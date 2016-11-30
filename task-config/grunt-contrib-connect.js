var config = require("./config");

function connect(name) {
	var port,
		base;

	if(name === "app") {
		base = config.path.build;
		port = 7000;
	} else {
		base = "./";
		port = 8000;
	}

	return {
		options: {
			hostname: "localhost",
			livereload: false,
			port: port,
			base: base
		}
	};
}

module.exports = connect;
