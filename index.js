var express = require('express');
var path = require('path');
var http = require('http');
var net = require('net');
var fs = require('fs');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var WebSocketServer = require('websocket').server;
var MongoClient = require('mongodb').MongoClient;
const schemas = JSON.parse(fs.readFileSync('./schema.json', 'utf8')).schemas;
global.appRoot = path.resolve(__dirname);


app = express();
app.locals.session_path = global.appRoot + "/sessions/";

/* collections  */
const liveCollections = ["users", "sessions", "songs"];

/* routes */
const index = require('./routes/index.js');


/* Middleware */
app.use(morgan('dev'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false, limit: '50mb'}));
app.use(bodyParser.raw({
    type: 'audio/ogg'
}))
app.use(cookieParser());

// views
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, '/public/')));
app.use(express.static('public/audio/Samples1/hhat1.wv'));

// app.get('/', (req, res) => {
 //	res.sendFile(__dirname + '/index.html');
// });

app.use('/', index);


// To run app without database access uncomment the next line 
//app.listen(3000, () => {console.log("app running")});


// Comment out MongoClient block to run without DB client
// start of MongoClient Block
// Doesn't start app without successful connection to DB
MongoClient.connect("mongodb://localhost:27017", {useNewUrlParser: true}, function(err, client){
 	if(err){
 		console.log(err);
 	}
 	else {
        var db = client.db("livepad");
 		// coneect database instance to the request object
 		app.use( (req, res, next) => {
 			req.db = db;
 			console.log(req.db);
 			next();
 		});
 		express.request.db = db;
 		console.log("DB CONNECTED!");
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
        
 		app.listen(3000, () => { console.log(" App Listening on Port 3000 ") }); 
 	}
 })

// end of MongoClient Block
module.exports = app;
