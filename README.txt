//////////////////////////////////////
//	Capstone Project by				//  
//									//
//	Glyne Gittens					//
//	Kevin Espinola					//
//	Kevin Yan						//
//									//
//////////////////////////////////////
// 			README.txt				//
//////////////////////////////////////

All work done via git logged onto our branches
from master-> @ https://github.com/ArtBears/livepad

/branchke = Kevin Espinola's branch
/branchky = Kevin Yan's branch
/webserver = Glyne Gitten's branch

//////////////////////////////////////
Project hosted by Paperspace @ the following
addresses, please visit one to avoid dealing with
installation of packages and tools needed to run
the source code locally.

74.82.53.200 - Glyne Gitten's paperspace server
74.82.53.201 - Kevin Yan's paperspace server
74.82.53.202 - Kevin Espinola's paperspace server

//////////////////////////////////////
To run source code locally

-Unzip this entire .zip into a directory
-Ensure your terminal of choice has access to:

	mongo
	node
	npm

-Ensure you have mongodb
// mongodb setup - credit to Glyne G
	check if you have a /data/db directory on your system
	No? create it ' sudo mkdir /data  '  then ' sudo mkdir /data/db '
	Yes? Gratz
Change permissions for those directories
	sudo chmod 777 /data
	sudo chmod 777 /data/db
Start the mongo process ' mongod & '
	The '&' tells it to run in the background
	press enter if the command prompt doesn't come back
To use the mongo interactive shell run ' mongo  '
	mongod must be running already for this to work
	to check: use ' ps aux | grep mongo '
	if you see more than one result, its running already
	if this is your first time starting mongo, create the livepad database by typing ' use livepad '  

-Run node index.js
-Visit http://localhost:3000/


site flow

signup if you dont have an account, otherwise login with your account
	@session/list/yourUSERid -> join a session in progress OR click on new at the top of the list
		@session/sessionID/userID -> click create to start using the pad to make music OR click listen to listen to user made music
			@session/createSong -> make music and then name your song, upload it
				site was never finished :(