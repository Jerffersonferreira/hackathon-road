/*jshint esversion: 6 */
var config = require("./config");

function watch() {
	return {
		options: {
			atBegin: true,
			spawn: false,
			interrupt: true,
			forever: true
		},
		less: {
			files: config.path.less.source + "**/*.less",
			tasks: ["css:dev"]
		},
		js: {
			files: config.path.js.source + "**/*.js",
			tasks: ["javascript:dev"]
		},
		img: {
			files: config.path.img.source + "**/*",
			tasks: ["images:dev"]
		},
		html: {
			files: config.path.html.source + "**/*",
			tasks: ["html:dev"]
		},
		vendor: {
			files: config.path.vendor.source + "**/*",
			tasks: ["vendor"]
		},
		misc: {
			files: [config.path.source + "**/*.json", config.path.source + "**/*.manifest"],
			tasks: ["misc"]
		}
	};
}

module.exports = watch;
