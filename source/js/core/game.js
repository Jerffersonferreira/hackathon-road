var instance,
	requestAnimationFrame = require("../util/request-animation-frame"),
	Drawable = require("../core/drawable"),
	Road = require("../core/road");

function Game() {
	this.started = false;
	this.initialized = false;
	this.width = Zepto(window).width();
	this.height = Zepto(window).height();
}

var teste;

Game.prototype = {
	init: function (wrapperElement) {
		if(this.initialized) return;
		this.initialized = true;

		this.createCanvasElem(wrapperElement);
		this.addRoad();
		this.addTapEvent();

	},
	addRoad: function () {
		this.road = new Road(this.context, true);
		this.road.width = this.width;
		this.road.height = this.height;
	},
	run: function (event) {
		console.log(event);
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
