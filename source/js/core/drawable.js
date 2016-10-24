var requestAnimationFrame = require("../util/request-animation-frame");

function Drawable() {
	this.started = false;
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;
	this.imageX = 0;
	this.imageY = 0;
	this.imageWidth = 0;
	this.imageHeight = 0;
	this.isTiling = false;
	this.image = null;
	this.isPaused = true;
	this.super = this;
}

Drawable.prototype = {
	play: function () {
		if(!this.isPaused) return;

		this.isPaused = false;
		this.started = true;

		this.requestAnimationFrame();
	},
	pause: function () {
		if(this.isPaused) return;

		this.isPaused = true;
		this.onPause();
	},
	onPause: function () {

	},
	setWidth: function (width) {
		var that = this;
		this.width = width;
	},
	setHeight: function (height) {
		var that = this;
		this.height = height;
	},
	beforeRender: function () {},
	afterRender: function () {},
	requestAnimationFrame: function () {
		if(this.isPaused) return;

		var that = this;

		this.beforeRender();

		if(this.isTiling) {
			this.renderTiling();
		} else {
			this.renderImage();
		}

		requestAnimationFrame(function () {
			that.requestAnimationFrame();
		});

		this.afterRender();
	},
	render: function () {
		var that = this;

		this.beforeRender();

		if(this.isTiling) {
			this.renderTiling();
		} else {
			this.renderImage();
		}

		this.afterRender();
	},
	setImageX: function (x) {
		if(x >= 0 && x < this.imageWidth) {
			this.imageX = x;
		} else {
			this.imageX = 1;
		}
	},
	setImageY: function (y) {
		if(y >= 0 && y < this.imageHeight) {
			this.imageY = y;
		} else {
			this.imageY = 1;
		}
	},
	isReadyToDraw: function () {
		return this.image && this.image.width;
	},
	renderImage: function () {
		if(this.isReadyToDraw()) {
			this.context.drawImage(this.image, this.imageX, this.imageY, this.imageWidth, this.imageHeight, this.x, this.y, this.imageWidth, this.imageHeight);

		}
	},
	renderTiling: function () {
		if(this.isReadyToDraw()) {
			var that = this,
				iX, // iterator X
				iY, // iterator Y
				siX, // source image X
				siY, // source image Y
				siWidth, // source image width
				siHeight, // source image height
				dX, // destination x
				dY, // destination y
				dWidth, // destination width
				dHeight, // destination height
				countX, // max num x tiles
				countY, // max num y tiles
				offsetTop,
				offsetLeft;

			if(this.imageWidth === 0 || this.imageHeight === 0 || this.imageWidth > this.width || this.imageHeight > this.height) {
				return;
			}

			countX = Math.ceil(this.width / this.imageWidth) + 1;
			countY = Math.ceil(this.height / this.imageHeight) + 1;

			if(this.width % this.imageWidth === 0) {
				countX += 1;
			}

			if(this.height % this.imageHeight === 0) {
				countY += 1;
			}

			iX = 0;
			while(iX < countX) {
				if(iX === 0) {
					siX = this.imageWidth - this.imageX;
					dX = this.x;
					dWidth = this.imageX;
				} else {
					siX = 0;
					dX = this.x + this.imageX;

					offsetLeft = this.imageWidth * (iX - 1);

					dX += offsetLeft;

					offsetLeft += this.imageWidth + this.imageX; // now offsetLeft mean offsetLeft + imageWidth + imageX

					if(offsetLeft > this.width) {
						dWidth = this.imageWidth - (offsetLeft - this.width) + 1;
					} else {
						dWidth = this.imageWidth;
					}
				}

				siWidth = dWidth;

				iY = 0;
				while(iY < countY) {
					if(iY === 0) {
						siY = this.imageHeight - this.imageY;
						dY = this.y;
						dHeight = this.imageY;
					} else {
						siY = 0;
						dY = this.y + this.imageY;

						offsetTop = this.imageHeight * (iY - 1);

						dY += offsetTop;

						offsetTop += this.imageHeight + this.imageY; // now offsetTop mean offsetTop + imageHeight + imageY

						if(offsetTop > this.height) {
							dHeight = this.imageHeight - (offsetTop - this.height) + 1;
						} else {
							dHeight = this.imageHeight;
						}
					}

					siHeight = dHeight;

					this.context.drawImage(this.image, siX, siY, siWidth, siHeight, dX, dY, dWidth, dHeight);
					iY += 1;
				}
				iX += 1;
			}

			that.isAbleToRender = true;
		}
	},
	setImage: function (image, width, height) {
		var that = this;

		this.image = image;
		that.imageWidth = width || that.image.width;
		that.imageHeight = height || that.image.height;

		that.setWidth(width || that.width);
		that.setHeight(height || that.height);
	}
};

module.exports = Drawable;
