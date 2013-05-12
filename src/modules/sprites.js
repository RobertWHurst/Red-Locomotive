var UidRegistry = require('../lib/uid-registry');
var Bitmap = require('../lib/bitmap');
var Emitter = require('../lib/emitter');
//var QuadTree = require('../lib/quad-tree');
//var Rect = require('../lib/Rect');

module.exports = Sprites;

function Sprites(engine, config){
    var SpriteUid = UidRegistry();

    var sprites = {};

    engine.Sprite = Sprite;
    engine.Sprite.rawAccess = rawAccess;
    engine.Sprite.get = get;

    function Sprite(id, source, index) {
        var uid = SpriteUid(id);

        var sprite = {};
        sprite.uid = uid;
        sprite.ready = false;
        sprite.index = index;
        sprites[uid] = sprite;

        var api = Emitter();
        api.uid = uid;
        api.clear = function() { clear(sprite); }

        fetchSource(source, function(bitmap) {
            sprite.bitmap = bitmap;
            sprite.ready = true;
            api.trigger('ready');
        });

        return api;
    }

    function fetchSource(source, callback) {
        if(typeof source == 'object') {
            callback(source);
        } else if(typeof source == 'string') {
            var image = new Image();
            image.src = source;
            if(image.width > 0) {
                setTimeout(function() {
                    callback(Bitmap(image))
                }, 0);
            } else {
                image.onload = function() {
                    callback(Bitmap(image));
                };
            }
        }
    }

    function rawAccess(api) {
        return sprites[api.uid];
    }

    function get(uid) {
        return sprites[uid].api;
    }

    function clear(sprite) {
        unIndex(sprite);
        SpriteUid.clear(sprite.uid);
    }
}
