RedLocomotive('sprites', function(engine, options) {
    "use strict"

    var spriteSheets = {};

    /**
     * newSpriteSheet - Makes a new sprite sheet for use with elements
	 * @param url {string} The url to the sprite sheet image
     * @param width {int} The sprite width
     * @param height {int} The sprite height
     * @param callback {boolean} [optional] a callback to fire once the spritesheet is ready
     */
    function newSpriteSheet(name, url, width, height, callback) {

	    var ii = 0,
			sS = [];
	    
		function exec(spriteSheet) {
			
			sS.push(spriteSheet);

			if(ii < name.length - 1) {
				ii += 1;
			} else if(typeof callback === "function") {
				callback(sS);
			}
		}

        if(typeof name === "object") {
            callback = url;

            for (var i = 0; i < name.length; i += 1) {
                newSpriteSheet(name[i][0], name[i][1], name[i][2], name[i][3], exec);
            }
	        
        } else {

	        loadImage(url, function(image) {

		        var canvas = engine.canvas.create(image[0].width, image[0].height, image[0]),
		            sprites = engine.canvas.slice(canvas, width, height),
					spriteSheet = {
						"canvas": canvas,
						"sprites": sprites
					};

		        spriteSheets[name] = spriteSheet;

				if(typeof callback === 'function') {
					callback(spriteSheet);
				}
	        });
        }
    }

    /**
     * getImage - Downloads the image and caches it, if its already cached then use the cached version
	 * @param url {string} The url to the sprite sheet image
     * @param callback {function} [optional] A function that will fire when the image has been fully downloaded
     */
    function loadImage(url, callback) {

        //download the image
        var image = jQuery('<img src="' + url + '">');

        //on ready fire the callback
        image.load(function () {
	        if(typeof callback === 'function') {
                callback(image);
	        }
        });
    }

    /**
     * removeSpriteSheet - Removes a sprite sheet and its corresponding image
	 * @param name {string} The sprite name
     */
    function removeSpriteSheet(name) {
        delete spriteSheets[name];
    }

    /**
     * getSpriteSheet - returns a sprite sheet data object by url
     * @param name
     */
    function getSpriteSheet(name) {
        return spriteSheets[name];
    }

    //return the module api
    return {
        "spriteSheet": {
            "create": newSpriteSheet,
            "get": getSpriteSheet,
            "remove": removeSpriteSheet
        }
    }
});
