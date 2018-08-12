/*
list.js
  -Display sessions with corresponding session info.
  -Allow user to create a new session or join a session
    in progress.

"sessions/list"
    page name: "list.html"
    Do db connectivity to 
      /session/new/:name/:user/:start/:end
*/



// adjectives[], nouns[], used for session name generation.
var adjectives = ["murky","neat","nonchalant","vivacious","white","materialistic","excellent","feeble","voracious","slippery",
"greasy","industrious","sassy","vengeful","frantic","stale","tame","red","highfalutin","chunky","brainy","feeble","damp","craven",
"half","squeamish","available","zonked","assorted","terrific","thirsty","dirty","staking","bored","stupendous","absent"]

var nouns = ["Sweater","Kettle","Back","Eggs","Religion","Attack","Dogs","Lake","Credit","Arch","Badge","Sleet","Apparel","Plantation",
"Worn","Walk","Night","Railway","Suit","Passenger","Rat","Turn","Finger","Cat"]

var adjective = adjectives[Math.floor(Math.random()*adjectives.length)];
var noun = nouns[Math.floor(Math.random()*nouns.length)];


var session_name = adjective+noun;
var start = new Date();
var end = new Date("October 20, 2020 12:00:00");
var fd = new FormData();


/*
newSession(userId)
  get userId from page
  make post request with corresponding parameters.
*/
function newSession(){
	var userid = document.getElementById("userelement").innerText;
	//console.log(session_name, userid, start, end);
	postReq(session_name, userid, start, end);
}


/*
postReq(name, user, start, end)
will do different things depending on response status code
400 == error -> alert user
200 == success -> redirect to next page
*/
function postReq(name, user, start, end){
/*
  request for new session
  /session/new/:name/:user/:start/:end

*/
  fetch('/session/new/'+name+'/'+user+'/'+start+'/'+end,
  {
   method: 'post',
   body: fd
  }).then(function(response){
    return response.json();
  })
  .then(function(resp){
    console.log(resp);
    if(resp.status == 400){
      confirm(resp.error)
    }
    else if(resp.status == 200){
      var uid = resp.userId;
      var path = resp.path;
      //console.log(path);
      //let session_path = "/session/" + id.toHexString();
      window.location.replace(path);
    }
  });
}