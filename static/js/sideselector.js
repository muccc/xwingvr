AFRAME.registerComponent('sideselector', {

  schema: {
    side: {type: 'string', default: 'empire'}
  },

  init: function () {
    var self = this;

    this.el.addEventListener('mousedown', function () {
      this.sceneEl.emit('sideSelection', self.data.side);
    });

  }
});

document.addEventListener('DOMContentLoaded', function (){
  var rebelSelectorImage = XWING.generateElementByJSON(
    {
      element: 'img',
      id: 'rebellogo',
      src: 'img/rebellogo.png'
    });

  var empireSelectorImage = XWING.generateElementByJSON(
    {
      element: 'img',
      id: 'empirelogo',
      src: 'img/empirelogo.png'
    });

  var assets = document.querySelector('a-assets');

  assets.appendChild(rebelSelectorImage);
  assets.appendChild(empireSelectorImage);

  function generateSideSelectorFor (side, pos) {
    return XWING.generateElementByJSON({
    element: 'a-entity',
    id: side+'sideselector',
    sideselector: 'side:'+side,
    position: pos,
    geometry: 'primitive: box; width:1; height:1; depth:0.01;',
    material: 'src:#'+side+'logo; roughness: 1; metalness: 0'
  });}

  var rebelSideSelector = generateSideSelectorFor('rebel','-1 1 -3');
  var empireSideSelector = generateSideSelectorFor('empire','1 1 -3');

  var scene = document.querySelector('a-scene');

  scene.appendChild(rebelSideSelector);
  scene.appendChild(empireSideSelector);
});

