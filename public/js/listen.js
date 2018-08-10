const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'livepad';

var codec = '';

codec = 'audio/mpeg';

// Use connect method to connect to the server
MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  findSongs(db, function() {
    client.close();
  });
});

//Locate the audio tag with id of THESTREAM
var audio = document.getElementById('THESTREAM');
var mediaSource = new MediaSource();
audio.src = window.URL.createObjectURL(mediaSource);
var buffer = null;
var queue = [];

var bufferArray = [];

function updateBuffer(){
    if (queue.length > 0 && !buffer.updating) {
        buffer.appendBuffer(queue.shift());
    }
}

//Mediasource

function sourceBufferHandle(){
    buffer = mediaSource.addSourceBuffer(codec);
    buffer.mode = 'sequence';

    buffer.addEventListener('update', function() {
        console.log('update');
        updateBuffer();
    });

    buffer.addEventListener('updateend', function() {
        console.log('updateend');
        updateBuffer();
    });

    initWS();
}

mediaSource.addEventListener('sourceopen', sourceBufferHandle)

function initWS(){
    var ws = new WebSocket('ws://' + window.location.hostname + ':' + window.location.port, 'echo-protocol');
    ws.binaryType = "arraybuffer";

    ws.onopen = function(){
        console.info('WebSocket connection initialized');
    };

    ws.onmessage = function (event) {
        console.info('Recived WS message.', event);

        if(typeof event.data === 'object'){
            if (buffer.updating || queue.length > 0) {
                queue.push(event.data);
            } else {
                buffer.appendBuffer(event.data);
                audio.play();
            }
        }
    };

}


const findSongs = function(db, callback) {
  // Get the Songs collection
  const collection = db.collection('Songs');
  // Find some documents
  collection.find({}).toArray(function(err, sngs) {
    assert.equal(err, null);
    console.log("Found the following songs");
    console.log(sngs);
    callback(sngs);
  });
}
