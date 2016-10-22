/* jshint esversion:6 */
const
	SOURCE_PATH = "source/",
	BUILD_PATH = "build/",
	TEMP_PATH = "temp/",
	JS_SOURCE_PATH = SOURCE_PATH + "js/",
	JS_BUILD_PATH = BUILD_PATH + "js/",
	LESS_SOURCE_PATH = SOURCE_PATH + "less/",
	LESS_BUILD_PATH = BUILD_PATH + "css/",
	IMG_SOURCE_PATH = SOURCE_PATH + "img/",
	IMG_BUILD_PATH = BUILD_PATH + "img/";
IMG_TEMP_PATH = TEMP_PATH + "img/";

module.exports = {
	path: {
		source: SOURCE_PATH,
		build: BUILD_PATH,
		temp: TEMP_PATH,
		js: {
			source: JS_SOURCE_PATH,
			build: JS_BUILD_PATH
		},
		less: {
			source: LESS_SOURCE_PATH,
			build: LESS_BUILD_PATH
		},
		img: {
			source: IMG_SOURCE_PATH,
			build: IMG_BUILD_PATH,
			temp: IMG_TEMP_PATH
		}
	}
};
