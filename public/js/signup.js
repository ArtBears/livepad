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

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:3000/";


//get username from form
var username = "testname";

function isUser(username){
	var inputname = username;
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
  		var dbo = db.db("livepad");
  		var query = { user: inputname };
  		dbo.collection("users").find(query).toArray(function(err, result) {
  			if (err) throw err;
  			console.log(result);
  			//
   			db.close();
   		});
  	});
}