(function(){

var codec = '';

codec = 'audio/mpeg';

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

//this works if used from another terminal
/*var exec = require('exec');

const child = exec("ffmpeg -i test.mp3 -f mp3 tcp://localhost:9090",function(error,stdout,stderr){
    console.log('STDOUT: ',stdout);
    console.log('STDERR: ',stderr);
});*/


})();