/*jshint esversion: 6 */
module.exports = function (grunt) {
	"use strict";

	var browserify = require("./task-config/grunt-browserify"),
		contribClean = require("./task-config/grunt-contrib-clean"),
		contribConect = require("./task-config/grunt-contrib-connect"),
		contribCopy = require("./task-config/grunt-contrib-copy"),
		contribLess = require("./task-config/grunt-contrib-less"),
		contribWatch = require("./task-config/grunt-contrib-watch");

	grunt.initConfig({
		connect: {
			dev: contribConect("dev"),
			app: contribConect("app")
		},
		browserify: {
			dev: browserify("dev"),
			prod: browserify("prod")
		},
		less: {
			dev: contribLess("dev"),
			prod: contribLess("prod")
		},
		clean: contribClean(),
		copy: contribCopy(),
		watch: contribWatch()
	});

	// Load NPM Tasks
	grunt.loadNpmTasks("grunt-browserify");
	grunt.loadNpmTasks('grunt-imageoptim');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-watch");

	grunt.registerTask("default", ["connect:app","watch"]);

	grunt.registerTask("css:dev", ["clean:css", "less:dev"]);
	grunt.registerTask("images:dev", ["clean:img", "copy:img"]);
	grunt.registerTask("javascript:dev", ["clean:js", "browserify:dev"]);
	grunt.registerTask("html", ["clean:html", "copy:html"]);
	grunt.registerTask("vendor", ["clean:vendor", "copy:vendor"]);
	grunt.registerTask("misc", ["copy:misc"]);

	grunt.registerTask("css:prod", ["clean:css", "less:prod"]);
	grunt.registerTask("images:prod", ["clean:img", "copy:img"]);
	grunt.registerTask("javascript:prod", ["clean:js", "browserify:prod"]);

	grunt.registerTask("build", ["html", "css:prod", "images:prod", "javascript:prod"]);
};
