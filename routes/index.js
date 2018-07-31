var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var ObjectId = require('mongodb').ObjectId;
var path  = require('path');
var fs = require('fs');

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

router.get('/session/:session_id', (req, res, next) => {
	// loads the session page and lists the current users
	let id = new ObjectId(req.params.session_id);
	req.db.collection('Sessions')
		.find({__id: id})
		.next( (err, doc)=>{
			if(err){
				// some error occured with query
				// console.log(err);
				console.log("Session not found");
				res.send("Session not found");
			}
			else if(null == doc){
				// session doesn't exit
				console.log("session doesn't exist");
				res.send(id);
			}
			else {
				//return page with info for session
				console.log(doc);
				res.send(doc)
			}
		})
});

router.post('/session/new/:name/:user/:start/:end', (req, res, next) => {
	// create a session in the DB
	let id = new ObjectId();
	let dir = createDir(id.toHexString());
	req.db.collection('Sessions')
		.insertOne(
			{
				__id: id,
				name: req.params.name,
				date: new Date(),
				users: [req.params.user],
				diskLocation: dir
			}
		)
		.next((err, doc) => {
			if(err){
				res.send(err);
			}
			else if(doc == null) {
				console.log("problem saving document")
				res.send("problem saving document");
			}
			else {
				let session_path = "/session/" + id.toHexString();
				res.redirect(200, session_path);
			}
		})
	// redirect to the new session/:session_id
});

router.get('/session/createSong/:session_id/:user_id', (req, res, next) => {
	// generate a song ID
	// save the record of the song/session/user
	req.db.collection('Sessions')
						.updateOne( {__id: req.params.session_id},
									{})
});

router.post('/song/upload/:session_id/:song_id/:song_name/:length', (req, res, next) => {
	// save song to file system
	// update properties: length, name
	// req is a stream bro
	req.on('end', (data) => {
		req.db.collection('Songs')
			.updateOne(	{__id: req.params.song_id},
						{name: req.params.song_name,
						 length: req.params.length}
			)
			.next((err, doc) => {
				if(err){
					// do some stuff
				}
				if(doc.result == 'ok'){
					saveToDir(app.locals.session_path, 
								req.params.song_name,
								data
					);
					res.redirect(200, "/session/"+ req.params.session_id);
				}
			})
	})
});

function createDir(id){/* return string of rel location */
	let path = app.locals.session_path + id; 
	if(!fs.existsSync(path)){
		fs.mkdirSync(path);
		return path;
	}
}

function saveToDir(dir, name, file){
	let path = app.locals.session_path + dir;
	let song_path = path + '/' + name
	if(fs.existsSync(path)){
		fs.writeFile(song_path, file);
		return song_path;
	} else {
		fs.mkdirSync(path, (err) => {
			if(err == null){
				fs.writeFileSync(song_path, file);
			}
			else {
				return err;
			}
		});
		return "";
	}
}

module.exports = router;
