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