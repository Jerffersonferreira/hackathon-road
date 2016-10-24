var requestAnimationFrame = require("../util/request-animation-frame"),
	imageRepository = require("../util/image-repository")(),
	Drawable = require("./drawable"),
	Bed = require("./bed"),
	Char = require("./char");

function Road(context, isTiling) {
	var that = this;

	this.char = null;
	this.objectList = [];
	this.x = 0;
	this.y = 0;
	this.rollStep = 80; // bed height
	this.remainingRoll = 0;
	this.context = context;
	this.isTiling = isTiling;
	this.countLeftGenObj = 0;
	this.countRightGenObj = 0;
	this.setImage(imageRepository.getImage("road"));
}

Road.prototype = new Drawable();

Road.prototype.reset = function () {
	var that = this,
		object;

	this.started = false;
	this.rollStep = 80;
	this.remainingRoll = 0;
	this.countLeftGenObj = 0;
	this.countRightGenObj = 0;
	this.setImageY(0);

	if(that.char) {
		that.char.pause();
		that.char.stopWalking();
	}

	that.objectList.forEach(function (object) {
		object.pause();
	});
	this.objectList = [];

	this.pause();
	this.render();

	if(that.char) {
		that.char.render();
	}

	while(that.isReadToAddObject()) {
		object = that.getRandomObject();
		object.pause();
		that.addObject(object, object.side);
		object.render();
	}

};

Road.prototype.isReadToAddObject = function () {
	return this.objectList.length <= Math.ceil(this.height / this.rollStep) / 3 + 3;
};

Road.prototype.updateObjectList = function (step) {
	var that = this;
	this.objectList.slice(0).forEach(function (object, i) {
		object.y += step;

		if(that.started) {
			if(object.y >= object.height * -1 && object.y <= that.height) {
				object.play();
			} else if(object.y > that.height) {
				object.pause();
				that.objectList.splice(i, 1);
			}
		} else {
			object.imageLoadCallback = function () {
				object.render();
				object.imageLoadCallback = function () {};
			};

		}
	});
};

Road.prototype.beforeRender = function () {
	if(this.isPaused) {
		return;
	}
};

Road.prototype.getRandomObject = function () {
	var side;

	if(Math.random() < 0.5) {
		side = "left";
		this.countLeftGenObj += 1;
		this.countRightGenObj = 0;
	} else {
		side = "right";
		this.countLeftGenObj = 0;
		this.countRightGenObj += 1;
	}

	if(this.countLeftGenObj === 3) {
		side = "right";
		this.countRightGenObj = 0;
		this.countLeftGenObj = 0;
	}

	if(this.countRightGenObj === 3) {
		side = "left";
		this.countRightGenObj = 0;
		this.countLeftGenObj = 0;
	}

	return new Bed(this.context, side);
};

Road.prototype.afterRender = function () {
	if(this.isPaused) {
		return;
	}
	var step = 3,
		object;

	if(this.started && this.char) {
		this.char.play();
		this.char.walk();
	}

	this.setImageY(this.imageY + step);
	this.updateObjectList(step);

	if(this.isReadToAddObject()) {
		object = this.getRandomObject();
		this.addObject(object, object.side);
	}
};

Road.prototype.addObject = function (object, side) {
	if(!(object instanceof Drawable)) throw new Error("object must be a Drawable object");

	if(side === "right") {
		object.x = this.width - object.width - this.imageX;
	} else {
		object.x = this.imageX;
	}

	object.y = (this.objectList.length + 1) * this.rollStep * -3 + this.height;

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
	var that = this;

	this.char = char;
	this.char.y = this.height - this.char.height;
	this.char.setWidthKnownArea(this.width);
	this.char.setBorderOffset(this.imageX);
	console.log(this.imageX);

	if(this.started) {
		this.char.play();
	} else {
		if(!this.char.imageWidth) {
			this.char.imageLoadCallback = function () {
				that.char.render();
				that.char.imageLoadCallback = function () {};
			};
		} else {
			this.char.render();
		}
	}
};

Road.prototype.roll = function () {
	if(Math.floor(this.remainingRoll / this.rollStep) < 2) {
		this.remainingRoll += this.rollStep;
	}
};

module.exports = Road;
