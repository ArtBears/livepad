/*
login page
    "/login" GET
    "/login/:username/:pass" POST
    page name: "login.html"
    Create routes (POST & GET)
    Should query the DB for the form data, if null return error
*/


var username = "testname";
var password = "testpass";

var fd = new FormData();

function login(){
  username = document.getElementById("userNameInput").value;
  password = document.getElementById("passWordInput").value;
  console.log(username + " " + password);
  postReq(username, password);
}

function postReq(username, pass){
  //fd.append('acorn', blob, song_name + ".ogg");
  fetch('/login/'+username+'/'+pass, 
  {
   method: 'post',
   body: fd
  });
}
