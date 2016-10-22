/*jshint esversion: 6 */
var config = require("./config");

function clean() {
	return {
		css: [config.path.less.build + "*"],
		js: [config.path.js.build + "*"],
		img: [config.path.img.build + "*", config.path.img.temp + "*"],
		html: [config.path.html.build + "*.html", config.path.html.build + "screen/*"],
		vendor: [config.path.vendor.build + "*"]
	};
}

module.exports = clean;
