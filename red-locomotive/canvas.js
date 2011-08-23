RedLocomotive('canvas', function(){

	/**
	 * newCanvas - Creates a new Red Locomotive canvas width dimensions and image data.
	 * @param width {int} The canvas width
	 * @param height {int} The canvas height
	 * @param image {object} An image or canvas object to copy from
	 * @param dX {int} The x position to draw the image data from
	 * @param dY {int} The y position to draw the image data from
	 */
	function newCanvas(width, height, image, sX, sY, sW, sH, dX, dY, dW, dH) {

		var canvasEle = jQuery('<canvas></canvas>'),
			context = canvasEle[0].getContext('2d');

		if(width) {
			canvasEle[0].width = width;
		}
		if(height) {
			canvasEle[0].height = height;
		}

		if(image) {

			sX = sX || 0;
			sY = sY || 0;
			sW = sW || image.width;
			sH = sH || image.height;

			dX = dX || 0;
			dY = dY || 0;
			dW = dW || image.width;
			dH = dH || image.height;

			context.drawImage(image, sX, sY, sW, sH, dX, dY, dW, dH);
		}

		return {
			"canvas": canvasEle,
			"context": context
		};

	}

	/**
	 * trim - Trims white space margins from a canvas
	 * @param canvas {object} A Red Locomotive canvas
	 */
	function trim(canvas) {

		var pixels = dump(canvas),
			topLeft, topRight,
			bottomLeft;

		for(var pI = 0; pI < pixels.length; pI += 1) {

			var alpha = pixels[pI][3],
				y = Math.floor(pI / canvas.canvas[0].width),
				x = pI - (canvas.canvas[0].width * y);

			//if the pixel is transparent
			if(alpha >= 255) {

				//Set the first opaque pixel as the start point
				if(!topLeft) { topLeft = [x, y]; }
				if(!topRight) { topRight = [x, y]; }
				if(!bottomLeft) { bottomLeft = [x, y]; }

				//TOP LEFT
				if(x < topLeft[0]) {
					topLeft[0] = x;
				}

				//TOP RIGHT
				if(x > topRight[0]) {
					topRight[0] = x;
				}

				//BOTTOM LEFT
				if(y > bottomLeft[1]) {
					bottomLeft[1] = y;
				}
				if(x < bottomLeft[0]) {
					bottomLeft[0] = x;
				}
			}
		}

		//get the trimmed area width and height
		var width = topRight[0] - topLeft[0],
			height = bottomLeft[1] - topLeft[1];

		//apply the trimmed data to a new canvas and return it
		return newCanvas(width, height, canvas.canvas[0], topLeft[0], topLeft[1], width, height, 0, 0, width, height);

	}

	/**
	 * slice - Chops a canvas into bits of a given size starting from the top left.
	 * @param canvas {object} A Red Locomotive canvas
	 * @param width {int} The width of each slice
	 * @param height {int} The height of each slice
	 */
	function slice(canvas, width, height) {

		//calculate the rows and columns
		var rows = Math.floor(canvas.canvas[0].width / width),
			columns = Math.floor(canvas.canvas[0].height / height),
			canvases = [];

		//get each piece
		for (var rI = 0; rI < rows; rI += 1) {
			if(!canvases[rI]) { canvases[rI] = []; }

			for (var cI = 0; cI < columns; cI += 1) {

				var x = rI * width,
					y = cI * height;

				//apply the image
				canvases[rI][cI] = newCanvas(width, height, canvas.canvas[0], x, y, width, height, 0, 0, width, height);

			}
		}

		return canvases;
	}

	/**
	 * dump - Dumps all the pixel data grouped by pixel
	 * @param canvas {object} A Red Locomotive canvas
	 */
	function dump(canvas) {
		var imageData = canvas.context.getImageData(0, 0, canvas.canvas[0].width, canvas.canvas[0].height).data,
			pixels = [];

		for(var pI = 0; pI < imageData.length; pI += 4) {

			var red = imageData[pI],
				blue = imageData[pI + 1],
				green = imageData[pI + 2],
				alpha = imageData[pI + 3],
				pixel = [red, blue, green, alpha];

			pixels.push(pixel);
		}

		return pixels;
	}

	/**
	 * isBlank - Checks to the if a Red Locomotive canvas is blank
	 * @param canvas {object} A Red Locomotive canvas
	 */
	function isBlank(canvas) {

		//trim the canvas
		canvas = trim(canvas);

		//dump the pixels
		var pixels = dump(canvas);

		//loop through the pixels looking for a translucent or opaque pixel
		for(var pI = 0; pI < pixels; pI += 1) {

			//if a translucent or opaque pixel is found return false
			if(pixels[pI][3] > 0) {
				return false;
			}
		}

		//no translucent or opaque pixels were found, return true
		return true;

	}

	return {
		"canvas": {
			"create": newCanvas,
			"trim": trim,
			"slice": slice,
			"dump": dump,
			"isBlank": isBlank
		}
	}
});