var requestAnimationFrame = require("../util/request-animation-frame"),
	Drawable = require("./drawable");

function Bed(context, side) {
	var that = this;

	this.side = side || "left";
	this.widthKnownArea = 0;
	this.spriteDirection = 1;
	this.spriteTile = 0;
	this.width = 161;
	this.height = 109;
	this.x = 0;
	this.y = 0;
	this.isSpriteLocked = false;
	this.accumulator = 0;

	this.context = context;
	this.setImage("https://jerffersonferreira.github.io/hackathon-road/img/bed-" + this.side + ".png");
}

Bed.prototype = new Drawable();

Bed.prototype.beforeRender = function () {
	this.accumulator += 1;
	if(this.accumulator < 10) return;
	this.isSpriteLocked = false;
	this.accumulator = 0;
};

Bed.prototype.changeSpriteTile = function () {
	this.imageX = this.spriteTile * this.width;
};

Bed.prototype.setWidthKnownArea = function (width) {
	this.widthKnownArea = width;
};

module.exports = Bed;
