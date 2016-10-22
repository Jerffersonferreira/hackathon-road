var config = require("./config");

function getFilePaths(fileNameList, paths) {
	var filePaths = {};

	fileNameList.forEach(function (filename) {
		filePaths[paths.build + filename.target] = paths.source + filename.source;
	});

	return filePaths;
}

function less(env) {
	var sourceMap = false,
		files,
		filePaths;

	files = [{
		source: "main.less",
		target: "main.css"
	}];

	filePaths = config.path.less;

	if(typeof env !== "string") {
		throw new Error("Env must be a string");
	}

	if(env === "DEV") {
		sourceMap = true;
	}

	return {
		files: getFilePaths(files, filePaths),
		options: {
			cleancss: false,
			compress: true,
			sourceMap: sourceMap
		}
	};
}

module.exports = less;
