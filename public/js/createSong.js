
//def_color used to verify buttons being on/off
var def_color = 'rgb(136, 136, 136)';

//WebAudio setup
//chunks[] stores blobs of audio
var chunks = [];
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var song = context.createMediaStreamDestination();
var mediaRecorder = new MediaRecorder(song.stream);

//init for sound frequencies.
var val_one = 1.0;
var val_two = 2.0;
var val_three = 3.0;
var val_four = 4.0;
var val_five = 5.0;
var val_six = 6.0;
var val_seven = 7.0;
var val_eight = 8.0;

//declare button scale elements
amin_button = document.getElementById("aMin");
cmaj_button = document.getElementById("cMaj");
gmaj_button = document.getElementById("gMaj");

//initializes pad in the key of Am
function initScale(){
  aMin();
  amin_button.style.borderColor = "dodgerblue";
}

initScale();

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

//unusued, took up too much TIME
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

  sn = document.getElementById("nameholder").value;
  if(sn == ""){
    sn = "Song Name";
  }
  console.log(sn);

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

/*
for my own reference
<div class="sinBn" onclick="setSin()" id="upload">SIN</div>
<div class="sawBn" onclick="setSaw()" id="saw">SAW</div>
<div class="triBn" onclick="setTri()" id="tri">TRI</div>
<div class="sqrBn" onclick="setSqr()" id="sqr">SQR</div>
*/

//initialize oscillator sound
var osc_type = "sine";
sin_button = document.getElementById("sin");
saw_button = document.getElementById("saw");
tri_button = document.getElementById("tri");
sqr_button = document.getElementById("sqr");
sin_button.style.borderColor = "dodgerblue";

/*
  set oscillator to what the function is named
*/

function setSin(){
  osc_type = "sine";
  sin_button.style.borderColor = "dodgerblue";
  saw_button.style.borderColor = "#111111";
  tri_button.style.borderColor = "#111111";
  sqr_button.style.borderColor = "#111111";
}

function setSaw(){
  osc_type = "sawtooth";
  saw_button.style.borderColor = "mediumseagreen";
  sin_button.style.borderColor = "#111111";
  tri_button.style.borderColor = "#111111";
  sqr_button.style.borderColor = "#111111";
}

function setTri(){
  osc_type = "triangle";
  tri_button.style.borderColor = "orange";
  sin_button.style.borderColor = "#111111";
  saw_button.style.borderColor = "#111111";
  sqr_button.style.borderColor = "#111111";
}

function setSqr(){
  osc_type = "square";
  sqr_button.style.borderColor = "tomato";
  sin_button.style.borderColor = "#111111";
  saw_button.style.borderColor = "#111111";
  tri_button.style.borderColor = "#111111";
}

function setAmin(){
  aMin();
  amin_button.style.borderColor = "dodgerblue";
  cmaj_button.style.borderColor = "#111111";
  gmaj_button.style.borderColor = "#111111";
}

function setCmaj(){
  cMaj();
  cmaj_button.style.borderColor = "orange";
  amin_button.style.borderColor = "#111111";
  gmaj_button.style.borderColor = "#111111";
}

function setGmaj(){
  gMaj();
  gmaj_button.style.borderColor = "tomato";
  amin_button.style.borderColor = "#111111";
  cmaj_button.style.borderColor = "#111111";
}


function aMin(){
  /*
  1 = A
  2 = B
  3 = C
  4 = D
  5 = E
  6 = F
  7 = G
  8 = A
  */
  val_one = 220.0;
  val_two = 246.9;
  val_three = 261.6;
  val_four = 293.7;
  val_five = 329.6;
  val_six = 349.2;
  val_seven = 392.0;
  val_eight = 440.0;
}

function cMaj(){
  /*
  1 = C
  2 = D
  3 = E
  4 = F
  5 = G
  6 = A
  7 = B
  8 = C
  */
  val_one = 261.63;
  val_two = 293.66;
  val_three = 329.63;
  val_four = 349.23;
  val_five = 392.00;
  val_six = 440.00;
  val_seven = 493.88;
  val_eight = 523.25;
}

function gMaj(){
   /*
  1 = G
  2 = A
  3 = B
  4 = C
  5 = D
  6 = E
  7 = F#
  8 = G
  */
  val_one = 196.00;
  val_two = 220.00;
  val_three = 246.94;
  val_four = 261.63;
  val_five = 293.66;
  val_six = 329.63;
  val_seven = 369.99;
  val_eight = 392.00;
}

//clean this up eventually..
//as of now each call to this function creates and plays
//an oscillator sound.
//onclick function
//check the elements class and play the corresponding sound.
//gain makes the audio easier on the ears.
function playAudio(element){
  var osc = context.createOscillator();
  var gain = context.createGain();
  osc.type = osc_type;
  osc.connect(gain);
  gain.connect(context.destination);
  gain.connect(song);

  //gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.005);
  gain.gain.linearRampToValueAtTime(1, context.currentTime + 0.005);
  gain.gain.linearRampToValueAtTime(0, context.currentTime + 0.4);
  
  if(element.classList.contains("sineA3")){
    osc.frequency.value = val_one;
    osc.start();
  }
  else if(element.classList.contains("sineB3")){
    osc.frequency.value = val_two;
    osc.start();
  }
  else if(element.classList.contains("sineC4")){
    osc.frequency.value = val_three;
    osc.start();
  }
  else if(element.classList.contains("sineD4")){
    osc.frequency.value = val_four;
    osc.start();
  }
  else if(element.classList.contains("sineE4")){
    osc.frequency.value = val_five;
    osc.start();
  }
  else if(element.classList.contains("sineF4")){
    osc.frequency.value = val_six;
    osc.start();
  }
  else if(element.classList.contains("sineG4")){
    osc.frequency.value = val_seven;
    osc.start();
  }
  else if(element.classList.contains("sineA5")){
    osc.frequency.value = val_eight;
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