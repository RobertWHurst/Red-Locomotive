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
                viewport.stage.width = viewport.width;
                viewport.stage.height = viewport.height;
                return stage;
            } else if(viewport.stage && viewport.stage.api) {
                return viewport.stage.api;
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

            if(viewport.stage) {
                renderElement(viewport.stage, viewport, viewport.bitmap.context);
            }
        }

        function renderElement(element, parent, context) {
            if(element.sprite && element.sprite.ready) {
                var sprite = element.sprite;
                var spriteBitmap = sprite.bitmap;
                var spriteBitmapCtx = spriteBitmap.context;

                //MASK
                var padding = 0;
                var px = parent.x + padding;
                var pxx = px + parent.width - (padding * 2);
                var py = parent.y + padding;
                var pyy = py + parent.height - (padding * 2);
                var pw = parent.width - (padding * 2);
                var ph = parent.height - (padding * 2);

                //ELEMENT
                var ex = element.x;
                var exx = ex + element.width;
                var ey = element.y;
                var eyy = ey + element.height;
                var ew = element.width;
                var eh = element.height;

                //CLIPPING
                var cl = ex < px ? px - ex : 0;
                var cr = pxx < exx ? exx - pxx : 0;
                var ct = ey < py ? py - ey : 0;
                var cb = pyy < eyy ? eyy - pyy : 0;

                //SOURCE BITMAP
                var sx = cl;
                var sy = ct;
                var sw = ew - cl - cr;
                var sh = eh - ct - cb;

                //DESTINATION BITMAP
                var dx = ex + cl;
                var dy = ey + ct;
                var dw = ew - cl - cr;
                var dh = eh - ct - cb;

                if(dw > 0 && dh > 0 && sw > 0 && sh > 0) {
                    context.drawImage(
                        spriteBitmap,
                        sx, sy, sw, sh,
                        dx, dy, dw, dh
                    );
                }
            }

            if(element.childIndex) {
                var children = element.childIndex.get(element);
                while(children[0]) {
                    renderElement(children.shift(), element, context);
                }
            }
        }

        function setFillStyle(fillStyle) {
            viewport.fillStyle = fillStyle;
        }

        function resize(width, height) {
            viewport.width = viewport.bitmap.width = width;
            viewport.height = viewport.bitmap.height = height;
            if(viewport.stage) {
                viewport.stage.width = width;
                viewport.stage.height = height;
            }
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
