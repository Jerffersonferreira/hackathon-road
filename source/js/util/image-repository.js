var instance;

function ImageRepository() {
	this.totalImages = 0;
	this.totalLoadedImages = 0;
	this.repository = {};
}

ImageRepository.prototype = {
	loadImage: function (id, url) {
		if(this.repository[id]) return;

		var that = this,
			image;

		this.totalImages += 1;

		image = new Image();
		image.onload = function () {
			that.totalLoadedImages += 1;
		};
		image.src = url;

		this.repository[id] = image;
	},
	getImage: function (id) {
		return this.repository[id];
	}
};

module.exports = function () {
	if(!instance) instance = new ImageRepository();
	return instance;
};
