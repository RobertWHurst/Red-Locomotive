module.exports = Bitmap;

function Bitmap(width, height, source, sX, sY, sW, sH, dX, dY, dW, dH) {

    var bitmap = Canvas(width, height);
    bitmap.context = bitmap.getContext('2d');

    bitmap.context.imageSmoothingEnabled = false;
    bitmap.context.webkitImageSmoothingEnabled = false;
    bitmap.context.mozImageSmoothingEnabled = false;

    if(source != undefined) {
        // BUGFIX: node-canvas does not ignore any passed arguments even if they are
        // set to undefined. therefore defualt values must be set.
        //
        // TJ: node-canvas is great, so please fix and I'll buy you a case of beer ;)
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

        bitmap.context.drawImage(source, sX, sY, sW, sH, dX, dY, dW, dH);
    }

    return bitmap;
}

function Canvas(width, height) {

    width = width || 0;
    height = height || 0;

    if(typeof document == 'object' && document.createElement) {
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
    }
    else {
        var canvas = new (require('canvas'))(width, height);
    }

    return canvas;
}