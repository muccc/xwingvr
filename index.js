var express = require('express');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('static'))

var scenarios = require('./lib/scenarios.js');
var scenario; //set in init

// Phases: setMovement / evaluateMovement / setAction / evaluateAction
var phase;
var setMovementTimeout;

var sockets = [];
var ships = {};
var players = {};


function init() {
	scenario = scenarios.basic; //this should be configurable...

	ships = createShips();

	setMovementTimeout = scenario.global.phaseDuration  * 1000;

	setTimeout(nextPhase, setMovementTimeout);
	phase = "setMovement";
}

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

function createShips() {
	var result = {};
	for (var ship in scenario.rebel) {
    	result[scenario.rebel[ship].id] = scenario.rebel[ship];
    	result[scenario.rebel[ship].id].side = 'rebel';
    }

	for (var ship in scenario.empire) {
    	result[scenario.empire[ship].id] = scenario.empire[ship];
    	result[scenario.empire[ship].id].side = 'empire';
    }
    return result;
}



io.on('connection', function(socket){
  sockets.push(socket);
  console.log(socket.id+' connected. now ' + sockets.length + " users in total.");
  //send other ships to user:
  var shipArray = Object.values(ships);
  for (var i = 0; i<shipArray.length; i++) {
  	socket.emit('ship', shipArray[i]);
  }

  //to begin with
  var playerID = socket.id;

  players[playerID] = {};
  players[playerID].socketID = socket.id;
  players[playerID].phaseReady = false;
  

  socket.on('joinSide', function(side) {
  	for (var i = 0; i<shipArray.length; i++) {
		if (shipArray[i].side == side) {
		  	socket.emit('yourship', shipArray[i]);
		}
	}
	console.log('Player ' + playerID + ' joined ' + side);
  });

  socket.on('disconnect', function(){
  	sockets = sockets.filter(item => item !== this)
    delete(players[playerID]);
    console.log(socket.id+' disconnected. now ' + sockets.length + " users in total");
  });

  socket.on('phaseReady', function(){
    players[playerID].phaseReady = true;
    checkAllReady();
  });

  socket.on('moveShip', function(to, shipID){
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
  });
});

http.listen(8080, function(){
  console.log('listening on *:8080');
  init();
});
