var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var ObjectId = require('mongodb').ObjectId;
var path  = require('path');

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
	let dir = createDir(id);
	req.db.collection('Sessions')
		.insertOne(
			{
				__id: id,
				name: req.params.name,
				date: new Date(),
				users: [req.params.user],
				diskLocation: dir
			}, 
			(err, doc) => {
				
			}
		);
	// redirect to the new session/:session_id
});

router.get('/session/create/:session_id/:user_id', (req, res, next) => {
	// generate a song ID
	// save the record of the song/session/user
});

router.post('/song/upload/:session_id/:song_id', (req, res, next) => {
	// save song to file system
	// update properties: length, name
	// req is a stream bro
	req.on('readable', )
});

function createDir(id){/* return string of rel location */}
function saveToDir(dir, name, file){}

module.exports = router;
