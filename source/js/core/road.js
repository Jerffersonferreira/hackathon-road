var requestAnimationFrame = require("../util/request-animation-frame"),
	Drawable = require("./drawable");

function Road(context, isTiling) {
	var that = this;

	this.objectList = [];
	this.x = 0;
	this.y = 0;

	this.context = context;
	this.isTiling = isTiling;
	this.setImage("http://192.168.25.176:7000/img/bricks-2.jpg");

	this.render();
}

Road.prototype = new Drawable();

Road.prototype.beforeRender = function () {
	this.setImageY(this.imageY + 1);
};

Road.prototype.addObject = function (object) {
	if(!(object instanceof Drawable)) throw new Error("Object must be a Drawable object");
	this.objectList.push(object);
};

Road.prototype.advance = function () {

};

module.exports = Road;
