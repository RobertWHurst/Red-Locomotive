var RL = require('../');
var Point = RL.Point;
var Vector = RL.Vector;
var Quad = RL.Quad;

describe('Point()', function() {
    it('should return a point instance', function() {
        var point = Point();
        if(typeof point != 'object') { throw new Error('point must be an object'); }
    });
    it('should return a point at 0,0 if no arguments are given', function() {
        var point = Point();
        if(point.x != 0) { throw new Error('point.x must be 0'); }
        if(point.y != 0) { throw new Error('point.y must be 0'); }
    });
});

describe('Point.fromVector', function() {
    it('should accept a vector and return a point relative to 0,0', function() {
        var p1 = Point.fromVector(Vector(0, 1));
        var p2 = Point.fromVector(Vector(45, 1));
        var p3 = Point.fromVector(Vector(90, 1));
        var p4 = Point.fromVector(Vector(135, 1));
        var p5 = Point.fromVector(Vector(180, 1));
        var p6 = Point.fromVector(Vector(225, 1));
        var p7 = Point.fromVector(Vector(270, 1));
        var p8 = Point.fromVector(Vector(315, 1));
        if(p1.x != 0 || p1.y != -1) { throw new Error('point 1 incorrect'); }
        if(p2.x.toFixed(1) != 0.7 || p2.y.toFixed(1) != -0.7) { throw new Error('point 2 incorrect'); }
        if(p3.x != 1 || p3.y != 0) { throw new Error('point 3 incorrect'); }
        if(p4.x.toFixed(1) != 0.7 || p4.y.toFixed(1) != 0.7) { throw new Error('point 4 incorrect'); }
        if(p5.x != 0 || p5.y != 1) { throw new Error('point 5 incorrect'); }
        if(p6.x.toFixed(1) != -0.7 || p6.y.toFixed(1) != 0.7) { throw new Error('point 6 incorrect'); }
        if(p7.x != -1 || p7.y != 0) { throw new Error('point 7 incorrect'); }
        if(p8.x.toFixed(1) != -0.7 || p8.y.toFixed(1) != -0.7) { throw new Error('point 8 incorrect'); }
    });
});

describe('Point.fromQuad', function() {
    it('should accept a quad and return a point relative to 0,0', function() {
        var p1 = Point.fromQuad(Quad(0, 0, 1));
        var p2 = Point.fromQuad(Quad(0, 0.7, 0.7));
        var p3 = Point.fromQuad(Quad(1, 0, 1));
        var p4 = Point.fromQuad(Quad(1, 0.7, 0.7));
        var p5 = Point.fromQuad(Quad(2, 0, 1));
        var p6 = Point.fromQuad(Quad(2, 0.7, 0.7));
        var p7 = Point.fromQuad(Quad(3, 0, 1));
        var p8 = Point.fromQuad(Quad(3, 0.7, 0.7));
        if(p1.x != 0 || p1.y != -1) { throw new Error('point 1 incorrect'); }
        if(p2.x != 0.7 || p2.y != -0.7) { throw new Error('point 2 incorrect'); }
        if(p3.x != 1 || p3.y != 0) { throw new Error('point 3 incorrect'); }
        if(p4.x != 0.7 || p4.y != 0.7) { throw new Error('point 4 incorrect'); }
        if(p5.x != 0 || p5.y != 1) { throw new Error('point 5 incorrect'); }
        if(p6.x != -0.7 || p6.y != 0.7) { throw new Error('point 6 incorrect'); }
        if(p7.x != -1 || p7.y != 0) { throw new Error('point 7 incorrect'); }
        if(p8.x != -0.7 || p8.y != -0.7) { throw new Error('point 8 incorrect'); }
    });
});

describe('Point.relativeTo', function() {
    it('should accept two points and return a new point repesenting the second relative to the first', function() {
        var point = Point.relativeTo(Point(10, 0), Point(15, 5));
        if(point.x != 5 || point.y != 5) { throw new Error('point incorrect'); }
    });
});
