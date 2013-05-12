var Quad = require('./quad');

module.exports = Point;
module.exports.fromVector = fromVector;
module.exports.fromQuad = fromQuad;
module.exports.relativeTo = relativeTo;

function Point(x, y) {
    if(x != undefined && typeof x != 'number') { throw new Error('x must be a number'); }
    if(y != undefined && typeof y != 'number') { throw new Error('y must be a number'); }
    var rect = {
        x: x || 0,
        y: y || 0,
    };
    return rect;
}

function fromVector(vector) {
    return fromQuad(Quad.fromVector(vector));
}

function fromQuad(quad) {
    if(quad.q === 0) { return Point(quad.o, -quad.a); }
    if(quad.q === 1) { return Point(quad.a, quad.o); }
    if(quad.q === 2) { return Point(-quad.o, quad.a); }
    if(quad.q === 3) { return Point(-quad.a, -quad.o); }
}

function relativeTo(point, relativePoint) {
    return Point(relativePoint.x - point.x, relativePoint.y - point.y);
}
