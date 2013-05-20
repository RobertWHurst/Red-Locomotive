var t = require('./tools');

function Quad(quadrant, opposite, adjacent) {
    this.q = quadrant ? quadrant - (Math.floor(quadrant / 4) * 4) : 0,
    this.o = opposite ? Math.abs(opposite) : 0,
    this.a = adjacent ? Math.abs(adjacent) : 0
}
Quad.fromPoint = function(point) {
    if(point.x == 0 && point.y == 0) { return new Quad(); }
    if(point.x >= 0 && point.y < 0) { return new Quad(0, point.x, point.y); }
    if(point.x > 0 && point.y >= 0) { return new Quad(1, point.y, point.x); }
    if(point.x <= 0 && point.y > 0) { return new Quad(2, point.x, point.y); }
    if(point.x < 0 && point.y <= 0) { return new Quad(3, point.y, point.x); }
};
Quad.fromVector = function(vector) {
    if(vector.length == 0) { return new Quad(); }
    var o = t.sin(vector.degree % 90) * vector.length;
    var a = t.cos(vector.degree % 90) * vector.length;
    var q = Math.floor(vector.degree / 90);
    return new Quad(q, o, a);
};

module.exports = Quad;
