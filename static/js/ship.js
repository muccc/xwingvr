AFRAME.registerComponent('ship', {
  dependencies:['statussphere'],

  schema: {
    type: {type: 'string', default: 'xwing'},
    hull:    {type: 'int', default: 100},
    shields: {type: 'int', default: 0}
  },

  init:function(){
    this.to=function(pos, rot, sel) {
      return this.toRel(pos,rot,sel,1);
    }

    this.toRel=function(pos, rot, sel, rel) {
      return shipconfig.toRelMobility(pos, rot, sel, rel, this.config.mobility);
    };

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
      data.to.selYaw = selectedYawPitchThrottle.yaw;
      data.to.selPitch = selectedYawPitchThrottle.pitch;
      data.to.selThrottle = selectedYawPitchThrottle.throttle;

      data.id=this.el.getAttribute('id');
      this.sceneEl.emit('movementSelection', data);

      this.el.removeAttribute('commandablecontrolleractive');
      this.active = false;
    }

    this.resetMovementData = function() {
      this.stagedMovementData = {};
      this.stagedMovementDataPresent = false;
    }

    this.setMovementData = function(data) {
      this.resetMovementData();
      this.stagedMovementData.origPos = this.el.getAttribute('position');
      this.stagedMovementData.origRot = this.el.getAttribute('rotation');
      this.stagedMovementData.finalPos = data.pos;
      this.stagedMovementData.finalRot = data.rot;
      this.stagedMovementData.stagedSel = data.stagedSel;
      this.stagedMovementDataPresent = true;
    }

    this.clear = function() {
      this.clearDots();
      this.el.removeAttribute('commandablecontrolleractive');
    }

    this.updatePositionForAnimation = function() {
      var duration = this.movementTiming.end - this.movementTiming.start;
      var relativeTime = (Date.now() - this.movementTiming.start)/duration;

      if (relativeTime >= 1 && this.stagedMovementDataPresent) {
        this.movementAnimationActive = false;
        this.el.setAttribute("position", this.stagedMovementData.finalPos);
        this.el.setAttribute("rotation", this.stagedMovementData.finalRot);
        this.resetMovementData();
      } else if (this.stagedMovementDataPresent) {
        //NOW MOVE!!
        var staged = this.stagedMovementData;
        var moveTo = this.toRel(staged.origPos, staged.origRot, staged.stagedSel, relativeTime);
        var newPosition={x:moveTo.x, y:moveTo.y, z:moveTo.z};
        var newRotation={x:moveTo.pitch, y:moveTo.yaw, z:moveTo.roll};

        this.el.setAttribute("position", newPosition);
        this.el.setAttribute("rotation", newRotation);
      }
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

    this.el.addEventListener('startMovementAnimation', function(data) {
      self.movementTiming = data.detail;
      self.movementAnimationActive = true;
    });

    this.el.addEventListener('abortMovementAnimation', function() {
      self.resetMovementData();
    });

    //actual constructor
    this.type = this.data.type;
    this.hull = this.data.hull;
    this.shields = this.data.shields;
    this.mine = false;
    this.config = shipconfig[this.type];
    this.buildShip();
    this.resetMovementData();
    this.sceneEl = document.querySelector('a-scene');
    this.el.setAttribute("statussphere", "");
  },

  tick: function() {
    if (this.movementAnimationActive) {
      this.updatePositionForAnimation();
    }
  }


});

