var http = require('http');
var net = require('net');
var path = require('path');
var express = require('express');
var app = express();
const WebSocket = require('ws');
var exec = require('exec');
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

// Connection URL
const url = "mongodb://localhost:27017";

// Database Name
const dbName = "livepad";

var codec = "";

codec = "audio/mpeg";

// Use connect method to connect to the server
MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  findSongs(db, function() {
    client.close();
  });
});

var firstPacket = [];

var options = {
    root: path.resolve(__dirname,),
    httpPort:8080,
    tcpPort: 9090
};

// Send static files with express
app.use(express.static(options.root));

var wsClients = [];

app.get('/', function(req, res){
    res.sendFile('listen.html', options);
});

/** HTTP server */
var server = http.createServer(app);
server.listen(options.httpPort);

/** TCP server */
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


const wss = new WebSocket.Server({
    server: server,
    autoAcceptConnections: false
});

wss.on('request', function(request) {
    var connection = request.accept('echo-protocol', requeset.origin);
    console.log((new Date()) + 'Connection accepted.');

    if(firstPacket.length){
    firstPacket.map(function(packet, index){
      connection.sendBytes(packet); 
    });
    
  };
  wsClients.push(connection);

  connection.on('close', function(reasonCode, description) {
      console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
  });
});
const socket = new WebSocket("ws://localhost:8080");

socket.addEventListener('open', (event) => {
  console.log("Now Open")
  socket.send('testname-1533331174213.ogg');
});

socket.addEventListener('message', (event) => {
  console.log("Response", event.data);
});

var codec = '';

codec = 'audio/mpeg'

//Locate the audio tag with id of THESTREAM
var audio = document.getElementById("THESTREAM");
var mediaSource = new MediaSource();
audio.src = window.URL.createObjectURL(mediaSource);
var buffer = null;
var queue = [];

var bufferArray = [];

function updateBuffer() {
  if (queue.length > 0 && !buffer.updating) {
    buffer.appendBuffer(queue.shift());
  }
}

//Mediasource

function sourceBufferHandle() {
  buffer = mediaSource.addSourceBuffer(codec);
  buffer.mode = "sequence";

  buffer.addEventListener("update", function() {
    console.log("update");
    updateBuffer();
  });

  buffer.addEventListener("updateend", function() {
    console.log("updateend");
    updateBuffer();
  });

  initWS();
}

mediaSource.addEventListener("sourceopen", sourceBufferHandle);

function initWS() {
  var ws = new WebSocket(
    "ws://" + window.location.hostname + ":" + window.location.port,
    "echo-protocol"
  );
  ws.binaryType = "arraybuffer";

  ws.onopen = function() {
    console.info("WebSocket connection initialized");
  };

  ws.onmessage = function(event) {
    console.info("Recived WS message.", event);

    if (typeof event.data === "object") {
      if (buffer.updating || queue.length > 0) {
        queue.push(event.data);
      } else {
        buffer.appendBuffer(event.data);
        audio.play();
      }
    }
  };
}

child = exec("ffmpeg -i " + app.locals.session_path + test.mp3 + "-f mp3 tcp://localhost:9090",function(error,stdout,stderr){
    console.log('STDOUT: ',stdout);
    console.log('STDERR: ',stderr);
});
/*
//lists the songs in db with information
const findSongs = function(db, callback) {
  // Get the Songs collection
  const collection = db.collection("Songs");
  // Find some documents
  collection.find({}).toArray(function(err, doc) {
    assert.equal(err, null);
    console.log("Found the following songs");
    console.log(doc);
    callback(doc);
  });
};

//attempt to stream
const streamSongs = function(db, callback) {
    const collection = db.collection("Songs");
    collection.find({}).toArray(function(err, doc)) {
        assert.equal(err, null);
        console.log("Playing Songs");
        new ffmpeg("/sessions/" + doc.song_name + '-' + Date.now() + ".ogg")
    }
}

//also attempt to stream
try {
        var process = new ffmpeg('/path/to/your_movie.avi');
        process.then(function (audio) {
            
            audio
            .addCommand('-f', 'mp3')
            .save('tcp://localhost:9090', function (error, file) {
                if (!error)
                    console.log('Audio file: ' + file);
            });

        }, function (err) {
            console.log('Error: ' + err);
        });
}
catch (e) {
        console.log(e.code);
        console.log(e.msg);
}
*/