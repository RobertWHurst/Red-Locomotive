var RL = require('../');
var should = require('should');

describe('.watch', function() {
    var rl;

    beforeEach(function() {
        rl = new RL();
        rl.start();
    });

    afterEach(function() {
        rl.stop();
    });

    it('should take an object, property name, and a callback. When the property changes, once the core clock complete\'s a, the callback should be fired', function(done) {
        var obj = {property: 'value'};
        rl.watch(obj, 'property', function() { done(); });
        obj.property = 'newValue';
    });
});

describe('.unwatch', function() {
    var rl;
    beforeEach(function() {
        rl = new RL();
        rl.start();
    });

    afterEach(function() {
        rl.stop();
    });

    it('should take an object, property name, and a callback and stop watching the property on the object', function(done) {
        var obj = {property: 'value'};
        var mod = function() { modTracked = true; };
        var modTracked = false;
        rl.watch(obj, 'property', mod);
        rl.unwatch(obj, 'property', mod);
        obj.property = 'newValue';
        setTimeout(function() {
            modTracked.should.be.false;
            done();
        }, 1000 / rl._coreClock.Hz + 10);
    });
});