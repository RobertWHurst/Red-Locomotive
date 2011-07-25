RedLocomotive('audio', function(options, engine) {

	var sounds = {};

	function newSound(name, oggUrl, mp3Url, callback, forceNewSound) {

		var sound;

		function exec() {
			if(x < url.length - 1) {
				x += 1;
			} else if(typeof callback === "function") {
				callback();
			}
		}

		function play(callback) {
			sound.node[0].play();

			if(typeof callback === "function") {
				sound.node.end(callback);
			}
		}

		function stop() {
			sound.node[0].stop();
		}

        if(typeof url === "object") {

			callback = oggUrl;

            for (var i = 0; i < name.length; i += 1) {
                newSound(name, mp3Url[i].mp3Url, mp3Url[i].oggUrl, exec);
            }
			
        } else {
			//if the image has not been created, or we're forcing an overwrite
			if (!sounds[name] || forceNewSound) {

				//download the image
				sound = {
					"node": jQuery('<audio><source src="' + oggUrl + '" type="audio/ogg" /><source src="' + mp3Url + '" type="audio/mpeg" /></audio>'),
					"play": play,
					"stop": stop
				};

				sounds[name] = sound;

				//on ready fire the callback
				sound.node.ready(function () {
					if(typeof callback === "function") {
						callback(sound);
					}
				});

			//else fire the callback
			} else {
				if(typeof callback === "function") {
					callback(sounds[name]);
				}
			}
        }
    }

	return {
		"audio": {
			"sound": {
				"create": newSound
			}
		}
	}
});