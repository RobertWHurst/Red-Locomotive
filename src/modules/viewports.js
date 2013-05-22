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
            window.stage = _this.stage;
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
            var stageBitmap = this._renderElement(this.stage);
            this._bitmap.context.clearRect(0, 0, this.width, this.height);
            this._bitmap.draw(stageBitmap, 0, 0, this.width, this.height);
        }
    }

    Viewport.prototype._renderElement = function(element) {
        if(element._bitmap) {
            var children = element._childIndex.get(element).sort(elementIndexSort);
            element._bitmap.context.clearRect(0, 0, element._bitmap.width, element._bitmap.height);
            
            while(children[0]) {
                var child = children.shift().data;
                var bitmap = this._renderElement(child, element);
                if(bitmap != undefined) {
                    element._bitmap.draw(bitmap, 0, 0, child.width, child.height, child.x, child.y, child.width, child.height);
                }
            }

            return element._bitmap;
        } else if(element.sprite) {
            return element.sprite.bitmap;
        }
    };
};

function elementIndexSort(elementA, elementB) {
    if(elementA.data.z > elementB.data.z) {
        return 1;
    } else if(elementA.data.z < elementB.data.z) {
        return -1;
    } else {
        if(elementA.data._cI > elementB.data._cI){
            return 1;
        } else if(elementA.data._cI < elementB.data._cI) {
            return -1;
        } else {
            return 0;
        }
    }
}