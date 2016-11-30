var MobileDetect = require("mobile-detect");

function Screen(app) {
	var mobileDetect = new MobileDetect(window.navigator.userAgent);

	this.app = app;

	this.currentScoreDisplay = app.find(".js-current-score");
	this.bestScoreDisplay = app.find(".js-best-score");
	this.gameScoreDisplay = app.find(".js-gamescore");
	this.regressBar = app.find(".js-regressbar");
	this.playButton = app.find(".js-playbutton");
	this.loadingProgressBar = app.find(".js-loading-progressbar");
	this.loadingDisplay = app.find(".js-loading-display");

	this.gameStates = {
		loading: "is-loading",
		home: "is-home",
		ready: "is-ready",
		playing: "is-playing",
		gameOver: "is-gameOver"
	};

	if(mobileDetect.mobile() !== null){
		this.app.addClass("is-mobile");
	} else {
		this.app.addClass("is-desktop");
	}
}

Screen.prototype = {
	resetState: function() {
		var classNames = this.app.attr("class");

		classNames = classNames.replace(/\s{2,}/g, " ");
		classNames = classNames.replace(/^\s|is-(?!desktop|mobile)[^\s]+\s?|\s$/gi, "");
		classNames = classNames.replace(/^\s+|\s+$/g, "");

		this.app.attr("class", classNames);
	},
	changeState: function(state) {
		this.resetState();
		this.app.addClass(this.gameStates[state]);
	},
	gameOver: function(currentScore, bestScore) {
		this.currentScoreDisplay.text(currentScore);
		this.bestScoreDisplay.text(bestScore);

		this.changeState("gameOver");
	},
	ready: function() {
		var that = this;
		this.regressBar.css("width", "0%");
		this.regressBar.addClass("is-animated");

		setTimeout(function(){
			that.regressBar.css("width", "50%");

			setTimeout(function() {
				that.regressBar.removeClass("is-animated");
			}, 1000);
		}, 1);

		this.gameScoreDisplay.text(0);

		this.changeState("ready");
	},
	playing: function() {
		this.changeState("playing");
	},
	loading: function() {
		this.changeState("loading");
	},
	home: function() {
		this.changeState("home");
	},
	updateScore: function(score) {
		this.gameScoreDisplay.text(score);
	},
	updateRegressBar: function(size) {
		this.regressBar.css("width", size);
	},
	setPlayButtonAction: function(playButtonAction) {
		if(typeof playButtonAction === "function") {
			this.playButton.on("click", playButtonAction);
		}
	},
	updateLoadingProgress: function(value) {
		this.loadingDisplay.text(value + "%");
		this.loadingProgressBar.css("width", value + "%");
	}
};

module.exports = Screen;
