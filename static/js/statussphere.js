/****           statussphere component             ****/
AFRAME.registerComponent('statussphere', {
	
	
	init: function () {
		this.getSphere = function() {
			if (this._sphere == undefined) {
				this._sphere = document.createElement('a-entity');
				this._sphere.setAttribute("geometry","primitive: sphere; radius: 0.1;");
				this._sphere.setAttribute('material', 'opacity:0.01, color:#000');
			} 
			return this._sphere;
		};
		
		this.hoverOn = function() {
			this.getSphere().setAttribute('material', 'opacity',0.2);
		}
		
		this.hoverOff = function() {
			this.getSphere().setAttribute('material', 'opacity',0.01);	
		}


		
		this.updateSphereStatus = function() {
			if (this.el.hasAttribute("commandableship")) {
				this.getSphere().setAttribute("material","color:#0F0");
			} else {
				this.getSphere().setAttribute("material","color:#000");
			}
			console.log('updated sphere');
		}
		

		this.el.append(this.getSphere());

		this.updateSphereStatus();

		var self = this;

		this.getSphere().addEventListener('mouseenter', function () {
			self.hoverOn();
		});
		
		this.getSphere().addEventListener('mouseleave', function () {
			self.hoverOff();
		});


		this.el.addEventListener('updatespherestatus', function(data) {
			self.updateSphereStatus();
			console.log(data);
		});

	},
	
	remove: function() {
		this.el.removeChild(this.getSphere());
	}
});