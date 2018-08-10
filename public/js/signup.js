/*
signup page
    "/signup" GET
    "/signup/:username/:pass" POST
    page name: "signup.html"
    Create routes (POST & GET)
    Should query the db for the existance of the user
        no: create the user
        yes: say the user exists, ask if they want to login
    Redirect to session list with user
*/

var username = "testname";
var password = "testpass";

function signup(){
  username = document.getElementById("userNameInput").value;
  password = document.getElementById("passWordInput").value;
  console.log(username + " " + password);
  postReq(username, password);
}

function postReq(username, pass){
  //fd.append('acorn', blob, song_name + ".ogg");
  /*
  '/signup/:username/:pass'
  */
  var fd = new FormData();
  fetch('/signup/'+username+'/'+pass, 
  {
   method: 'post',
   body: fd
  }).then(function(response){
    return response.json();
  })
  .then(function(){
    console.log("aa");
  });
}

