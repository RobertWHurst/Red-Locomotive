var RL = require('../');

describe('Point', function() {

    describe('#fromVector', function() {
        it('should accept a vector and return a point relative to 0,0', function() {
            var p1 = RL.Point.fromVector(new RL.Vector(0, 1));
            var p2 = RL.Point.fromVector(new RL.Vector(45, 1));
            var p3 = RL.Point.fromVector(new RL.Vector(90, 1));
            var p4 = RL.Point.fromVector(new RL.Vector(135, 1));
            var p5 = RL.Point.fromVector(new RL.Vector(180, 1));
            var p6 = RL.Point.fromVector(new RL.Vector(225, 1));
            var p7 = RL.Point.fromVector(new RL.Vector(270, 1));
            var p8 = RL.Point.fromVector(new RL.Vector(315, 1));
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

    describe('#fromQuad', function() {
        it('should accept a quad and return a point relative to 0,0', function() {
            var p1 = RL.Point.fromQuad(new RL.Quad(0, 0, 1));
            var p2 = RL.Point.fromQuad(new RL.Quad(0, 0.7, 0.7));
            var p3 = RL.Point.fromQuad(new RL.Quad(1, 0, 1));
            var p4 = RL.Point.fromQuad(new RL.Quad(1, 0.7, 0.7));
            var p5 = RL.Point.fromQuad(new RL.Quad(2, 0, 1));
            var p6 = RL.Point.fromQuad(new RL.Quad(2, 0.7, 0.7));
            var p7 = RL.Point.fromQuad(new RL.Quad(3, 0, 1));
            var p8 = RL.Point.fromQuad(new RL.Quad(3, 0.7, 0.7));
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

    describe('.x', function() {
        it('should contain the x value', function() {
            var point = new RL.Point(78, 24);
            point.x.should.equal(78);
        });
    });

    describe('.y', function() {
        it('should contain the y value', function() {
            var point = new RL.Point(12, 34);
            point.y.should.equal(34);
        });
    });

    describe('.relativeTo', function() {
        it('should accept a point and return a new point repesenting the given point relative to the point', function() {
            var point = (new RL.Point(10, 0)).relativeTo(new RL.Point(15, 5));
            if(point.x != 5 || point.y != 5) { throw new Error('point incorrect'); }
        });
    });
});






