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

        var viewport = Rect(x, y, width, height);
        viewport.uid = uid;
        viewport.fillStyle = fillStyle;
        viewport.bitmap = Bitmap(width, height);
        viewports[uid] = viewport;

        var api = {
            get stage() { return getSetStage(); },
            set stage(value) { return getSetStage(value); }
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

        function getSetStage(stage) {
            if(stage != undefined) { 
                stage = viewport.stage = Stage.rawAccess(stage);
                stage.parent = viewport;
                stage.width = viewport.width;
                stage.height = viewport.height;
                stage.bitmap = viewport.bitmap;
                window.s = stage;
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

            //Composite Element with Children (and maybe a sprite)
            if(element.bitmap) {

                //if the element has been updated
                if(element.update) {
                    element.update = false;

                    // compute the visible area
                    var visibleRect = Rect(
                        -element.x,
                        -element.y,
                        element.width,
                        element.height
                    );

                    // get all children in view
                    var children = element.childIndex.get(visibleRect);

                    // add children that just left the view (clean up exiting artifacts)
                    while(element.drawData.lastDrawn[0]) {
                        var child = element.drawData.lastDrawn.shift();
                        var cI = children.length - 1;
                        while(cI > 0) {
                            cI -= 1;
                            if(children[cI].data == child.data) {
                                child = undefined;
                                break;
                            }
                        }
                        if(child) {
                            children.unshift(child);
                        }
                    }

                    // compute the area to redraw relative to the screen
                    while(children[0]) {
                        element.drawData.lastDrawn.push(children[0]);
                        var child = children[0].data;
                        var childRect = children.shift().rect;


                        // compute the relative position of the element to the view
                        childRect.x += visibleRect.x;
                        childRect.y += visibleRect.y;
                        var lastChildRect = element.drawData.children[child.uid] || childRect;

                        // save the relative position to the element so the next cycle can
                        // track changes in position.
                        element.drawData.children[child.uid] = childRect;

                        // compute redraw rectangles and add them to the draw index
                        var redrawRects = Rect.clip(lastChildRect, childRect);
                        redrawRects.unshift(childRect);
                        while(redrawRects[0]) {

                            // Prevent overlapping redraw rects by removing all overlapping
                            // rects already in the index, clip each of them, and then re-add
                            // them to the index.
                            var overlappingRects = element.drawData.index.remove(redrawRects[0]);
                            while(overlappingRects[0]) {
                                var clippedRects = Rect.clip(overlappingRects.shift().rect, redrawRects[0]);
                                while(clippedRects[0]) {
                                    element.drawData.index.insert(clippedRects.shift());
                                }
                            }

                            //insert the redraw rect
                            element.drawData.index.insert(redrawRects.shift());
                        }

                    }

                    // redraw the view in updated areas
                    var redrawRects = element.drawData.index.remove(element.drawData.index.root);
                    while(redrawRects[0]) {
                        var redrawRect = Rect.trim(redrawRects.shift().rect, element);

                        var rx = redrawRect.x - 1;
                        var ry = redrawRect.y - 1;
                        var rw = redrawRect.width + 2;
                        var rh = redrawRect.height + 2;

                        // erase the view under the redraw rect
                        element.bitmap.context.clearRect(rx, ry, rw, rh);
                        if(config.showRedrawRects) {
                            element.bitmap.context.strokeStyle = "rgba(255, 0, 0, 0.5)";
                            element.bitmap.context.strokeRect(rx, ry, rw, rh);
                        }

                        // get the absolute pos of the redraw Rect
                        // so children indexed that overlap the
                        // absolute pos can be gathered for to be
                        // redrawn
                        var absRedrawRect = Rect(
                            rx - visibleRect.x,
                            ry - visibleRect.y,
                            rw,
                            rh
                        );

                        // get all children within the redraw rect
                        // sorted so they are drawn in the correct
                        // order.
                        var children = element.childIndex.get(absRedrawRect).sort(elementIndexSort);
                        while(children[0]) {
                            var child = children.shift().data;

                            // get the child's relative rect relative to
                            // the view
                            var cx = child.x + visibleRect.x;
                            var cy = child.y + visibleRect.y;
                            var cw = child.width;
                            var ch = child.height;

                            // calculate what part of the child's bitmap
                            // to draw from.
                            // TODO: scale should be calculated by child
                            // scale vs element zoom.
                            var scale = 1;
                            var sx = (Math.max(cx, rx) - cx) / scale;
                            var sy = (Math.max(cy, ry) - cy) / scale;
                            var sw = (Math.min(cx + cw, rx + rw) - Math.max(cx, rx)) / scale;
                            var sh = (Math.min(cy + ch, ry + rh) - Math.max(cy, ry)) / scale;

                            // calculate where the source data should be
                            // drawn too
                            var dx = cx + (sx * scale);
                            var dy = cy + (sy * scale);
                            var dw = sw * scale;
                            var dh = sh * scale;

                            if(sw < 1 || sh < 1 || dw < 1 || dh < 1) { continue; }

                            element.bitmap.context.drawImage(
                                renderElement(child),
                                sx, sy, sw, sh,
                                dx, dy, dw, dh
                            );
                        }
                    }
                }

                return element.bitmap;
            }

            //Simple Element with sprite
            else if(element.sprite) {
                return element.sprite.bitmap;
            }
        }

        function elementIndexSort(elementA, elementB) {
            if(elementA.data.z > elementB.data.z) {
                return 1;
            } else if(elementA.data.z < elementB.data.z) {
                return -1;
            } else {
                if(elementA.data.drawOrder > elementB.data.drawOrder){
                    return 1;
                } else if(elementA.data.drawOrder < elementB.data.drawOrder) {
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
