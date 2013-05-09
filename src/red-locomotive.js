//EXT LIBS
var Path = require('path');

//MODULES
var Core = require('./modules/core');
var Elements = require('./modules/elements');
var Stages = require('./modules/stages');
var Viewports = require('./modules/viewports');

//CONFIG
var defaults = require('./defaults.json');

//STATIC LIBS
RedLocomotive.Bitmap = require('./lib/bitmap');
RedLocomotive.Clock = require('./lib/clock');
RedLocomotive.Dispatcher = require('./lib/dispatcher');
RedLocomotive.Emitter = require('./lib/emitter');
RedLocomotive.Rect = require('./lib/rect');
RedLocomotive.QuadTree = require('./lib/quad-tree');

if(typeof window === 'object') {
    if(!window.RedLocomotive) { window.RedLocomotive = RedLocomotive; }
} else {
    module.exports = RedLocomotive;
}

function RedLocomotive(opts) {

    //CONFIG
    var config = opts && extend(defaults, opts) || defaults;

    //MODULES
    var api = {};
    api.extend = extend;
    Core(api, config);
    Elements(api, config);
    Stages(api, config);
    Viewports(api, config);

    return api

    function extend(    ) {
        var objs = Array.prototype.slice.call(arguments);
        var newObj = {};
        while(objs[0]) {
            var obj = objs.shift();
            for(var key in obj) {
                if(!obj.hasOwnProperty(key)) { continue; }
                newObj[key] = obj[key];
            }
        }
        return newObj;
    }
}