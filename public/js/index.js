
//def_color used to verify buttons being on/off
var def_color = 'rgb(136, 136, 136)';

//WebAudio setup
//chunks[] stores blobs of audio
var chunks = [];
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var song = context.createMediaStreamDestination();
var mediaRecorder = new MediaRecorder(song.stream);


//bool used in record() . I have no clue how Js booleans works but this works for me.
var bool = 0;

// records audio, check if record button element is on or off
function record(){
  r = document.getElementById("rec");
  if(bool == 0){
    r.style.color = "purple"
    bool = 1;
    mediaRecorder.start(500);
    play();
  }
  else if(bool == 1){
    r.style.color = "orange"
    bool = 0;
    clearInterval(clock);
    mediaRecorder.stop();
    mediaRecorder.release();
    mediaRecorder.reset();
  }
}

mediaRecorder.ondataavailable = function(e){
  chunks.push(e.data);
};

mediaRecorder.onstop = function(e){
  var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
  document.querySelector("audio").src = URL.createObjectURL(blob);
};

//clean this up eventually..
//as of now each call to this function creates and plays
//an oscillator sound.

//onclick function
//check the elements class and play the corresponding sound.
//gain makes the audio easier on the ears.
function playAudio(element){
  var osc = context.createOscillator();
  var gain = context.createGain();
  osc.type = "sine";
  
  if(element.classList.contains("sineA3")){
    osc.frequency.value = 220.0;
    osc.connect(gain);
    gain.connect(context.destination);
    gain.connect(song);
    gain.gain.linearRampToValueAtTime(1, context.currentTime + 0.005);
    gain.gain.linearRampToValueAtTime(0, context.currentTime + 0.5);
    osc.start();
    osc.stop(context.currentTime + .5);
  }
  else if(element.classList.contains("sineB3")){
    osc.frequency.value = 246.9;
    osc.connect(gain);
    gain.connect(context.destination);
    gain.connect(song);
    gain.gain.linearRampToValueAtTime(1, context.currentTime + 0.005);
    gain.gain.linearRampToValueAtTime(0, context.currentTime + 0.5);
    osc.start();
    osc.stop(context.currentTime + .5);
  }
  else if(element.classList.contains("sineC4")){
    osc.frequency.value = 261.6;
    osc.connect(gain);
    gain.connect(context.destination);
    gain.connect(song);
    gain.gain.linearRampToValueAtTime(1, context.currentTime + 0.005);
    gain.gain.linearRampToValueAtTime(0, context.currentTime + 0.5);
    osc.start();
    osc.stop(context.currentTime + .5);
  }
  else if(element.classList.contains("sineD4")){
    osc.frequency.value = 293.7;
    osc.connect(gain);
    gain.connect(context.destination);
    gain.connect(song);
    gain.gain.linearRampToValueAtTime(1, context.currentTime + 0.005);
    gain.gain.linearRampToValueAtTime(0, context.currentTime + 0.5);
    osc.start();
    osc.stop(context.currentTime + .5);
  }
  else if(element.classList.contains("sineE4")){
    osc.frequency.value = 329.6;
    osc.connect(gain);
    gain.connect(context.destination);
    gain.connect(song);
    gain.gain.linearRampToValueAtTime(1, context.currentTime + 0.005);
    gain.gain.linearRampToValueAtTime(0, context.currentTime + 0.5);
    osc.start();
    osc.stop(context.currentTime + .5);
  }
  else if(element.classList.contains("sineF4")){
    osc.frequency.value = 349.2;
    osc.connect(gain);
    gain.connect(context.destination);
    gain.connect(song);
    gain.gain.linearRampToValueAtTime(1, context.currentTime + 0.005);
    gain.gain.linearRampToValueAtTime(0, context.currentTime + 0.5);
    osc.start();
    osc.stop(context.currentTime + .5);
  }
  else if(element.classList.contains("sineG4")){
    osc.frequency.value = 392.0;
    osc.connect(gain);
    gain.connect(context.destination);
    gain.connect(song);
    gain.gain.linearRampToValueAtTime(1, context.currentTime + 0.005);
    gain.gain.linearRampToValueAtTime(0, context.currentTime + 0.5);
    osc.start();
    osc.stop(context.currentTime + .5);
  }
  else if(element.classList.contains("sineA5")){
    osc.frequency.value = 440.0;
    osc.connect(gain);
    gain.connect(context.destination);
    gain.connect(song);
    gain.gain.linearRampToValueAtTime(1, context.currentTime + 0.005);
    gain.gain.linearRampToValueAtTime(0, context.currentTime + 0.5);
    osc.start();
    osc.stop(context.currentTime + .5);
  }
}

//turns buttons on/off
function set(element, color){
  if(element.style.background == color){
    element.style.background = def_color;
  }
  else{
    element.style.background = color;
    //remove the following line eventually
    playAudio(element);
  }
}

var testArr = document.getElementsByClassName("button");
var clock;

function play(){
  var i = 0;
  var clock = setInterval(function loop(){
    
    //put this outside eventually
    s = document.getElementById("stop");
    s.addEventListener("click", function(){
      clearInterval(clock);
      console.log("uhde");
    });
    
    //bleh
    var eight = i+8;
    for(i; i<eight; i++){
      var style = window.getComputedStyle(testArr[i], null);
      if(style.backgroundColor == def_color){
        console.log("NOTHING", i);
      }
      else{
        playAudio(testArr[i]);
        console.log("PLAY SOUND", i, style.backgroundColor);
      }
    }
    if(i > 63){
      i = 0;
      /*
      clearInterval(clock);
      */
    }
  }, 500);
}