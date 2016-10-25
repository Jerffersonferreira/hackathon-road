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
	this.height = 109;
	this.x = 0;
	this.y = 0;
	this.isSpriteLocked = false;
	this.accumulator = 0;
	this.context = context;
	this.paused = true;
}

Bed.prototype = new Drawable();

Bed.prototype.setPosition = function (position) {
	this.position = position;
	if(position === "left") {
		this.x = this.borderOffset;
	} else {
		this.x = this.widthKnownArea - this.width - this.borderOffset;
	}

	this.setImage(imageRepository.getImage("bed-" + position));
};

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

Bed.prototype.setBorderOffset = function (offset) {
	this.borderOffset = offset;
	this.x = offset;
};

module.exports = Bed;
