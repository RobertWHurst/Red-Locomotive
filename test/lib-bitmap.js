var RL = require('../');
var should = require('should');
var HTMLCanvasElement = (function() {
    return  (typeof HTMLCanvasElement == 'object') &&
            HTMLCanvasElement ||
            (require('canvas'));
})();
var CanvasRenderingContext2D = (function() {
    return  (typeof CanvasRenderingContext2D == 'object') &&
            CanvasRenderingContext2D ||
            (require('canvas')).Context2d;
})();

describe('RL.Bitmap', function() {
    var bitmap;

    it('should accept a source and apply it to the bitmap', function() {
        var sourceBitmap = new RL.Bitmap(100, 100);
        sourceBitmap.context.fillStyle = 'rgba(50, 255, 30, 1)';
        sourceBitmap.context.fillRect(0, 0, 100, 100);
        var bitmap = new RL.Bitmap(sourceBitmap);
        var pixel = bitmap.context.getImageData(0, 0, 1, 1).data;
        pixel[0].should.be.equal(50);
        pixel[1].should.be.equal(255);
        pixel[2].should.be.equal(30);
    });

    beforeEach(function() {
        bitmap = new RL.Bitmap();
    });

    describe('.canvas', function() {
        it('should be an instance of HTMLCanvasElement', function() {
            bitmap.canvas.should.be.instanceOf(HTMLCanvasElement);
        });
    });

    describe('.context', function() {
        it('should be an instance of CanvasRenderingContext2D', function() {
            bitmap.context.should.be.instanceOf(CanvasRenderingContext2D);
        });
    });

    describe('.width', function() {
        it('should be a number', function() {
            bitmap.width.should.be.a('number');
        });
        it('should always be the equal to .canvas.width', function() {
            bitmap.width.should.equal(bitmap.canvas.width);
        });
    });

    describe('.height', function() {
        it('should be a number', function() {
            bitmap.height.should.be.a('number');
        });
        it('should always be the equal to .canvas.height', function() {
            bitmap.height.should.equal(bitmap.canvas.height);
        });
    });

    describe('.draw', function() {
        it('should be a function', function() {
            bitmap.draw.should.be.a('function');
        });
        it('should accept a bitmap and apply it to the bitmap', function() {
            var sourceBitmap = new RL.Bitmap(100, 100);
            sourceBitmap.context.fillStyle = 'rgba(50, 255, 30, 1)';
            sourceBitmap.context.fillRect(0, 0, 100, 100);
            bitmap.width = 100;
            bitmap.height = 100;
            bitmap.draw(sourceBitmap);
            var pixel = bitmap.context.getImageData(0, 0, 1, 1).data;
            pixel[0].should.be.equal(50);
            pixel[1].should.be.equal(255);
            pixel[2].should.be.equal(30);
        });
    });
});