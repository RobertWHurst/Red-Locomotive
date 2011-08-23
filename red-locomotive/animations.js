RedLocomotive('animations', function(engine, options) {

	/**
	 * Move any object that contains X and Y coordinates
	 * @param element
	 * @param degree
	 * @param distance
	 * @param frames
	 */
	function move(element, endX, endY, frames, callback) {

		var cleared = false;

		function clear() {
			cleared = true;
		}

		var api = {
			"clear": clear
		};

		function setCallback(newCallback) {
			callback = newCallback;
		}

		//if the element has x and y values, and they are int values.
		if (typeof element.x === 'number' && typeof element.y === 'number') {

			var moveTimer,
				counter = frames || 1;

			moveTimer = engine.every(function(){

				if(cleared) {
					//kill the timer
					moveTimer.clear();

					if (typeof callback === 'function') {
						callback();
					}
				}

				if(!counter) {

					newX = endX;
					newY = endY;

					//kill the timer
					moveTimer.clear();

					if (typeof callback === 'function') {
						callback();
					}

				} else {

					counter -= 1;

					//calculate the distance
					var distanceX = endX - element.x,
						distanceY = endY - element.y,
						moveX = Math.round((distanceX / counter) * 100) / 100,
						moveY = Math.round((distanceY / counter) * 100) / 100,
						newX = element.x + moveX,
						newY = element.y + moveY;
				}


				element.x = newX;
				element.y = newY;

				//fire an event for movement
				engine.event('move', api, newX, newY);
				engine.event('move-' + element.name, api, newX, newY);

			});

			return {
				"clear": moveTimer.clear,
				"setCallback": setCallback
			}
		}
		return false;
	}

	/**
	 * Animate any element with a spritesheet.
	 * @param element
	 * @param sequence
	 */
	function sequence(element, sequence, frames, callback) {

		function setCallback(newCallback) {
			callback = newCallback;
		}
		
		var frame = 0, useloop = false;

		if (element.spriteSheet && element.spritePos && typeof sequence === 'object') {

			var aniTimer = engine.every(function () {

				element.spritePos = sequence[frame];

				frame += 1;

				if (frame >= sequence.length) {
					if(!useloop){
						aniTimer.clear();
					} else {
						frame = 0;
					}
					if(typeof callback == 'function') {
						callback();
					}
				}
				
			}, frames, true);
		}

		function loop() {
			useloop = true;
		}

		function clear() {
			aniTimer.clear();
			if(typeof callback == 'function') {
				callback();
			}
		}

		return {
			"loop": loop,
			"clear": clear,
			"setCallback": setCallback
		}
	}

	return {
		"animate": {
			"move": move,
			"sequence": sequence,
			"stop": stop
		}
	}

});