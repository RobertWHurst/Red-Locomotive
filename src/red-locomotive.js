
if(typeof define == 'function' && define.amd) {
    define(RL);
} else if(typeof window == 'object') {
    RL._namespaces = [];
    RL._namespaceBackups = [];
    RL.noConflict = noConflict;
    RL.noConflict('RL', 'RedLocomotive');
} else {
    module.exports = RL;
}

var Emitter = require('./lib/emitter');

var t = require('./lib/tools');

function RL(opts) {
    Emitter.call(this);

    this.config = t.extend(require('./defaults.json'), opts);

    require('./modules/core')(this);
    require('./modules/sprites')(this);
    require('./modules/elements')(this);
    require('./modules/stages')(this);
    require('./modules/viewports')(this);
}

t(RL);
RL.Emitter = Emitter;
RL.Bitmap = require('./lib/bitmap');
RL.Clock = require('./lib/clock');
RL.Dispatcher = require('./lib/dispatcher');
RL.Point = require('./lib/point');
RL.QuadTree = require('./lib/quad-tree');
RL.Quad = require('./lib/quad');
RL.Rect = require('./lib/rect');
RL.UidRegistry = require('./lib/uid-registry');
RL.Vector = require('./lib/vector');
RL.Grid = require('./lib/grid');
RL.IsoGrid = require('./lib/iso-grid');

RL.prototype = Object.create(RL.Emitter.prototype);
RL.prototype.constructor = RL;

// NOTE: This method is only attached if the
// engine is included in a browser with a script
// tag. This is why the no conflict is not simply
// added to the class as a static method here.
function noConflict(   ) {
    newNamespaces = Array.prototype.slice.call(arguments);
    while(this._namespaces[0]) {
        var namespace = this._namespaces.shift();
        window[namespace] = this._namespaceBackups[namespace];
    }
    while(newNamespaces[0]) {
        var namespace = newNamespaces.shift();
        this._namespaceBackups[namespace] = window[namespace];
        window[namespace] = RL;
    }
};
