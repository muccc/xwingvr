/****         laser-teleport component            ****/
/**** usage: <a-entity laser-teleport></a-entity> ****/


AFRAME.registerComponent('teleportable', {
	init: function () {
	    var el = this.el;
	    var self = this;
	
	    el.addEventListener('camteleport', function (evt) {
			if (!(
	    		AFRAME.utils.device.isGearVR()
	    		||
	    		AFRAME.utils.device.checkHasPositionalTracking()
	    		||
	    		AFRAME.utils.device.isMobile()
	    		)) {return false;}

			var jmp = XWING.teleportDistance;
	    	
	    	var dPitch = document.querySelector('#teleportlaser').getAttribute('rotation').x;
	    	var dYaw   = document.querySelector('#teleportlaser').getAttribute('rotation').y;
	    	var dRoll  = document.querySelector('#teleportlaser').getAttribute('rotation').z;
	      
	      
	        var xOld = el.getAttribute('position').x;
	        var yOld = el.getAttribute('position').y;
	        var zOld = el.getAttribute('position').z;

	        var dx = (-1)*Math.cos(dPitch*Math.PI/180)*Math.sin(dYaw*Math.PI/180);
			var dy = Math.sin(dPitch*Math.PI/180);
		    var dz = (-1)*Math.cos(dPitch*Math.PI/180)*Math.cos(dYaw*Math.PI/180);
	
	        var xNew = xOld+dx*jmp;
	        var yNew = yOld+dy*jmp;
	        var zNew = zOld+dz*jmp;
	        

	        el.setAttribute('position', ""+xNew+" "+yNew+" "+zNew);
	   	});
	   	
	   	var triggerWallN = document.createElement('a-box');
		triggerWallN.setAttribute("position","0 0 50");
		triggerWallN.setAttribute("width","100");
		triggerWallN.setAttribute("depth","1");
		triggerWallN.setAttribute("height","100");
		triggerWallN.setAttribute("color","#000");
		triggerWallN.setAttribute("opacity","0.01");
		triggerWallN.setAttribute("motion-listener", "");

		el.appendChild(triggerWallN);

	   	var triggerWallS = document.createElement('a-box');
		triggerWallS.setAttribute("position","0 0 -50");
		triggerWallS.setAttribute("width","100");
		triggerWallS.setAttribute("depth","1");
		triggerWallS.setAttribute("height","100");
		triggerWallS.setAttribute("color","#000");
		triggerWallS.setAttribute("opacity","0.01");
		triggerWallS.setAttribute("motion-listener", "");

		el.appendChild(triggerWallS);

	   	var triggerWallE = document.createElement('a-box');
		triggerWallE.setAttribute("position","50 0 0");
		triggerWallE.setAttribute("width","1");
		triggerWallE.setAttribute("depth","100");
		triggerWallE.setAttribute("height","100");
		triggerWallE.setAttribute("color","#000");
		triggerWallE.setAttribute("opacity","0.01");
		triggerWallE.setAttribute("motion-listener", "");

		el.appendChild(triggerWallE);

	   	var triggerWallW = document.createElement('a-box');
		triggerWallW.setAttribute("position","-50 0 0");
		triggerWallW.setAttribute("width","1");
		triggerWallW.setAttribute("depth","100");
		triggerWallW.setAttribute("height","100");
		triggerWallW.setAttribute("color","#000");
		triggerWallW.setAttribute("opacity","0.01");
		triggerWallW.setAttribute("motion-listener", "");

		el.appendChild(triggerWallW);

	   	var triggerWallT = document.createElement('a-box');
		triggerWallT.setAttribute("position","0 50 0");
		triggerWallT.setAttribute("width","100");
		triggerWallT.setAttribute("depth","100");
		triggerWallT.setAttribute("height","1");
		triggerWallT.setAttribute("color","#000");
		triggerWallT.setAttribute("opacity","0.01");
		triggerWallT.setAttribute("motion-listener", "");

		el.appendChild(triggerWallT);
		
	   	var triggerWallB = document.createElement('a-box');
		triggerWallB.setAttribute("position","0 -50 0");
		triggerWallB.setAttribute("width","100");
		triggerWallB.setAttribute("depth","100");
		triggerWallB.setAttribute("height","1");
		triggerWallB.setAttribute("color","#000");
		triggerWallB.setAttribute("opacity","0.01");
		triggerWallB.setAttribute("motion-listener", "");

		el.appendChild(triggerWallB);
	}
});


AFRAME.registerComponent('motion-listener', {
  init: function () {
    var el = this.el;
    
    var self = this;

    el.addEventListener('mousedown', function (evt) {
    	var cam = document.querySelector('a-camera');
		cam.emit('camteleport');
    });
  }
});


AFRAME.registerComponent('laser-teleport', {
  init: function () {
	var lasercontrolentity = document.createElement('a-entity');
	lasercontrolentity.setAttribute('id', 'teleportlaser');
	lasercontrolentity.setAttribute('laser-controls', '');
	
	this.el.appendChild(lasercontrolentity);
    
   	
   	if (document.querySelector('a-camera') == null) {
   		this.el.appendChild(document.createElement('a-camera'));
   	} else {
		//tested?
		var cameraEntity = document.querySelector('a-camera');
		cameraEntity.parentElement.removeChild(cameraEntity);
		this.el.appendChild(cameraEntity);
   	}
   	
   	this.el.setAttribute('teleportable','');
   	
   	if (!(
   		AFRAME.utils.device.isGearVR()
	    ||
	    AFRAME.utils.device.checkHasPositionalTracking()
	    ||
	    AFRAME.utils.device.isMobile()
	)) {
		document.querySelector('a-camera').setAttribute('wasd-controls',"fly:true;");
		var cursor = document.createElement('a-entity');
		cursor.setAttribute('cursor',"fuse: true; fuseTimeout: 500");
		cursor.setAttribute('position',"0 0 -0.03");
		cursor.setAttribute('geometry',"primitive: ring; radiusInner: 0.0004; radiusOuter: 0.00055");
		cursor.setAttribute('material',"color: red; shader: flat");
		
		document.querySelector('a-camera').appendChild(cursor);
	}
	    		
   	
  }
});
