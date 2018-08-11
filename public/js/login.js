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

/*
login()
parse username and password input fields
make a post request call and pass username, password
*/
function login(){
  username = document.getElementById("userNameInput").value;
  password = document.getElementById("passWordInput").value;
  console.log(username + " " + password);
  postReq(username, password);
}

/*
postReq(username, pass)
takes username, password input and makes post request
will do different things depending on response status code
400 == error -> alert user
200 == success -> redirect to next page
*/
function postReq(username, pass){
  fetch('/login/'+username+'/'+pass, 
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
      window.location.replace('/session/list');
    }
  });
}
