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

/*
signup()
parse username and password input fields
make a post request call and pass username, password
*/
function signup(){
  username = document.getElementById("userNameInput").value;
  password = document.getElementById("passWordInput").value;
  postReq(username, password);
}


/*
postReq(username, pass)
takes username, password input and makes post request
will do different things depending on response status code
400 == error -> alert user
201 == success -> redirect to next page
*/
function postReq(username, pass){
  fetch('/signup/'+username+'/'+pass, 
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
    else if(resp.status == 201){
      var userId = resp.userId;
      window.location.replace('/session/list/'+userId);
    }
  });
}




/* zombie code, used for my own reference

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
