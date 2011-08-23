RedLocomotive('core', function(engine, options) {

	//create configuration
	var config = jQuery.extend({
		"showFPS": false,
		"pauseOnBlur": false,
		"fps": 60
	}, options);

	//get the canvas
	var lastId = 0,
		mousePos = [0, 0],
		mousedown = [false, 0, 0],
		keyboard = {
			"axisCode": 0,
			"enter": false,
			"esc": false
		},
		active = false,
		frameCount = 0,
		realFps = '?',
		cycleDrift = 0,
		lastCoreLoopTime = 0,
		timers = {},
		events = {},
		tanMap = {},
		sinMap = {},
		cosMap = {},
		atanMap = {},
		asinMap = {},
		acosMap = {};

	//core loop
	(function coreLoop(coreLoopTime) {

		//if active
		if (active) {

			//get the milliseconds per frame
			var mspf = Math.floor(1000 / config.fps);

			//count the amount of drift in milliseconds between frames
			cycleDrift += Math.round(((coreLoopTime - lastCoreLoopTime) / mspf) * 10) / 10;

			//get the number of cycles for this loop
			var clockCycles = Math.floor(cycleDrift);

			//prevent runway cycles
			clockCycles = clockCycles <= 600 ? clockCycles : 600;

			//if there are cycles in this loop
			if(clockCycles > 0) {

				//update the frame counter
				frameCount += 1;

				//remove the elapsed cycles from the frameDrift
				cycleDrift -= clockCycles;

				//run the clock for each cycle
				for(var i = 0; i < clockCycles; i += 1) {
					clock();
				}

				//draw the current frame
				draw();
			}

			//call the core loop hook
			newEvent('coreLoop');

		}

		//save the last core loop time
		lastCoreLoopTime = coreLoopTime;

		requestAnimFrame(coreLoop);

	})(new Date());

	//core secondary loop
	setInterval(function () {

		//figure out the framerate
		realFps = frameCount;
		frameCount = 0;

		//stop the loop if the system is inactive
		if (!active) { return true; }

		//call the second loop hook
		newEvent('coreSecLoop');

	}, 1000);

	//events
	(function eventsHooks() {
		var depressedKeyCodes = [];

		//mouse position
		jQuery(document).mousemove(function (e) {
			mousePos = [e.pageX , e.pageY];
			newEvent('mousemove', e);
		});
		//mouse down
		jQuery(document).mousedown(function (e) {
			mousedown = [true, e.pageX, e.pageY];
			newEvent('mousedown', e);
		});
		//mouse up
		jQuery(document).mouseup(function (e) {
			mousedown = [false, e.pageX, e.pageY];
			newEvent('mouseup', e);
		});
		//window focus
		jQuery(window).focus(function (e) {
			newEvent('focus', e);
		});
		//window blur
		jQuery(window).blur(function (e) {
			if (config.pauseOnBlur) {
				active = false;
			}
			newEvent('blur', e);
		});

		jQuery(window).keydown(function(e) {
			newEvent('keydown', e);
			if (e.keyCode === 38) {
				if(!depressedKeyCodes[38]) {
					keyboard.axisCode += 1;
					depressedKeyCodes[38] = true;
				}
				return false;
			}
			if (e.keyCode === 39) {
				if(!depressedKeyCodes[39]) {
					keyboard.axisCode += 10;
					depressedKeyCodes[39] = true;
				}
				return false;
			}
			if (e.keyCode === 40) {
				if(!depressedKeyCodes[40]) {
					keyboard.axisCode += 100;
					depressedKeyCodes[40] = true;
				}
				return false;
			}
			if (e.keyCode === 37) {
				if(!depressedKeyCodes[37]) {
					keyboard.axisCode += 1000;
					depressedKeyCodes[37] = true;
				}
				return false;
			}
			if (e.keyCode === 27) {
				keyboard.esc = true;
				return false;
			}
			if (e.keyCode === 13) {
				keyboard.enter = true;
				return false;
			}
		});

		jQuery(window).keyup(function(e) {
			newEvent('keyup', e);
			if (e.keyCode === 38) {
				keyboard.axisCode -= 1;
				depressedKeyCodes[38] = false;
				return false;
			}
			if (e.keyCode === 39) {
				keyboard.axisCode -= 10;
				depressedKeyCodes[39] = false;
				return false;
			}
			if (e.keyCode === 40) {
				keyboard.axisCode -= 100;
				depressedKeyCodes[40] = false;
				return false;
			}
			if (e.keyCode === 37) {
				keyboard.axisCode -= 1000;
				depressedKeyCodes[37] = false;
				return false;
			}
			if (e.keyCode === 27) {
				keyboard.esc = false;
				return false;
			}
			if (e.keyCode === 13) {
				keyboard.enter = false;
				return false;
			}
		});
	})();

	function random(limit) {
		return Math.floor(Math.random() * (limit || 100)) || 0;
	}

	function idGen() {
		lastId += 1;
		return lastId;
	}

	/**
	 * Returns the distance from an x and y offset.
	 * @param xDistance
	 * @param yDistance
	 */
	function distance(xDistance, yDistance) {

		xDistance = xDistance < 0 ? -xDistance : xDistance;
		yDistance = yDistance < 0 ? -yDistance : yDistance;

		//use pythagoras theorem to find the distance.
		return Math.round(Math.sqrt(Math.pow(yDistance, 2) + Math.pow(xDistance, 2)) * 100) / 100;

	}

	/**
	 * Returns degree of an x and y offset.
	 * @param xDistance
	 * @param yDistance
	 */
	function degree(xDistance, yDistance) {

		//if the distance is along x or y return the degree without using trig
		//
		//if the object is stationary return 0
		if (xDistance === 0 && yDistance === 0) {
			return 0;

		//if moving along the y axis
		} else if(xDistance === 0) {

			//return 0 for up
			if(yDistance < 0) {
				return 0;

			//return 180 for down
			} else {
				return 180;
			}

		//if moving along the x axis
		} else if (yDistance === 0) {

			//return 90 for right
			if(xDistance > 0) {
				return 90;

			//return 270 for left
			} else {
				return 270;
			}
		}

		//prepare some variables for the trig based method
		var quad, decimal;

		//figure out the quadrant
		if (xDistance >= 0 && yDistance < 0) {
			quad = 0;
		} else if(xDistance > 0 && yDistance >= 0) {
			quad = 1;
		} else if(xDistance <= 0 && yDistance > 0) {
			quad = 2;
		} else if(xDistance < 0 && yDistance <= 0) {
			quad = 3;
		}

		//inverse negative axis
		xDistance = xDistance < 0 ? -xDistance : xDistance;
		yDistance = yDistance < 0 ? -yDistance : yDistance;

		//get the decimal for atan
		switch (quad) {
			case 0:
			case 2:
				decimal = yDistance / xDistance;
			break;
			case 1:
			case 3:
				decimal = xDistance / yDistance;
			break;
		}

		//use arc tangent to find the degree of ascent.
		return (Math.round((engine.atan(decimal)) * 100) / 100) + (90 * quad);
	}

	function vector(xDistance, yDistance) {
		return [degree(xDistance, yDistance), distance(xDistance, yDistance)];
	}

	/**
	 * Returns the end coordinates of a vector starting at 0, 0.
	 * @param degree
	 * @param distance
	 */
	function coords(degree, distance) {

		//throw an error if greater than 360 or less than 0
		if (degree >= 360) {
			degree /= degree / 360;
		} else if (degree < 0) {
			degree *= -degree / 360;
		}

		var quad = Math.floor(degree / 90);
		degree -= 90 * quad;

		var x = 0, y = 0;

		switch (quad) {
			case 0:
				y = -cos(degree) * distance;
				x = sin(degree) * distance;
				break;
			case 1:
				y = sin(degree) * distance;
				x = cos(degree) * distance;
				break;
			case 2:
				y = cos(degree) * distance;
				x = -sin(degree) * distance;
				break;
			case 3:
				y = -sin(degree) * distance;
				x = -cos(degree) * distance;
				break;
		}

		x = Math.round(x * 10) / 10;
		y = Math.round(y * 10) / 10;

		return {"x": x, "y": y};
	}

	function tan(input) {
		if (!tanMap[input]) {
			tanMap[input] = Math.tan(input * Math.PI / 180);
		}
		return tanMap[input];
	}

	function sin(input) {
		if (!sinMap[input]) {
			sinMap[input] = Math.sin(input * Math.PI / 180);
		}
		return sinMap[input];
	}

	function cos(input) {
		if (!cosMap[input]) {
			cosMap[input] = Math.cos(input * Math.PI / 180);
		}
		return cosMap[input];
	}

	function atan(input) {
		if (!atanMap[input]) {
			atanMap[input] = Math.atan(input) / Math.PI * 180;
		}
		return atanMap[input];
	}

	function asin(input) {
		if (!asinMap[input]) {
			asinMap[input] = Math.asin(input) / Math.PI * 180;
		}
		return asinMap[input];
	}

	function acos(input) {
		if (!acosMap[input]) {
			acosMap[input] = Math.acos(input) / Math.PI * 180;
		}
		return acosMap[input];
	}

	function clock() {
		var timer;
		for (var id in timers) {
			if (timers.hasOwnProperty(id)) {
				timer = timers[id];

				if (timer.counter < timer.frames) {
					timer.counter += 1;
				} else {

					if (typeof timer.callback === 'function') {
						timer.callback();
					}
					if (timer.type === 'timeout') {
						delete timers[id];
					} else if (timer.type === 'interval') {
						timer.counter = 0;
					}
				}
			}
		}
	}

	function after(callback, frames) {
		return newTimer('timeout', frames, callback, false);
	}

	function every(callback, frames, startNow) {
		return newTimer('interval', frames, callback, startNow);
	}

	/**
	 * newEvent - Executes a set of action by newEvent name.
	 * @param eventName {string} The event name.
	 * @param data {object} [optional] Any data object to be passed to the actions on execution.
	 */
	function newEvent(eventName, data) {

		/**
		 * Removes the event
		 */
		function remove() {
			if (events[eventName]) {
				delete events[eventName];
			}
		}

		if (events[eventName]) {
			for (var actionId in events[eventName]) {
				if (events[eventName].hasOwnProperty(actionId) && typeof events[eventName][actionId] === "function") {
					events[eventName][actionId](data);
				}
			}
		}

		return {
			"clear": remove
		}
	}

	/**
	 * newAction - Registers a callback to be fired on the execution of a an event.
	 * @param eventName {string} Name of the event to be paired with.
	 * @param callback {function} Callback to be executed on execution of the defined event.
	 */
	function newAction(eventName, callback) {
		var actionId;

		/**
		 * Removes the action
		 */
		function remove() {
			if (events[eventName][actionId]) {
				delete events[eventName][actionId];
			}
		}

		if (typeof callback === "function") {

			//generate an action id
			actionId = idGen();

			//If the event has not been defined yet, define it.
			if (!events[eventName]) {
				events[eventName] = {};
			}

			//define the action
			events[eventName][actionId] = callback;

			return {
				"clear": remove
			}
		}

		return false;
	}

	function newTimer(type, frames, callback, startNow) {
		var id,
			counter;

		/**
		 * Removes the new timer
		 */
		function remove() {
			if (timers[id]) {
				delete timers[id];
			}
		}

		/**
		 * Changes the frame rate
		 * @param frames
		 */
		function setFrames(frames) {
			if (timers[id] && frames) {
				timers[id].frames = frames;
			}
		}

		if (type === 'interval' || type === 'timeout') {

			id = idGen();

			if (startNow) {
				counter = frames;
			} else {
				counter = 1;
			}

			timers[id] = {
				"type": type,
				"frames": frames,
				"counter": counter,
				"callback": callback
			};

			return {
				"clear": remove,
				"setFrames": setFrames
			}

		}

		return false;
	}

	/**
	 * Draws the fps
	 */
	function fpsElement() {
		if (!fpsElement) {
			fpsElement = engine.text.create('FPS ELEMENT', 'FPS: ' + realFps, 16, 0, 16);
		} else {
			fpsElement.text = 'FPS: ' + realFps;
		}
	}

	function fps() {
		return realFps;
	}

	/**
	 * Draws everything!!!
	 */
	function draw() {

		var viewports = engine.viewport.get('all'),
			viewport,
			elements,
			element,
			x,
			y,
			stack;

		//loop through each viewport
		for (var viewportName in viewports) {
			if (viewports.hasOwnProperty(viewportName)) {
				viewport = viewports[viewportName];

				//clear the stack
				stack = [];

				//empty the viewport
				viewport.context.clearRect(0, 0, viewport.width, viewport.height);

				//get the elements
				elements = engine.element.get('all');

				//order the new content
				for (var elementName in elements) {
					if (elements.hasOwnProperty(elementName)) {

						//get the element
						element = elements[elementName];

						x = element.x - viewport.x;
						y = element.y - viewport.y;

						//Make sure the element is in view
						if (
							x + element.width > 0 &&
							x < viewport.width &&
							y + element.height > 0 &&
							y < viewport.height &&
							typeof element.z === 'number'
						) {
							if (!stack[element.z]) {
								stack[element.z] = [];
							}
							stack[element.z].push(element);
						}
					}
				}

				newEvent('draw', stack);

				//draw the new content
				for (var level in stack) {
					if (stack.hasOwnProperty(level)) {
						for (var i = 0; i < stack[level].length; i += 1) {

							//get the element
							element = stack[level][i];

							//x and y
							x = element.x - viewport.x;
							y = element.y - viewport.y;

							var sprite = element.spriteSheet.sprites[element.spritePos[0]][element.spritePos[1]],
								imageData = sprite.canvas[0];

							//draw to the context
							viewport.context.drawImage(imageData, x, y);

						}
					}
				}
			}
		}
	}

	function getMousePos() {
		return mousePos;
	}

	function getMouseDown() {
		return mousedown;
	}

	function getKeyboard() {
		return keyboard;
	}

	function loopIsActive() {
		return active;
	}

	function pause() {
		newEvent('pause');
		active = false;
	}

	function resume() {
		newEvent('resume');
		active = true;
	}

	//return the core api
	return {
		"mousePosition": getMousePos,
		"mouseDown": getMouseDown,
		"keyboard": getKeyboard,
		"loopIsActive": loopIsActive,
		"pause": pause,
		"resume": resume,
		"start": resume,
		"distance": distance,
		"degree": degree,
		"vector": vector,
		"coords": coords,
		"every": every,
		"after": after,
		"event": newEvent,
		"when": newAction,
		"random": random,
		"idGen": idGen,
		"tan": tan,
		"atan": atan,
		"sin": sin,
		"asin": asin,
		"cos": cos,
		"acos": acos
	}

});