AFRAME.registerComponent('xwingscene', {
  init: function () {
    this.phase = "init";

    this.socket = io();
    this.socket.on('connect', () => {
      this.socket.on('ship',(data) => {
        var ship = document.createElement('a-entity');
        ship.setAttribute("id",data.id);
        ship.setAttribute("ship", "type:"+data.type+"; hull:"+data.hull+"; shields:"+data.shields+";");
        ship.setAttribute("position", data.pos);
        ship.setAttribute("rotation", data.rot);
        ship.className = "targetable";

        this.el.append(ship);
      });

      this.socket.on('yourship', (data) => {
        var ship = document.querySelector('#'+data.id);
        ship.className += " commandableship";
      });

      this.socket.on('removeShip',(data) => {
        var ship = document.getElementById(data.id);
        ship.parentElement.remove(ship);
      });

      this.socket.on('shootShip', (shooter, target) => {
        var targetShip = document.getElementById(target.id);
        targetShip.emit('setDamageData', data); //TODO: Does not exist yet.
      });


      this.socket.on('moveShip', (data) => {
        var ship = document.getElementById(data.id);
        ship.emit('clear');
        ship.emit('setMovementData', data); //TODO: Do not move ship right away!
      });

      this.socket.on('movementDuration', (data) => {
        this.movementDuration = data;
        console.log("movementDuration: "+this.movementDuration);
      });

      this.socket.on('nextPhase', (phase) => {
        this.setPhase(phase);
      });

      this.socket.on('battlefield', (bf) => {
        this.renderBattlefieldScenery(bf);
      });
    });

    this.setPhase = function(phase) {
      var oldphase = this.phase;

      switch (oldphase) {
        case "setMovement":
          this.enableMovementControls(false);
          break;
        case "evaluateMovement":
          this.abortMovementAnimation();
          break;
        case "setAction":
          this.enableTargetControls(false);
          break;
        case "evaluateAction":
          break;
      }

      this.phase = phase;

      switch (this.phase) {
        case "setMovement":
          this.enableMovementControls(true);
          break;
        case "evaluateMovement":
          this.startMovementAnimation();
          break;
        case "setAction":
          this.enableTargetControls(true);
          break;
        case "evaluateAction":
          break;
      }

      console.log("switched to phase: "+this.phase);
    }

    this.enableMovementControls = function(enable) {
      var els = document.querySelectorAll('.commandableship');
      for (var i = 0; i < els.length; i++) {
        if (enable) {
          els[i].setAttribute("commandableship", "");
        } else {
          els[i].removeAttribute("commandableship");
        }
      }
    }

    this.startMovementAnimation = function() {
      timing = {
        start: Date.now(),
        end: Date.now()+this.movementDuration
      }

      var els = document.querySelectorAll('.ship');
      for (var i = 0; i < els.length; i++) {
        els[i].emit('startMovementAnimation', timing);
      }
    }

    this.abortMovementAnimation = function(){
      var els = document.querySelectorAll('.ship');
      for (var i = 0; i < els.length; i++) {
        els[i].emit('abortMovementAnimation',"");
      }
    }

    this.enableTargetControls = function(enable) {
      var els = document.querySelectorAll('.commandableship');
      for (var i = 0; i < els.length; i++) {
        if (enable) {
          els[i].setAttribute("commandableactionship", "");
        } else {
          els[i].removeAttribute("commandableactionship");
        }
      }
    }


    this.emitMovementSelection=function(data) {
      this.socket.emit('movementSelection', data.to, data.id);
    }

    this.emitTargetSelection = function(data) {
      this.socket.emit('targetSelection', data.shooterID, data.targetID);
    }


    this.removeSideSelectorsAndEmitSideSelection=function(side) {
      var els = document.querySelectorAll('[sideselector]');
      for (var i = 0; i < els.length; i++) {
        els[i].parentNode.removeChild(els[i]);
      }


      if(side == "rebel") {
        this.socket.emit('joinSide','rebel');
      } else {
        this.socket.emit('joinSide','empire');
      }
    }


    var self = this;

    this.renderBattlefieldScenery = function(bf) {
      var assetEl = document.querySelector('a-assets');

      bf.assets.forEach(function(asset) {
        assetEl.appendChild(XWING.generateElementByJSON(asset));
      });


      bf.scenery.forEach(function(part) {
        self.el.appendChild(XWING.generateElementByJSON(part));
      });

    }

    this.el.addEventListener('movementSelection', function(data) {
      self.emitMovementSelection(data.detail);
    });

    this.el.addEventListener('sideSelection', function(data) {
      self.removeSideSelectorsAndEmitSideSelection(data.detail);
    });

    this.el.addEventListener('targetSelection', function(data) {
      self.emitTargetSelection(data.detail);
    });
  }
});
