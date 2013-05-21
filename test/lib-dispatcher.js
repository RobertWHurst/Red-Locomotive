var RL = require('../');
var should = require('should');

describe('RL.Dispatcher', function() {
    describe('#extend', function() {
        it('should augment an object to function as a dispatcher', function() {
            var arr = [];
            RL.Dispatcher.extend(arr);
            arr.listeners.should.be.instanceOf(Array);
            arr.bind.should.be.a('function');
            arr.unbind.should.be.a('function');
            arr.trigger.should.be.a('function');
        });
    });

    var dispatcher;
    beforeEach(function() {
        dispatcher = new RL.Dispatcher();
    });

    describe('.bind', function() {
        it('should bind a given listener', function() {
            var listener = function() {};
            dispatcher.bind(listener);
            dispatcher.listeners[0].should.be.equal(listener);
        });
    });

    describe('.unbind', function() {
        it('should unbind a given listener', function() {
            var listener = function() {};
            dispatcher.bind(listener);
            dispatcher.listeners[0].should.be.equal(listener);
            dispatcher.unbind(listener);
            should.not.exist(dispatcher.listeners[0]);
        });
    });

    describe('.trigger', function() {
        it('should trigger all bound listeners', function() {
            var i = 0;
            var listenerA = function() { i += 1; };
            var listenerB = function() { i += 2; };
            dispatcher.bind(listenerA);
            dispatcher.bind(listenerB);
            dispatcher.trigger();
            i.should.be.equal(3);
        });
    });
});
