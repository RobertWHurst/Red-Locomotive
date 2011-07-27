RedLocomotive('core', function(engine, options) {
	"use strict"

	//create configuration
	var config = jQuery.extend({
		"fps": 30,
		"showFPS": false,
		"pauseOnBlur": true
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
		active = true,
		primaryViewport = false,
		frameCount = 0,
		realFps = '?',
		viewports = {},
		timers = {},
		fpsElement,
		tanMap = {},
		sinMap = {},
		cosMap = {},
		atanMap = {},
		asinMap = {},
		acosMap = {};

	//core loop
	setInterval(function () {

		if(!active) {
			return true;
		}

		draw();
		clock();

		engine.hook('core-loop');

		frameCount += 1;
		
	}, Math.round(1000 / config.fps));

	//core secondary loop
	setInterval(function () {

		if(!active) { return true; }

		fps();
		
		engine.hook('core-sec-loop');

		realFps = frameCount;
		frameCount = 0;

	}, 1000);

	//events
	(function events() {
		var depressedKeyCodes = [];

		//mouse position
		jQuery(document).mousemove(function (e) {
			mousePos = [e.pageX, e.pageY];
			engine.hook('mousemove', e);
		});
		//mouse down
		jQuery(document).mousedown(function (e) {
			mousedown = [true, e.pageX, e.pageY];
			engine.hook('mousedown', e);
			if(!active) {
				active = true;
			}
		});
		//mouse up
		jQuery(document).mouseup(function (e) {
			mousedown = [false, e.pageX, e.pageY];
			engine.hook('mouseup', e);
		});
		//window focus
		jQuery(window).focus(function (e) {
			if (config.pauseOnBlur) {
				active = true;
			}
			engine.hook('active', e);
		});
		//window blur
		jQuery(window).blur(function (e) {
			if (config.pauseOnBlur) {
				active = false;
			}
			engine.hook('inactive', e);
		});

		jQuery(window).keydown(function(e){
            var fired = false;
			if(e.keyCode === 38 && !depressedKeyCodes[38]) { keyboard.axisCode += 1; depressedKeyCodes[38] = true; fired = true; }
			if(e.keyCode === 39 && !depressedKeyCodes[39]) { keyboard.axisCode += 10; depressedKeyCodes[39] = true; fired = true; }
			if(e.keyCode === 40 && !depressedKeyCodes[40]) { keyboard.axisCode += 100; depressedKeyCodes[40] = true; fired = true; }
			if(e.keyCode === 37 && !depressedKeyCodes[37]) { keyboard.axisCode += 1000; depressedKeyCodes[37] = true; fired = true; }
			if(e.keyCode === 27) { keyboard.esc = true; fired = true; }
			if(e.keyCode === 13) { keyboard.enter = true; fired = true; }
			if (fired) {
				engine.hook('keydown', e);
				return false;
			}
		});

		jQuery(window).keyup(function(e){
            var fired = false;
			if(e.keyCode === 38) { keyboard.axisCode -= 1; depressedKeyCodes[38] = false; fired = true; }
			if(e.keyCode === 39) { keyboard.axisCode -= 10; depressedKeyCodes[39] = false; fired = true; }
			if(e.keyCode === 40) { keyboard.axisCode -= 100; depressedKeyCodes[40] = false; fired = true; }
			if(e.keyCode === 37) { keyboard.axisCode -= 1000; depressedKeyCodes[37] = false; fired = true; }
			if(e.keyCode === 27) { keyboard.esc = false; fired = true; }
			if(e.keyCode === 13) { keyboard.enter = false; fired = true; }
			if (fired) {
				engine.hook('keyup', e);
				return false;
			}
		});
	})();

	function random(multi) {
		return Math.floor(Math.random() * (multi || 100)) || 0;
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
		return Math.sqrt(Math.pow(yDistance, 2) + Math.pow(xDistance, 2));

	}
	
	/**
	 * Returns angle of an x and y offset.
	 * @param xDistance
	 * @param yDistance
	 */
	function angle(xDistance, yDistance) {

		var quad;

		if (xDistance < 0) {
			if (yDistance < 0) {
				quad = 3;
			} else {
				quad = 0;
			}
		}
		if (yDistance < 0) {
			if (xDistance < 0) {
				quad = 2;
			} else {
				quad = 1;
			}
		}

		//use arc tangent to find the angle of ascent.
		return Math.round(engine.atan(yDistance / xDistance)) + (90 * quad);
	}

	/**
	 * Returns the end coordinates of a vector.
	 * @param degree
	 * @param distance
	 */
	function coords(degree, distance) {

		//throw an error if greater than 360 or less than 0
		if(degree >= 360) {
            degree /=  Math.floor(degree / 360);
		} else if(degree < 0) {
            degree *=  Math.floor(-degree / 360);
		}

		var quad = Math.floor(degree / 90);
		degree -= 90 * quad;

        var x, y;

        distance = Math.round(distance);

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

        return {"x": x, "y": y};
	}

	function trigGen(callback) {
		var angle = 0;
		var trigGenTimer = engine.every(function () {

			atan(tan(angle)); asin(sin(angle)); acos(cos(angle));

			if(angle < 90){
				angle += 1;
			} else {
				trigGenTimer.clear();
				if(typeof callback === "function") {
					callback();
				}
			}
			
		});
	}

	function tan(input) {
		if(!tanMap[input]){
			tanMap[input] = Math.tan(input * Math.PI/180);
		}
		return tanMap[input];
	}

	function sin(input) {
		if(!sinMap[input]){ sinMap[input] = Math.sin(input * Math.PI/180); }
		return sinMap[input];
	}

	function cos(input) {
		if(!cosMap[input]){ cosMap[input] = Math.cos(input * Math.PI/180); }
		return cosMap[input];
	}

	function atan(input) {
		if(!atanMap[input]){ atanMap[input] = Math.atan(input * Math.PI/180); }
		return atanMap[input];
	}

	function asin(input) {
		if(!asinMap[input]){ asinMap[input] = Math.asin(input * Math.PI/180); }
		return asinMap[input];
	}

	function acos(input) {
		if(!acosMap[input]){ acosMap[input] = Math.acos(input * Math.PI/180); }
		return acosMap[input];
	}

	function clock() {
		var timer;
		for (var id in timers) {
			if (timers.hasOwnProperty(id)) {
				timer = timers[id];

				if (timer.counter < timer.frames - 1) {
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

	function after(callback, frames, startNow) {
		return newTimer('timeout', frames, callback, startNow);
	}

	function every(callback, frames, startNow) {
		return newTimer('interval', frames, callback, startNow);
	}

	function newTimer(type, frames, callback, startNow) {
		var id,
			counter;

		/**
		 * Removes the new timer
		 */
		function remove() {
			if(timers[id]) {
				delete timers[id];
			}
		}

		/**
		 * Changes the frame rate
		 * @param frames
		 */
		function setFrames(frames) {
			if(timers[id] && frames) {
				timers[id].frames = frames;
			}
		}

		if (type === 'interval' || type === 'timeout') {

			id = idGen();

			if (startNow) {
				counter = frames;
			} else {
				counter = 0;
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
	function fps() {
		if (options.showFPS && engine.text) {
			if (!fpsElement) {
				fpsElement = engine.text.create('FPS ELEMENT', 'FPS: ' + realFps, 16, 0, 16);
			} else {
				fpsElement.text = 'FPS: ' + realFps;
			}
		}
	}

	/**
	 * New Viewport
	 * @param viewportName
	 * @param selector
	 * @param width
	 * @param height
	 */
	function newViewport(viewportName, selector, width, height) {

		if(viewportName === 'all'){
			throw new Error('Viewport name can not be reserved word "all".');
		}

		//get the canvas
		var canvas = jQuery(selector),
			context = canvas[0].getContext('2d');

		if (!width && !height) {
			canvas[0].width = canvas.width();
			canvas[0].height = canvas.height();
		} else {
			if (width) {
				canvas[0].width = width;
			}
			if (height) {
				canvas[0].height = height;
			}
		}

		if(viewportName && canvas[0].tagName === "CANVAS"){
			viewports[viewportName] = {
				"node": canvas,
				"context": context,
				"x": 0,
				"y": 0
			};
		}

		if(!primaryViewport) {
			primaryViewport = viewports[viewportName];
		}

		return viewports[viewportName];
	}

	function getViewport(viewportName){
		if(viewports[viewportName]) {
			return viewports[viewportName];
		} else if(viewportName === 'all') {
			return viewports;
		} else {
			return false;
		}
	}

	/**
	 * Remove Viewport
	 * @param viewportName
	 */
	function removeViewport(viewportName) {
		if(viewports[viewportName]){
			delete viewports[viewportName];
			return true;
		}
		return false;
	}

	function offsetInViewport(viewport, x, y) {
		return (
			//x is in left
			(x < viewport.x) &&
			//x is in right
			(x > viewport.x + viewport.node[0].width) &&
			//y is in top
			(y < viewport.y) &&
			//y is in bottom
			(y > viewport.y + viewport.node[0].height)
		);
	}

	/**
	 * Draws everything!!!
	 */
	function draw() {

		var viewport,
			height,
			width;

		//loop through each viewport
		for (var viewportName in viewports) {
			if (viewports.hasOwnProperty(viewportName)) {
				viewport = viewports[viewportName];

				//get the viewport height and width
				width = viewport.node[0].width;
				height = viewport.node[0].height;

				//empty the viewport
				viewport.context.clearRect(0, 0, width, height);

				//draw elements
				drawElements(viewport);

				//draw text elements
				drawTextElements(viewport);
			}
		}
	}

	/**
	 * Draws all elements
	 * @param viewport
	 */
	function drawElements(viewport) {
		var elements,
			element,
			image,
            x,
            y,
			sW,
			sH,
			cP,
			sX,
			sY,
			dW,
			dH,
			dX,
			dY,
			stack = [];

		//get the elements
		elements = engine.element.get('all');

		//order the new content
		for (var elementName in elements) {
			if (elements.hasOwnProperty(elementName) ) {

				//get the element
				element = elements[elementName];

				//check to make sure its a valid element
				if (element.spriteSheet) {

					x = element.x - viewport.x;
					y = element.y - viewport.y;

					//Make sure the element is in view
					if(
						x + element.width > 0 &&
						x < viewport.node[0].width &&
						y + element.height > 0 &&
						y < viewport.node[0].height
					) {

                        if (!stack[element.z]) {
                            stack[element.z] = [];
                        }
                        stack[element.z].push(element);

                    }
				}

			}
		}

		//draw the new content
		for (var level in stack) {
			if (stack.hasOwnProperty(level)) {
				for (var i = 0; i < stack[level].length; i += 1) {

					//get the element
					element = stack[level][i];

                    //abstract some data
                    image = element.spriteSheet.image;
                    sW = element.spriteSheet.spriteWidth;
                    sH = element.spriteSheet.spriteHeight;

                    cP = element.spritePos;
                    sX = Math.floor(cP[0] * sW);
                    sY = Math.floor(cP[1] * sH);

					dX = element.x - viewport.x;
					dY = element.y - viewport.y;
                    dW = element.spriteSheet.spriteWidth;
                    dH = element.spriteSheet.spriteHeight;

                    //draw the sprite on to the
                    viewport.context.drawImage(image[0], sX, sY, sW, sH, dX, dY, dW, dH);
				}
			}
		}
	}

	/**
	 * Draws all text elements
	 * @param viewport {object}
	 */
	function drawTextElements(viewport) {
		var textElements,
			textElement,
			font,
			fontString,
			size,
			text,
			x,
			y,
			w;

		//get the elements
		textElements = engine.text.get('all');

		//draw the new content
		for (var elementName in textElements) {
			if (textElements.hasOwnProperty(elementName) ) {

				//get the element
				textElement = textElements[elementName];

				if (textElement.text && textElement.size && textElement.font) {

					//abstract some data
					font = textElement.font;
					size = textElement.size;
					text = textElement.text;
					x = textElement.x;
					y = textElement.y;
					w = textElement.width || false;

					//set the font
					fontString = size + 'px ' + font;

					viewport.context.font = fontString;
					viewport.context.fillText(text, x, y, w);

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
		active = false;
	}

	function resume() {
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
		"viewport": {
			"create": newViewport,
			"get": getViewport,
			"remove": removeViewport,
			"offsetInViewport": offsetInViewport
		},
		"distance": distance,
		"angle": angle,
		"coords": coords,
		"every": every,
		"after": after,
		"random": random,
		"idGen": idGen
	}

});