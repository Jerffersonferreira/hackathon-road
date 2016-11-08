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
		},
		vendor: {
			expand: true,
			cwd: config.path.vendor.source,
			src: "**",
			dest: config.path.vendor.build
		},
		misc: {
			expand: true,
			cwd: config.path.source,
			src: ["*.json", "*.manifest"],
			dest: config.path.build
		}
	};
}

module.exports = copy;
