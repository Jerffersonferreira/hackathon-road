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
	this.rollStep = 170;
	this.incrementStep = 24;
	this.remainingRoll = 0;
	this.nextRoll = null;
	this.context = context;
	this.isTiling = isTiling;
	this.countLeftGenObj = 0;
	this.countRightGenObj = 0;
	this.borderOffset = 100;
	this.setImage(imageRepository.getImage("road"));
}

Road.prototype = new Drawable();

Road.prototype.reset = function () {
	var that = this,
		object;

	this.started = false;
	this.remainingRoll = 0;
	this.countLeftGenObj = 0;
	this.countRightGenObj = 0;
	this.setImageY(0);

	this.pauseRolling();

	this.objectList = [];

	while(that.isReadyToAddObject()) {
		object = that.getRandomObject();
		object.pause();
		that.addObject(object);
		object.render();
	}

};

Road.prototype.pauseRolling = function () {
	if(this.char) {
		this.char.pause();
		this.char.stopWalking();
	}

	this.objectList.forEach(function (object) {
		object.pause();
	});

	this.pause();
	this.render();

	this.objectList.forEach(function (object) {
		object.render();
	});

	if(this.char) {
		this.char.render();
	}
};

Road.prototype.isReadyToAddObject = function () {
	return this.objectList.length <= Math.ceil(this.height / this.rollStep) / 3 + 3;
};

Road.prototype.updateObjectList = function (step) {
	var that = this;
	this.objectList.slice(0).forEach(function (object, i) {
		object.y += step;

		if(that.started) {
			if(object.y >= object.height * -2 && object.y <= that.height) {
				object.play();
			} else if(object.y > that.height) {
				object.pause();
				that.objectList.splice(i, 1);
			}
		}
	});
};

Road.prototype.beforeRender = function () {
	if(this.isPaused) {
		return;
	}
};

Road.prototype.getRandomObject = function () {
	var object;

	object = new Bed(this.context);

	object.setWidthKnownArea(this.width);
	object.setBorderOffset(this.imageX + this.borderOffset * 1.2);

	return object;
};

Road.prototype.getObjectPosition = function() {
	var objPosition;

	if(Math.random() < 0.5) {
		objPosition = "left";
	} else {
		objPosition = "right";
	}

	if(objPosition === "left") {
		this.countLeftGenObj += 1;
		this.countRightGenObj = 0;
	} else {
		this.countLeftGenObj = 0;
		this.countRightGenObj += 1;
	}

	if(this.countLeftGenObj === 2) {
		objPosition = "right";
		this.countRightGenObj = 0;
		this.countLeftGenObj = 0;
	}

	if(this.countRightGenObj === 2) {
		objPosition = "left";
		this.countRightGenObj = 0;
		this.countLeftGenObj = 0;
	}

	return objPosition;
};

Road.prototype.onPause = function () {
	this.pauseRolling();
};

Road.prototype.afterRender = function () {
	if(this.isPaused) {
		return;
	}

	var step,
		object;

	if(this.remainingRoll <= 0) {
		this.remainingRoll = 0;
		step = 0;

		if(this.nextRoll) {
			this.nextRoll();
		}
	} else {
		if(this.remainingRoll) {
		}

		if(this.remainingRoll - this.incrementStep < 0) {
			step = this.remainingRoll;
			this.remainingRoll = 0;
		} else {
			step = this.incrementStep;
			this.remainingRoll -= step;
		}
	}

	if(this.started && this.char) {
		if(step === 0) {
			this.char.stopWalking();
		} else {
			this.char.play();
			this.char.walk();
		}
	}

	if(this.isReadyToAddObject()) {
		object = this.getRandomObject();
		this.addObject(object);
	}

	this.setImageY(this.imageY += step);
	this.updateObjectList(step);
};

Road.prototype.getMultiplier = function(actualPosition) {
	var multipier = Math.round(Math.random()) + 1;

	if(multipier === 1 && this.objectList.length && this.objectList[this.objectList.length - 1].position !== actualPosition)  {
		return 2;
	}

	return multipier;
};

Road.prototype.addObject = function (object, objPos) {
	if(!(object instanceof Drawable)) throw new Error("object must be a Drawable object");

	var multiplier,
	 	objPosition;

	objPosition = objPos || this.getObjectPosition();
	multiplier = this.getMultiplier(objPosition);

	object.setPosition(objPosition);

	if(this.objectList.length) {
		object.y = this.objectList[this.objectList.length-1].y - this.rollStep * multiplier;
	} else {
		object.y = this.rollStep * (this.objectList.length + 1); // queue
		object.y *= -2; // direction
		object.y += this.height - this.rollStep; // considering screen height
		object.y += this.rollStep; // first tile after char
	}

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
	this.char.setBorderOffset(this.imageX + this.borderOffset);

	if(this.started) {
		this.char.play();
	} else {
		this.char.render();
	}
};

Road.prototype.roll = function (charPos) {
	if(this.remainingRoll) {
	}

	this.nextRoll = function () {
		this.remainingRoll += this.rollStep;
		if(this.char) {
			this.char.goTo(charPos);
		}
		this.nextRoll = null;
	};
};

module.exports = Road;
