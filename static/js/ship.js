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

	}
};



AFRAME.registerComponent('ship', {
	dependencies:['statussphere'],
	
	schema: {
		type: {type: 'string', default: 'xwing'},
		hull:    {type: 'int', default: 100},
		shields: {type: 'int', default: 0}
	},

	init:function(){
		this.toRel=function(pos, rot, sel, rel) {

			var minSpeed = this.config.mobility.minSpeed;
			var maxSpeed = this.config.mobility.maxSpeed;
	    	var maxYaw = this.config.mobility.maxYaw;
	    	var maxPitch = this.config.mobility.maxPitch;
	    	var maxRoll = this.config.mobility.maxRoll;

	        var newPitch = rot.x - sel.pitch*maxPitch*rel*rel*2;
			var dPitch = (newPitch+rot.x)/2;

			var newYaw = rot.y - sel.yaw*maxYaw*rel*rel*2;
			var dYaw = (newYaw+rot.y)/2;

			var newRoll = -sel.yaw * maxRoll * rel*rel;

			var speed = (sel.throttle*(maxSpeed-minSpeed)+minSpeed)*rel;

	        var dx = -Math.cos(dPitch*Math.PI/180)* Math.sin(dYaw*Math.PI/180)*speed;
	    	var dy = Math.sin(dPitch*Math.PI/180)*speed;
	    	var dz = -Math.cos(dPitch*Math.PI/180)*Math.cos(dYaw*Math.PI/180)*speed;

	        var posXNew = pos.x+dx;
	        var posYNew = pos.y+dy;
	        var posZNew = pos.z+dz;

	        return {x:posXNew, y:posYNew, z:posZNew, pitch: newPitch, yaw:newYaw, roll:newRoll};
		};

		this.to=function(pos, rot, sel) {
			return this.toRel(pos,rot,sel,1);
		}


		this.doesAssetExist = function() {
			return (shipconfig.assets[this.type]!=undefined);
		}

		this.buildAssetIfRequired = function() {
			if (!this.doesAssetExist()) {
				shipconfig.assets[this.type] = document.createElement('a-asset-item');
				shipconfig.assets[this.type].setAttribute('id',this.type+"-gltf");
				shipconfig.assets[this.type].setAttribute('src',this.config.gltf);

				if (document.querySelector('a-assets') == null) {
					document.querySelector('a-scene').appendChild(document.createElement('a-assets'));
				}
				document.querySelector('a-assets').append(shipconfig.assets[this.type]);
			}
		}

		this.buildShip = function() {
			this.buildAssetIfRequired();
			this.model = document.createElement('a-entity');
			this.model.setAttribute('gltf-model',"#"+this.type+"-gltf");
			this.model.setAttribute('rotation',this.config.gltfRot);
			this.model.setAttribute('scale', this.config.gltfScale+" "+this.config.gltfScale+" "+this.config.gltfScale);
			this.model.className = "ship";

			this.el.append(this.model);
		}


		this.setPosition = function(pos) {
			this.el.setAttribute("position",pos);
		}

		this.setRotation = function(rot) {
			this.el.setAttribute("rotation",rot);
		}

		this.setMine = function() {
			this.mine = true;
		}

		this.dots=[];
		this.clearDots=function() {
			for ( i = 0; i<this.dots.length; i++) {
				var dot = this.dots[i];
				dot.parentNode.remove(dot);
			}
			this.dots = [];
		}

		this.paintDots=function(pos, rot, sel) {
			this.dots = [];
			for (var i = 0; i<30; i++) {
				var to = this.toRel(pos, rot, sel, 1/30*(i+1));
				var dot = document.createElement("a-sphere");
				dot.setAttribute("radius","0.002");
				dot.setAttribute("color","#F0F");
				dot.setAttribute("position",""+to.x+" "+to.y+" "+to.z);
				document.querySelector("a-scene").append(dot);
				this.dots[i]=dot;
			}
		}

		this.doMoveGhost = function(selectedYawPitchThrottle) {
			this.clearDots();
			var position = this.el.getAttribute('position');
			var rotation = this.el.getAttribute('rotation');
			this.paintDots(position, rotation, selectedYawPitchThrottle);
		}

		this.doMove = function(selectedYawPitchThrottle) {
			this.clearDots();

			var position = this.el.getAttribute('position');
			var rotation = this.el.getAttribute('rotation');

			
			var data = {};
			data.to=this.to(position, rotation, selectedYawPitchThrottle);
			data.id=this.el.getAttribute('id');
			this.sceneEl.emit('movementSelection', data);

			this.el.removeAttribute('commandablecontrolleractive');
			this.active = false;
		}

		this.setMovementData = function(data) {
			this.el.setAttribute("position", data.pos);
			this.el.setAttribute("rotation", data.rot);
		}
		
		this.clear = function() {
			this.clearDots();
			this.el.removeAttribute('commandablecontrolleractive');
		}

		//event listeners
		var self = this;

		this.el.addEventListener('doMoveGhost',function(selectedYawPitchThrottle) {
			self.doMoveGhost(selectedYawPitchThrottle.detail);
		});

		this.el.addEventListener('doMove',function(selectedYawPitchThrottle) {
			self.doMove(selectedYawPitchThrottle.detail);
		});
		this.el.addEventListener('clear', function () {
			self.clear();
		});
		
		this.el.addEventListener('setMovementData', function(data) {
			self.setMovementData(data.detail);
		});


		//actual constructor
		this.type = this.data.type;
		this.hull = this.data.hull;
		this.shields = this.data.shields;
		this.mine = false;
		this.config = shipconfig[this.type];
		this.buildShip();
		this.sceneEl = document.querySelector('a-scene');
		this.el.setAttribute("statussphere", "");
	}

});

