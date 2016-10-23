var instance,
	requestAnimationFrame = require("../util/request-animation-frame"),
	Drawable = require("../core/drawable"),
	Road = require("../core/road"),
	Char = require("../core/char");

function Game() {
	this.started = false;
	this.initialized = false;
}

var teste;

Game.prototype = {
	init: function (wrapperElement) {
		if(this.initialized) return;
		this.initialized = true;

		this.width = wrapperElement.width();
		this.height = wrapperElement.height();

		this.createCanvasElem(wrapperElement);

		this.addRoad();
		this.addChar();
		this.addTapEvent();

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
	run: function (event) {
		var side;

		this.road.roll();
		side = event.x / this.width <= 0.5 ? "left" : "right";
		this.char.goTo(side);
	},
	tapEvent: function (event) {
		this.run(event);
	},
	addTapEvent: function () {
		var that = this;
		Zepto("body").on("click", function (event) {
			that.tapEvent(event);
		});
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
