var requestAnimationFrame = require("../util/request-animation-frame");

function Drawable(context) {
	this.context = context;
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;
	this.imageX = 0;
	this.imageY = 0;
	this.imageWidth = 0;
	this.imageHeight = 0;
	this.tilling = false;
	this.image = null;
	this.isAbleToRender = true;

	this.draw();
}

/*
	@TODO: método para setar image x e y. motivo: limitar estes ao no máximo a largura e altura.
	@TODO: trocar a propriedade tilling por método. motivo: resetar a largura e alura para original.
*/

Drawable.prototype = {
	draw: function () {
		var that = this;

		if(this.tilling) {
			this.drawTilling();
		} else {
			this.drawImage();
		}

		requestAnimationFrame(function () {
			that.draw();
		});
	},
	isReadyToDraw: function () {
		return this.isAbleToRender && this.image && this.image.width;
	},
	drawImage: function () {
		if(this.isReadyToDraw()) {
			this.context.drawImage(this.image, this.imageX, this.imageY, this.imageWidth, this.imageHeight, this.x, this.y, this.imageWidth, this.imageHeight);

		}
	},
	drawTilling: function () {
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

			if(this.imageWidth > this.width || this.imageHeight > this.height) {
				return;
			}

			this.isAbleToRender = false;

			this.context.clearRect(0, 0, 320, 500);

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
	setImage: function (imagePath, width, height) {
		var that = this;

		this.image = new Image();
		this.image.src = imagePath;

		this.image.onload = function () {
			that.imageWidth = width || that.image.width;
			that.imageHeight = height || that.image.height;
		};
	}
};

module.exports = Drawable;
