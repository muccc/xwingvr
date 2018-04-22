/****           statussphere component             ****/
AFRAME.registerComponent('statussphere', {


  init: function () {
    this.hoverOnValue=0.2;
    this.hoverOffValue=0.01;


    this.getSphere = function() {
      if (this._sphere == undefined) {
        this._sphere = document.createElement('a-entity');
        this._sphere.setAttribute("geometry","primitive: sphere; radius: 0.1;");
        this._sphere.setAttribute('material', 'opacity:0.01, color:#000');
      }
      return this._sphere;
    };

    this.hoverOn = function() {
      this.getSphere().setAttribute('material', 'opacity',this.hoverOnValue);
    }

    this.hoverOff = function() {
      this.getSphere().setAttribute('material', 'opacity',this.hoverOffValue);
    }

    this.updateSphereStatus = function() {
      if (this.el.getAttribute('targetable')!=null) {
        this.getSphere().setAttribute("material","color:#F00; opacity:0.2");
        this.hoverOffValue = 0.2;
        this.hoverOnValue = 0.4;
      } else if (this.el.getAttribute('commandableship')!=null) {
        this.getSphere().setAttribute("material","color:#0F0");
        this.hoverOffValue = 0.01;
        this.hoverOnValue = 0.2;
      } else if (this.el.getAttribute('commandableactionshipactive')!=null) {
        this.getSphere().setAttribute("material","color:#FFF");
        this.hoverOffValue = 0.2;
        this.hoverOnValue = 0.2;
      } else if (this.el.getAttribute('commandableactionship')!=null) {
        this.getSphere().setAttribute("material","color:#FF0");
        this.hoverOffValue = 0.01;
        this.hoverOnValue = 0.2;
      } else {
        this.getSphere().setAttribute("material","color:#000");
        this.hoverOffValue = 0.01;
        this.hoverOnValue = 0.01;
      }
      //console.log('updated sphere of '+ this.el.id);
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
    });

  },

  remove: function() {
    this.el.removeChild(this.getSphere());
  }
});
