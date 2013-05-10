var t = require('./tools');

module.exports = Quad;
module.exports.fromPoint = fromPoint;
module.exports.fromVector = fromVector;

function Quad(quadrant, opposite, adjacent) {
    var quad = {
        q: quadrant ? quadrant - (Math.floor(quadrant / 4) * 4) : 0,
        o: opposite ? Math.abs(opposite) : 0,
        a: adjacent ? Math.abs(adjacent) : 0
    };
    return quad;
}

function fromPoint(point) {
    if(point.x == 0 && point.y == 0) { return Quad(); }
    if(point.x >= 0 && point.y < 0) { return Quad(0, point.x, point.y); }
    if(point.x > 0 && point.y >= 0) { return Quad(1, point.y, point.x); }
    if(point.x <= 0 && point.y > 0) { return Quad(2, point.x, point.y); }
    if(point.x < 0 && point.y <= 0) { return Quad(3, point.y, point.x); }
}

function fromVector(vector) {
    if(vector.length == 0) { return Quad(); }
    var degree = vector.degree - (Math.floor(vector.degree / 360) * 360);
    var o = t.sin(degree % 90) * vector.length;
    var a = t.cos(degree % 90) * vector.length;
    var q = Math.floor(degree / 90);
    return Quad(q, o, a);
}