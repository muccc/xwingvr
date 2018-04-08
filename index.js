var express = require('express');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('static'))

var xwingtools = require('./lib/xwingtools.js');


var scenarios = require('./lib/scenarios.js');
var scenario; //set in init

// Phases: init / setMovement / evaluateMovement / setAction / evaluateAction
var phase;
var setMovementTimeout;
var setMovementEvaluationTimeout;
var setActionTimeout;
var timeout;

var sockets = [];
var ships = {};
var players = {};

var game;

var stdin = process.openStdin();

stdin.addListener("data", function(d) {
  s = d.toString().trim();

  switch(s){
    case "n":
      nextPhase();
      break;
    default:
      "Command " + s + " not available";
      break;
  }
});

class Game {
  constructor(scenario) {
    this.teams = [];
    this.players = [];
    this.scenario = scenario;

    this.initTeams();
  }

  initTeams() {
    var self = this;
    ["rebel", "empire"].forEach(function (teamName) {
      let team = new Team(teamName);
      self.teams.push(team);
    });
  }

  addPlayer(player) {
    this.players.push(player);
  }

  removePlayer(player) {
    var index = this.players.indexOf(player);
    if (index !== -1) this.players.splice(index,1);
  }

  checkAllReady() {
    var self = this;
    var allReady = true;

    this.players.forEach(function (player) {
      if (player.phaseReady == false) {
        allReady = false;
      }
    })

    if(allReady) {
      nextPhase();
    }

  }

}

class Team {
  constructor(name) {
    this.name = name;
  }
}

class Player {
  constructor(socketId) {
    this.socketId = socketId;
    this.phaseReady = false;
  }

  get id() {
    return this.socketId;
  }
}

phase = "init";

function init() {
  console.log('init..');
  scenario = scenarios.basic; //this should be configurable...

  game = new Game(scenario);

  ships = createShips();

	setMovementTimeout = scenario.global.movementPhaseDuration  * 1000;
	setMovementEvaluationTimeout = scenario.global.movementEvaluationPhaseDuration * 1000;
	setActionTimeout = scenario.global.actionPhaseDuration  * 1000;


	phase = "init";
  console.log('init.. done');
	nextPhase();
}

function getPlayerID(socketID) {
  for (var playerID in players) {
    if (players[playerID].socketID == socketID) {
      return playerID;
    }
  }
}

function nextPhase() {
  switch(phase) {
  	case "init":
  	  phase = "setMovement";
  	  break;
    case "setMovement":
      phase = "evaluateMovement";
      break;
    case "evaluateMovement":
      phase = "setAction"
      break;
    case "setAction":
      phase = "evaluateAction";
      break;
    case "evaluateAction":
      phase = "setMovement";
      break;
    default:
	  console.log("BUG: no next action for phase " + phase);
      phase = "setMovement";
      break;

  }
  doPhaseAction();
}

function doPhaseAction () {
  console.log("Do Phase Action: " + phase);
  clearTimeout(timeout);
  switch(phase) {
    case "setMovement":
      timeout = setTimeout(nextPhase, setMovementTimeout);
      io.emit('nextPhase', phase);
      break;
    case "evaluateMovement":
      evaluateMovement();
      io.emit('nextPhase', phase);
      timeout = setTimeout(nextPhase, setMovementEvaluationTimeout);
      break;
	case "setAction":
      timeout = setTimeout(nextPhase, setActionTimeout);
      io.emit('nextPhase', phase);
	  break;
	case "evaluateAction":
	  evaluateShooting();
	  io.emit('nextPhase', phase);
	  nextPhase();
	  break;
	default:
	  console.log("BUG: no action for phase " + phase);
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
  io.emit('movementDuration', setMovementEvaluationTimeout);
}

function evaluateShooting() {
  for (var ship in ships) {
    if (ships[ship].stagedTargetID) {
      var targetID = ships[ship].stagedTargetID;
      console.log("Ship "+ships[ship].id+" shoots at "+targetID);

      var chanceToHit = xwingtools.calculateChanceToHit(ships[ship], ships[targetID]);
      console.log("chance to hit: "+chanceToHit);

      var doesHit = chanceToHit > Math.random();
      console.log("hits: "+doesHit);

      if (doesHit) {
        var damage = ships[ship].laser; //TODO: should be at least a little random
        if (ships[targetID].shields == 0) {
        	ships[targetID].hull = ships[targetID].hull-damage;
        } else if (ships[targetID].shields>0) {
          ships[targetID].shields = ships[targetID].shields-damage;
          if (ships[targetID].shields<0) {
  	        ships[targetID].hull = ships[targetID].hull+ships[targetID].shields;
    	    }
    	  }
        io.emit('shoot', ships[ship], ships[targetID]);

    	  if (ships[targetID].hull <= 0) {
    	    ships[targetID].hull = 0;
    	    ships[targetID].destroyed = true;
    	    io.emit('removeShip', ships[targetID]);
    	  }
    	  console.log("Hull:"+ships[targetID].hull+" Shields:"+ships[targetID].shields);
  	  }
      ships[ship].stagedTargetID = null;

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

  var player = new Player(socket.id);
  game.players.push(player);

  socket.on('joinSide', function(side) {
  	for (var i = 0; i<shipArray.length; i++) {
		if (shipArray[i].side == side) {
		  	socket.emit('yourship', shipArray[i]);
		}
	}
	console.log('Player ' + player.id + ' joined ' + side);
	socket.emit('nextPhase', phase);
  });

  socket.on('disconnect', function(){
    sockets = sockets.filter(item => item !== this)
    game.removePlayer(player);
    delete(player);
    console.log(socket.id+' disconnected. now ' + sockets.length + " users in total");
  });

  socket.on('phaseReady', function(){
    player.phaseReady = true;
    game.checkAllReady();
  });

  socket.on('movementSelection', function(to, shipID){
    console.log("Got move: " + to + " From: " + player.id + " Ship: " + shipID);


    var mySel = {};
    mySel.yaw = to.selYaw;
    mySel.pitch = to.selPitch;
    mySel.throttle = to.selThrottle;
  	ships[shipID].stagedSel = mySel;

    //TODO: For this should be evaluated by old position and the selectedYawPitchThrottle!!
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

  socket.on('targetSelection', function(shooterID, targetID) {
  	ships[shooterID].stagedTargetID = targetID;
  });

});

http.listen(8080, function(){
  console.log('listening on *:8080');
  init();
});
