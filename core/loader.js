jQuery(function () {
    
    /**
     * RED LOCOMOTIVE LOADER
     * 
     * This script contain's Red Locomotive's loader object and its boot script.
     * 
     * !!! DO NOT TOUCH !!! If this is broken NOTHING WILL EVER WORK!
     */
     
     var base = 'http://cloud9ide.com/robertwhurst/red-locomotive/workspace/';
     var redLoco = {};
     window.redLoco = redLoco;
    
    /**
     * Load one or more scripts then fire a callback
     * 
     * @author <a href="mailto:robert@thinktankdesign.ca">Robert Hurst</a>
     * @param url {string|object} A string containing a single script url or an array containing multible script urls.
     * @param callback {function} [optional] A function to be executed after the requested scripts have been loaded.
     */
    function loadScript(url, callback) {
        console.log(url, typeof url);
        
        /**
         * Counts the number of loaded scripts. Once all the scripts are loaded it fires the callback
         */
        function count() {
                
            //count the script as loaded
            loaded += 1;
            
            //check to see if all the scripts have loaded
            if (loaded >= url.length && typeof callback === 'function') {
                callback();
            }
            
        }
        
        //if a single script is requested then load it
        if (typeof url === "string") {
            
            //load the script via ajax
            $.ajax({
                url: base + url,
                dataType: 'script',
                success: callback,
                error: function () {
                    throw Error('No script at ' + requestedScripts[i]);
                }
            });
        
        //if a batch of scripts is requested then self execute of each
        } else {
            
            //create a success counter
            var loaded = 0;
        
            //if multple urls are given
            for (var i = 0; i < url.length; i += 1) {
                loadScript(url[i], count);
            }
            
        }
    }
    
    /**
     * Load a module for use
     * 
     * @author <a href="mailto:robert@thinktankdesign.ca">Robert Hurst</a>
     * @param moduleName {string} A string containing a name of a module. See README of a list of modules.
     */
    function require(moduleName, callback, inCore) {
        
        //define the module path
        var modulePath = 'core/';
        
        //if not loading from the core use the modules folder
        if(!inCore) {
            modulePath = 'modules/' + moduleName + '/';
        }
        
        function loadModule () {
            if(typeof redLoco[moduleName].init === 'function') {
                redLoco[moduleName].init();
            }
            if(typeof callback === 'function') {
                callback();
            }
        }
        
        //load the module
        loadScript(modulePath + moduleName + '.js', loadModule);
        
    }
    
    //add require and load to red loco
    redLoco.loadScript = loadScript;
    redLoco.require = require;
    
    //execute
    require('core', false, true);
    
});