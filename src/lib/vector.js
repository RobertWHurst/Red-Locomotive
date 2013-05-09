var t = require('./tools');
var Point = require('./point');
var Quad = require('./quad');

module.exports = Vector;
module.exports.fromPoint = fromPoint;
module.exports.fromQuad = fromQuad;

function Vector(degree, length) {
    var rect = {
        degree: degree,
        length: length
    };
    return rect;
}

function fromPoint(point) {
    return fromQuad(Quad.fromPoint(point));
}

function fromQuad(quad) {
    var point = Point.fromQuad(quad);
    var degree = t.atan(quad.a / quad.b);
    quad.a = quad.a < 0 ? -quad.a : quad.a;
    quad.b = quad.b < 0 ? -quad.b : quad.b;
    point.x = point.x < 0 ? -point.x : point.x;
    point.y = point.y < 0 ? -point.y : point.y;
    var length = Math.sqrt(Math.pow(point.y, 2) + Math.pow(point.x, 2));
    return Vector(degree, length);
}