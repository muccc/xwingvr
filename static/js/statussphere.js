/****           statussphere component             ****/
AFRAME.registerComponent('statussphere', {
	
	
	init: function () {
		this.getSphere = function() {
			if (this._sphere == undefined) {
				this._sphere = document.createElement('a-entity');
				this._sphere.setAttribute("geometry","primitive: sphere; radius: 0.1;");
				this._sphere.setAttribute("material",XWING.commandSphereInactiveMaterial);
			} 
			return this._sphere;
		};
		
		this.hoverOn = function() {
			this.getSphere().setAttribute('material', 'opacity',XWING.hoverShipSphereOpacity);
		}
		
		this.hoverOff = function() {
			this.getSphere().setAttribute('material', 'opacity',XWING.unhoverShipSphereOpacity);	
		}
		
		this.activeOn = function() {
			this.getSphere().setAttribute('material', 'color', XWING.activeShipSphereColor);
		}
		
		this.activeOff = function() {
			this.getSphere().setAttribute('material', 'color', XWING.inactiveShipSphereColor);
		}
		
		this.updateSphereStatus = function() {
			//TODO
			/*
			if parentNode.getClass().contains("targetable") {color=red}
			else if parentNode.
			
			*/	
		}
		

		this.el.append(this.getSphere());

		var self = this;

		this.getSphere().addEventListener('mouseenter', function () {
			self.hoverOn();
		});
		
		this.getSphere().addEventListener('mouseleave', function () {
			self.hoverOff();
		});
		
		this.getSphere().addEventListener('setShipActive', function() {
			self.activeOn();
		});
		
		this.getSphere().addEventListener('setShipInactive', function() {
			self.activeOff();
		});
		
		this.getSphere().addEventListener('updateSphereStatus', function() {
			self.updateSphereStatus();	
		});
			
		

	},
	
	remove: function() {
		this.el.removeChild(this.getSphere());
	}
});