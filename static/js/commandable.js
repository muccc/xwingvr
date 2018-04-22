/****           commandable component             ****/
AFRAME.registerComponent('commandableship', {
  dependencies : ['ship'],

  init: function () {
    this.active = false;
    this.deactivate = function () {
        this.el.emit('setShipInactive');
        this.active=false;
        this.el.removeAttribute('commandablecontrolleractive');
    }
    this.activate = function() {
        this.el.emit('setShipActive');
        this.active=true;
        this.el.setAttribute('commandablecontrolleractive',"");
    }
    this.switchActive = function() {
      if(this.active) {
          this.deactivate();
        } else {
        this.activate();
        }
    }

    var self = this;
    this.fnordSwitchActive = function()  {
      self.switchActive();
    }

    this.el.addEventListener('mousedown', this.fnordSwitchActive);
    this.el.emit('updatespherestatus');
  },
  remove: function() {
    this.el.emit('clear');
    this.el.removeEventListener('mousedown', this.fnordSwitchActive);
    this.el.removeAttribute('commandablecontrolleractive');
  }
});



AFRAME.registerComponent('commandablecontrolleractive', {
  dependencies:['commandable'],
  init: function() {
    var el = this.el;
    var self = this;


    var pos = el.getAttribute('position');

    var selectionArea = document.createElement('a-entity');
    selectionArea.setAttribute('position',""+pos.x+" "+pos.y+" "+pos.z);

    var cameraPos = (new THREE.Vector3()).setFromMatrixPosition(document.querySelector('[camera]').object3D.matrixWorld);

    var angle = XWING.calculatePitchAndYawForCoords(pos, cameraPos);

    selectionArea.setAttribute('rotation',""+angle.pitch+" "+angle.yaw+" 0");


    self.selectionArea = selectionArea;
    document.querySelector('a-scene').append(selectionArea);


    var turnSelectionArea = document.createElement('a-entity');
    turnSelectionArea.setAttribute('geometry','primitive:plane; height:0.2; width:0.2;');
    turnSelectionArea.setAttribute('position',"0 -0.2 0");
    turnSelectionArea.setAttribute('material', 'src:#flightcomputer');
    turnSelectionArea.addEventListener('mousedown', function(evt){
      if(evt.target==turnSelectionArea) {
        var xRel = evt.detail.intersection.uv.x;
        var yRel = evt.detail.intersection.uv.y;

        self.moveXSelection = xRel-0.5;
        self.moveYSelection = yRel-0.5;

        var xAbs = (xRel-0.5)*0.2;
        var yAbs = (yRel-0.5)*0.2;

        self.clickpunkt.setAttribute('position',""+xAbs+" "+yAbs+" 0");
        el.emit('doMoveGhost',{yaw:self.moveXSelection,pitch:self.moveYSelection,throttle:self.throttleSelection});
      }
    });
    self.moveXSelection = 0;
    self.moveYSelection = 0;
    self.turnSelectionArea = turnSelectionArea;
    self.selectionArea.append(turnSelectionArea);

    var throttleSelectionArea = document.createElement('a-entity');
    throttleSelectionArea.setAttribute('geometry','primitive:plane; height:0.2; width:0.025;');
    throttleSelectionArea.setAttribute('position',"-0.1125 -0.2 0");
    throttleSelectionArea.setAttribute('material', 'src:#throttle');
    throttleSelectionArea.addEventListener('mousedown', function(evt){
      if(evt.target==throttleSelectionArea) {
        var yRel = evt.detail.intersection.uv.y;
        self.throttleSelection = yRel;
        var yAbs = (yRel-0.5)*0.2;
        self.throttleclickpunkt.setAttribute('position',""+0+" "+yAbs+" 0");
        el.emit('doMoveGhost',{yaw:self.moveXSelection,pitch:self.moveYSelection,throttle:self.throttleSelection});
      }
    });
    self.throttleSelection = 0.5;
    self.throttleSelectionArea = throttleSelectionArea;
    self.selectionArea.append(throttleSelectionArea);

    var goButtonArea = document.createElement('a-entity');
    goButtonArea.setAttribute('geometry','primitive:plane; height:0.2; width:0.025;');
    goButtonArea.setAttribute('position',"+0.1125 -0.2 0");
    goButtonArea.setAttribute('material', 'src:#go');
    goButtonArea.addEventListener('mousedown', function(evt){
      el.emit('doMove',{yaw:self.moveXSelection,pitch:self.moveYSelection,throttle:self.throttleSelection});
    });
    self.goButtonArea = goButtonArea;
    self.selectionArea.append(goButtonArea);


    var clickpunkt = document.createElement('a-entity');
    clickpunkt.setAttribute('geometry','primitive:sphere; radius:0.005');
    clickpunkt.setAttribute('position',""+0+" "+0+" 0");
    clickpunkt.setAttribute('material',"color:blue");
    clickpunkt.addEventListener('mousedown', function(){return false;});
    self.clickpunkt = clickpunkt;
    self.turnSelectionArea.append(clickpunkt);

    var throttleclickpunkt = document.createElement('a-entity');
    throttleclickpunkt.setAttribute('geometry','primitive: box; width: 0.05; height: 0.005; depth: 0.005; ');
    throttleclickpunkt.setAttribute('position',""+0+" "+0+" 0");
    throttleclickpunkt.setAttribute('material',"color:blue");
    throttleclickpunkt.addEventListener('mousedown', function(){return false;});
    self.throttleclickpunkt = throttleclickpunkt;
    self.throttleSelectionArea.append(throttleclickpunkt);

    el.emit('doMoveGhost',{yaw:self.moveXSelection,pitch:self.moveYSelection,throttle:self.throttleSelection});
  },

  remove: function() {
    var el = this.el;
    var self = this;

    var turnSelectionArea = self.turnSelectionArea;
    turnSelectionArea.parentNode.removeChild(turnSelectionArea);

    var goButtonArea = self.goButtonArea;
    goButtonArea.parentNode.removeChild(goButtonArea);

    var throttleSelectionArea = self.throttleSelectionArea;
    throttleSelectionArea.parentNode.removeChild(throttleSelectionArea);
  },

  tick: function() {
    var pos = this.el.getAttribute('position');
    var cameraPos = (new THREE.Vector3()).setFromMatrixPosition(document.querySelector('[camera]').object3D.matrixWorld);
    var angle = XWING.calculatePitchAndYawForCoords(pos, cameraPos);
    this.selectionArea.setAttribute('rotation',""+angle.pitch+" "+angle.yaw+" 0");
  }

});

window.addEventListener('load', function() {
  var assets = [{
    element:'img',
    id:"flightcomputer",
    src:"img/flightcomputer.png"
  },{
    element:'img',
    id:"throttle",
    src:"img/throttle.png"
  },{
    element:'img',
    id:"go",
    src:"img/go.png"
  }];

  assets.forEach(function(asset) {
    var element = XWING.generateElementByJSON(asset);
    document.querySelector('a-assets').appendChild(element);
  });

});
