var config = require("./config");

function getPreBundleCallback(sourceMap) {
	return function (browserify) {
		browserify.transform({
			global: true,
			sourcemap: sourceMap
		}, "uglifyify");
	};
}

function getJsFilePaths(fileNameList, jsFilePaths) {
	var filePaths = {};

	fileNameList.forEach(function (filename) {
		filePaths[jsFilePaths.build + filename] = [jsFilePaths.source + filename];
	});

	return filePaths;
}

function browserify(env) {
	var debug = false,
		sourceMap = false,
		files,
		jsFilePaths;

	files = ["main.js"];
	jsFilePaths = config.path.js;

	if(typeof env !== "string") {
		throw new Error("Env must be a string");
	}

	if(env === "DEV") {
		debug = true;
		sourceMap = true;
	}

	return {
		files: getJsFilePaths(files, jsFilePaths),
		options: {
			preBundleCB: getPreBundleCallback(sourceMap),
			browserifyOptions: {
				debug: debug
			}
		}
	};
}

module.exports = browserify;
