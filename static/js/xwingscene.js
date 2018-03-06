AFRAME.registerComponent('xwingscene', {
	init: function () {
		this.socket = io();
		this.socket.on('connect', () => {
			this.socket.on('ship',(data) => {
		    	var ship = document.createElement('a-entity');
		    	ship.setAttribute("id",data.id);
		    	ship.setAttribute("ship", "type:"+data.type+";");
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
		
		if(location.hash == "#rebel") { //todo: user interface!
			this.socket.emit('joinSide','rebel');
		} else {
			this.socket.emit('joinSide','empire');
		}
		
		this.emitMovementSelection=function(data) {
			this.socket.emit('movementSelection', data.to, data.id);
		}
		
		var self = this;
		this.el.addEventListener('movementSelection', function(data) {
			self.emitMovementSelection(data.detail);
		});
	}
});	