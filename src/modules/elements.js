
var UidRegistry = require('../lib/uid-registry');
var QuadTree = require('../lib/quad-tree');
var Rect = require('../lib/rect');
var Emitter = require('../lib/emitter');
var Bitmap = require('../lib/bitmap');
var t = require('../lib/tools');

module.exports = function(engine) {
    var ElementUid = new UidRegistry();
    var Sprite = engine.Sprite;

    engine.Element = Element;

    function Element(id, x, y, z, width, height, sprite) {
        if(!sprite instanceof Sprite) { throw new Error('sprite must be an instance of Sprite'); }

        Rect.call(this, x, y, width, height);
        Emitter.call(this);

        Object.defineProperty(this, 'uid', {
            value: ElementUid.generate(id),
            writable: false,
            enumerable: true,
            configurable: false
        });
        this.z = z || 0;
        this.sprite = sprite;
        this._update = false;
        this._redrawRect = new Rect(x, y, width, height);
        this._parent = undefined;
        this._bitmap = undefined;
        this._childIndex = undefined;
        this._drawData = undefined;
        this._drawOrder = undefined;
        this._childDrawOrder = undefined;

        var _this = this;
        engine.watch(this, 'sprite', function() {
            if(_this._parent) { _this._parent._update = true; }
        });
        engine.watch(this, ['x', 'y', 'z', 'width', 'height'], function(property, oldValue, newValue) {
            if(_this._parent) { _this._parent._update = true; }

            // if the element has a bitmap, and
            // the property is width or height,
            // update that property on the bitmap.
            if(_this._bitmap) {
                if(property == 'width') { _this._bitmap.width = newValue; }
                if(property == 'height') { _this._bitmap.height = newValue; }
            }

            // momentarily roll back the property
            // value to correctly unindex the
            // element from the parent element's
            // child index. After unindexing,
            // re-apply the new value and
            // re-index.
            _this[property] = oldValue;
            _this._unIndex();
            _this[property] = newValue;
            _this._index();
        });
    }
    t.inherit(Element, Rect, Emitter);

    Element.prototype.append = function(element) {
        if(!element instanceof Element) { throw new Error('element must be an instance of Element'); }
        this._upgrade();
        this._update = true;
        element._parent = this;
        element._drawOrder = this._childDrawOrder += 1;
        element._index();
    };

    Element.prototype.remove = function(element) {
        if(!element instanceof Element) { throw new Error('element must be an instance of Element'); }
        if(!this._childIndex) { return; }
        element._unIndex();
        element._parent = undefined;
        element._drawOrder = undefined;
    };

    Element.prototype.clear = function() {
        this._unIndex();
        ElementUid.clear(element.uid);
    };

    Element.prototype._upgrade = function() {
        if(this._bitmap != undefined) { return; }
        this._bitmap = new Bitmap(this.width, this.height);
        this._childIndex = new QuadTree();
        this._drawData = {};
        this._drawData.index = new QuadTree();
        this._drawData.lastDrawn = [];
        this._drawData.children = {};
        this._childDrawOrder = 0;
    };

    Element.prototype._index = function() {
        if(!this._parent) { return }
        if(this._parent) { this._parent._update = true; }
        this._parent._childIndex.insert(this, this);
    };

    Element.prototype._unIndex = function() {
        if(!this._parent) { return; }
        this._parent._childIndex.remove(this, this);
    };
};
