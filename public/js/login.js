/*
login page
    "/login" GET
    "/login/:username/:pass" POST
    page name: "login.html"
    Create routes (POST & GET)
    Should query the DB for the form data, if null return error
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