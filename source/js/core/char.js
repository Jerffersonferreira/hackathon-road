var requestAnimationFrame = require("../util/request-animation-frame"),
	Drawable = require("./drawable");

function Char(context, isTiling) {
	var that = this;

	this.spriteDirection = 1;
	this.spriteTile = 0;
	this.x = 0;
	this.y = 0;

	this.context = context;
	this.isTiling = isTiling;
	this.setImage("http://192.168.25.176:7000/img/bricks-2.jpg");

	this.render();
}

Char.prototype = new Drawable();

Char.prototype.beforeRender = function () {
	this.setImageY(this.imageY + 1);
};

Char.prototype.stop = function () {
	this.spriteTile = 0;
	this.spriteDirection = 1;
};

Char.prototype.walk = function () {
	this.spriteTile += this.spriteDirection;

	if(this.spriteTile === 3) {
		this.spriteDirection = -1;
	} else if(this.spriteTile === 1) {
		this.spriteDirection = 1;
	}
};

Char.prototype.walk = function () {

};

Char.prototype.advance = function () {

};

module.exports = Char;
r;
