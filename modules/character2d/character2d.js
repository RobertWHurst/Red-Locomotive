RedLocomotive('character2d', function(engine, options) {

	var idleTimer;

	function newCharacter(elementName, spriteUrl, x, y, z, w, h) {

		//create an element
		var character = engine.element.create(elementName, spriteUrl, x, y, z, w, h),
			aniBindings = {
				"idle": false,
				"up": false,
				"down": false,
				"right": false,
				"left": false
			},
			binding,
			lastState = '',
			c = 0,
			f = 0,
			sequence;

		character.movement = 'idle';


		engine.every(function(){

			//get the current binding
			binding = aniBindings[character.movement];

			//exit on bad binding
			if(!binding) {
				return false;
			}

			//reset counters on state change
			if(lastState !== character.movement) {
				c = binding.frames;
				f = 0;
				sequence = binding.startSequence;
			}

			//skip frames
			if(c < binding.frames) {
				
				c += 1;

			//load frame
			} else {
				c = 0;

				character.spritePos = sequence[f];

				//advance the frame
				if(f < sequence.length - 1) {
					f += 1;
				} else {
					f = 0;

					// there is a running sequence use it from now on
					if(binding.runningSequence.length) {
						sequence = binding.runningSequence;
					}
				}

			}

			lastState = character.movement;

		});

		/**
		 * Defines a sequence of movement for a specific motion
		 * @param movement
		 * @param startSequence
		 * @param runningSequence
		 * @param frames
		 */
		function animateMovement(movement, startSequence, runningSequence, frames) {

			if(typeof runningSequence === 'number' && !frames) {
				frames = runningSequence;
				runningSequence = false;
			}

			//bind the new animation set
			if(movement === 'idle' || movement === 'up' || movement === 'down' || movement === 'right' || movement === 'left'){
				aniBindings[movement] = {
					"startSequence": startSequence,
					"runningSequence": runningSequence,
					"frames": frames
				}
			}
		}


		function onIdle(startSequence, runningSequence, frames) {
			animateMovement('idle', startSequence, runningSequence, frames);
		}
		function onUp(startSequence, runningSequence, frames) {
			animateMovement('up', startSequence, runningSequence, frames);
		}
		function onDown(startSequence, runningSequence, frames) {
			animateMovement('down', startSequence, runningSequence, frames);
		}
		function onRight(startSequence, runningSequence, frames) {
			animateMovement('right', startSequence, runningSequence, frames);
		}
		function onLeft(startSequence, runningSequence, frames) {
			animateMovement('left', startSequence, runningSequence, frames);
		}

		return jQuery.extend(character, {
			"sequence": {
				"idle": onIdle,
				"up": onUp,
				"down": onDown,
				"right": onRight,
				"left": onLeft
			}
		});
	}

	/**
	 * Binds the arrow keys to a character
	 * @param distance
	 */
	function bindToArrowKeys(character, distance) {

		//set the default pixel travel
		distance = distance || 1;

		//move loop
		//Defines what the state of the object is and weather or not its moving
		var arrowKeysLoop = engine.every(function () {

			//get the input.
			var keyboard = engine.keyboard();

			//none
			if(keyboard.axisCode === 0) {
				return false;

			//up
			} else if (keyboard.axisCode === 1) {
				move(character, character.x, character.y - distance);

			// up + right
			} else if (keyboard.axisCode === 11) {
				var coords = engine.coords(45, distance);
				move(character, coords.x + character.x, coords.y + character.y);

			// right
			} else if (keyboard.axisCode === 10) {
				move(character, character.x + distance, character.y);

			//down + right
			} else if (keyboard.axisCode === 110) {
				var coords = engine.coords(135, distance);
				move(character, character.x + coords.x, character.y + coords.y);

			//down
			} else if (keyboard.axisCode === 100) {
				move(character, character.x, character.y + distance);

			//down + left
			} else if (keyboard.axisCode === 1100) {
				var coords = engine.coords(225, distance);
				move(character, character.x + coords.x, character.y + coords.y);

			//left
			} else if (keyboard.axisCode === 1000) {
				move(character, character.x - distance, character.y);

			//left + up
			} else if (keyboard.axisCode === 1001) {
				var coords = engine.coords(315, distance);
				move(character, character.x + coords.x, character.y + coords.y);
			}

		});

		return {
			"clear": arrowKeysLoop.clear
		}
	}

	function setMovement(character, x, y, framesToHoldFor) {

		if(character.idleTimer) {
			character.idleTimer.clear();
			delete character.idleTimer;
		}

		var _x = x < 0 ? -x : x,
			_y = y < 0 ? -y : y,
			mH = _x >= _y;

		if(mH) {
			if(x < 0) {
				character.movement = 'left';
			} else {
				character.movement = 'right';
			}
		} else {
			if(y < 0) {
				character.movement = 'up';
			} else {
				character.movement = 'down';
			}
		}

		//setup a timer to idle the sprite movement
		character.idleTimer = engine.after(function(){
			character.movement = 'idle';
		}, framesToHoldFor);

	}

	function move(character, x, y) {

		var vector = engine.vector(x - character.x, y - character.y);
		var coords = {"x": x, "y": y};

		setMovement(character, x - character.x, y - character.y);

		if(!engine.element.move(character, coords.x, coords.y)) {
			coords = engine.coords(vector[0] + 75, vector[1]);

			if(!engine.element.move(character, coords.x + character.x, coords.y + character.y)) {
				coords = engine.coords(vector[0] - 75, vector[1]);

				engine.element.move(character, coords.x + character.x, coords.y + character.y);
			}
		}
	}

	function animateMove(character, x, y, frames, callback) {
		setMovement(character, x - character.x, y - character.y, frames);
		engine.animate.move(character, x, y, frames, callback);
	}

	return {
		"create": newCharacter,
		"move": move,
		"animate": {
			"move": animateMove
		},
		"bindToArrowKeys": bindToArrowKeys,
		"setMovement": setMovement
	}
});