/****           commandable action component             ****/
AFRAME.registerComponent('commandableactionship', {
	dependencies : ['ship'],
	
	
	init: function () {
		console.log("enabled action: "+ this.el.id);

		this.active = false;
		this.deactivate = function () {
			//this.el.emit('setShipInactive');
		  	this.active=false;
		  	this.makeAllOtherShipsTargetable(false);
		}
		this.activate = function() {
		  	//this.el.emit('setShipActive'); TODO: Bubble colors....
		  	this.active=true;
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
					els[i].setAttribute("targetable", "origin:"+this.el.id);
				} else {
					els[i].removeAttribute("targetable");
				}
			}
		}

		this.el.setAttribute('statussphere','');
		
		var self = this;
		this.fnordSwitchActive = function()  {
			self.switchActive();
		}
		this.fnordSetTarget = function(targetId) {
			console.log(self.el.id + " shoots at "+ targetId.detail);
			console.log(targetId.detail);
		}
		
		this.el.addEventListener('mousedown', this.fnordSwitchActive);
		this.el.addEventListener('setTarget', this.fnordSetTarget); 
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
		//console.log("origin: "+this.data.origin);
		
		
		var self = this;
		this.setMyselfAsTarget = function() {
			var originEl = document.querySelector("#"+self.data.origin);
			//originEl.emit("setTarget", self.el.id); //TODO: ???
			console.log(self.el.id);
		}
		
		this.el.addEventListener('mousedown', this.setMyselfAsTarget);
	},
	
	remove: function() {
		this.el.removeEventListener('mousedown', this.setMyselfAsTarget);
	}


	
});
