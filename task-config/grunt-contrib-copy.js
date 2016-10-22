/*jshint esversion: 6 */
var config = require("./config");

function copy() {
	return {
		img: {
			expand: true,
			cwd: config.path.img.source,
			src: "**",
			dest: config.path.img.build
		}
	};
}

module.exports = copy;
