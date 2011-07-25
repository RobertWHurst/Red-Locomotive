(function(){
	/**
	 * RED LOCOMOTIVE LOADER
	 *
	 * This script contains Red Locomotive's loader object and its boot script.
	 *
	 * !!! DO NOT TOUCH !!! If this is broken NOTHING WILL EVER WORK!
	 */

	var Engine = {},
		modules = {},
		hooks = {},
		kernel = function() {},
		options,
		state;

	/**
	 * loadScript - Load one or more scripts then fire a callback.
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
	 * @param callback {function} A function the will be executed after the module is loaded.
	 * @param inCore {boolean} If true Require will load the module from '/core/'. If false Require will load the module from '/modules/[the module name]/'.
	 */
	function require(moduleName, callback, inCore) {

		if(typeof moduleName === 'object') {
			var reqModules = moduleName,
				i = 0;

			function loadCounter () {

				if (i < reqModules.length) {
					i += 1;
				} else if (typeof callback === 'function') {
					callback();
				}

			}

			//load each module
			for(var moduleName in reqModules) {
				//load the current module
				require(moduleName, loadCounter);
			}

		} else {

			//define the module path
			var modulePath = 'red-locomotive/';

			//if not loading from the core use the modules folder
			if(!inCore) {
				modulePath = 'modules/' + moduleName + '/';
			}

			//load the module
			loadScript(modulePath + moduleName + '.js', function () {

				if (typeof modules[moduleName] === "function") {
					if(!inCore) {
						Engine[moduleName] = modules[moduleName](options, Engine);
					} else {
						Engine = jQuery.extend(true, Engine, modules[moduleName](options, Engine));
					}
				}

				if (typeof callback === "function") {
					callback();
				}
			});
		}
	}

	/**
	 * hook - Executes a set of actions by hook name.
	 * @param hookName {string} The hook name.
	 * @param data {object} [optional] Any data object to be passed to the actions on execution.
	 */
	function hook(hookName, data) {
		if( hooks[hookName] ) {
			for (var actionName in hooks[hookName]) {
				if (hooks[hookName].hasOwnProperty(actionName) && typeof hooks[hookName][actionName] === "function") {
					hooks[hookName][actionName](data);
				}
			}
		}
	}

	/**
	 * action - registers a callback to be fired on the execution of a hook by name.
	 * @param hookName {string} Name of the hook to be paired with.
	 * @param actionName {string} Name for the action. this is needed for deleting the action later.
	 * @param callback {function} Callback to be executed on execution of the defined hook.
	 */
	function action(hookName, actionName, callback, force) {
		if (typeof actionName === "string" && typeof callback === "function") {

			//If the hook has not been defined yet, define it.
			if (!hooks[hookName]) {
				hooks[hookName] = {};
			}

			//If the action already exists then kill it
			if (hooks[hookName][actionName] && force) {
				clearAction(hookName, actionName);
			}

			//define the action
			if (!hooks[hookName][actionName]) {
				hooks[hookName][actionName] = callback;
			} else {
				throw Error('Action "' + actionName + '" for hook "' + hookName + '" has already by defined.');
			}
		}
	}

	/**
	 * clearHook - Removes a hook, and all paired actions.
	 * @param hookName {string} Name of hook to clear.
	 */
	function clearHook (hookName) {
		if (hooks[hookName]) {
			delete hooks[hookName];
		}
	}

	/**
	 * clearAction - deletes an action
	 * @param hookName {string} Name of hook the action is paired to.
	 * @param actionName {string} Name action to clear with in the hook.
	 */
	function clearAction (hookName, actionName) {
		if (hooks[hookName] && hooks[hookName][actionName]) {
			delete hooks[hookName][actionName];
		}
	}

	//add require and load to red loco
	Engine = jQuery.extend(true, Engine, {
		"hook": hook,
		"action": action,
		"clearHook": clearHook,
		"clearAction": clearAction,
		//strip the 'core' flag so that the end user cannot reload core modules
		"require": function(moduleName, callback) {
			require(moduleName, callback);
		},
		"loader": {
			"loadScript": loadScript
		}
	});

	/**
	 * RedLocomotive - Creates and returns an engine, or takes a module and extends Red Locomotive
	 * @param input {object|string} A module name, or a set of options.
	 * @param callback {object} A module or the kernel script.
	 */
	function RedLocomotive(input, callback) {
		var coreModules = [
				"core",
				"audio",
				"elements",
				"sprites",
				"animations",
                "collisions"
			],
			i = 1;

		//a callback must be given
		if (typeof callback === "function") {

			//expect a module if a string is given as the first argument
			if (typeof input === "string") {
				modules[input] = callback;

			//expect an initialization if the first argument is an object
			} else if(typeof input === "object") {

				//set the engine options
				options = input;

				//set the kernel
				kernel = callback;

				//set the state
				state = 2;

				//function that executes the kernel after loading all the modules
				function count() {

					//if all the modules are loaded
					if (i >= coreModules.length) {

						//execute the kernel
						kernel(Engine);

					//if still loading some modules count and wait
					} else {
						i += 1;
					}
				}

				//loop through each of the modules and load them with require
				for (var ii = 0; ii < coreModules.length; ii += 1) {
					require(coreModules[ii], count, true);
				}
			}
		}

	}

	//globalize Red Locomotive's constructor
	window.RedLocomotive = RedLocomotive;
})();