
function Bitmap(width, height, source, sX, sY, sW, sH, dX, dY, dW, dH) {

    // Allow for the first argument to be source
    // if no other arguments are given. Get the
    // width and height from the source in such
    // a case.
    if(height == undefined && typeof width == 'object') {
        source = width;
        width = source.width;
        height = source.height;
    }

    this.width = width;
    this.height = height;
    this.canvas = createCanvas(width, height);
    this.context = this.canvas.getContext('2d');

    // disable image smoothing so pixel graphics
    // are crisp
    this.context.imageSmoothingEnabled = false;
    this.context.webkitImageSmoothingEnabled = false;
    this.context.mozImageSmoothingEnabled = false;

    // if a source is given then copy it over
    if(source != undefined) {
        this.draw(source);
    }

    // Attach getters & setters for setting the
    // bitmap width and height. These getters &
    // setters update the internal canvas
    // element's width and height to match the
    // bitmap.
    Object.defineProperty(this, 'width', {
        get: function() {
            return this.canvas.width;
        },
        set: function(width) {
            this.canvas.width = width;
            return width;
        }
    });
    Object.defineProperty(this, 'height', {
        get: function() {
            return this.canvas.height;
        },
        set: function(height) {
            this.canvas.height = height;
            return height;
        }
    });
}

Bitmap.prototype.draw = function(source, sX, sY, sW, sH, dX, dY, dW, dH) {

    // if the source is a bitmap (or something
    // like it) then grab its canvas and use it
    // as the source.
    if (source.canvas) { source = source.canvas; };

    // BUGFIX: node-canvas does not ignore any
    // passed arguments even if they are set 
    // to undefined. therefore defualt values
    // must be set.
    //
    // TJ: node-canvas is great, so please fix
    // and I'll buy you a case of beer ;)
    // - Robert
    sX = sX || 0;
    sY = sY || 0;
    sW = sW || source.width;
    sH = sH || source.height;

    dX = dX || 0;
    dY = dY || 0;
    dW = dW || source.width;
    dH = dH || source.height;
    // ENDOF BUGFIX

    // draw the source to the canvas
    this.context.drawImage(source, sX, sY, sW, sH, dX, dY, dW, dH);
};

function createCanvas(width, height) {

    // default width and height to zero, no point
    // in allocating memory if we don't need it 
    // yet.
    width = width || 0;
    height = height || 0;

    // create the canvas. Use node-canvas if the
    // environment is NodeJS or use DOM canvas
    // if in a browser.
    if(typeof document == 'object' && document.createElement) {
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
    } else {
        var canvas = new (require('canvas' + ''))(width, height);
    }

    return canvas;
}

module.exports = Bitmap;
