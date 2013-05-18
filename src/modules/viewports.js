var Bitmap = require('../lib/bitmap');
var Clock = require('../lib/clock');
var Rect = require('../lib/rect');
var QuadTree = require('../lib/quad-tree');
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


        var clock = Clock('r', 1);
        clock.onTick = render;

        var redrawIndex = QuadTree();

        var viewport = Rect(x, y, width, height);
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
                viewport.stage.parent = viewport;
                viewport.stage.bitmap.width = viewport.width;
                viewport.stage.bitmap.height = viewport.height;
                viewport.stage.bitmap = viewport.bitmap;
                return stage;
            } else if(viewport.stage && viewport.stage.api) {
                return viewport.stage.api;
            }
        }

        function render() {
            if(visible && viewport.stage) {
                renderElement(viewport.stage);
            }
        }

        function renderElement(element) {

            //return sprite bitmap
            if(!element.bitmap) {
                if(element.sprite && element.sprite.ready) {
                    return element.sprite.bitmap;
                }
            } 

            //return composited bitmap
            else {

                //redraw if nessisary
                if(element.redraw) {


                    //COMPUTE MODIFIED SCREEN AREA

                    //add any redraw rects owned by the current element
                    if(element.redrawRect) {
                        redrawIndex.insert(element.redrawRect);
                        element.redrawRect = undefined;
                    }

                    //get the elements within the element
                    var children = element.childIndex.get(element.parent);
                    while(children[0]) {
                        var child = children.shift().data;
                        var rect = child.redrawRect;
                        child.redrawRect = undefined;
                        if(rect) {
                            var overlapingRects = redrawIndex.get(rect);
                            while(overlapingRects[0]) {
                                var rect = Rect.merge(overlapingRects.shift().rect, rect);
                            }
                            redrawIndex.insert(rect);
                        }
                    }


                    //REDRAW MODIFIED AREA

                    //get the areas for redraw
                    var redrawRects = redrawIndex.remove(redrawIndex.root);
                    while(redrawRects[0]) {
                        //var redrawRect = Rect.trim(redrawRects.shift().rect, element.parent);
                        var redrawRect = redrawRects.shift().rect;
                        if(redrawRect.width < 1 || redrawRect.height < 1) { continue; }

                        //clear the redraw area
                        element.bitmap.context.clearRect(
                            redrawRect.x|0,     redrawRect.y|0,
                            redrawRect.width|0, redrawRect.height|0
                        );

                        //redraw the current redrawRect
                        var children = element.childIndex.get(redrawRect).sort(elementSort);
                        while(children[0]) {
                            var child = children.shift().data;

                            //MASK
                            var pw = redrawRect.width;
                            var ph = redrawRect.height;
                            var px = redrawRect.x;
                            var py = redrawRect.y;
                            var pxx = px + pw;
                            var pyy = py + ph;

                            //ELEMENT
                            var z = 2;
                            var ew = child.width;
                            var eh = child.height;
                            var ex = child.x;
                            var ey = child.y;
                            var exx = ex + ew;
                            var eyy = ey + eh;

                            //CLIPPING
                            var cl = ex < px ? px - ex : 0;
                            var ct = ey < py ? py - ey : 0;
                            var cr = pxx < exx ? exx - pxx : 0;
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

                            //draw the child to the bitmap
                            if(dw > 0 && dh > 0 && sw > 0 && sh > 0) {
                                element.bitmap.context.drawImage(
                                    renderElement(child),
                                    sx|0, sy|0, 
                                    sw|0, sh|0,
                                    dx|0, dy|0,
                                    dw|0, dh|0
                                );
                            }
                        }

                        if(config.showRedrawRects) {
                            element.bitmap.context.strokeStyle = '#f00';
                            element.bitmap.context.strokeRect(
                                redrawRect.x|0, redrawRect.y|0,
                                redrawRect.width|0, redrawRect.height|0
                            );
                        }
                    }
                }

                return element.bitmap;
            }
        }

        function elementSort(elementA, elementB) {
            if(elementA.z > elementB.z) {
                return 1;
            } else if(elementA.z < elementB.z) {
                return -1;
            } else {
                if(elementA.drawOrder > elementB.drawOrder){
                    return 1;
                } else if(elementA.drawOrder < elementB.drawOrder) {
                    return -1;
                } else {
                    return 0;
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
                viewport.stage.bitmap.width = width;
                viewport.stage.bitmap.height = height;
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
