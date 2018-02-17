var XWING = new Object({
	commandSphereInactiveMaterial:"color:#0F0; opacity:0.01;",
	
	activeShipSphereColor 	: "#F00",
	inactiveShipSphereColor	: "#0F0",
	hoverShipSphereOpacity	: "0.2",
	unhoverShipSphereOpacity: "0.01",
	
	teleportDistance		: 0.5,

	calculatePitchAndYawForCoords:function(me, to) {
		var dx = to.x-me.x;
		var dy = to.y-me.y;
		var dz = to.z-me.z;
		
		var r = Math.sqrt((dx * dx) + (dy * dy) + dz*dz);
		var newYaw = 90-parseInt(Math.atan2(dz,dx)/Math.PI*180);
		var newPitch = -(90-Math.acos(dy/r)/Math.PI*180);
		
		return {pitch:newPitch, yaw:newYaw};
	},

	
		
}); 