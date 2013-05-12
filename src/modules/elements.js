var UidRegistry = require('../lib/uid-registry');
var QuadTree = require('../lib/quad-tree');
var Rect = require('../lib/Rect');
var Bitmap = require('../lib/bitmap');

module.exports = Elements;

function Elements(engine, config){
    var ElementUid = UidRegistry();

    var elements = {};

    var Sprite = engine.Sprite;

    engine.Element = Element;
    engine.Element.rawAccess = rawAccess;
    engine.Element.get = get;

    function Element(id, x, y, width, height, spriteApi) {
        var uid = ElementUid(id);

        var element = Rect(x, y, width, height);
        element.uid = uid;
        elements[uid] = element;

        if(spriteApi) { getSetSprite(element, spriteApi); }

        var api = element.api = {
            uid: uid,
            get x() { return getSetPosOrDim('x', element); },
            set x(value) { return getSetPosOrDim('x', element, value); },
            get y() { return getSetPosOrDim('y', element); },
            set y(value) { return getSetPosOrDim('y', element, value); },
            get width() { return getSetPosOrDim('width', element); },
            set width(value) { return getSetPosOrDim('width', element, value); },
            get height() { return getSetPosOrDim('height', element); },
            set height(value) { return getSetPosOrDim('height', element, value); },
            get sprite() { return getSetSprite(element); },
            set sprite(spriteApi) { return getSetSprite(element, spriteApi); },
            clear: function() { clear(element); },
            append: function(elementApi) { appendChild(element, rawAccess(elementApi)); },
            remove: function(elementApi) { removeChild(element, rawAccess(elementApi)); }
        };

        return api;
    }

    function getSetPosOrDim(property, element, value) {
        if(property != 'x' && property != 'y' && property != 'width' && property != 'height') { return; }
        if(value != undefined) {
            unIndex(element);
            element[property] = value;
            index(element);
        }
        return element[property];
    }

    function getSetSprite(element, sprite) {
        if(sprite != undefined) {
            element.sprite = Sprite.rawAccess(sprite);
            return sprite;
        } else if(element.sprite && element.sprite.api) {
            return element.sprite.api;
        }
    }

    // Upgrades an element so it can contain sub elements
    // This is done later to prevent preformance lost
    function upgrade(element) {
        if(element.childIndex) { return; }
        element.childIndex = QuadTree();
        element.redrawIndex = QuadTree();
        element.redraw = true; //set to true for first draw
        element.bitmap = Bitmap();
    }

    function redraw(element, rect) {
        if(!element.parent) { return; }
        element.redraw = true;
        element.redrawIndex.insert(rect);
    }

    function index(element) {
        if(!element.parent) { return }
        element.parent.childIndex.insert(element);
        redraw(element.parent, Rect(element.x, element.y, element.width, element.height));
    }

    function unIndex(element) {
        if(!element.parent) { return; }
        element.parent.childIndex.remove(element, element);
        redraw(element.parent, Rect(element.x, element.y, element.width, element.height));
    }

    function appendChild(parent, element) {
        upgrade(parent);
        element.parent = parent;
        index(element);
    }

    function removeChild(parent, element) {
        if(!parent.childIndex) { return; }
        unIndex(element);
        delete element.parent;
    }

    function rawAccess(api) {
        return elements[api.uid];
    }

    function get(uid) {
        return elements[uid].api;
    }

    function clear(element) {
        unIndex(element);
        ElementUid.clear(element.uid);
        delete elements[uid];
    }
}
