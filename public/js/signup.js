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

var username = "";
var password = "";

var fd = new FormData();

function signup(){
  username = document.getElementById("userNameInput").value;
  password = document.getElementById("passWordInput").value;
  postReq(username, password);
}


function postReq(username, pass){
  //fd.append('acorn', blob, song_name + ".ogg");
  fetch('/signup/'+username+'/'+pass, 
  {
   method: 'post',
   body: fd
 }).then(res => res.json())
  .catch(error => console.error('Error:', error))
  .then(response => console.log('Success:', response));
  //}).then(response => console.log("it works cool"))
  //.catch(error => console.log(error, "there should be an error here"));

  
}

/*
function postReq(u, p){
  var username = u;
  var password = p;
  console.log(username,password);
  var data = {
    name: username,
    password: password
   };
  /*
  '/signup/:username/:pass'

  //fetch('/signup/'+username+'/'+pass, 
  fetch('/signup/'+username+'/'+password, 
  {
   method: 'POST',
   body: JSON.stringify(data),
   headers: {
    'Content-Type': 'application/json',
  },
  }).then(res => res.json())
  .catch(error => console.error('Error:', error))
  .then(response => console.log('Success:', response));
}
*/
