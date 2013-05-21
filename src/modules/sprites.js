
var UidRegistry = require('../lib/uid-registry');
var Bitmap = require('../lib/bitmap');
var Emitter = require('../lib/emitter');
var t = require('../lib/tools');

module.exports = function(engine) {
    var SpriteUid = new UidRegistry();

    var sprites = {};

    engine.Sprite = Sprite;

    function Sprite(id, source, index) {
        Emitter.call(this);

        Object.defineProperty(this, 'uid', {
            value: SpriteUid.generate(id),
            writable: false,
            enumerable: true,
            configurable: false
        });
        this.ready = false;
        this.index = index;
        this.bitmap = undefined;
        this._fetchSource(source);
    }
    t.inherit(Sprite, Emitter);

    Sprite.prototype._fetchSource = function(source) {
        if(typeof source == 'object') {
            this.ready = true;
            this.trigger('ready');
            this.bitmap = new Bitmap(source);
        } else if(typeof source == 'string') {
            var image = new Image();
            image.src = source;
            var _this = this;
            if(image.width > 0) {
                this.ready = true;
                this.bitmap = new Bitmap(image);
                setTimeout(function() {
                    _this.trigger('ready');
                }, 0);
            } else {
                image.onload = function() {
                    _this.ready = true;
                    _this.bitmap = new Bitmap(image);
                    _this.trigger('ready');
                };
            }
        }
    };

    Sprite.clear = function() {
        SpriteUid.clear(this.uid);
    };
};
