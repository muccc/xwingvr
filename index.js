var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('static'))

setMovementTimeout = 20000;

var sockets = [];
var ships = {};
var players = {};

// Phases: setMovement / evaluateMovement / setAction / evaluateAction
var phase = "setMovement";
setTimeout(nextPhase, setMovementTimeout);

function getPlayerID(socketID) {
  for (var playerID in players) {
    if (players[playerID].socketID == socketID) {
      return playerID;
    }
  }
}

function checkAllReady() {
  for (var playerID in players) {
    if (players[playerID].phaseReady == false) {
      return;
    }
  }
  nextPhase();
}

function nextPhase() {
  switch(phase) {
    case "setMovement":
      phase = "evaluateMovement";
      break;
    case "evaluateMovement":
      phase = "setMovement";
      break;
  }
  doPhaseAction();
}

function doPhaseAction () {
  console.log("Do Phase Action: " + phase);
  switch(phase) {
    case "setMovement":
      setTimeout(nextPhase, setMovementTimeout);
      break;
    case "evaluateMovement":
      evaluateMovement();
      nextPhase();
      break;
  }
}

function evaluateMovement() {
  for (var ship in ships) {
    if (ships[ship].stagedPos) {
      ships[ship].pos = ships[ship].stagedPos;
      ships[ship].rot = ships[ship].stagedRot;
      ships[ship].stagedPos = null;
      ships[ship].stagedRot = null;

      io.emit('moveShip', ships[ship]);
    }
  }
}

function createRandomShip(myId) {
	var myType = Math.random()>0.5?"xwing":"tie";
	var myPos = {};
	myPos.x = Math.random()*4-2;
	myPos.y = Math.random()*4-2;
	myPos.z = Math.random()*4-2;


	var myRot = {};
	myRot.x = Math.random()*120-60;
	myRot.y = Math.random()*360;
	myRot.z = Math.random()*40-20;

	return {id:myId, type:myType, pos:myPos, rot:myRot};
}


io.on('connection', function(socket){
  sockets.push(socket);
  console.log(socket.id+' connected. now ' + sockets.length + " users in total.");
  //send other ships to user:
  var shipArray = Object.values(ships);
  for (var i = 0; i<shipArray.length; i++) {
  	socket.emit('othership', shipArray[i]);
  }

  //to begin with
  var playerID = socket.id;

  players[playerID] = {};
  players[playerID].socketID = socket.id;
  players[playerID].phaseReady = false;

  //create user's ship
  var shipID = playerID+"_01";
  ships[shipID]=createRandomShip(shipID);
  socket.emit("yourship", ships[shipID]);
  socket.broadcast.emit("othership", ships[shipID]);

  socket.on('disconnect', function(){
	socket.broadcast.emit('removeShip', ships[shipID]);
  	sockets = sockets.filter(item => item !== this)
  	delete(ships[shipID]);
    delete(players[playerID]);
    console.log(socket.id+' disconnected. now ' + sockets.length + " users in total");
  });

  socket.on('phaseReady', function(){
    players[playerID].phaseReady = true;
    checkAllReady();
  });

  socket.on('moveShip', function(to){
    console.log("Got move: " + to + " From: " + playerID + " Ship: " + shipID);
	var myPos = {};
	myPos.x = to.x;
	myPos.y = to.y
	myPos.z = to.z
	ships[shipID].stagedPos = myPos;


	var myRot = {};
	myRot.x = to.pitch;
	myRot.y = to.yaw;
	myRot.z = to.roll;
	ships[shipID].stagedRot = myRot;


	//socket.broadcast.emit('moveShip', ships[shipID]);
  });
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});
