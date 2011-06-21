RedLocomotive('core', function(){
    "use strict"

    /**
     * Core - All event handling and environment management
     * @class Core
     */
    function Core() {

        var defaults = {
            'fps': 30,
            'canvasSelector': 'canvas',
            'debug': true
        },
            config = false,
            canvas = '';


        /**
         * Init - Sets the config once.
         * @param options {object} An object containing all desired options. See the README for defaults.
         */
        function init(options) {

            alert('hello');

            //set the config up
            if (!config) {
                config = jQuery.extend(defaults, options);
            }

            //get the canvas
            canvas = jQuery(config.canvasSelector);

        }

        return {
            'init': init,
            'canvas': canvas
        }
    }

    //setup the core
    return Core();
    
});