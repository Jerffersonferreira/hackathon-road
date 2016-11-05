var instance,
	requestAnimationFrame = require("../util/request-animation-frame"),
	MobileDetect = require("mobile-detect"),
	Drawable = require("../core/drawable"),
	Scene = require("../core/scene"),
	Char = require("../core/char");

function Game() {
	var mobileDetect = new MobileDetect(window.navigator.userAgent);

	this.started = false;
	this.initialized = false;
	this.isMobile = mobileDetect.mobile() !== null;
	this.remainingTime = null;
	this.earnPoints = null;
	this.timeStep = null;
}

Game.prototype = {
	init: function (wrapperElement) {
		if(this.initialized) return;
		this.initialized = true;

		this.width = wrapperElement.width()*2;
		this.height = wrapperElement.height()*2;

		this.createCanvasElem(wrapperElement);

		this.addScene();
		this.reset();
		this.addChar();
		this.addControls();
	},
	reset: function() {
		this.started = false;
		this.earnPoints = 0;
		this.remainingTime = 500;
		this.timeStep = 1;
		this.scene.reset();
		this.scene.play();
	},
	gameOver: function() {
		console.log("Game over!");
	},
	increaseRemainingTime: function() {
		if(this.remainingTime >= 1000) return;
		this.remainingTime += 14;
	},
	addChar: function () {
		this.char = new Char(this.context);
		this.scene.addChar(this.char);
	},
	addScene: function () {
		var that = this;
		this.scene = new Scene(this.context, true);
		this.scene.setWidth(this.width);
		this.scene.setHeight(this.height);
		this.scene.onScrollDown = function() {
			that.earnPoints += 1;
			that.increaseRemainingTime();
		};
	},
	tapEvent: function (event) {
		var charPosition;

		charPosition = event.x / window.innerWidth <= 0.5 ? "left" : "right";

		this.scene.scrollDown(charPosition);
	},
	keyDownEvent: function (event) {
		var charPosition;
		if(event.repeat) {
			return;
		}

		if(event.which === 37) {
			charPosition = "left";
		} else if(event.which === 39) {
			charPosition = "right";
		}

		if(!charPosition) {
			return;
		}

		this.scene.scrollDown(charPosition);
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
		wrapperElement.append(Zepto("<canvas id=\"gamecanvas\" style=\"width:" + this.width/2 + "px; height:" + this.height/2 + "px\" width=\"" + this.width + "\" height=\"" + this.height + "\"></canvas>"));
		this.canvasElement = document.getElementById("gamecanvas");

		this.createContext();
	},
	createContext: function () {
		this.context = this.canvasElement.getContext('2d');
	},
	start: function () {
		if(this.started) return;
		this.started = true;

		window.progressbar = Zepto("#progressbar");
		var that = this;
		setTimeout(function(){
			that.increment();
			console.log("começou");
		}, 2000);
	},
	increment: function () {
		var that = this;

		if(this.remainingTime <= 0) {
			this.gameOver();
			//alert("Game over. Pontuação total: " + this.earnPoints);
			return;
		}

		//console.log("remainingTime", this.remainingTime);

		progressbar.css("width", this.remainingTime/1000 * 100 + "%");
		this.remainingTime -= this.timeStep;

		requestAnimationFrame(function () {
			that.increment();
		});
	}

};

module.exports = function () {
	if(!instance) instance = new Game();
	return instance;
};
