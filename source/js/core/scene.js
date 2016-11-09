var requestAnimationFrame = require("../util/request-animation-frame"),
	imageRepository = require("../util/image-repository")(),
	Drawable = require("./drawable"),
	Bed = require("./bed"),
	Char = require("./char");

function Scene(context, isTiling) {
	var that = this;

	this.debug = true;
	this.char = null;
	this.objectList = [];
	this.x = 0;
	this.y = 0;
	this.scrollDownStep = 340;
	this.incrementStep = 48;
	this.remainingScrollDown = 0;
	this.nextScrollDown = null;
	this.context = context;
	this.isTiling = isTiling;
	this.countLeftGenObj = 0;
	this.countRightGenObj = 0;
	this.borderOffset = 200;
	this.bumpedObject = null;
	this.setImage(imageRepository.getImage("road"));
}

Scene.prototype = new Drawable();

Scene.prototype.reset = function () {
	var that = this,
		object;

	this.started = false;
	this.remainingScrollDown = 0;
	this.nextScrollDown = null;
	this.countLeftGenObj = 0;
	this.countRightGenObj = 0;
	this.bumpedObject = null;
	this.setImageY(0);

	this.pauseAndRenderAll();

	this.objectList = [];

	this.render();

	while(that.isReadyToAddObject()) {
		object = that.getRandomObject();
		object.pause();
		that.addObject(object);
		object.render();
	}

	if(this.char) {
		this.char.render();
	}

};

Scene.prototype.onPlay = function () {
	if(this.char) {
		this.char.play();
	}
};

Scene.prototype.pauseAndRenderAll = function () {
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

Scene.prototype.isReadyToAddObject = function () {
	return this.objectList.length <= Math.ceil(this.height / this.scrollDownStep) / 3 + 3;
};

Scene.prototype.updateObjectList = function (step) {
	var that = this;
	this.objectList.slice(0).forEach(function (object, i) {
		object.y += step;

		if(that.started) {
			if(object.y >= object.height * -2 && object.y < that.height) {
				object.play();
			} else if(object.y >= that.height) {
				object.pause();
				that.objectList.splice(i, 1);
			}
		}
	});
};

Scene.prototype.getRandomObject = function () {
	var object;

	object = new Bed(this.context);

	object.setWidthKnownArea(this.width);
	object.setBorderOffset(this.imageX + this.borderOffset * 1.2);
	return object;
};

Scene.prototype.genObjectPosition = function() {
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

Scene.prototype.onPause = function () {
	this.pauseAndRenderAll();
};

Scene.prototype.afterRender = function () {
	if(this.isPaused) {
		return;
	}

	var step,
		object;

	if(this.remainingScrollDown <= 0) {
		this.remainingScrollDown = 0;
		step = 0;

		if(this.nextScrollDown && !this.bumpedObject) {
			this.nextScrollDown();
		}

	} else {
		if(this.remainingScrollDown) {
		}

		if(this.remainingScrollDown - this.incrementStep < 0) {
			step = this.remainingScrollDown;
			this.remainingScrollDown = 0;
		} else {
			step = this.incrementStep;
			this.remainingScrollDown -= step;
		}
	}

	if(this.started && this.char) {
		if(step === 0) {
			this.char.stopWalking();
			if(this.bumpedObject && !this.bumpedObject.wasBumped) {
				var that = this;
				this.bumpedObject.setBump(true);
				this.char.isHide = true;
				this.nextScrollDown = null;

				setTimeout(function(){
					that.bumpedObject.setBump(false);
					that.char.isHide = false;
					that.char.goTo(that.char.position === "right" ? "left":"right");
					that.bumpedObject = null;
				}, 3000);
				return;
			}
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
	this.setBumpedObject(true);
};

Scene.prototype.setBumpedObject = function (isAdvancing) {
	var object,
		objectReachedChar,
		areBothInSameSide;

	if(this.char && this.objectList.length) {
		object = this.objectList[0];
		objectReachedChar = object.y + object.height/2 > this.char.y;
		areBothInSameSide = this.char.position === object.position;

		if(!isAdvancing && areBothInSameSide && objectReachedChar) {
			this.bumpedObject = object;
			return;
		}else if(isAdvancing && areBothInSameSide && objectReachedChar) {
			this.bumpedObject = object;
		}
	}
};

Scene.prototype.getMultiplier = function(actualPosition) {
	var multipier = Math.round(Math.random()) + 1;

	if(multipier === 1 && this.objectList.length && this.objectList[this.objectList.length - 1].position !== actualPosition)  {
		return 2;
	}

	return multipier;
};

Scene.prototype.addObject = function (object, objPos) {
	if(!(object instanceof Drawable)) throw new Error("object must be a Drawable object");

	var multiplier,
	 	objPosition;

	objPosition = objPos || this.genObjectPosition();
	multiplier = this.getMultiplier(objPosition);

	object.setPosition(objPosition);

	if(this.objectList.length) {
		object.y = this.objectList[this.objectList.length-1].y - this.scrollDownStep * multiplier;
	} else {
		object.y = this.scrollDownStep * (this.objectList.length + 1); // queue
		object.y *= -2; // direction
		object.y += this.height - this.scrollDownStep; // considering screen height
		object.y += this.scrollDownStep; // first tile after char
	}

	this.objectList.push(object);
};

Scene.prototype.setWidth = function (width) {
	var that = this;
	this.width = width;

	if(this.imageWidth === 0) return;
	this.imageX = (this.width - this.imageWidth) / 2;
};

Scene.prototype.setHeight = function (height) {
	var that = this;
	this.height = height;
};

Scene.prototype.addChar = function (char) {
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

Scene.prototype.scrollDown = function (charPosition) {
	if(this.bumpedObject) return;

	this.nextScrollDown = function () {
		if(this.char) {
			this.char.goTo(charPosition);
		}

		this.setBumpedObject(false);
		if(this.bumpedObject) {
			return;
		}
		this.remainingScrollDown += this.scrollDownStep;
		this.onScrollDown();
		this.nextScrollDown = null;
	};
};

Scene.prototype.onScrollDown = function(){};

module.exports = Scene;
