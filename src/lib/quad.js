var t = require('./tools');

module.exports = Quad;
module.exports.fromPoint = fromPoint;
module.exports.fromVector = fromVector;

function Quad(quadrant, opposite, adjacent) {
    var quad = {
        q: quadrant || 0,
        o: opposite || 0,
        a: adjacent || 0
    };
    return quad;
}

function fromPoint(point) {
    if(point.x > -1) {
        if(point.y < 0) { return Quad(0, point.x, -point.y); }
        else { return Quad(1, point.y, point.x); }
    } else {
        if(point.y > -1) { return Quad(2, -point.x, point.y); }
        // NOTE: changed point.y to -point.y.
        // If function breaks try reversing this change.
        else { return Quad(3, -point.y, -point.x); }
    }
}

function fromVector(vector) {
    var degree = vector.degree % 90;
    var o = t.sin(degree) * vector.length;
    var a = t.cos(degree) * vector.length;
    var q = Math.floor(vector.degree / 90);
    return Quad(q, o, a);
}