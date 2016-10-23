var requestAnimationFrame = require("./util/request-animation-frame"),
	Drawable = require("./drawable");

function Road(context) {
	this.objectList = [];
	this.x = 0;
	this.y = 0;
	this.width = 320;
	this.height = 658;

	this.context = context;
	this.draw();
}

Road.prototype = {
	addObject: function (object) {
		if(!(object instanceof Drawable)) throw new Error("Object must be a Drawable object");
		this.objectList.push(object);
	},
	draw: function () {

	}

};

module.exports = Road;
