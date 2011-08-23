(function(){
	/**
	 * RED LOCOMOTIVE LOADER
	 *
	 * This script contains Red Locomotive's loader object and its boot script.
	 *
	 * !!! DO NOT TOUCH !!! If this is broken NOTHING WILL EVER WORK!
	 */

	var engine = {},
		modules = {},
		coreModules = [
			"core",
			"canvas",
			"viewports",
			"elements",
			"sprites",
			"paths",
			"animations",
			"collisions",
			"audio"
		],
		options;

	/**
	 * loadScript - Load one or more scripts then fire a callback
	 * @param url {string} A string containing a script url.
	 * @param callback {function} [optional] A function to be executed after the requested script has been loaded.
	 */
	function loadScript(url, callback) {

		//if a single script is requested then load it
		if (typeof url === 'string') {

			//load the script via ajax
			jQuery.ajax({
				url: options.baseUrl + url || 'Red-Locomotive/',
				dataType: 'script',
				complete: function() {
					callback();
				}
			});
		}
	}

	/**
	 * require - Load a module for use
	 * @param moduleName {string} A string containing a name of a module. See README of a list of modules.
	 */
	function require(moduleName, callback, inCore) {

		//if a list of modules is given
		if(typeof moduleName === 'object') {
			var i = 1;

			function loadCounter () {

				if (i < moduleName.length) {
					i += 1;
				} else if (typeof callback === 'function') {
					callback();
				}

			}

			//load each module
			for(var ii = 0; ii < moduleName.length; ii += 1) {
				//load the current module
				require(moduleName[ii], loadCounter, inCore);
			}

		//if a single module is given
		} else {

			//define the module path
			var modulePath = inCore ? 'red-locomotive/' : 'modules/' + moduleName + '/';

			//load the module
			loadScript(modulePath + moduleName + '.js', function () {

				if (typeof modules[moduleName] === "function") {
					if(!inCore) {
						engine[moduleName] = modules[moduleName](engine, options);
					} else {
						engine = jQuery.extend(true, engine, modules[moduleName](engine, options));
					}
				}

				if (typeof callback === "function") {
					callback();
				}
			});
		}
	}

	/**
	 * RedLocomotive - Creates and returns an engine, or takes a module and extends Red Locomotive
	 * @param input {object|string} A module name, or a set of options.
	 * @param callback {object} A module or the kernel script.
	 */
	function RedLocomotive(input, callback) {

		//If a user doesn't declare any options object.
		if(typeof input === 'function' && !callback) {
			callback = input;
			input = {};
		}

		//a callback must be given
		if (typeof callback === "function") {

			/*
			DEFINING A MODULE
			 */
			//expect a module if a string is given as the first argument
			if (typeof input === "string") {
				modules[input] = callback;
			}

			/*
			EXECUTE THE SYSTEM
			 */
			//expect an initialization if the first argument is an object
			else if(typeof input === "object") {

				//set the engine options
				options = input;

				//loop through each of the core modules and load them with require
				require(coreModules, function () {

					if(options.require && options.require.length) {
						require(options.require, function(){
							callback(engine);
						});
					} else {
						callback(engine);
					}
					
				}, true);
			}
		}

	}

	//add require and load to red loco
	engine = jQuery.extend(true, engine, {
		//strip the 'core' flag so that the end user cannot reload core modules
		"require": function(moduleName, callback) {
			require(moduleName, callback);
		},
		"loadScript": loadScript
	});

	//globalize Red Locomotive's constructor
	window.RedLocomotive = RedLocomotive;
})();