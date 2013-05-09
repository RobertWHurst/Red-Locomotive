var Dispatcher = require('../').Dispatcher;

describe('Dispatcher()', function() {
    it('should return a dispatcher instance', function() {
        var dispatcher = Dispatcher();
        if(typeof dispatcher != 'object') { throw new Error('dispatcher must be an object'); }
        if(typeof dispatcher.bind != 'function') { throw new Error('dispatcher.bind must be an function'); }
        if(typeof dispatcher.trigger != 'function') { throw new Error('dispatcher.trigger must be an function'); }
        if(typeof dispatcher.unbind != 'function') { throw new Error('dispatcher.unbind must be an function'); }
    });
});
describe('dispatcher{}', function() {
    var dispatcher;
    beforeEach(function() {
        dispatcher = Dispatcher();
    });
    it('should be possible to bind and trigger listeners', function() {
        var i = 0;
        dispatcher.bind(function() { i += 1; });
        dispatcher.bind(function() { i += 2; });
        dispatcher.trigger();
        if(i != 3) { throw new Error('i should have been 3'); }
    });
    it('should be possible to clear existing listeners', function() {
        var i = 0;
        var toxic = function() { i = NaN; };
        dispatcher.bind(toxic);
        dispatcher.bind(function() { i += 2; });
        dispatcher.unbind(toxic);
        dispatcher.trigger();
        if(i != 2) { throw new Error('i should have been 2'); }
    });
});