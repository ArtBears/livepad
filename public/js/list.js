/*
"sessions/list"
    page name: "list.html"
    Do db connectivity
*/

/*
`/session/new/:name/:user/:start/:end`
*/

var adjectives = ["murky","neat","nonchalant","vivacious","white","materialistic","excellent","feeble","voracious","slippery",
"greasy","industrious","sassy","vengeful","frantic","stale","tame","red","highfalutin","chunky","brainy","feeble","damp","craven",
"half","squeamish","available","zonked","assorted","terrific","thirsty","dirty","staking","bored","stupendous","absent"]

var nouns = ["sweater","kettle","back","eggs","religion","attack","dogs","lake","credit","arch","badge","sleet","apparel","plantation",
"corn","walk","night","railway","suit","passenger","rat","turn","finger","cat"]

var adjective = adjectives[Math.floor(Math.random()*adjectives.length)];
var noun = nouns[Math.floor(Math.random()*nouns.length)];


var session_name = adjective+noun;
var start = new Date();
var end = new Date("October 20, 2020 12:00:00");
var fd = new FormData();


/*
newSession(userId)
*/
function newSession(){
	var userid = document.getElementById("userelement").innerText;
	console.log(session_name, userid, start, end);
	postReq(session_name, userid, start, end);
}


/*
postReq(name, user, start, end)
will do different things depending on response status code
400 == error -> alert user
201 == success -> redirect to next page
*/
function postReq(name, user, start, end){
/*
`/session/new/:name/:user/:start/:end`
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
      window.location.replace(path);
    }
  });
}