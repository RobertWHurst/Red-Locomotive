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

    function Element(id, x, y, z, width, height, spriteApi) {
        var uid = ElementUid(id);

        var element = Rect(x, y, width, height);
        element.z = z || 0;
        element.uid = uid;
        elements[uid] = element;

        if(spriteApi) { getSetSprite(element, spriteApi); }

        var api = element.api = {
            uid: uid,
            get x() { return getSetPosOrDim('x', element); },
            set x(value) { return getSetPosOrDim('x', element, value); },
            get y() { return getSetPosOrDim('y', element); },
            set y(value) { return getSetPosOrDim('y', element, value); },
            get cx() { return getSetPosOrDim('cx', element); },
            set cx(value) { return getSetPosOrDim('cx', element, value); },
            get cy() { return getSetPosOrDim('cy', element); },
            set cy(value) { return getSetPosOrDim('cy', element, value); },
            get z() { return getSetPosOrDim('z', element); },
            set z(value) { return getSetPosOrDim('z', element, value); },
            get width() { return getSetPosOrDim('width', element); },
            set width(value) { return getSetPosOrDim('width', element, value); },
            get height() { return getSetPosOrDim('height', element); },
            set height(value) { return getSetPosOrDim('height', element, value); },
            get sprite() { return getSetSprite(element); },
            set sprite(spriteApi) { return getSetSprite(element, spriteApi); },
            clear: function() { clear(element); },
            append: function(elementApi) { appendChild(element, rawAccess(elementApi)); },
            remove: function(elementApi) { removeChild(element, rawAccess(elementApi)); },
            upgrade: function() { upgrade(element); }
        };

        return api;
    }

    function getSetPosOrDim(property, element, value) {
        if(
            property != 'x' &&
            property != 'y' &&
            property != 'cx' &&
            property != 'cy' &&
            property != 'z' &&
            property != 'width' &&
            property != 'height'
        ) { return; }
        if(value != undefined) {
            if(element.bitmap) {
                if(property == 'width') { element.bitmap.width = value; }
                if(property == 'height') { element.bitmap.height = value; }
                redraw(element, element);
            }
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
        element.bitmap = Bitmap(element.width, element.height);
        element.childDrawOrder = UidRegistry();
    }

    function redraw(element, child) {
        element.redraw = true;
        var rect = Rect(child.x, child.y, child.width, child.height);
        var overlapingRects = element.redrawIndex.remove(rect);
        while(overlapingRects[0]) {
            rect = Rect.merge(rect, overlapingRects.shift());
        }
        element.redrawIndex.insert(rect);
    }

    function index(element) {
        if(!element.parent) { return }
        element.drawOrder = element.parent.childDrawOrder();
        element.parent.childIndex.insert(element);
        redraw(element.parent, element);
    }

    function unIndex(element) {
        if(!element.parent) { return; }
        redraw(element.parent, element);
        element.parent.childIndex.remove(element, element);
        element.parent.childDrawOrder.clear(element.drawOrder);
    }

    function appendChild(parent, element) {
        upgrade(parent);
        element.parent = parent;
        index(element);
    }

    function removeChild(parent, element) {
        if(!parent.childIndex) { return; }
        unIndex(element);
        element.parent = undefined;
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
    }
}
