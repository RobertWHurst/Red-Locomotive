RL = require('../');

describe('random()', function() {
    it('should return a random number between zero and a given number', function() {
        var i = 1000;
        while(i--) {
            if(RL.random(1000) > 1000) { throw new Error('random number not within correct range'); }
        }
    });
});

describe('round()', function() {
    it('should accept a number and return it rounded', function() {
        if(RL.round(13.5) != 14) { throw new Error('rounding error'); }
    });
    it('should accept a precision as a second argument', function() {
        if(RL.round(13.55, 1) != 13.6) { throw new Error('rounding error'); }
    });
});

describe('extend()', function() {
    it('should accept one or more objects, copy their properties and return them all on one new object', function() {
        var a = { a: 1 }
        var b = { b: 2 }
        var c = { c: 3, d: NaN }
        var d = { d: 4 }
        var all = RL.extend(a, b, c, d);
        if(all.a != 1) { throw new Error('a should be 1'); }
        if(all.b != 2) { throw new Error('b should be 2'); }
        if(all.c != 3) { throw new Error('c should be 3'); }
        if(all.d != 4) { throw new Error('d should be 4'); }
    });
});
