var instance,
	requestAnimationFrame = require("../util/request-animation-frame"),
	Drawable = require("../core/drawable");

function Game() {
	this.started = false;
	this.initialized = false;
	this.width = Zepto(window).width();
	this.height = Zepto(window).height();
}

var teste,
	multiplier = 1;

window.th = function (v) {
	teste.height = v;
	Zepto("div").css("height", v + "px");
};
window.tw = function (v) {
	teste.width = v;
	Zepto("div").css("width", v + "px");
};

Game.prototype = {
	init: function (wrapperElement) {
		if(this.initialized) return;
		this.initialized = true;

		this.createCanvasElem(wrapperElement);
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

		teste = new Drawable(this.context);
		teste.tilling = true;
		teste.setImage("http://192.168.25.176:7000/img/bricks-2.jpg");
		teste.width = this.width;
		teste.height = this.height;
		teste.x = 0;
		teste.y = 0;

		th(teste.height);
		tw(teste.width);

		window.teste = teste;

		this.increment();
	},
	increment: function () {
		var that = this;

		if(teste.imageY >= teste.imageHeight) {
			teste.imageY = 1;
		} else {
			teste.imageY += 4;
		}

		/*
		if(teste.imageX > teste.imageWidth) {
			teste.imageX = 0;
		} else {
			teste.imageX += 3;
		}
		*/

		/*
		if(teste.height >= this.height) {
			multiplier = -1;
		} else if(teste.height <= 50) {
			multiplier = 1;
		}

		th(teste.height += multiplier);
		tw(teste.width += multiplier);
		*/

		//console.log("Incrementing...");
		requestAnimationFrame(function () {
			that.increment();
		});
	}

};

module.exports = function () {
	if(!instance) instance = new Game();
	return instance;
};
