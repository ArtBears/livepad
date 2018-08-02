var express = require('express');
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
const schemas = JSON.parse(fs.readFileSync('./schema.json', 'utf8')).schemas;
global.appRoot = path.resolve(__dirname);
var ObjectId = require('mongodb').ObjectId;


/* collections  */
const liveCollections = ["Users", "Sessions", "Songs"];

var id = new ObjectId();
console.log("Created ID: " + id)
var session_1 = {
    __id: id,
    name: "testSession1",
    date: new Date(),
    diskLocation: __dirname + "routes/sessions/" + id.toHexString()   
} 

var song_id = new ObjectId();
var user_id = new ObjectId("5b60da49a6f29cab1db9b27c");
var song_1 = {
    __id: id,
    name: "testSession1",
    userId: user_id,
    sessionId: id,
    length: 0.01
} 
console.log("SONG ID: " + song_id.toHexString())
console.log("USER ID: " + user_id.toHexString())

MongoClient.connect("mongodb://localhost:27017", function(err, client){
 	if(err){
 		console.log(err);
 	}
 	else {
        var db = client.db("livepad");
 		// coneect database instance to the request object
        db.listCollections().toArray( (err, items) => {
            for (let col in liveCollections){
                // check if liveCollections[col] is in items
                if(!items.includes(liveCollections[col])){
                    // no? create the collections
                    db.createCollection(
                        liveCollections[col], 
                        schemas[liveCollections[col].toLowerCase()]
                    ).catch((err) => {
                        console.log("Collection Create or Validation Error: " + err);
                        exit();
                    });
                } else {
                    // yes? continue;
                    continue;
                }
            }   
        })
        
        db.collection('Sessions')
            .insertOne(session_1);
        db.collection('Songs')
            .insertOne(song_1);
 	}

 })