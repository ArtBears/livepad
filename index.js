var express = require('express');
var path = require('path');
var fs = require('fs');
var http = require('http');
var net = require('net');
var WebSocketServer = require('websocket').server;
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
const schemas = JSON.parse(fs.readFileSync('./schema.json', 'utf8')).schemas;
global.appRoot = path.resolve(__dirname);

var firstPacket = [];

var options = {
    tcpPort: 9090
};

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

var wsClients = [];

//HTTP Server
var server = http.createServer(app);

//TCP Server
var tcpServer = net.createServer(function(socket) {
    socket.on('data', function(data){

      /**
       * We are saving first packets of stream. These packets will be send to every new user.
       * This is hack. Video won't start whitout them.  
       */
      if(firstPacket.length < 3){ 
        console.log('Init first packet', firstPacket.length);
        firstPacket.push(data); 
      }

      /**
       * Send stream to all clients
       */
      wsClients.map(function(client, index){
        client.sendBytes(data);
      });
    });
});

tcpServer.listen(options.tcpPort, 'localhost');

/** Websocket */
var wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

wsServer.on('request', function(request) {
  var connection = request.accept('echo-protocol', request.origin);
  console.log((new Date()) + ' Connection accepted.');

  if(firstPacket.length){
    /**
     * Every user will get beginning of stream 
    **/ 
    firstPacket.map(function(packet, index){
      connection.sendBytes(packet); 
    });
    
  }
    
  /**
   * Add this user to collection
   */
  wsClients.push(connection);

  connection.on('close', function(reasonCode, description) {
      console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
  });
});

// To run app without database access uncomment the next line 
//app.listen(3000, () => {console.log("app running")});


// Comment out MongoClient block to run without DB client
// start of MongoClient Block
// Doesn't start app without successful connection to DB
MongoClient.connect("mongodb://localhost:27017", function(err, client){
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
        
 		server.listen(3000, () => { console.log(" App Listening on Port 3000 ") }); 
 	}
 })

// end of MongoClient Block
module.exports = app;
