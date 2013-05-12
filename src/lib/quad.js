var t = require('./tools');

module.exports = Quad;
module.exports.fromPoint = fromPoint;
module.exports.fromVector = fromVector;

function Quad(quadrant, opposite, adjacent) {
    if(quadrant != undefined && typeof quadrant != 'number') { throw new Error('quadrant must be a number'); }
    if(opposite != undefined && typeof opposite != 'number') { throw new Error('opposite must be a number'); }
    if(adjacent != undefined && typeof adjacent != 'number') { throw new Error('adjacent must be a number'); }
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
    var o = t.sin(vector.degree % 90) * vector.length;
    var a = t.cos(vector.degree % 90) * vector.length;
    var q = Math.floor(vector.degree / 90);
    return Quad(q, o, a);
}