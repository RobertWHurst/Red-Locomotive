// var Rect = require('../').Rect;

// describe('Rect()', function() {
//     it('should return a rect instance', function() {
//         var rect = Rect();
//         if(typeof rect != 'object') { throw new Error('rect must be an object.'); }
//         if(typeof rect.x != 'number') { throw new Error('rect must be an object.'); }
//         if(typeof rect.y != 'number') { throw new Error('rect must be an object.'); }
//         if(typeof rect.width != 'number') { throw new Error('rect must be an object.'); }
//         if(typeof rect.height != 'number') { throw new Error('rect must be an object.'); }
//     });
// });

// describe('Rect.merge()', function() {
//     it('should accept two rects and return a new rect that contains both', function() {
//         var rectA = Rect(0, 0, 100, 100);
//         var rectB = Rect(100, 100, 300, 300);
//         var rect = Rect.merge(rectA, rectB);
//         if(rect.x != 0) { throw new Error('rect x must be 0'); }
//         if(rect.y != 0) { throw new Error('rect y must be 0'); }
//         if(rect.width != 400) { throw new Error('rect width must be 200'); }
//         if(rect.height != 400) { throw new Error('rect height must be 200'); }
//     });
// });

// describe('Rect.clip()', function() {
//     it('should accept two rects and return a new array of rects that cover area where only a exists', function() {
//         var rectA = Rect(0, 100, 150, 150);
//         var rectB = Rect(50, 50, 50, 100);
//         var rects = Rect.clip(rectA, rectB);
//     });
// });

// describe('Rect.overlaps()', function() {
//     it('should accept two rects and return a true or false based on if they overlap', function() {
//         var rectA = Rect(0, 0, 300, 300);
//         var rectB = Rect(-50, -50, 500, 500);
//         if(!Rect.overlaps(rectA, rectB)) { throw new Error('must return true'); }
//         rectA = Rect(0, 0, 300, 300);
//         rectB = Rect(100, 100, 100, 100);
//         if(!Rect.overlaps(rectA, rectB)) { throw new Error('must return true'); }
//         rectA = Rect(0, 0, 300, 300);
//         rectB = Rect(300, 300, 100, 100);
//         if(Rect.overlaps(rectA, rectB)) { throw new Error('must return false'); }
//     });
// });
