var Bitmap = require('../lib/bitmap');
var Clock = require('../lib/clock');
var Rect = require('../lib/rect');
var QuadTree = require('../lib/quad-tree');
var UidRegistry = require('../lib/uid-registry');
var t = require('../lib/tools');

module.exports = Viewports;

function Viewports(engine){
    var ViewportUid = new UidRegistry();

    var Stage = engine.Stage;

    engine.Viewport = Viewport;

    function Viewport(id, x, y, width, height, fillStyle, fps) {
        Rect.call(this, x, y, width, height);

        if(height == undefined) {
            fillStyle = width;
            width = x;
            height = y;
            x = undefined;
            y = undefined;
        }

        Object.defineProperty(this, 'uid', {
            value: ViewportUid.generate(id),
            writable: false,
            enumerable: true,
            configurable: false
        });
        this._clock = new Clock(fps || 'r');
        this._bitmap = new Bitmap(this.width, this.height);
        this.fillStyle = fillStyle;
        this.node = this._bitmap.canvas;
        this.stage = undefined;

        var _this = this;
        this._clock.onTick = function() { _this._render(); };
        engine.watch(this, 'stage', function() {
            _this.stage.parent = _this;
            _this.stage.x = _this.x;
            _this.stage.y = _this.y;
            _this.stage.width = _this.width;
            _this.stage.height = _this.height;
            _this.stage._bitmap = _this._bitmap;
        });
        engine.watch(this, ['x', 'y', 'width', 'height'], function(property, oldValue, newValue) {
            if(property == 'width' || property == 'height') {
                _this._bitmap[property] = newValue;
            }
            if(_this.stage) {
                _this.stage[property] = newValue;
            }
        });
    }
    t.inherit(Viewport, Rect);

    Viewport.prototype.start = function() {
        this._clock.start();
    };

    Viewport.prototype.stop = function() {
        this._clock.stop();
    };

    Viewport.prototype.clear = function() {
        this._clock.stop();
        if(this._bitmap.parent) {
            this._bitmap.parent.removeChild(this.bitmap);
        }
        ViewportUid.clear(this.uid);
    };

    Viewport.prototype._render = function() {
        if(this.stage) {
            this._renderElement(this.stage);
        }
    }

    Viewport.prototype._renderElement = function(element) {

        //Composite Element with Children (and 
        // maybe a sprite)
        if(element._bitmap) {

            //if the element has been updated
            if(element._update) {
                element._update = false;

                // compute the visible area
                var visibleRect = new Rect(
                    -element.x,
                    -element.y,
                    element.width,
                    element.height
                );

                // get all children in view
                var children = element._childIndex.get(visibleRect);

                // add children that just left the
                // view (clean up exiting 
                // artifacts)
                while(element._drawData.lastDrawn[0]) {
                    var child = element._drawData.lastDrawn.shift();
                    var cI = children.length - 1;
                    while(cI > 0) {
                        cI -= 1;
                        if(children[cI].data == child.data) {
                            child = undefined;
                            break;
                        }
                    }
                    if(child) { children.push(child); }
                }

                // compute the area to redraw
                // relative to the screen.
                while(children[0]) {
                    element._drawData.lastDrawn.push(children[0]);
                    var child = children[0].data;
                    var childRect = children.shift().rect;

                    // compute the relative
                    // position of the element to
                    // the view.
                    childRect.x += visibleRect.x;
                    childRect.y += visibleRect.y;
                    var lastChildRect = element._drawData.children[child.uid] || childRect;

                    // save the relative position
                    // to the element so the next
                    // cycle can track changes in
                    // position.
                    element._drawData.children[child.uid] = childRect;

                    // compute redraw rectangles
                    // and add them to the draw
                    // index.
                    if(resolveByClip(childRect, lastChildRect)) {
                        var redrawRects = lastChildRect.clip(childRect);
                        redrawRects.unshift(childRect);
                    } else {
                        var redrawRects = [childRect.merge(lastChildRect)];
                    }
                    while(redrawRects[0]) {

                        // Prevent overlapping 
                        // redraw rects by
                        // removing all
                        // overlapping rects
                        // already in the index,
                        // clip or merge each of
                        // them, and then re-add
                        // them to the index.
                        var overlappingRects = element._drawData.index.remove(redrawRects[0]);
                        while(overlappingRects[0]) {
                            if(resolveByClip(redrawRects[0], overlappingRects[0].rect)) {
                                var clippedRects = overlappingRects.shift().rect.clip(redrawRects[0]);
                                while(clippedRects[0]) {
                                    element._drawData.index.insert(clippedRects.shift());
                                }
                            } else {
                                redrawRects[0] = redrawRects[0].merge(overlappingRects.shift().rect);
                            }
                        }

                        element._drawData.index.insert(redrawRects.shift());
                    }
                }

                // redraw the view in updated
                // areas.
                var redrawRects = element._drawData.index.remove(element._drawData.index.root);
                while(redrawRects[0]) {
                    var redrawRect = redrawRects.shift().rect.trim(element);

                    var rx = redrawRect.x - 1;
                    var ry = redrawRect.y - 1;
                    var rw = redrawRect.width + 2;
                    var rh = redrawRect.height + 2;

                    // erase the view under the
                    // redraw rect
                    element._bitmap.context.clearRect(rx, ry, rw, rh);
                    if(engine.config.showRedrawRects) {
                        element._bitmap.context.strokeStyle = "rgba(255, 0, 0, 0.5)";
                        element._bitmap.context.strokeRect(rx, ry, rw, rh);
                    }

                    // get the absolute pos of the
                    // redraw Rect so children
                    // indexed that overlap the
                    // absolute pos can be
                    // gathered for to be redrawn.
                    var absRedrawRect = new Rect(
                        rx - visibleRect.x,
                        ry - visibleRect.y,
                        rw,
                        rh
                    );

                    // get all children within
                    // the redraw rect sorted so
                    // they are drawn in the
                    // correct order.
                    var children = element._childIndex.get(absRedrawRect).sort(elementIndexSort);
                    while(children[0]) {
                        var child = children.shift().data;

                        // get the child's
                        // relative rect relative
                        // to the view.
                        var cx = child.x + visibleRect.x;
                        var cy = child.y + visibleRect.y;
                        var cw = child.width;
                        var ch = child.height;

                        // calculate what part of
                        // the child's bitmap
                        // to draw from.
                        // TODO: scale should be
                        // calculated by child
                        // scale vs element zoom.
                        var scale = 1;
                        var sx = (Math.max(cx, rx) - cx) / scale;
                        var sy = (Math.max(cy, ry) - cy) / scale;
                        var sw = (Math.min(cx + cw, rx + rw) - Math.max(cx, rx)) / scale;
                        var sh = (Math.min(cy + ch, ry + rh) - Math.max(cy, ry)) / scale;

                        // calculate where the
                        // source data should be
                        // drawn too
                        var dx = cx + (sx * scale);
                        var dy = cy + (sy * scale);
                        var dw = sw * scale;
                        var dh = sh * scale;

                        if(sw < 1 || sh < 1 || dw < 1 || dh < 1) { continue; }

                        element._bitmap.context.drawImage(
                            this._renderElement(child),
                            sx, sy, sw, sh,
                            dx, dy, dw, dh
                        );
                    }
                }
            }

            return element._bitmap.canvas;
        }

        //Simple Element with sprite
        else if(element.sprite.ready) {
            return element.sprite.bitmap.canvas;
        }
    };
};

function resolveByClip(rectA, rectB) {
    return Math.max(rectA.width, rectA.height, rectB.width, rectB.height) > 128;
}

function elementIndexSort(elementA, elementB) {
    if(elementA.data.z > elementB.data.z) {
        return 1;
    } else if(elementA.data.z < elementB.data.z) {
        return -1;
    } else {
        if(elementA.data._drawOrder > elementB.data._drawOrder){
            return 1;
        } else if(elementA.data._drawOrder < elementB.data._drawOrder) {
            return -1;
        } else {
            return 0;
        }
    }
}