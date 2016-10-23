/*jshint esversion: 6 */
var requestAnimationFrame = require("../util/request-animation-frame"),
	instance;

function Renderer() {
	var that = this;
	this.frameRate = 60;
	this.accumulator = 0;
	this.callbaks = [];
	this.isReadyToExecuteQueue = true;
	this.accumulatorLimit = Math.ceil(60 / this.frameRate);

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
		var queue;
		if(!this.isFrameRateReached() && !this.isReadyToExecuteQueue) return;
		this.isReadyToExecuteQueue = false;

		queue = this.callbaks;
		this.callbaks = [];
		queue.forEach(function (callback) {
			callback();
		});

		this.isReadyToExecuteQueue = false;

		this.accumulator = 0;
	},
	isFrameRateReached: function () {
		return this.accumulator > this.accumulatorLimit;
	}
};

module.exports = function () {
	if(!instance) instance = new Renderer();
	return instance;
};
