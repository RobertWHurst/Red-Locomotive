//Start Red Locomotive
jQuery('#mainView').keydown(function() {
	return false;
});
RedLocomotive({

	//Configuration
	"baseUrl": "",
	"fps": 30,
	"showFPS": false,
	"require": ['character2d']

}, function(engine) {

	engine.start();

	//Create the main viewport
	var mainView = engine.viewport.create('main', '#mainView', 400, 320);

	mainView.node.width(400);
	mainView.node.height(320);

	//create a test sprite sheet
	engine.spriteSheet.create([

		//Character Sprites
		["char", "spriteSheets/char-swim.png", 36, 36],
		["piranha", "spriteSheets/piranha.png", 20, 14],
		["bubble", "spriteSheets/bubble.png", 12, 12],
		["grass", "spriteSheets/sea-grass.png", 32, 28]

	], function () {

		engine.every(function() {
			Bubble(engine.random(jQuery(window).width()), engine.random(jQuery(window).height()), 1);
		}, 20);

		var zac = Zac(100, 100, 2);

		for(var i = 0; i < 2000; i += 1) {
			Grass(engine.random(2280)- 600, engine.random(2280)- 600, 1);
		}

		for(var i = 0; i < 60; i += 1) {
			Piranha(engine.random(2280)- 600, engine.random(2280)- 600, 1, engine.random(400) + 100);
		}

	});

	//Creates a Zac
	function Zac(x, y, z) {

		//make zac
		var zac = engine.character2d.create('zac', 'char', x, y, z);

		zac.sequence.up([[0, 0], [1, 0], [2, 0], [3, 0]], 2);
		zac.sequence.down([[0, 1], [1, 1], [2, 1], [3, 1]], 2);
		zac.sequence.right([[0, 2], [1, 2], [2, 2], [3, 2]], 2);
		zac.sequence.left([[0, 3], [1, 3], [2, 3], [3, 3]], 2);
		zac.sequence.idle([[0, 4], [1, 4], [2, 4], [3, 4]], 6);
		engine.element.keepIn(zac, mainView, -1);
		engine.character2d.bindToArrowKeys(zac, 5);

		return zac;

	}

	//Creates a piranha
	function Piranha(x, y, z) {

		//make the piranha
		var piranha = engine.character2d.create('piranha' + engine.idGen(), 'piranha', x, y, z),
			action = 'patrol';

		//define the sequences
		piranha.sequence.right([
			[11, 0], [10, 0], [9, 0]
		], [
			[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0]
		], 3);
		piranha.sequence.left([
			[12, 0], [13, 0], [14, 0]
		], [
			[23, 0], [22, 0], [21, 0], [20, 0], [19, 0], [18, 0], [17, 0], [16, 0], [15, 0]
		], 3);
		piranha.sequence.idle([[11, 0], [12, 0]], 10);


		function patrol(direction) {

			//figure out new coordinates
			var x = engine.random(50) + 200,
				y = (engine.random(40) - 20) + piranha.y,

				speed = engine.random(10) + 120;

			if(direction === 'left') {
				direction = 'right';
				x = piranha.x - x;
			} else {
				direction = 'left';
				x = piranha.x + x;
			}

			engine.character2d.animate.move(piranha, x, y, speed, function() {
				setTimeout(function () {
					patrol(direction);
				}, 1);
			});

		}

		function attack(element) {

			engine.every(function () {

				var targetX = element.x + (engine.random(20) - 10),
					targetY = element.y + (engine.random(20) - 10);

				engine.character2d.move(piranha, targetX, targetY);

			});
		}

		var rand = engine.random(2);
		console.log(rand);
		var initDirection = rand >= 1 ? 'left' : 'right';

		patrol(initDirection);

		return {
			"attack": attack,
			"patrol": patrol
		}

	}

	function Grass(x, y, z) {

		var grass = engine.element.create('seaGrass' + engine.idGen(), 'grass', x, y, z);
		engine.after(function(){
			engine.animate.sequence(grass, [[0, 0], [1, 0]], 10).loop();
		}, engine.random(10));

	}

	function Bubble(x, y, z, topLimit) {

		engine.after(function()  {

			//if(engine.isInView(mainView, bubble)){
				//engine.audio.sound.create('bubble', "media/bubble.mp3", "media/bubble.ogg", function(sound) {
					//sound.play();
				//});
			//}

			var topLimit = topLimit || 0,

				size = engine.random(10),

				//create bubble
				bubble = engine.element.create('bubble' + engine.idGen(), 'bubble', x, y, z);

			if(size > 2){
				//animate the bubble
				engine.animate.sequence(bubble, [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0]], 8, function(){
					engine.animate.sequence(bubble, [[6, 0], [7, 0], [8, 0], [9, 0]], 3).loop();
				});
			}
			if(size > 1){
				//animate the bubble
				engine.animate.sequence(bubble, [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0]], 8);
			} else {
				//animate the bubble
				engine.animate.sequence(bubble, [[0, 0], [1, 0], [2, 0]], 8);
			}

			var bubbleTimer = engine.every(function () {

				//if the bubble get to the limit
				if (bubble.y <= topLimit) {
					bubbleTimer.clear();
					engine.element.remove(bubble);
				}

				//walk the bubble up the screen
				bubble.y -= 1;

			});

		}, engine.random(100));

	}


});