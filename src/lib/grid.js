var Point = require('./point');
var Rect = require('./rect');
var t = require('./tools');

// x-----x-----x-----x
// |-1,-1| 0,-1| 1,-1|
// x-----x-----x-----x
// |-1, 0| 0, 0| 1, 0|
// x-----x-----x-----x
// |-1, 1| 0, 1| 1, 1|
// x-----x-----x-----x

function Grid(cellWidth, cellHeight, x, y) {
    x = x || -(cellWidth / 2);
    y = y || -(cellHeight / 2);
    Point.call(this, x, y);
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
}
t.inherit(Grid, Point);

Grid.prototype.cellRect = function(cellColumn, cellRow) {
    var x = (cellColumn * this.cellWidth) + this.x;
    var y = (cellRow * this.cellHeight) + this.y;
    var width = this.cellWidth;
    var height = this.cellHeight;
    return new Rect(x, y, width, height);
};

module.exports = Grid;
