
//def_color used to verify buttons being on/off
var def_color = 'rgb(136, 136, 136)';

//WebAudio setup
//chunks[] stores blobs of audio
var chunks = [];
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var song = context.createMediaStreamDestination();
var mediaRecorder = new MediaRecorder(song.stream);

//get Tempo(bpm) from input field and turn it into ms.
function tempoToMs(){
  var tempo = document.getElementById("tempo").value;
  var bpm = tempo;
  var ms = 0;
  if(bpm <= 0){
    document.getElementById("tempo").value = "60";
    bpm = 60;
    ms = 60000/bpm;
    confirm("User tempo was too low, new tempo set to 60.");
  }
  else{
    ms = 60000/bpm;
    //console.log(tempo, ms)
  }
  return ms;
}

var start_time;
var total_min = 0;
var total_sec = 0;
var end_time;

//bool used in record()
//records audio, check if record button element is on or off
var state = mediaRecorder.state;
function record(){
  r = document.getElementById("rec");
  var state = mediaRecorder.state;
  if(state == 'inactive'){
  	r.style.color = "tomato";
    r.style.borderLeftColor = "tomato";
    r.style.borderBottomColor = "tomato";
  	r.innerHTML = "PAUSE";
  	mediaRecorder.start();
  	play();
  }
  else if(state == 'recording'){
  	r.style.color = "orange";
    r.style.borderLeftColor = "orange";
    r.style.borderBottomColor = "orange";
    r.innerHTML = "RESUME RECORDING";
    mediaRecorder.pause();
    clearInterval(clock);
  }
  else if(state == 'paused'){
  	r.style.color = "tomato";
    r.style.borderLeftColor = "tomato";
    r.style.borderBottomColor = "tomato";
    r.innerHTML = "PAUSE";
  	play();
    mediaRecorder.resume();
  }
}

function upload(){
	mediaRecorder.stop();
}

function startT(){
  start_time = new Date();
}

function endT(){
  end_time = new Date();
  
  var elapsed_sec = end_time.getSeconds() - start_time.getSeconds();
  
  console.log(elapsed_sec);
  total_sec = total_sec + elapsed_sec;
  
  var user_time = document.getElementById("userTime");
  user_time.innerHTML = total_sec + " seconds.";
}

mediaRecorder.ondataavailable = function(e){
  chunks.push(e.data);
};

mediaRecorder.onstop = function(e){
  var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
  document.querySelector("audio").src = URL.createObjectURL(blob);
  
  /*

  "/song/upload/:session_id/:song_id/:song_name/:length"

  */
  var session_id = "5b6373f488e052c180b3a248";
  var song_id = "5b6373f488e052c180b3a246";
  var song_name = "testname";
  var length = "5";

  var fd = new FormData();
  fd.append('acorn', blob, song_name + ".ogg");
  fetch("/song/upload/"+session_id+'/'+song_id+'/'+song_name+'/'+length, 
  {
    method: 'post',
    body: fd
  });
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
  osc.connect(gain);
  gain.connect(context.destination);
  gain.connect(song);

  //gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.005);
  gain.gain.linearRampToValueAtTime(1, context.currentTime + 0.005);
  gain.gain.linearRampToValueAtTime(0, context.currentTime + 0.4);
  
  if(element.classList.contains("sineA3")){
    osc.frequency.value = 220.0;
    osc.start();
  }
  else if(element.classList.contains("sineB3")){
    osc.frequency.value = 246.9;
    osc.start();
  }
  else if(element.classList.contains("sineC4")){
    osc.frequency.value = 261.6;
    osc.start();
  }
  else if(element.classList.contains("sineD4")){
    osc.frequency.value = 293.7;
    osc.start();
  }
  else if(element.classList.contains("sineE4")){
    osc.frequency.value = 329.6;
    osc.start();
  }
  else if(element.classList.contains("sineF4")){
    osc.frequency.value = 349.2;
    osc.start();
  }
  else if(element.classList.contains("sineG4")){
    osc.frequency.value = 392.0;
    osc.start();
  }
  else if(element.classList.contains("sineA5")){
    osc.frequency.value = 440.0;
    osc.start();
  }
}

//turns buttons on/off
function set(element, color){
  if(element.style.backgroundColor == color){
    element.style.backgroundColor = def_color;
  }
  else{
    element.style.backgroundColor = color;
    //remove the following line eventually
    playAudio(element);
  }
}

function stop(){
  s = document.getElementById("stop");
  s.addEventListener("click", function(){
    clearInterval(clock);
    is_playing = false;
    //console.log("uhde");
  });
}

function boom(element){
  var elem = element;
  //save old button values, set new values for visual effect
  var original_size = elem.style.borderWidth;
  elem.style.borderWidth = "4px";
  
  var original_color = elem.style.backgroundColor;
  
  
  //make this more programmatic eventually, or scrap it?
  if(original_color == "mediumseagreen"){
    elem.style.backgroundColor = "#66cc93";
    elem.style.borderColor = original_color;
  }
  if(original_color == "dodgerblue"){
    elem.style.backgroundColor = "#339aff";
    elem.style.borderColor = original_color;
  }
  if(original_color == "orange"){
    elem.style.backgroundColor = "#ffb733";
    elem.style.borderColor = original_color;
  }
  if(original_color == "tomato"){
    elem.style.backgroundColor = "#ff6347";
    elem.style.borderColor = original_color;
  }
  
  
  setTimeout(function(){
    elem.style.borderWidth = "3px";
  }, tempoToMs()/4 );
  
  setTimeout(function(){
    elem.style.border = original_size;
    elem.style.backgroundColor = original_color;
    elem.style.borderColor = "rgba(180,180,180,180)";
  }, tempoToMs() );
}

function blink(hbelm){
  var ms = (tempoToMs()) + "ms";
  hbelm.style.opacity = 0.5;
  hbelm.style.animationDuration = ms;
  setTimeout(function(){
    hbelm.style.animationDuration = 0;
    hbelm.style.opacity = 0;
  }, tempoToMs());
}

var testArr = document.getElementsByClassName("button");
var hbArr = document.getElementsByClassName("hiddenBox")
var clock;
//var is_playing = false;

function play(){
  //if(is_playing == false){
    //is_playing = true;
    var i = 0;
    clock = setInterval(function loop(){
      
    //bleh
    var eight = i+8;
    for(i; i<eight; i++){
      var style = window.getComputedStyle(testArr[i], null);
      blink(hbArr[ (eight/8)-1 ]);
      if(style.backgroundColor == def_color){
        //console.log("NOTHING", i);
      }
      else{
        playAudio(testArr[i]);
        boom(testArr[i]);
        //console.log("PLAY SOUND", i, style.backgroundColor);
      }
    }
    if(i > 63){
    	var state = mediaRecorder.state;
    	i = 0;
    	if(state == 'recording'){
    		r = document.getElementById("rec");
	      r.style.color = "orange";
        r.style.borderLeftColor = "orange";
        r.style.borderBottomColor = "orange";
        r.innerHTML = "RESUME RECORDING";
	    	mediaRecorder.pause();
	    	clearInterval(clock);
	    }
	}
}, tempoToMs());
  //}else if(is_playing == true){
   // alert("It's already playing..");
  //}
}

function reset(){
  //add code
  var i=0;
  for(i=0; i<64; i++){
    testArr[i].style.backgroundColor = def_color;
  }
}