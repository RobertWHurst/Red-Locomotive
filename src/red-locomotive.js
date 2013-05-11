//EXT LIBS
var Path = require('path');

//MODULES
var Core = require('./modules/core');
var Elements = require('./modules/elements');
var Sprites = require('./modules/sprites');
var Stages = require('./modules/stages');
var Viewports = require('./modules/viewports');

//CONFIG
var defaults = require('./defaults.json');

//STATIC LIBS
RedLocomotive.Bitmap = require('./lib/bitmap');
RedLocomotive.Clock = require('./lib/clock');
RedLocomotive.Dispatcher = require('./lib/dispatcher');
RedLocomotive.Emitter = require('./lib/emitter');
RedLocomotive.Point = require('./lib/point');
RedLocomotive.QuadTree = require('./lib/quad-tree');
RedLocomotive.Quad = require('./lib/quad');
RedLocomotive.Rect = require('./lib/rect');
RedLocomotive.UidRegistry = require('./lib/uid-registry');
RedLocomotive.Vector = require('./lib/vector');

//TOOLING FUNCTIONS
var t = require('./lib/tools');
t(RedLocomotive);

if(typeof define == 'function' && define.amd) {
    define(RedLocomotive);
} else if(typeof window == 'object') {
    if(!window.RedLocomotive) { window.RedLocomotive = RedLocomotive; }
} else {
    module.exports = RedLocomotive;
}

function RedLocomotive(opts) {

    //CONFIG
    var config = opts && t.extend(defaults, opts) || defaults;

    //MODULES
    var api = {};
    Core(api, config);
    Elements(api, config);
    Sprites(api, config);
    Stages(api, config);
    Viewports(api, config);

    return api
}
