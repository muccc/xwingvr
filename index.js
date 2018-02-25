var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('static'))

var sockets = [];
var ships = {};

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
	
	
	//temp: hull and shield values
	var myHull = 100;
	var myShields = myType=="xwing"?100:0;

	return {id:myId, type:myType, pos:myPos, rot:myRot, hull:myHull, shields:myShields};
}


io.on('connection', function(socket){
  sockets.push(socket);
  console.log(socket.id+' connected. now ' + sockets.length + " users in total.");
  //send other ships to user:
  var shipArray = Object.values(ships);
  for (var i = 0; i<shipArray.length; i++) {
  	socket.emit('othership', shipArray[i]);	
  }
  
  //create user's ship
  ships[socket.id]=createRandomShip(socket.id+"_01");
  socket.emit("yourship", ships[socket.id]);  
  socket.broadcast.emit("othership", ships[socket.id]);
    
  socket.on('disconnect', function(){
	socket.broadcast.emit('removeShip', ships[socket.id]);
  	sockets = sockets.filter(item => item !== this)
  	delete(ships[socket.id]);
    console.log(socket.id+' disconnected. now ' + sockets.length + " users in total");
  });

  socket.on('moveShip', function(to){
	var myPos = {};
	myPos.x = to.x;
	myPos.y = to.y
	myPos.z = to.z
	ships[socket.id].pos = myPos;
	
	
	var myRot = {};
	myRot.x = to.pitch;
	myRot.y = to.yaw;
	myRot.z = to.roll;
	ships[socket.id].rot = myRot;


	socket.broadcast.emit('moveShip', ships[socket.id]);
  });
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});