(function () {
	var game = require("./core/game")(),
		Screen = require("./core/screen"),
		imageRepository = require("./util/image-repository")(),
		imageList = require("./resource/image-list"),
		interval,
		screen,
		app;

	app = Zepto(".js-app");
	screen = new Screen(app);
	screen.loading();

	imageList.forEach(function (img) {
		imageRepository.loadImage(img.id, img.url);
	});

	interval = setInterval(function () {
		screen.updateLoadingProgress(imageRepository.totalLoadedImages/imageRepository.totalImages*100);

		if(imageRepository.totalImages !== imageRepository.totalLoadedImages) return;

		game.setScreen(screen);

		setTimeout(function(){
			game.init(app);
		}, 500);

		clearInterval(interval);
	}, 200);

	window.game = game;
})();
