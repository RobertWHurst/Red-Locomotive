var RL = require('../');
var should = require('should');

describe('RL.Clock', function() {

    var clock;
    beforeEach(function() {
        clock = new RL.Clock(20);
    });

    describe('.Hz', function() {
        it('should set the clock speed', function(done) {
            clock.Hz = 40;
            var i = 0;
            clock.onTick = function() { i += 1; };
            clock._active = true;
            clock._init();
            setTimeout(function() {
                i.should.be.equal(4);
                clock._active = false;
                done();
            }, 110);
        });
    });

    describe('.start', function() {
        it('should start the clock', function(done) {
            var i = 0;
            clock.onTick = function() { i += 1; };
            clock.start();
            setTimeout(function() {
                clock._active.should.be.true;
                i.should.be.above(0);
                clock.stop();
                done();
            }, Math.ceil(1000 / clock.Hz) + 10);
        });
    });

    describe('.stop', function() {
        it('should stop the clock', function(done) {
            var i = 0, ii;
            clock.onTick = function() { i += 1; };
            clock.start();
            setTimeout(function() {
                ii = i;
                clock.stop();
            }, Math.ceil(500 / clock.Hz) + 10);
            setTimeout(function() {
                clock._active.should.be.false;
                i.should.be.equal(ii);
                done();
            }, Math.ceil(1000 / clock.Hz) + 10);
        });
    });
});
