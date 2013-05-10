var t = require('./tools');
var Point = require('./point');
var Quad = require('./quad');

module.exports = Vector;
module.exports.fromPoint = fromPoint;
module.exports.fromQuad = fromQuad;

function Vector(degree, length) {
    var rect = {
        degree: degree || 0,
        length: length ? Math.abs(length) : 0,
    };
    return rect;
}

function fromPoint(point) {
    return fromQuad(Quad.fromPoint(point));
}

function fromQuad(quad) {
    var degree = t.atan(quad.a / quad.o);
    var point = Point.fromQuad(quad);
    var x = Math.abs(point.x);
    var y = Math.abs(point.y);
    var length = Math.sqrt(Math.pow(y, 2) + Math.pow(x, 2));
    return Vector(degree, length);
}
