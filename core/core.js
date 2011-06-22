RedLocomotive('core', function(options, engine){
    "use strict"

    //create configuration
    var config = jQuery.extend({
        "selector": 'canvas'
    }, options);


    //get the canvas
    var canvas = jQuery(config.selector);

    return {
        "config": config,
        "core": {}
    }

});