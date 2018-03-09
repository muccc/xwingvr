AFRAME.registerComponent('xwingscene', {
	init: function () {
		this.socket = io();
		this.socket.on('connect', () => {
			this.socket.on('ship',(data) => {
		    	var ship = document.createElement('a-entity');
		    	ship.setAttribute("id",data.id);
				ship.setAttribute("ship", "type:"+data.type+"; hull:"+data.hull+"; shields:"+data.shields+";");
		    	ship.setAttribute("position", data.pos);
		    	ship.setAttribute("rotation", data.rot);
		    	this.el.append(ship);
			});
	
			this.socket.on('yourship', (data) => {
		    	var ship = document.querySelector('#'+data.id);
		    	ship.setAttribute("commandableship", "");
			});
	
			this.socket.on('removeShip',(data) => {
				var ship = document.getElementById(data.id);
				ship.parentElement.remove(ship);
			});
	
			this.socket.on('moveShip', (data) => {
				var ship = document.getElementById(data.id);
				ship.emit('clear');
				ship.emit('setMovementData', data);
			});
		});
		
		
		this.emitMovementSelection=function(data) {
			this.socket.emit('movementSelection', data.to, data.id);
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
		this.el.addEventListener('movementSelection', function(data) {
			self.emitMovementSelection(data.detail);
		});
		
		this.el.addEventListener('sideSelection', function(data) {
			self.removeSideSelectorsAndEmitSideSelection(data.detail);
		});
	}
});	