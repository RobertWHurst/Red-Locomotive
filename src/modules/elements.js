var UidRegistry = require('../lib/uid-registry');
var QuadTree = require('../lib/quad-tree');
var Rect = require('../lib/Rect');

module.exports = Elements;

function Elements(engine, config){
    var ElementUid = UidRegistry();

    var elements = {};

    engine.Element = Element;
    engine.Element.get = get;
    engine.Element.rawAccess = rawAccess;

    function Element(id, sprite, x, y, width, height) {
        var uid = ElementUid(id);

        var element = Rect(x, y, width, height);
        element.uid = uid;
        element.sprite = sprite;
        elements[uid] = element;

        var api = {};
        api.uid = uid;
        api.position = function(x, y, z) { position(element, x, y, z); };
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

    function position(element, x, y, z) {
        unIndex(element);
        if(typeof x == 'number') { element.x = x; }
        if(typeof y == 'number') { element.y = y; }
        if(typeof z == 'number') { element.z = z; }
        index(element);
    }

    function size(element, width, height) {
        unIndex(element);
        if(typeof width == 'number') { element.width = width; }
        if(typeof height == 'number') { element.height = height; }
        index(element);
    }

    function clear(element) {
        unIndex(element);
        ElementUid.clear(element.uid);
        delete elements[uid];
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
}
