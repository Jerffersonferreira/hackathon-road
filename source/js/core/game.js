var instance,
	requestAnimationFrame = require("../util/request-animation-frame"),
	MobileDetect = require("mobile-detect"),
	Drawable = require("../core/drawable"),
	Road = require("../core/road"),
	Char = require("../core/char");

function Game() {
	var mobileDetect = new MobileDetect(window.navigator.userAgent);

	this.started = false;
	this.initialized = false;
	this.isMobile = mobileDetect.mobile() !== null;
}

Game.prototype = {
	init: function (wrapperElement) {
		if(this.initialized) return;
		this.initialized = true;

		this.width = wrapperElement.width();
		this.height = wrapperElement.height();

		this.createCanvasElem(wrapperElement);

		this.addRoad();
		this.addChar();
		this.addControls();

	},
	addChar: function () {
		this.char = new Char(this.context);
		this.road.addChar(this.char);
	},
	addRoad: function () {
		this.road = new Road(this.context, true);
		this.road.setWidth(this.width);
		this.road.setHeight(this.height);
		this.road.reset();
		this.road.play();
	},
	tapEvent: function (event) {
		var charPos;

		charPos = event.x / window.innerWidth <= 0.5 ? "left" : "right";

		this.road.roll(charPos);
	},
	keyDownEvent: function (event) {
		var charPos;
		if(event.repeat) {
			return;
		}

		if(event.which === 37) {
			charPos = "left";
		} else if(event.which === 39) {
			charPos = "right";
		}

		if(!charPos) {
			return;
		}

		this.road.roll(charPos);
	},
	addControls: function () {
		var that = this,
			event;

		if(this.isMobile) {
			Zepto(window).on("click", function (event) {
				that.tapEvent(event);
			});
		} else {
			Zepto("body").on("keydown", function (event) {
				that.keyDownEvent(event);
			});
		}
	},
	createCanvasElem: function (wrapperElement) {
		wrapperElement.append(Zepto("<canvas id=\"gamecanvas\" width=\"" + this.width + "px\" height=\"" + this.height + "px\"></canvas>"));
		this.canvasElement = document.getElementById("gamecanvas");

		this.createContext();
	},
	createContext: function () {
		this.context = this.canvasElement.getContext('2d');
	},
	start: function () {
		if(this.started) return;
		this.started = true;

		this.increment();
	},
	increment: function () {
		var that = this;

		requestAnimationFrame(function () {
			that.increment();
		});
	}

};

module.exports = function () {
	if(!instance) instance = new Game();
	return instance;
};
