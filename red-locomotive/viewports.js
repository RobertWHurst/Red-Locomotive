RedLocomotive('viewports', function(engine, options){

	var viewports = {},
		primaryViewport = false;

/**
	 * New Viewport
	 * @param viewportName
	 * @param selector
	 * @param width
	 * @param height
	 */
	function newViewport(viewportName, selector, width, height, x, y) {

		if (viewportName === 'all') {
			throw new Error('Viewport name can not be reserved word "all".');
		}

		//get the canvas
		var canvas = jQuery(selector),
			context = canvas[0].getContext('2d');

		if(context.mozImageSmoothingEnabled) {
			context.mozImageSmoothingEnabled = false;
		}

		if (viewportName && canvas[0].tagName === "CANVAS") {

			canvas[0].width = width || 800;
			canvas[0].height = height || 600;

			var viewport = {
				"node": canvas,
				"context": context,
				"x": x || 0,
				"y": y || 0,
				"width": canvas[0].width,
				"height": canvas[0].height,
				"cursor": {
					"x": 0,
					"y": 0
				}
			};
			viewports[viewportName] = viewport;

			canvas.mousemove(function (e) {

				var realWidth = canvas.width(),
					realHeight = canvas.height(),
					realX = e.pageX - canvas[0].offsetLeft,
					realY = e.pageY - canvas[0].offsetTop,
					viewportWidth = canvas[0].width,
					viewportHeight = canvas[0].height;

				viewport.cursor.x = Math.round(realX * viewportWidth / realWidth);
				viewport.cursor.y = Math.round(realY * viewportHeight / realHeight);

			});
		}



		if (!primaryViewport) {
			primaryViewport = viewports[viewportName];
		}

		engine.event('createViewport', viewports[viewportName]);
		return viewports[viewportName];
	}

	/**
	 * Retreves a viewport by name
	 * @param viewportName
	 */
	function getViewport(viewportName) {
		if (viewports[viewportName]) {
			return viewports[viewportName];
		} else if (viewportName === 'all') {
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
		if (viewports[viewportName]) {
			engine.event('removeViewport', viewports[viewportName]);
			delete viewports[viewportName];
			return true;
		}
		return false;
	}

	/**
	 * Check if a point is within a viewport
	 * @param viewport
	 * @param x
	 * @param y
	 */
	function offsetInViewport(viewport, x, y) {
		return (
			//x is in left
			(x < viewport.x) &&
			//x is in right
			(x > viewport.x + viewport.width) &&
			//y is in top
			(y < viewport.y) &&
			//y is in bottom
			(y > viewport.y + viewport.height)
		);
	}

	return {
		"viewport": {
			"create": newViewport,
			"get": getViewport,
			"remove": removeViewport,
			"containsPos": offsetInViewport
		}
	}
});