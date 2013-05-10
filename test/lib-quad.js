var RL = require('../');
var Point = RL.Point;
var Vector = RL.Vector;
var Quad = RL.Quad;

describe('Quad()', function() {
    it('should return a quad instance', function() {
        var quad = Quad();
        if(typeof quad != 'object') { throw new Error('quad must be an object'); }
    });
    it('should return an quad empty quad if no arguments are given', function() {
        var quad = Quad();
        if(quad.q != 0) { throw new Error('quad.q must be 0'); }
        if(quad.o != 0) { throw new Error('quad.o must be 0'); }
        if(quad.a != 0) { throw new Error('quad.a must be 0'); }
    });
    it('should convert opposite and adjacent to positive numbers', function() {
        var quad = Quad(0, -5, -5);
        if(quad.o != 5) { throw new Error('quad.o must be 5'); }
        if(quad.a != 5) { throw new Error('quad.a must be 5'); }
    });
    it('should translate quadrant to a number between 0-3', function() {
        var quad = Quad(6, 0, 0);
        if(quad.q != 2) { throw new Error('quad.q must be 2'); }
    });
});

describe('Quad.fromPoint', function() {
    it('should accept a point and return a quad', function() {
        var q1 = Quad.fromPoint(Point(0, -1));
        var q2 = Quad.fromPoint(Point(1, -1));
        var q3 = Quad.fromPoint(Point(1, 0));
        var q4 = Quad.fromPoint(Point(1, 1));
        var q5 = Quad.fromPoint(Point(0, 1));
        var q6 = Quad.fromPoint(Point(-1, 1));
        var q7 = Quad.fromPoint(Point(-1, 0));
        var q8 = Quad.fromPoint(Point(-1, -1));
        if(q1.q != 0 || q1.o != 0 || q1.a != 1) { throw new Error('quad 1 incorrect'); }
        if(q2.q != 0 || q2.o != 1 || q2.a != 1) { throw new Error('quad 2 incorrect'); }
        if(q3.q != 1 || q3.o != 0 || q3.a != 1) { throw new Error('quad 3 incorrect'); }
        if(q4.q != 1 || q4.o != 1 || q4.a != 1) { throw new Error('quad 4 incorrect'); }
        if(q5.q != 2 || q5.o != 0 || q5.a != 1) { throw new Error('quad 5 incorrect'); }
        if(q6.q != 2 || q6.o != 1 || q6.a != 1) { throw new Error('quad 6 incorrect'); }
        if(q7.q != 3 || q7.o != 0 || q7.a != 1) { throw new Error('quad 7 incorrect'); }
        if(q8.q != 3 || q8.o != 1 || q8.a != 1) { throw new Error('quad 8 incorrect'); }
    });
});

describe('Quad.fromVector', function() {
    it('should accept a vector and return a quad', function() {
        var q1 = Quad.fromVector(Vector(0, 1));
        var q2 = Quad.fromVector(Vector(45, 1));
        var q3 = Quad.fromVector(Vector(90, 1));
        var q4 = Quad.fromVector(Vector(135, 1));
        var q5 = Quad.fromVector(Vector(180, 1));
        var q6 = Quad.fromVector(Vector(225, 1));
        var q7 = Quad.fromVector(Vector(270, 1));
        var q8 = Quad.fromVector(Vector(315, 1));
        if(q1.q != 0 || q1.o != 0 || q1.a != 1) { throw new Error('quad 1 incorrect'); }
        if(q2.q != 0 || q2.o.toFixed(1) != 0.7 || q2.a.toFixed(1) != 0.7) { throw new Error('quad 2 incorrect'); }
        if(q3.q != 1 || q3.o != 0 || q3.a != 1) { throw new Error('quad 3 incorrect'); }
        if(q4.q != 1 || q4.o.toFixed(1) != 0.7 || q4.a.toFixed(1) != 0.7) { throw new Error('quad 4 incorrect'); }
        if(q5.q != 2 || q5.o != 0 || q5.a != 1) { throw new Error('quad 5 incorrect'); }
        if(q6.q != 2 || q6.o.toFixed(1) != 0.7 || q6.a.toFixed(1) != 0.7) { throw new Error('quad 6 incorrect'); }
        if(q7.q != 3 || q7.o != 0 || q7.a != 1) { throw new Error('quad 7 incorrect'); }
        if(q8.q != 3 || q8.o.toFixed(1) != 0.7 || q8.a.toFixed(1) != 0.7) { throw new Error('quad 8 incorrect'); }
    });
});

// describe('Quad.relativeTo', function() {
//     it('should accept two quads and return a new quad repesenting the second relative to the first', function() {
//         var quad = Quad.relativeTo(Quad(10, 0), Quad(15, 5));
//         if(quad.x != 5 || quad.y != 5) { throw new Error('quad incorrect'); }
//     });
// });
