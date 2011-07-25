//Start Red Locomotive
window.onload = function(){
	RedLocomotive({

		//Configuration
		"baseUrl": "",
		"fps": 30,
		"showFPS": false,
		"pauseOnBlur": true

	}, function(engine) {

		engine.every(function(){
			if(engine.keyboard().esc){
				engine.pause();
			}
		});

		//Create the main viewport
		var mainView = engine.viewport.create('main', '#mainView', 100, 100);

		mainView.node.width(400);
		mainView.node.height(320);
		mainView.node[0].width = 400;
		mainView.node[0].height = 320;

		engine.require('character2d', init);

		function init() {

			//create a test sprite sheet
			engine.spriteSheet.create([

				//Character Sprites
				{ "url": "spriteSheets/char-swim.png", "spriteWidth": 36, "spriteHeight": 36 },
				{ "url": "spriteSheets/piranha.png", "spriteWidth": 20, "spriteHeight": 14 },
				{ "url": "spriteSheets/bubble.png", "spriteWidth": 12, "spriteHeight": 12 },
				{ "url": "spriteSheets/sea-grass.png", "spriteWidth": 32, "spriteHeight": 28 }

			], game);

		}

		//GAME
		function game() {
			
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

			for(var i = 0; i < 10; i += 1) {
				//Piranha(engine.random(2280)- 600, engine.random(2280)- 600, 1, engine.random(400) + 100).attack(zac);
			}

		}

		//Creates a Zac
		function Zac(x, y, z) {

			//make zac
			var zac = engine.character2d.create('zac' + engine.idGen(), 'spriteSheets/char-swim.png', x, y, z, 36, 36);

			zac.sequence.up(false, [[0, 0], [1, 0], [2, 0], [3, 0]], 2);
			zac.sequence.down(false, [[0, 1], [1, 1], [2, 1], [3, 1]], 2);
			zac.sequence.right(false, [[0, 2], [1, 2], [2, 2], [3, 2]], 2);
			zac.sequence.left(false, [[0, 3], [1, 3], [2, 3], [3, 3]], 2);
			zac.sequence.idle(false, [[0, 4], [1, 4], [2, 4], [3, 4]], 6);
			engine.element.keepIn(zac, mainView, -1);
			zac.bindToArrowKeys(5);

			return zac;

		}

		//Creates a piranha
		function Piranha(x, y, z, d) {

			//make the piranha
			var piranha = engine.character2d.create('piranha' + engine.idGen(), 'spriteSheets/piranha.png', x, y, z, 20, 14),
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
            piranha.sequence.idle(false, [[11, 0], [12, 0]], 10);

			function patrol() {
				var MovingLeft = Math.round(Math.random()),
					patrolTimer;

				patrolTimer = engine.every(function () {
					var	degree = Math.round(engine.random(30) + 75),
					    distance = Math.round(engine.random(200) + d),
                        speed = Math.round(distance / 2);

					//make up a vector
					if(MovingLeft) {
						degree += 180;
						MovingLeft = false;
					} else {
						MovingLeft = true;
					}
                    
					engine.character2d.animate.move(piranha, degree, distance, speed);
					patrolTimer.setFrames(speed);

				});
			}

            function attack(element) {

                engine.every(function () {

                    var targetX = element.x + (engine.random(20) - 10),
                        targetY = element.y + (engine.random(20) - 10);

                    engine.character2d.move(piranha, targetX, targetY);

                });
            }

			patrol();

            return {
                "attack": attack,
                "patrol": patrol
            }

		}

		function Grass(x, y, z) {

			var grass = engine.element.create('seaGrass' + engine.idGen(), 'spriteSheets/sea-grass.png', x, y, z, 32, 28);
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
					bubble = engine.element.create('bubble' + engine.idGen(), 'spriteSheets/bubble.png', x, y, z, 12, 12);

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
}