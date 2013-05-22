var Point = require('./point');
var Rect = require('./rect');
var t = require('./tools');

//  y\
//             x
//         x( 1,-1)x
//     x( 0,-1)x( 1, 0)x
// x(-1, 0)x( 0, 0)x( 1, 1)x
//     x(-1, 0)x( 0, 1)x
//         x(-1, 1)x
//             x
//  x/

function IsoGrid(cellSize, x, y) {
    x = x || -(cellSize / 2);
    y = y || -(cellSize / 4);
    Point.call(this, x, y);
    this.cellSize = cellSize;
}
t.inherit(IsoGrid, Point);

IsoGrid.prototype.cellRect = function(cellColumn, cellRow) {

    var x = (cellColumn * (this.cellSize / 2)) + (cellRow * (this.cellSize / 2)) + this.x;
    var y = (cellRow * (this.cellSize / 4)) - (cellColumn * (this.cellSize / 4)) + this.y;

    var width = this.cellSize;
    var height = this.cellSize / 2;
    
    return new Rect(x, y, width, height);
};

module.exports = IsoGrid;
