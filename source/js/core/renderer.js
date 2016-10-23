/*jshint esversion: 6 */
var requestAnimationFrame = require("../util/request-animation-frame"),
	instance;

function Renderer() {
	var that = this;
	this.frameRate = 24;
	this.accumulator = 0;
	this.callbaks = [];

	function requestedFrame() {
		requestAnimationFrame(function () {
			that.accumulator += 1;
			that.executeQueue();
			requestedFrame();
		});
	}

	requestedFrame();
}

Renderer.prototype = {
	queue: function (callback) {
		if(!(callback instanceof Function)) return;
		this.callbaks.push(callback);
	},
	executeQueue: function () {
		if(!this.isFrameRateReached()) return;
		this.callbaks.forEach(function (callback) {
			callback();
		});
		this.accumulator = 0;
	},
	isFrameRateReached: function () {
		return this.accumulator > 60 / this.frameRate;
	}
};

module.exports = function () {
	if(!instance) instance = new Renderer();
	return instance;
};
