var shipconfig= {
	assets : {},

	xwing : {
		gltf:"gltf/xwing.gltf",
		gltfScale:0.06,
		gltfRot:{x:0, y:180, z:0},

		mobility: {
				minSpeed:0.4,
				maxSpeed:1.3,
				maxYaw:80,
				maxPitch:70,
				maxRoll:45
			},
	},
	tie : {
		gltf:"gltf/tie.gltf",
		gltfScale:0.135,
		gltfRot:{x:0, y:180, z:0},

		mobility: {
				minSpeed:0.2,
				maxSpeed:0.8,
				maxYaw:110,
				maxPitch:80,
				maxRoll:45
			},
	},
	
  toRelMobility:function(pos, rot, sel, rel, mobility) {
    /**
    * pos: own position, {x,y,z}
    * rot: own rotation, {x,y,z}
    * sel: movement selection {pitch, yaw, roll}
    * rel: relative to complete movement 0<=rel<=1
    * mobliity: mobility settings of shipconfig
    * 
    * return: positional data: {x,y,z,pitch,yaw,roll}
    */
    
    var minSpeed = mobility.minSpeed;
    var maxSpeed = mobility.maxSpeed;
    var maxYaw   = mobility.maxYaw;
    var maxPitch = mobility.maxPitch;
    var maxRoll  = mobility.maxRoll;
    
    var newPitch = rot.x - sel.pitch*maxPitch*rel*rel*2;
    var newYaw = rot.y - sel.yaw*maxYaw*rel*rel*2;
    var newRoll = rot.z*(1-rel*rel) - sel.yaw*maxRoll*rel*rel;


    var dPitch = (newPitch+rot.x)/2;
    var dYaw = (newYaw+rot.y)/2;
    
    var speed = (sel.throttle*(maxSpeed-minSpeed)+minSpeed)*rel;
    
    var dx = -Math.cos(dPitch*Math.PI/180)* Math.sin(dYaw*Math.PI/180)*speed;
    var dy = Math.sin(dPitch*Math.PI/180)*speed;
    var dz = -Math.cos(dPitch*Math.PI/180)*Math.cos(dYaw*Math.PI/180)*speed;
    
    var posXNew = pos.x+dx;
    var posYNew = pos.y+dy;
    var posZNew = pos.z+dz;
    
    return {x:posXNew, y:posYNew, z:posZNew, pitch: newPitch, yaw:newYaw, roll:newRoll};
  }
};
