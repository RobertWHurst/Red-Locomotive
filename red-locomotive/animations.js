RedLocomotive('animations', function (options, engine) {

	/**
	 * Move any object that contains X and Y coordinates
	 * @param element
	 * @param degree
	 * @param distance
	 * @param frames
	 */
	function move(element, degree, distance, frames, callback) {

		//if the element has x and y values, and they are int values.
		if (element.x && element.y) {

			var counter = frames || 1,
				moveTimer,
                travelX,
                travelY,
                coords = engine.coords(degree, distance);

			moveTimer = engine.every(function(){

				travelX = Math.round(coords.x / counter);
				travelY = Math.round(coords.y / counter);

                coords.x -= travelX;
                coords.y -= travelY;

				element.x += travelX;
				element.y += travelY;

				counter -= 1;

				if(!counter) {

					//kill the timer
					moveTimer.clear();

					if (typeof callback === 'function') {
						callback();
					}
				}
			});

			return {
				"clear": moveTimer.clear
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
			"clear": clear
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