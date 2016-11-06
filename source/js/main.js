var game = require("./core/game")(),
	imageRepository = require("./util/image-repository")(),
	imageList = require("./resource/image-list"),
	interval;

imageList.forEach(function (img) {
	imageRepository.loadImage(img.id, img.url);
});

interval = setInterval(function () {
	console.log("loading... " + imageRepository.totalLoadedImages + "/" + imageRepository.totalImages);
	if(imageRepository.totalImages !== imageRepository.totalLoadedImages) return;

	game.init(Zepto(".js-app"));

	clearInterval(interval);
}, 200);

window.game = game;
