	function calculateDistanceAndAngelsForCoords(to, me) {
		var dx = to.x-me.x;
		var dy = to.y-me.y;
		var dz = to.z-me.z;
		
		var r = Math.sqrt((dx * dx) + (dy * dy) + dz*dz);
		var ay = 90-parseInt(Math.atan2(dz,dx)/Math.PI*180);
		ay=ay<0?ay+360:ay;
		
		var ax = -(90-Math.acos(dy/r)/Math.PI*180);
		ax=ax<0?ax+360:ax;
		
		return {alphax:ax, alphay:ay, dist:r, distx:dx, disty:dy, distz:dz};
	};


	function calculateChanceForDistance(distAndAngles) {
		var settingForDistance = 1.0; //1.0 -> 50% at a distance of 1m --> more is less!
		
		var dist = distAndAngles.dist;
		var chanceForDistance = Math.sqrt(settingForDistance/(dist+1.0));

		return chanceForDistance;
			
	}
	
	function calculateChanceForAngles(distAndAngles, ownRotation) {
		var settingForPitch = 45; //Maximum Angle
		var settingForYaw   = 45; //Maximum Angle

		var relPitch = (distAndAngles.alphax-ownRotation.x);
			relPitch = relPitch>180?relPitch-360:relPitch;
			relPitch = relPitch<-180?relPitch+360:relPitch;
		
		var relYaw = (distAndAngles.alphay-ownRotation.y);
			relYaw = relYaw > 180?relYaw-360:relYaw;
			relYaw = relYaw <-180?relYaw+360:relYaw;
		
		var chanceForPitch = Math.abs(relPitch)<settingForPitch?Math.sqrt(1-((relPitch/settingForPitch)*(relPitch/settingForPitch))):0;
		var chanceForYaw = Math.abs(relYaw)<settingForYaw?Math.sqrt(1-((relYaw/settingForYaw)*(relYaw/settingForYaw))):0;;
		
		var chanceForAngles = chanceForPitch*chanceForYaw;
		
		return chanceForAngles;	
	}

	exports.calculateChanceToHit = function(me, to) {
		var distAndAngles = calculateDistanceAndAngelsForCoords(me.pos, to.pos);
	
		var chanceForDistance = calculateChanceForDistance(distAndAngles);
		var chanceForAngles = calculateChanceForAngles(distAndAngles, me.rot);
		
		var chanceToHit = chanceForDistance*chanceForAngles;
		
		
		return chanceToHit;
	};