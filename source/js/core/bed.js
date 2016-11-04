var requestAnimationFrame = require("../util/request-animation-frame"),
	imageRepository = require("../util/image-repository")(),
	Drawable = require("./drawable");

function Bed(context) {
	var that = this;

	this.position = null;
	this.widthKnownArea = 0;
	this.borderOffset = 0;
	this.spriteDirection = 1;
	this.spriteTile = 0;
	this.width = 161;
	this.height = 170;
	this.x = 0;
	this.y = 0;
	this.accumulator = 0;
	this.context = context;
	this.wasBumped = false;
}

Bed.prototype = new Drawable();

Bed.prototype.setPosition = function (position) {
	this.position = position;
	if(position === "left") {
		this.x = this.borderOffset;
	} else {
		this.x = this.widthKnownArea - this.width - this.borderOffset;
	}

	this.setImage(imageRepository.getImage("bed-" + position), this.width);
};

Bed.prototype.beforeRender = function () {
	if(!this.wasBumped) {
		return;
	}
	this.accumulator += 1;
	if(this.accumulator < 25) return;
	this.accumulator = 0;

	this.spriteTile += this.spriteDirection;

	if(this.spriteTile === 3) {
		this.spriteDirection = -1;
	} else if(this.spriteTile === 1) {
		this.spriteDirection = 1;
	}

	this.changeSpriteTile();
};

Bed.prototype.changeSpriteTile = function () {
	this.imageX = this.spriteTile * this.width;
};

Bed.prototype.setBump = function (value) {
	if(value === true){
		if(this.wasBumped) return;
		this.accumulator = 26;
		this.spriteTile = 1;
	} else {
		this.accumulator = 0;
		this.spriteTile = 0;
		this.changeSpriteTile();
	}

	this.wasBumped = value;
};

Bed.prototype.setWidthKnownArea = function (width) {
	this.widthKnownArea = width;
};

Bed.prototype.setBorderOffset = function (offset) {
	this.borderOffset = offset;
	this.x = offset;
};

module.exports = Bed;
