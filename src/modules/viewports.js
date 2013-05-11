var Bitmap = require('../lib/bitmap');
var Clock = require('../lib/clock');
var Rect = require('../lib/rect');
var UidRegistry = require('../lib/uid-registry');
var t = require('../lib/tools');

module.exports = Viewports;

function Viewports(engine, config){
    var ViewportUid = UidRegistry();
    var viewports = {};
    var visible = true;

    var Stage = engine.Stage;

    engine.Viewport = Viewport;

    if(typeof window == 'object') {
        window.addEventListener('focus', function() { visible = true; });
        window.addEventListener('blur', function() { visible = false; });
    }

    function Viewport(id, x, y, width, height, fillStyle, fps) {
        var uid = ViewportUid(id);

        if(height == undefined) {
            fillStyle = width;
            width = x;
            height = y;
            x = undefined;
            y = undefined;
        }

        var viewport = Rect(x, y, width, height);

        var clock = Clock(fps || 60);
        clock.onTick = render;
        clock.start();

        viewport.uid = uid;
        viewport.fillStyle = fillStyle;
        viewport.bitmap = Bitmap(width, height);

        viewports[uid] = viewport;

        var api = {
            get stage() { return stage(); },
            set stage(value) { return stage(value); }
        };
        api.uid = uid;
        api.element = viewport.bitmap;
        api.fillStyle = setFillStyle;
        api.resize = resize;
        api.clear = clear;
        api.element = viewport.bitmap;
        api.start = clock.start;
        api.stop = clock.stop;

        return api;

        function stage(stage) {
            if(stage != undefined) { 
                viewport.stage = Stage.rawAccess(stage);
                return stage;
            } else if(viewport.stage && viewport.stage.api) {
                return viewport.stage.api;
            } else {
                return viewport.stage;
            }
        }

        function render() {
            if(!visible) { return; }

            var bitmap = viewport.bitmap;
            var bitmapCtx = bitmap.context;

            if(viewport.fillStyle) {
                if(bitmapCtx.fillStyle != viewport.fillStyle) { bitmapCtx.fillStyle = viewport.fillStyle; }
                bitmapCtx.fillRect(viewport.x, viewport.y, viewport.width, viewport.height);
            } else {
                bitmapCtx.clearRect(viewport.x, viewport.y, viewport.width, viewport.height);
            }

            if(viewport.stage) { renderStage(); }
        }

        function renderStage() {
            var bitmap = viewport.bitmap;
            var bitmapCtx = bitmap.context;

            var elements = viewport.stage.index.get(viewport);

            while(elements[0]) {
                var element = elements.shift();
                var sprite = element.sprite;
                var spriteBitmap = sprite.bitmap;
                var spriteBitmapCtx = bitmap.context;
                bitmapCtx.drawImage(
                    spriteBitmap,
                    0,
                    0,
                    t.round(element.width),
                    t.round(element.height),
                    t.round(element.x),
                    t.round(element.y),
                    t.round(element.width),
                    t.round(element.height)
                );
            }
        }

        function setFillStyle(fillStyle) {
            viewport.fillStyle = fillStyle;
        }

        function resize(width, height) {
            viewport.width = viewport.bitmap.width = width;
            viewport.height = viewport.bitmap.height = height;
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
}
