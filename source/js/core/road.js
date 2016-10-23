var requestAnimationFrame = require("../util/request-animation-frame"),
	Drawable = require("./drawable"),
	Bed = require("./bed"),
	Char = require("./char");

function Road(context, isTiling) {
	var that = this;

	this.char = null;
	this.objectList = [];
	this.x = 0;
	this.y = 0;
	this.rollStep = 109; // bed height
	this.remainingRoll = 0;
	window.objectList = this.objectList;
	this.context = context;
	this.isTiling = isTiling;
	this.setImage("http://192.168.25.176:7000/img/bricks-2.jpg");
}

Road.prototype = new Drawable();

Road.prototype.isReadToAddObject = function () {
	return this.objectList.length <= Math.ceil(this.height / this.rollStep) / 3 + 3;
};

Road.prototype.updateObjectList = function (step) {
	var that = this;
	this.objectList.slice(0).forEach(function (object, i) {
		object.y += step;

		if(object.y >= object.height * -1 && object.y <= that.height) {
			object.play();
		} else if(object.y > that.height) {
			object.pause();
			that.objectList.splice(i, 1);
		}
	});
};

Road.prototype.beforeRender = function () {
	if(this.isPaused) {
		return;
	}
};

Road.prototype.afterRender = function () {
	if(this.isPaused) {
		return;
	}
	var step = 3,
		side;

	if(this.char) {
		this.char.walk();
	}

	this.updateObjectList(step);
	this.setImageY(this.imageY + step);

	if(this.isReadToAddObject()) {
		side = Math.random() < 0.5 ? "left" : "right";
		this.addObject(new Bed(this.context, side), side);
	}
};

Road.prototype.addObject = function (object, side) {
	if(!(object instanceof Drawable)) throw new Error("object must be a Drawable object");

	if(side === "right") {
		object.x = this.width - object.width - this.imageX;
	} else {
		object.x = this.imageX;
	}

	object.y = (this.objectList.length + 1) * this.rollStep * -3 + this.height - this.rollStep;

	this.objectList.push(object);
};

Road.prototype.setWidth = function (width) {
	var that = this;
	this.width = width;

	if(this.imageWidth === 0) return;
	this.imageX = (this.width - this.imageWidth) / 2;
};

Road.prototype.setHeight = function (height) {
	var that = this;
	this.height = height;
};

Road.prototype.addChar = function (char) {
	if(!(char instanceof Drawable)) throw new Error("char must be a Drawable object");
	this.char = char;
	this.char.y = this.height - this.char.height;
	this.char.setWidthKnownArea(this.width);
	this.char.play();
};

Road.prototype.roll = function () {
	if(Math.floor(this.remainingRoll / this.rollStep) < 2) {
		this.remainingRoll += this.rollStep;
	}
};

module.exports = Road;
