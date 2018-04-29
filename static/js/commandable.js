/****           commandable component             ****/
AFRAME.registerComponent('commandable', {
  dependencies : ['ship'],

  init: function () {
    var self = this;

    this.active = false;
    this.deactivate = function () {
        this.el.emit('setShipInactive');
        this.active=false;
        this.el.removeState('movementInterfaceActive');
    }
    this.activate = function() {
        this.el.emit('setShipActive');
        this.active=true;
        this.el.addState('movementInterfaceActive');
    }
    this.switchActive = function() {
      if(self.active) {
          self.deactivate();
        } else {
          self.activate();
        }
    }

    this.el.addEventListener('mousedown', this.switchActive);
    this.el.emit('updatespherestatus');

    this.generateMovementInterface = function() {
      var el = this.el;
      var self = this;


      var pos = el.getAttribute('position');

      var cameraPos = (new THREE.Vector3()).setFromMatrixPosition(document.querySelector('[camera]').object3D.matrixWorld);

      var angle = XWING.calculatePitchAndYawForCoords(pos, cameraPos);

      this.selectionArea = XWING.generateElementByJSON({
        element: 'a-entity',
        position: pos,
        rotation: ""+angle.pitch+" "+angle.yaw+" 0"
      });

      document.querySelector('a-scene').append(this.selectionArea);

      this.turnSelectionArea = XWING.generateElementByJSON({
        element: 'a-entity',
        geometry: 'primitive:plane; height:0.2; width:0.2;',
        position: '0 -0.2 0',
        material: 'src:#flightcomputer'
      });
      this.turnSelectionArea.addEventListener('mousedown', function(evt){
        if(evt.target==self.turnSelectionArea) {
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
      this.moveXSelection = 0;
      this.moveYSelection = 0;
      this.selectionArea.append(this.turnSelectionArea);

      this.throttleSelectionArea = XWING.generateElementByJSON({
        element: 'a-entity',
        geometry: 'primitive:plane; height:0.2; width:0.025;',
        position: '-0.1125 -0.2 0',
        material: 'src:#throttle'
      });
      this.throttleSelectionArea.addEventListener('mousedown', function(evt){
        if(evt.target==self.throttleSelectionArea) {
          var yRel = evt.detail.intersection.uv.y;
          self.throttleSelection = yRel;
          var yAbs = (yRel-0.5)*0.2;
          self.throttleclickpunkt.setAttribute('position',""+0+" "+yAbs+" 0");
          el.emit('doMoveGhost',{yaw:self.moveXSelection,pitch:self.moveYSelection,throttle:self.throttleSelection});
        }
      });
      this.throttleSelection = 0.5;
      this.selectionArea.append(this.throttleSelectionArea);

      this.goButtonArea = XWING.generateElementByJSON({
        element: 'a-entity',
        geometry: 'primitive:plane; height:0.2; width:0.025;',
        position: '+0.1125 -0.2 0',
        material: 'src:#go'
      });
      this.goButtonArea.addEventListener('mousedown', function(evt){
        el.emit('doMove',{yaw:self.moveXSelection,pitch:self.moveYSelection,throttle:self.throttleSelection});
        el.removeState('movementInterfaceActive');
      });
      this.selectionArea.append(this.goButtonArea);


      this.clickpunkt = XWING.generateElementByJSON({
        element: 'a-entity',
        geometry: 'primitive:sphere; radius:0.005',
        position: ""+0+" "+0+" 0",
        material: 'color:blue'
      });
      this.clickpunkt.addEventListener('mousedown', function(){return false;});
      this.turnSelectionArea.append(this.clickpunkt);

      this.throttleclickpunkt = XWING.generateElementByJSON({
        element: 'a-entity',
        geometry: 'primitive: box; width: 0.05; height: 0.005; depth: 0.005; ',
        position: ""+0+" "+0+" 0",
        material: 'color:blue'
      });
      this.throttleclickpunkt.addEventListener('mousedown', function(){return false;});
      this.throttleSelectionArea.append(this.throttleclickpunkt);

      el.emit('doMoveGhost',{yaw:self.moveXSelection,pitch:self.moveYSelection,throttle:self.throttleSelection});
    }

    this.movementInterfaceActiveEventListener = function (evt) {
      if (evt.detail.state == 'movementInterfaceActive'){
        self.generateMovementInterface();
      }
    };
    this.el.addEventListener('stateadded', this.movementInterfaceActiveEventListener);

    this.movementInterfaceInactiveEventListener = function (evt) {
      if (evt.detail.state == 'movementInterfaceActive'){
        XWING.removeElement(self.turnSelectionArea);
        XWING.removeElement(self.goButtonArea);
        XWING.removeElement(self.throttleSelectionArea);
        XWING.removeElement(self.selectionArea);
      }
    };
    this.el.addEventListener('stateremoved', this.movementInterfaceInactiveEventListener);
  },
  remove: function() {
    this.el.removeState('movementInterfaceActive');
    this.el.removeEventListener('mousedown', this.switchActive);
    this.el.removeEventListener('stateremoved', this.movementInterfaceInactiveEventListener);
    this.el.removeEventListener('stateadded', this.movementInterfaceActiveEventListener);

    this.el.emit('clear');
  },
  tick: function() {
    if(this.el.is('movementInterfaceActive')){
      var pos = this.el.getAttribute('position');
      var cameraPos = (new THREE.Vector3()).setFromMatrixPosition(document.querySelector('[camera]').object3D.matrixWorld);
      var angle = XWING.calculatePitchAndYawForCoords(pos, cameraPos);
      this.selectionArea.setAttribute('rotation',""+angle.pitch+" "+angle.yaw+" 0");
    }
  },
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
