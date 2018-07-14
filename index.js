var express = require('express');
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
global.appRoot = path.resolve(__dirname);

app = express();

/* routes */
const index = require('./routes/index.js');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
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
app.listen(3000, () => {console.log("app running")});


// Comment out MongoClient block to run without DB client
// start of MongoClient Block
// Doesn't start app without successful connection to DB
// MongoClient.connect("mongodb://localhost:27017/livepad", function(err, database){
// 	if(err){
// 		console.log(err);
// 	}
// 	else {
// 		// coneect database instance to the request object
// 		app.use( (req, res, next) => {
// 			req.db = database;
// 			console.log(req.db);
// 			next()
// 		})
// 		express.request.db = database;
// 		console.log("DB CONNECTED!");
// 		app.listen(3000, () => { console.log(" App Listening on Port 3000 ") }) 
// 	}
// })

// end of MongoClient Block
module.exports = app;
