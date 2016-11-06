var instance,
	requestAnimationFrame = require("../util/request-animation-frame"),
	MobileDetect = require("mobile-detect"),
	Drawable = require("../core/drawable"),
	Screen = require("../core/screen"),
	Scene = require("../core/scene"),
	Char = require("../core/char");

function Game() {
	var mobileDetect = new MobileDetect(window.navigator.userAgent);

	this.isGameOver = false;
	this.started = false;
	this.initialized = false;
	this.isMobile = mobileDetect.mobile() !== null;
	this.remainingTime = null;
	this.score = null;
	this.bestScore = null;
	this.timeStep = null;
	this.screen = null;
	this.scene = null;
}

Game.prototype = {
	init: function (app) {
		var wrapperElement;

		if(this.initialized) return;
		this.initialized = true;

		wrapperElement = app.find('.js-body');

		this.app = app;
		this.width = wrapperElement.width()*2;
		this.height = wrapperElement.height()*2;

		this.createCanvasElem(wrapperElement);

		this.addScreen();
		this.addScene();
		this.addChar();
		this.reset();
	},
	reset: function() {
		var that = this;

		this.started = false;
		this.isGameOver = false;
		this.score = 0;
		this.remainingTime = 500;
		this.timeStep = 1;
		this.scene.reset();

		setTimeout(function(){
			that.scene.play();
		}, 100);
	},
	gameOver: function() {
		this.isGameOver = true;
		if(this.bestScore === null || this.score > this.bestScore) {
			this.bestScore = this.score;
		}
		this.screen.gameOver(this.score, this.bestScore);
	},
	increaseRemainingTime: function() {
		if(this.remainingTime >= 1000) return;
		this.remainingTime += 14;
	},
	addChar: function () {
		this.char = new Char(this.context);
		this.scene.addChar(this.char);
	},
	playButtonAction: function() {
		if(this.started && !this.isGameOver) {
			return;
		} else if(this.isGameOver) {
			this.reset();
		} else {
			this.addControls();
		}

		this.screen.ready();
	},
	addScreen: function() {
		var that = this;
		this.screen = new Screen(this.app, function() {
			that.playButtonAction();
		});
	},
	addScene: function () {
		var that = this;
		this.scene = new Scene(this.context, true);
		this.scene.setWidth(this.width);
		this.scene.setHeight(this.height);
		this.scene.onScrollDown = function() {
			that.score += 1;
			that.increaseRemainingTime();
			that.screen.updateScore(that.score);
		};
	},
	beforeTapOrKeyDown: function() {
		if(!this.isGameOver && !this.started) {
			this.start();
		}
	},
	tapEvent: function (event) {
		var charPosition;

		this.beforeTapOrKeyDown();

		if(!this.started || this.isGameOver) return;

		charPosition = event.x / window.innerWidth <= 0.5 ? "left" : "right";

		this.scene.scrollDown(charPosition);
	},
	keyDownEvent: function (event) {
		var charPosition;

		if(event.repeat) return;

		this.beforeTapOrKeyDown();

		if(!this.started || this.isGameOver) return;


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
		this.screen.playing();
		this.increment();
	},
	increment: function () {
		var that = this;

		if(this.remainingTime <= 0) {
			this.gameOver();
			return;
		}

		this.remainingTime -= this.timeStep;
		this.screen.updateProgressBar(this.remainingTime/1000 * 100 + "%");

		requestAnimationFrame(function () {
			that.increment();
		});
	}

};

module.exports = function () {
	if(!instance) instance = new Game();
	return instance;
};
