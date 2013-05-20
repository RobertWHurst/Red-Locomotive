var Quad = require('./quad');

function Point(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}
Point.fromVector = function(vector) {
    return fromQuad(Quad.fromVector(vector));
};
Point.fromQuad = function(quad) {
    if(quad.q === 0) { return new Point(quad.o, -quad.a); }
    if(quad.q === 1) { return new Point(quad.a, quad.o); }
    if(quad.q === 2) { return new Point(-quad.o, quad.a); }
    if(quad.q === 3) { return new Point(-quad.a, -quad.o); }
}
Point.relativeTo = function(point, relativePoint) {
    return new Point(relativePoint.x - point.x, relativePoint.y - point.y);
}

module.exports = Point;
