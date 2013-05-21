var RL = require('../');
var should = require('should');

describe('RL.Emitter', function() {
    describe('#extend', function() {
        it('should augment an object to function as a emitter', function() {
            var arr = [];
            RL.Emitter.extend(arr);
            arr.listeners.should.be.instanceOf(Object);
            arr.bind.should.be.a('function');
            arr.unbind.should.be.a('function');
            arr.trigger.should.be.a('function');
        });
    });

    var emitter;
    beforeEach(function() {
        emitter = new RL.Emitter();
    });

    describe('.bind', function() {
        it('should bind a given listener to a given event', function() {
            var listener = function() {};
            emitter.bind('event', listener);
            emitter.listeners['event'][0].should.be.equal(listener);
        });
    });

    describe('.unbind', function() {
        it('should unbind a given listener', function() {
            var listener = function() {};
            emitter.bind('event', listener);
            emitter.listeners['event'][0].should.be.equal(listener);
            emitter.unbind('event', listener);
            should.not.exist(emitter.listeners['event'][0]);
        });
        it('should not unbind a given listener from other events', function() {
            var listener = function() {};
            emitter.bind('event1', listener);
            emitter.bind('event2', listener);
            emitter.listeners['event1'][0].should.be.equal(listener);
            emitter.listeners['event2'][0].should.be.equal(listener);
            emitter.unbind('event1', listener);
            should.not.exist(emitter.listeners['event1'][0]);
            should.exist(emitter.listeners['event2'][0]);
        });
    });

    describe('.trigger', function() {
        it('should trigger all bound listeners', function() {
            var i = 0;
            var listenerA = function() { i += 1; };
            var listenerB = function() { i += 2; };
            emitter.bind('event1', listenerA);
            emitter.bind('event1', listenerB);
            emitter.bind('event2', listenerB);
            emitter.trigger('event1');
            i.should.be.equal(3);
        });
    });
});
