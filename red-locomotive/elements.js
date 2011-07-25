RedLocomotive("elements", function(options, engine) {

    var elements = {},
		textElements = {};

   var lastX = 0, lastY = 0;
   engine.every(function(){
       for (var key in elements) {
           if (elements.hasOwnProperty(key)) {
               if (elements[key].x > lastX) {
                   lastX = elements[key].x;
               }
               if (elements[key].y > lastY) {
                   lastY = elements[key].y;
               }
           }
       }

   });

	/**
	 * New Element - Creates a new basic element.
	 * @param elementName {string} An id for the element. If an element has the same id it will be overwritten.
	 * @param spriteUrl {string} The url to a spritesheet for the element.
	 * @param x {int} The x coordinate.
	 * @param y {int} The y coordinate.
	 * @param w {int} The element's width.
	 * @param h {int} The element's height.
	 * @param sX {int} [optional] The default sprite column
	 * @param sY {int} [optional] The default sprite row
	 */
    function newElement(elementName, spriteUrl, x, y, z, w, h, sX, sY) {
		
		if(elementName !== 'all') {
			var element = {
				"name": elementName,
				"spriteSheet": engine.spriteSheet.get(spriteUrl),
				"x": x,
				"y": y,
				"z": z,
				"width": w,
				"height": h,
				"spritePos": [sX || 0, sY || 0]
			};

			//save the element
			elements[elementName] = element;


			return element;
		}

		return false;
    }

	/**
	 * Get Element or Elements
	 * @param elementName {string} The name of the string
	 */
	function getElement(elementName) {

		if (elementName === "all") {
			return elements;
		} else if (elements[elementName]) {
			return elements[elementName];
		}

		return false;
	}

	/**
	 * Remove Element
	 * @param elementName
	 */
	function removeElement(elementName) {

		if(elementName.name){
			elementName = elementName.name;
		}

		if (elements[elementName]) {
			delete elements[elementName];
			return true;
		}

		return false
	}

	/**
	 * Takes an element and a vector, then moves the element to the vector's end point
	 * @param element
	 * @param degree
	 * @param distance
	 */
	function move(element, degree, distance) {

		var newPos = engine.coords(degree, distance);

		//find the x and y distance via sine and cosine
		element.x += newPos.x;
		element.y += newPos.y;
	}

	function keepIn(element, viewport, marginX, marginY) {

        marginX = marginX || 0;
        marginY = marginY || marginX;

		function clear() {
			bindingTimer.clear();
		}

		if(
			typeof element.x !== "undefined" ||
			typeof element.y !== "undefined" ||
			typeof element.height !== "undefined" ||
			typeof element.width !== "undefined" ||
			
			typeof viewport.x !== "undefined" ||
			typeof viewport.y !== "undefined"

		) {

			var bindingTimer = engine.every(function(){

                //figure out limits
                var viewportLimits = {
                        "top": viewport.y,
                        "bottom": viewport.y + viewport.node[0].height,
                        "left": viewport.x,
                        "right": viewport.x + viewport.node[0].width,
                        "centerX": (viewport.x + (viewport.node[0].width / 2)),
                        "centerY": (viewport.y + (viewport.node[0].height / 2))
                    },
                    elementLimits = {
                        "top": element.y - marginY,
                        "bottom": element.y + element.height + marginY,
                        "left": element.x - marginX,
                        "right": element.x + element.width + marginX,
                        "centerX": (element.x + (element.width / 2)),
                        "centerY": (element.y + (element.height / 2))
                    };

                //if element height is greater than viewport height
                if(marginX === -1 || elementLimits.bottom - elementLimits.top > viewportLimits.bottom - viewportLimits.top){
                    
                    viewport.x += elementLimits.centerX - viewportLimits.centerX;

                } else {

                    //scroll Y on limits
                    if (viewportLimits.top > elementLimits.top) {
                        //viewport.y = elementLimits.top;
                    }
                    if (viewportLimits.bottom < elementLimits.bottom) {
                        viewport.y = elementLimits.bottom
                    }
                }

                //if element width is greater than viewport width
                if(marginY === -1 || elementLimits.right - elementLimits.left > viewportLimits.right - viewportLimits.left){

                    viewport.y += elementLimits.centerY - viewportLimits.centerY;

                } else {

                    //scroll X on limits
                    if (viewportLimits.left > elementLimits.left) {
                        viewport.x = elementLimits.left
                    }
                    if (viewportLimits.right < elementLimits.right) {
                        viewport.x = elementLimits.right
                    }
                }

			});

			return {
				"clear": clear
			}

		}

		return false;
	}

	/**
	 * New Text Element
	 * @param textElementName
	 * @param text
	 * @param size
	 * @param x
	 * @param y
	 * @param w
	 */
	function newTextElement(textElementName, text, size, x, y, w) {

		if(textElementName !== 'all') {
			textElements[textElementName] = {
				"x": x,
				"y": y,
				"width": w || 0,
				"text": text || '',
				"size": size || 16,
				"font": '' || 'Arial, Helvetica'
			};
			return textElements[textElementName];
		}

		return false;
	}

	/**
	 * Get Text Element or Text Elements
	 * @param textElementName
	 */
	function getTextElement(textElementName) {

		if (textElementName === "all") {
			return textElements;
		} else if (textElements[textElementName]) {
			return textElements[textElementName];
		}

		return false;
	}

	/**
	 * Remove Text Element
	 * @param textElementName
	 */
	function removeTextElement(textElementName) {

		if (textElements[textElementName]) {
			delete textElements[textElementName];
			return true;
		}

		return false
	}

    return {
        "element": {
            "create": newElement,
            "get": getElement,
			"remove": removeElement,
			"move": move,
			"keepIn": keepIn
        },
		"text": {
			"create": newTextElement,
			"get": getTextElement,
			"remove": removeTextElement
		}
    }
});