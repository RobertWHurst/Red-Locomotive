var Rect = require('../').Rect;

describe('Rect()', function() {
    it('should return a rect instance', function() {
        var rect = Rect();
        if(typeof rect != 'object') { throw new Error('rect must be an object.'); }
        if(typeof rect.x != 'number') { throw new Error('rect must be an object.'); }
        if(typeof rect.y != 'number') { throw new Error('rect must be an object.'); }
        if(typeof rect.cx != 'number') { throw new Error('rect must be an object.'); }
        if(typeof rect.cy != 'number') { throw new Error('rect must be an object.'); }
        if(typeof rect.width != 'number') { throw new Error('rect must be an object.'); }
        if(typeof rect.height != 'number') { throw new Error('rect must be an object.'); }
    });
});
describe('rect{}', function() {
    var rect;
    beforeEach(function() {
        rect = Rect(0, 0, 100, 50);
    });
    it('cx should be the middle of the element on the x axis', function() {
        if(rect.cx != 50) { throw new Error('cx should have been 50'); }
    });
    it('cy should be the middle of the element on the y axis', function() {
        if(rect.cy != 25) { throw new Error('cy should have been 25'); }
    });
    it('setting cx should set x', function() {
        rect.cx = 75;
        if(rect.x != 25) { throw new Error('x should have been 25'); }
    });
    it('setting cx should set x', function() {
        rect.cy = 50;
        if(rect.y != 25) { throw new Error('cy should have been 25'); }
    });
});