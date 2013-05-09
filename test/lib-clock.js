var Clock = require('../').Clock;

describe('Clock()', function() {
    it('should return a clock instance', function() {
        var clock = Clock();
        if(typeof clock != 'object') { throw new Error('clock must be an object'); }
        if(typeof clock.onTick != 'function') { throw new Error('clock.onTick must be a function'); }
        if(typeof clock.start != 'function') { throw new Error('clock.start must be a function'); }
        if(typeof clock.stop != 'function') { throw new Error('clock.stop must be a function'); }
    });
    it('should accept a custom Hz', function(done) {
        var clock = Clock(20);
        var i = 0;
        clock.onTick = function() { i += 1; };
        clock.start();
        setTimeout(function() {
            if(i != 2) { done(new Error('i should be equal to 2')); }
            else { done(); }
        }, 110);
    });
});
describe('clock{}', function() {
    it('should not be running on init', function(done) {
        var clock = Clock(20);
        var i = 0;
        clock.onTick = function() { i += 1; };
        setTimeout(function() {
            if(i != 0) { done(new Error('i should be equal to 0')); }
            else { done(); }
        }, 110);
    });
    it('should stop running on call of clock.stop', function(done) {
        var clock = Clock(20);
        var i = 0;
        clock.onTick = function() { i += 1; };
        clock.start();
        setTimeout(function() { clock.stop(); }, 60);
        setTimeout(function() {
            if(i != 1) { done(new Error('i should be equal to 1')); }
            else { done(); }
        }, 110);
    });
});