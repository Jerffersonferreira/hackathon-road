/*jshint esversion: 6 */
var config = require("./config");

function copy() {
	return {
		img: {
			expand: true,
			cwd: config.path.img.source,
			src: "**",
			dest: config.path.img.build
		},
		html: {
			expand: true,
			cwd: config.path.html.source,
			src: "**",
			dest: config.path.html.build
		}
	};
}

module.exports = copy;
