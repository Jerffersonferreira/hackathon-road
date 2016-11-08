var MobileDetect = require("mobile-detect");

function Screen(app, playButtonAction) {
	var mobileDetect = new MobileDetect(window.navigator.userAgent);

	this.app = app;

	this.currentScoreDisplay = app.find(".js-current-score");
	this.bestScoreDisplay = app.find(".js-best-score");
	this.gameScoreDisplay = app.find(".js-gamescore");
	this.gameScoreDisplay = app.find(".js-gamescore");
	this.progressBar = app.find(".js-progressbar");
	this.playButton = app.find(".js-playbutton");

	this.gameStates = {
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

	if(typeof playButtonAction === "function") {
		this.playButton.on("click", playButtonAction);
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
	addState: function(state) {
		this.app.addClass(this.gameStates[state]);
	},
	gameOver: function(currentScore, bestScore) {
		this.currentScoreDisplay.text(currentScore);
		this.bestScoreDisplay.text(bestScore);

		this.resetState();
		this.addState("gameOver");
	},
	ready: function() {
		var that = this;
		this.progressBar.css("width", "0%");
		this.progressBar.addClass("is-animated");

		setTimeout(function(){
			that.progressBar.css("width", "50%");

			setTimeout(function() {
				that.progressBar.removeClass("is-animated");
			}, 1000);
		}, 1);

		this.gameScoreDisplay.text(0);

		this.resetState();
		this.addState("ready");
	},
	playing: function() {
		this.resetState();
		this.addState("playing");
	},
	updateScore: function(score) {
		this.gameScoreDisplay.text(score);
	},
	updateProgressBar: function(size) {
		this.progressBar.css("width", size);
	}
};

module.exports = Screen;
