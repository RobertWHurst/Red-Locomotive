var t = require('./tools');
var Point = require('./point');
var Quad = require('./quad');

function Vector(degree, length) {
    var rect = {
        degree: degree ? degree - (Math.floor(degree / 360) * 360) : 0,
        length: length ? Math.abs(length) : 0,
    };
    return rect;
}
Vector.fromPoint = function(point) {
    return fromQuad(Quad.fromPoint(point));
};
Vector.fromQuad = function(quad) {
    var degree = t.atan(quad.a / quad.o);
    var point = Point.fromQuad(quad);
    var x = Math.abs(point.x);
    var y = Math.abs(point.y);
    var length = Math.sqrt(Math.pow(y, 2) + Math.pow(x, 2));
    return new Vector(degree, length);
};

module.exports = Vector;
