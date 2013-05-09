var Emitter = require('../').Emitter;

describe('Emitter()', function() {
    it('should return a emitter instance', function() {
        var emitter = Emitter();
        if(typeof emitter != 'object') { throw new Error('emitter must be an object'); }
        if(typeof emitter.bind != 'function') { throw new Error('emitter.bind must be an function'); }
        if(typeof emitter.trigger != 'function') { throw new Error('emitter.trigger must be an function'); }
        if(typeof emitter.unbind != 'function') { throw new Error('emitter.unbind must be an function'); }
    });
});
describe('emitter{}', function() {
    var emitter;
    beforeEach(function() {
        emitter = Emitter();
    });
    it('should be possible to bind and trigger listeners to an event', function() {
        var i = 0;
        emitter.bind('foo', function() { i += 1; });
        emitter.bind('bar', function() { i += 2; });
        emitter.bind('baz', function() { i = NaN; });
        emitter.trigger('foo');
        emitter.trigger('bar');
        emitter.trigger('bar');
        if(i != 5) { throw new Error('i should have been 5'); }
    });
    it('should be possible to clear existing listeners', function() {
        var i = 0;
        var toxic = function() { i = NaN; };
        emitter.bind('foo', toxic);
        emitter.bind('foo', function() { i += 2; });
        emitter.unbind('foo', toxic);
        emitter.trigger('foo');
        if(i != 2) { throw new Error('i should have been 2'); }
    });
});