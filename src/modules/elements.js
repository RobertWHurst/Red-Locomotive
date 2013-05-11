var UidRegistry = require('../lib/uid-registry');
var QuadTree = require('../lib/quad-tree');
var Rect = require('../lib/Rect');

module.exports = Elements;

function Elements(engine, config){
    var ElementUid = UidRegistry();

    var elements = {};

    engine.Element = Element;
    engine.Element.rawAccess = rawAccess;
    engine.Element.get = get;

    function Element(id, sprite, x, y, width, height) {
        var uid = ElementUid(id);

        if(typeof sprite == 'string') { sprite = engine.Sprite.get(sprite); }
        sprite = engine.Sprite.rawAccess(sprite);

        var element = Rect(x, y, width, height);
        element.uid = uid;
        element.sprite = sprite;
        elements[uid] = element;

        var api = {
            get x() { return posAndDim('x', element); },
            set x(value) { return posAndDim('x', element, value); },
            get y() { return posAndDim('y', element); },
            set y(value) { return posAndDim('y', element, value); },
            get width() { return posAndDim('width', element); },
            set width(value) { return posAndDim('width', element, value); },
            get height() { return posAndDim('height', element); },
            set height(value) { return posAndDim('height', element, value); }
        };
        api.uid = uid;
        api.size = function(width, height) { size(element, width, height); };
        api.clear = function() { clear(element); };
        api.append = function(api) { appendChild(element, rawAccess(api)); };
        api.remove = function(api) { removeChild(element, rawAccess(api)); };

        element.api = api;
        return api;
    }

    // Upgrades an element so it can contain sub elements
    // This is done later to prevent preformance lost
    function upgrade(element) {
        if(element.index) { return; }
        element.index = QuadTree();
        element.redraw = true; //set to true for first draw
    }

    function posAndDim(property, element, value) {
        if(property != 'x' && property != 'y' && property != 'width' && property != 'height') { return; }
        if(value != undefined) {
            unIndex(element);
            element[property] = value;
            index(element);
        }
        return element[property];
    }

    function size(element, width, height) {
        unIndex(element);
        if(typeof width == 'number') { element.width = width; }
        if(typeof height == 'number') { element.height = height; }
        index(element);
    }

    function index(element) {
        if(!element.parent) { return }
        element.parent.redraw = true;
        element.parent.index.insert(element);
    }

    function unIndex(element) {
        if(!element.parent) { return; }
        element.parent.redraw = true;
        element.parent.index.remove(element, element);
    }

    function appendChild(parent, element) {
        upgrade(parent);
        element.parent = parent;
        index(element);
    }

    function removeChild(parent, element) {
        if(!parent.index) { return; }
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
