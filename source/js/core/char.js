var requestAnimationFrame = require("../util/request-animation-frame"),
	imageRepository = require("../util/image-repository")(),
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
	this.borderOffset = 0;

	this.context = context;
	this.setImage(imageRepository.getImage("char"), this.width);
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

Char.prototype.stopWalking = function () {
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

Char.prototype.setBorderOffset = function (offset) {
	this.borderOffset = offset;
	this.x = offset;
};

Char.prototype.goTo = function (side) {
	if(side === "left") {
		this.x = this.borderOffset;
	} else {
		this.x = this.widthKnownArea - this.width - this.borderOffset;
	}
};

module.exports = Char;
