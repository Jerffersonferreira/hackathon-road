module.exports = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function (callback) {
		if(!(callback instanceof Function)) throw new Error("Callback must be a function");
		window.setTimeout(callback, 1000 / 60);
	};
