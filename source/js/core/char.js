var requestAnimationFrame = require("../util/request-animation-frame"),
	Drawable = require("./drawable");

function Char(context) {
	var that = this;

	this.widthKnownArea = 0;
	this.spriteDirection = 1;
	this.spriteTile = 0;
	this.width = 200;
	this.height = 172;
	this.x = 0;
	this.y = 0;
	this.isSpriteLocked = false;
	this.accumulator = 0;

	this.context = context;
	this.setImage("http://192.168.25.176:7000/img/char.png", this.width);
}

Char.prototype = new Drawable();

Char.prototype.beforeRender = function () {
	this.accumulator += 1;
	if(this.accumulator < 10) return;
	this.isSpriteLocked = false;
	this.accumulator = 0;
};

Char.prototype.changeSpriteTile = function () {
	this.imageX = this.spriteTile * this.width;
};

Char.prototype.stop = function () {
	this.spriteTile = 0;
	this.spriteDirection = 1;
	this.changeSpriteTile();
};

Char.prototype.walk = function () {
	if(this.isSpriteLocked) return;
	this.isSpriteLocked = true;

	this.spriteTile += this.spriteDirection;

	if(this.spriteTile === 3) {
		this.spriteDirection = -1;
	} else if(this.spriteTile === 1) {
		this.spriteDirection = 1;
	}

	this.changeSpriteTile();
};

Char.prototype.setWidthKnownArea = function (width) {
	this.widthKnownArea = width;
};

Char.prototype.goTo = function (side) {
	if(side === "left") {
		this.x = 0;
	} else {
		this.x = this.widthKnownArea - this.width;
	}
};

module.exports = Char;
