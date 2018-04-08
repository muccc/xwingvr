/****           commandable action component             ****/
AFRAME.registerComponent('commandableactionship', {
	dependencies : ['ship'],
	
	
	init: function () {
		//console.log("enabled action: "+ this.el.id);

		this.active = false;
		this.deactivate = function () {
		  	this.active=false;
		  	this.el.removeAttribute('commandableactionshipactive');
		  	this.makeAllOtherShipsTargetable(false);
		  	
		}
		this.activate = function() {
		  	this.active=true;
		  	this.el.setAttribute('commandableactionshipactive','');
		  	this.makeAllOtherShipsTargetable(true);
		}
		this.switchActive = function() {
			if(this.active) {
		  		this.deactivate();
		  	} else {
				this.activate();
		  	}
		}

		this.makeAllOtherShipsTargetable = function(enable) {
			var els = document.querySelectorAll('.targetable');
			for (var i = 0; i < els.length; i++) {
				if (enable) {
					if (els[i].id != this.el.id) {
						els[i].setAttribute("targetable", "origin:"+this.el.id);
					}
				} else {
					els[i].removeAttribute("targetable");
				}
				els[i].emit('updatespherestatus');		
			}
		
		}

		var self = this;
		this.fnordSwitchActive = function()  {
			self.switchActive();
		}
		this.fnordSetTarget = function(myTargetID) {
			document.querySelector('a-scene').emit("targetSelection", {shooterID:self.el.id, targetID:myTargetID.detail});
			console.log(self.el.id + " shoots at "+ myTargetID.detail);
			self.deactivate();
		}
		
		this.el.addEventListener('mousedown', this.fnordSwitchActive);
		this.el.addEventListener('setTarget', this.fnordSetTarget); 
		this.el.emit('updatespherestatus');
	},
	remove: function() {
		this.el.removeEventListener('mousedown', this.fnordSwitchActive);
		this.makeAllOtherShipsTargetable(false);
		this.el.removeEventListener('setTarget', this.fnordSetTarget);
		console.log("disabled action: "+ this.el.id);

	}
});


AFRAME.registerComponent('targetable', {
	dependencies : ['ship'],
	
	schema: {
    	origin: {type: 'string', default: '#none'},
  	},

	init: function() {
		//console.log(this.el.id+" is now targetable");
		
		var self = this;
		this.setMyselfAsTarget = function() {
			var originEl = document.querySelector("#"+self.data.origin);
			originEl.emit("setTarget", self.el.id);
		}
		
		this.el.addEventListener('mousedown', this.setMyselfAsTarget);
	},
	
	remove: function() {
		this.el.removeEventListener('mousedown', this.setMyselfAsTarget);
	}
});
