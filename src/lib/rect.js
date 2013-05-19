module.exports = Rect;
module.exports.trim = trimRect;
module.exports.merge = mergeRect;
module.exports.split = splitRect;
module.exports.clip = clipRect;
module.exports.contains = containsRect;
module.exports.overlaps = overlapsRect;
module.exports.is = isRect;

function Rect(x, y, width, height) {
    var rect = {
        x: x || 0,
        y: y || 0,
        width: width || 0,
        height: height || 0
    };
    return rect;
}

function isRect(obj) {
    return (
        typeof obj.x == 'number' &&
        typeof obj.y == 'number' &&
        typeof obj.width == 'number' &&
        typeof obj.height == 'number'
    );
}

function mergeRect(rectA, rectB) {
    var x = rectA.x < rectB.x ? rectA.x : rectB.x;
    var y = rectA.y < rectB.y ? rectA.y : rectB.y;

    if(rectA.x + rectA.width > rectB.x + rectB.width) {
        var width = (rectA.x - x) + rectA.width;
    } else {
        var width = (rectB.x - x) + rectB.width;
    }
    if(rectA.y + rectA.height > rectB.y + rectB.height) {
        var height = (rectA.y - y) + rectA.height;
    } else {
        var height = (rectB.y - y) + rectB.height;
    }

    return Rect(x, y, width, height);
}

function splitRect(rect) {
    return [
        Rect(rect.x + rect.width / 2,   rect.y,                     rect.width / 2, rect.height / 2),
        Rect(rect.x + rect.width / 2,   rect.y + rect.height / 2,   rect.width / 2, rect.height / 2),
        Rect(rect.x,                    rect.y + rect.height / 2,   rect.width / 2, rect.height / 2),
        Rect(rect.x,                    rect.y,                     rect.width / 2, rect.height / 2)
    ];
}

function clipRect(rectA, rectB) {
    var ax = rectA.x;
    var ay = rectA.y;
    var aw = rectA.width;
    var ah = rectA.height;

    var bx = rectB.x;
    var by = rectB.y;
    var bw = rectB.width;
    var bh = rectB.height;

    var rects = [];
    var rx, ry, rw, rh;

    if(ay < by) {
        rx = ax;
        ry = ay;
        rw = aw;
        rh = by - ry;
        rects.push(Rect(rx, ry, rw, rh));
    }

    if(ax < bx) {
        rx = ax;
        ry = Math.max(ay, by);
        rw = bx - rx;
        rh = Math.min(ay + ah, by + bh) - ry;
        rects.push(Rect(rx, ry, rw, rh));
    }

    if(ax + aw > bx + bw) {
        rx = bx + bw;
        ry = Math.max(ay, by);
        rw = ax + aw - rx;
        rh = Math.min(ay + ah, by + bh) - ry;
        rects.push(Rect(rx, ry, rw, rh));
    }

    if(ay + ah > by + bh) {
        rx = ax;
        ry = by + bh;
        rw = ax + aw - rx;
        rh = ay + ah - ry;
        rects.push(Rect(rx, ry, rw, rh));
    }

    return rects;
}

function trimRect(rectA, rectB) {
    var x = rectA.x > rectB.x ? rectA.x : rectB.x;
    var y = rectA.y > rectB.y ? rectA.y : rectB.y;

    if(rectA.x + rectA.width < rectB.x + rectB.width) {
        var width = (rectA.x - x) + rectA.width;
    } else {
        var width = (rectB.x - x) + rectB.width;
    }
    if(rectA.y + rectA.height < rectB.y + rectB.height) {
        var height = (rectA.y - y) + rectA.height;
    } else {
        var height = (rectB.y - y) + rectB.height;
    }

    return Rect(x, y, width, height);

}

function containsRect(rect, subjectRect) {
    return (
        subjectRect.x >= rect.x &&
        subjectRect.y >= rect.y &&
        subjectRect.x + subjectRect.width <= rect.x + rect.width &&
        subjectRect.y + subjectRect.height <= rect.y + rect.height
    );
}

function overlapsRect(rectA, rectB) {
    var x = false;
    var y = false;

    var ax = rectA.x;
    var axx = rectA.x + rectA.width - 1;
    var ay = rectA.y;
    var ayy = rectA.y + rectA.height - 1;

    var bx = rectB.x;
    var bxx = rectB.x + rectB.width - 1;
    var by = rectB.y;
    var byy = rectB.y + rectB.height - 1;

    return axx >= bx && ax <= bxx && ayy >= by && ay <= byy
}
