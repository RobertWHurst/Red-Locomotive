RedLocomotive('sprites', function(options, engine){
    "use strict"

    var sprites = {},
        images = {},
        canvas = jQuery('<canvas></canvas>'),
        canvasContext = canvas[0].getContext('2d');

    /**
     * newSpriteSheet - Makes a new sprite sheet for use with elements
	 * @param url {string} The url to the sprite sheet image
     * @param w {int} The sprite width
     * @param h {int} The sprite height
     * @param skipPixelMap {boolean} [optional] If true, A pixel map will not be created. Defaults to false
     */
    function newSpriteSheet(url, w, h, skipPixelMap, callback) {

		var x = 0;

		function exec() {
			if(x < url.length - 1) {
				x += 1;
			} else if(typeof callback === "function") {
				callback();
			}
		}

        if(typeof url === "object") {
            callback = w;

            for (var i = 0; i < url.length; i += 1) {
                newSpriteSheet(url[i].url || '', url[i].spriteWidth || 0, url[i].spriteHeight || 0, url[i].skipPixelMap || false, exec);
            }
        } else {
			sprites[url] = {
				"spriteWidth": w,
				"spriteHeight": h,
				"imageData": [],
				"skipPixelMap": skipPixelMap,
				"image": false
			};
			updateSpriteSheet(url, callback);
        }
    }

    /**
     * getImage - Downloads the image and caches it, if its already cached then use the cached version
	 * @param url {string} The url to the sprite sheet image
     * @param callback {function} [optional] A function that will fire when the image has been fully downloaded
     * @param forceNewImage {boolean} [optional] If true, the image will download whether its cached or not. Though not recommended this can be used to update the spriteSheet revision already in memory.
     */
    function loadImage(url, callback, forceNewImage) {

        //if the image has not been created, or we're forcing an overwrite
        if (!images[url] || forceNewImage) {

            //download the image
            images[url] = jQuery('<img src="' + url + '" alt="">');

            //on ready fire the callback
            images[url].ready(function () {
                callback(images[url]);
            });

        //else fire the callback
        } else {
            callback(images[url]);
        }
    }

    /**
     * updateSpriteSheet - Used by newSpriteSheet() to make an pixel map of a sprite. It is a separate function because it is possible to prevent newSpriteSheet() from calling updateSpriteSheet(). Separating the two functions allows manual mapping later.
     * @param url {string} The url to the sprite sheet image
     * @param callback {function} [optional] A callback function to be fired after the sprite has been created
     */
    function updateSpriteSheet(url, callback) {

        //reference the sprite data
        var spriteSheet = sprites[url];

        //create an image
        loadImage(url, function (image) {

			//save the image
			spriteSheet.image = image;

            //get the image data
            if (!spriteSheet.skipPixelMap) {

                //collect vars
                var imageWidth = image[0].width,
                    imageHeight = image[0].height,
                    columns = Math.floor(imageWidth / spriteSheet.spriteWidth),
                    rows = Math.floor(imageHeight / spriteSheet.spriteHeight),
                    pixelData = spriteSheet.imageData,
                    spritePixelData = false;
					
				//size the canvas to the image
				canvas.width(imageWidth).height(imageHeight);

				//blit the image on to the canvas
				canvasContext.drawImage(image[0], 0, 0, imageWidth, imageHeight);

				//loop each sprite column
				for (var c = 0; c < columns; c += 1) {

					//if the pixel data column does not exist then create it
					if (!pixelData[c]) { pixelData[c] = []; }

					//loop through each sprite row
					for (var r = 0; r < rows; r += 1) {

						//if the pixel data row does not exist then create it
						if (!pixelData[c][r]) { pixelData[c][r] = []; }

						//get the pixel data
						// top left coods, bottom right coords
						spritePixelData = canvasContext.getImageData(c * spriteSheet.spriteWidth, r * spriteSheet.spriteHeight, spriteSheet.spriteWidth, spriteSheet.spriteHeight).data;

						//extract each pixel
						for (var prgb = 0; prgb < spritePixelData.length; prgb += 4) {
							var p = prgb / 4,
								pr = Math.floor(p / spriteSheet.spriteWidth),
								pc = p - Math.floor(imageWidth * pr);

							//if the pixel data row does not exist then create it
							if (!pixelData[c][r][pc]) { pixelData[c][r][pc] = []; }

							//create the pixel slot for the rgba data
							pixelData[c][r][pc][pr] = [spritePixelData[prgb], spritePixelData[prgb + 1], spritePixelData[prgb + 2], spritePixelData[prgb + 3]];
						}
					}
                }

            } else {
                spriteSheet.imageData = false;
            }

            if  (typeof callback === "function") {
                callback();
            }
        }, false);
    }

    /**
     * removeImage - Removes an image from the cache
	 * @param url {string} The image url
     */
    function removeImage(url) {
        delete images[url];
    }

    /**
     * removeSpriteSheet - Removes a sprite sheet and its corresponding image
	 * @param url {string} The sprite url
     */
    function removeSpriteSheet(url) {
        delete sprites[url];
        delete images[url];
    }

    /**
     * getSpriteSheet - returns a sprite sheet data object by url
     * @param url
     */
    function getSpriteSheet(url) {
        return sprites[url];
    }

    //return the module api
    return {
        "spriteSheet": {
            "get": getSpriteSheet,
            "create": newSpriteSheet,
            "update": updateSpriteSheet,
            "clear": removeSpriteSheet
        },
        "image": {
            "load": loadImage,
            "clear": removeImage
        }
    }
});
