var Bitmap = require('../lib/bitmap');
var Clock = require('../lib/clock');
var Rect = require('../lib/rect');
var UidRegistry = require('../lib/uid-registry');

module.exports = Viewports;

function Viewports(engine, config){
    var ViewportUid = UidRegistry();

    var viewports = {};

    engine.Viewport = Viewport;

    function Viewport(id, x, y, width, height, fillStyle) {
        var uid = ViewportUid(id);

        if(height == undefined) {
            fillStyle = width;
            width = x;
            height = y;
            x = undefined;
            y = undefined;
        }

        var viewport = Rect(x, y, width, height);

        var clock = Clock(60);
        clock.onTick = render;

        viewport.uid = uid;
        viewport.fillStyle = fillStyle;
        viewport.bitmap = Bitmap(width, height);

        viewports[uid] = viewport;

        var api = {};
        api.uid = uid;
        api.stage = setStage;
        api.fillStyle = setFillStyle;
        api.resize = resize;
        api.clear = clear;
        api.element = viewport.bitmap;
        api.start = clock.start;
        api.stop = clock.stop;

        return api;

        function setStage(stage) {
            if(!stage) { delete viewport.stage; }
            else { viewport.stage = stage; }
        }

        function setFillStyle(fillStyle) {
            viewport.fillStyle = fillStyle;
        }

        function resize(width, height) {
            viewport.width = width;
            viewport.height = height;
        }

        function clear() {
            viewport.clock.stop();
            if(viewport.bitmap.parent) {
                viewport.bitmap.parent.removeChild(viewport.bitmap);
            }
            viewports[uid];
            ViewportUid.clear(uid);
        }
    }
};
