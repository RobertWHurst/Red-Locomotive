var Bitmap = require('../').Bitmap;

describe('Bitmap()', function() {
    // Bitmap(width, height, source, sX, sY, sW, sH, dX, dY, dW, dH)
    it('should return a bitmap instance', function() {
        var bitmap = Bitmap();
        if(typeof bitmap != 'object') { throw new Error('bitmap must be an object'); }
        if(typeof bitmap.context != 'object') { throw new Error('bitmap.context must be an object'); }
    });
    it('should accept a custom width and height', function() {
        var bitmap = Bitmap(600, 200);
        if(bitmap.width != 600) { throw new Error('bitmap.width should be 600'); }
        if(bitmap.height != 200) { throw new Error('bitmap.height should be 200'); }
    });
    it('should accept a custom source', function() {
        var srcBitmap = Bitmap(100, 100);
        srcBitmap.context.fillStyle = 'rgba(50, 255, 30, 1)';
        srcBitmap.context.fillRect(0, 0, 100, 100);
        var bitmap = Bitmap(100, 100, srcBitmap, 0, 0);
        var pixel = bitmap.context.getImageData(0, 0, 1, 1).data;
        if(pixel[0] !== 50 || pixel[1] !== 255 || pixel[2] !== 30) { throw new Error('bitmap should contain image data from source'); }
    });
});