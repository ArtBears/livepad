var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var ObjectId = require('mongodb').ObjectId;
var path  = require('path');
var fs = require('fs');
var multer = require('multer');
var storage = multer.diskStorage({
	destination: app.locals.session_path,
	filename: function(req, file, cb){
		cb(null, req.params.song_name + '-' + Date.now() + ".ogg")
	}
})
var upload = multer({storage: storage});

router.get('/', (req, res, next) => {
	res.render('index');
	// get a list of sessions and return them as JSON
});

router.get('/sample', (req, res, next) => {
    res.render('sample');
});

router.get( '/sample/:type', (req, res, next) => {
    var sound = req.params.type;
    var sound_path = appRoot + '/public/audio/Samples1/' + sound;
    res.sendFile(sound_path);
});

router.get('/login', (req, res, next) => {
    res.render('login');
});

router.post('/login/:username/:pass', (req,res,next) => {
	// check user info
	let user = req.params.username;
	let pass = req.params.pass;
	req.db.collection('users')
		.find({ $and: [ { name: user }, { password: pass } ] })
		.next((err, doc) => {
			if(err){
				// some error occured with query
				// console.log(err);
				console.log("User " +user+ " not found");
				res.status(400).json( { status: 400, error: "User " +user+ " not found" } );
			}
			else if(null == doc){
				// session doesn't exit
				console.log("User: " +user+ " doesn't exist");
				let userError = "Your password or username may be invalid.";
				res.status(400).json( { status: 400, error: userError} );
			}
			else {
				//return page with info for session
				console.log(doc);
				res.status(200).json( { status: 200, username: user, userId: doc.__id, loggedin: true } );
			}
		})
})

router.get('/signup', (req, res, next) => {
    res.render('signup');
});

router.post('/signup/:username/:pass', (req,res,next) => {
	let user = req.params.username;
	let pass = req.params.pass;

	// check user info
	req.db.collection('users')
		.find({name: user})
		.next((err, doc) => {
			if(err){
				// some error occured with query
				// console.log(err);
				console.log("User " +user+ " not found");
				res.status(400).json({ status: 400, error: "User " +user+ " not found"});
			}
			else if(null == doc){
				// user doesn't exit so create
				let id = new ObjectId();
				try{
					req.db.collection('users')
						.insertOne({__id: id, name: user, password: pass})
					
					// respond with success 
					// frontend should link to sessions/list
					res.status(201).json({status: 201, username: user, userId: id, loggedin: true});
				}
				catch(e) {
					console.log(e)
					res.status(400).json({ status: 400, error: e });
				}
			}
			else {
				//return page with info for session
				console.log(doc);
				let userError = "User already exists";
				res.status(400).json( { status: 400, error: userError } );
			}
		})
})


router.get('/session/list/:user_id', (req, res, next) => {
	// Grab list of sessions from the database and list them
	req.db.collection('sessions')
		.find()
		.toArray((err, doc) => {
			if(err){
				// some error occured with query
				// console.log(err);
				console.log("Sessions not found");
				res.status(400).send("Session not found");
			}
			else if(null == doc){
				// session doesn't exit
				console.log("session doesn't exist");
				let sessionErr = "No Sessions Found"
				res.render('list', {error: sessionErr});
			}
			else {
				//return page with info for session
				console.log(doc);
				res.render("list", {sessions: doc, user: req.params.user_id});
			}
		})

})

router.get('/session/listen/:session_id', (req, res, next) => {
	let id = req.params.session_id;
	req.db.collection('songs')
		.find({session_id: id})
		.toArray( (err, results) => {
			if(err){
				// some error occured with query
				// console.log(err);
				console.log("Session not found");
				res.status(400).send("Session not found");
			}
			else if(null == results){
				// session doesn't exit
				let songError = "No Songs in this Session";
				res.render("listen", {error: songError});
			}
			else {
				//return page with info for session
				console.log(results);
				res.render("listen", {songs: results});
			}
		})
	// res.render('listen')
})

router.get('/session/:session_id', (req, res, next) => {
	// loads the session page and lists the current users
	let id = new ObjectId(req.params.session_id);
	req.db.collection('sessions')
		.find({__id: id})
		.next( (err, doc)=>{
			if(err){
				// some error occured with query
				// console.log(err);
				console.log("Session not found");
				res.status(400).send("Session not found");
			}
			else if(null == doc){
				// session doesn't exit
				console.log("session doesn't exist");
				let e = "session doesn't exist";
				res.status(400).send({error: e,  sessionId: id});
			}
			else {
				//return page with info for session
				console.log(doc);
				res.render("session", {info: doc});
			}
		})
});

router.post('/session/new/:name/:user/:start/:end', (req, res, next) => {
	// create a session in the DB
	let id = new ObjectId();
	let dir = createDir(id.toHexString());
	
	try {
		req.db.collection('sessions')
		.insertOne(
			{
				__id: id,
				name: req.params.name,
				date: new Date(),
				$push: {users: req.params.user},
				diskLocation: dir
			}
		);
				let session_path = "/session/" + id.toHexString();
				res.status(200).json({status: 200, path: session_path});
	}
	catch (e) {
		res.status(400).json({ status: 400, error: e})
	}
});

router.get('/session/createSong/:session_id/:user_id', (req, res, next) => {
	// generate a song ID
	// save the record of the song/session/user
	let id = new ObjectId();
	let temp_song_name = req.params.session_id + "-" + req.params.user_id;
	
	try {
		req.db
			.collection('songs')
				.insertOne({
					__id: id,
					name: temp_song_name,
					userId: req.params.user_id,
					sessionId: req.params.session_id,
					length: 0.00
				});
		console.log("Saving to Sessions DB");
		req.db
			.collection('sessions')
				.updateOne( {__id: req.params.session_id},
							{$push: {songs: id} }); // id is ObjectId("24ByteHexCode")
					
		res.status(200).render('createSong' , {id: id, sessionId: req.params.session_id, userId: req.params.user_id});					
	}
	catch(e) {
		console.log("Problem Making Song");
		res.status(400).json({status: 400, area: "/session/" + req.params.session_id, error: e});
	}
});

router.post('/song/upload/:session_id/:song_id/:song_name/:length', upload.single('acorn'), function(req, res, next) {
	// save song to file system
	// update properties: length, name
	// req is a stream bro
	try {
		req.db.collection('songs')
			.updateOne(	
				{ __id: req.params.song_id}, 	// where this is true
				{								// and update these properties
					name: req.params.song_name,
			 		length: req.params.length
			 	}
			);
		res.status(201).json({status: 201, session: "/session/"+ req.params.session_id});
		console.log(req.file);
	}
	catch(e){
		res.status(400).json({ status: 400, error: e });
	}
});

router.post('/song/upload/test/:song_name', upload.single('acorn'), (req, res, next) => {
	console.log(req.file);
	res.sendStatus(200);
})


function createDir(id){/* return string of rel location */
	let path = app.locals.session_path + id; 
	if(!fs.existsSync(path)){
		fs.mkdirSync(path);
		return path;
	}
}

module.exports = router;