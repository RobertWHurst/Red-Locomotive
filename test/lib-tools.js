var RL = require('../');
var should = require('should');

describe('RL.random', function() {
    it('should return a random number between zero and a given number', function() {
        var i = 1000;
        while(i--) {
            RL.random(1000).should.be.within(0, 1000);
        }
    });
});

describe('RL.round', function() {
    it('should accept a number and return it rounded', function() {
        RL.round(13.5).should.equal(14);
    });
    it('should accept a precision as a second argument', function() {
        RL.round(13.55, 1).should.equal(13.6);
    });
});

describe('RL.extend', function() {
    it('should accept one or more objects, copy their properties and return them all on one new object', function() {
        var a = { a: 1 };
        var b = { b: 2 };
        var c = { c: 3, d: NaN };
        var d = { property: 'value' };
        var e = { e: 5, d: d };
        var f = RL.extend(a, b, c, e);
        f.a.should.be.equal(1);
        f.b.should.be.equal(2);
        f.c.should.be.equal(3);
        f.e.should.be.equal(5);
        f.d.should.be.equal(d);
        f.d.property.should.be.equal('value');
    });
    it('should properly extend arrays', function() {
        var a = ['value'];
        var b = [a];
        var c = RL.extend(b);
        c[0][0].should.be.equal(a[0]);
        c[0].should.be.equal(a);
    });
    if('should preform a deep copy if the last argement is true', function() {
        var a = { property: 'value' };
        var b = { a: a };
        var c = RL.extend(b, true);
        c.a.property.should.be.equal(a.property);
        c.a.should.not.be.equal(a);
    });
    it('should properly deep copy arrays', function() {
        var a = ['value'];
        var b = [a];
        var c = RL.extend(b, true);
        c[0][0].should.be.equal(a[0]);
        c[0].should.not.be.equal(a);
    });
});

describe('.inherit', function() {
    it('should accept a two or more classes, then extend the first with all of the following classes', function() {
        function A() {
            this.a = 'a';
        };
        function B() {};
        B.prototype.b = function() { return 'b'; };
        function C() {};
        C.prototype.c = function() { return 'c'; };

        RL.inherit(A, B, C);

        var a = new A();
        a.a.should.be.equal('a');
        a.b().should.be.equal('b');
        a.c().should.be.equal('c');
    });
    it('should correctly set the constructor', function() {
        function A() { B.call(this); this.a = 'a'; }
        function B() { this.b = this._b(); }
        B.prototype._b = function() { return 'b'; };
        RL.inherit(A, B);
        var a = new A();
        a.a.should.be.equal('a');
        a.b.should.be.equal('b');
    })
});
