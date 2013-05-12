module.exports = Rect;
module.exports.trim = trimRect;
module.exports.merge = mergeRect;
module.exports.contains = containsRect;
module.exports.overlaps = overlapsRect;
module.exports.is = isRect;

function Rect(x, y, width, height) {
    if(x != undefined && typeof x != 'number') { throw new Error('x must be a number'); }
    if(y != undefined && typeof y != 'number') { throw new Error('y must be a number'); }
    if(width != undefined && typeof width != 'number') { throw new Error('width must be a number'); }
    if(height != undefined && typeof height != 'number') { throw new Error('height must be a number'); }
    var rect = {
        x: x || 0,
        y: y || 0,
        get cx() { return cx(rect); },
        set cx(value) { return cx(rect, value); },
        get cy() { return cy(rect); },
        set cy(value) { return cy(rect, value); },
        width: width || 0,
        height: height || 0
    };
    return rect;
}

function cx(rect, newCx) {
    var curCx = rect.x + (rect.width / 2);
    if(newCx != undefined) {
        rect.x += newCx - curCx;
    }
    return curCx;
}

function cy(rect, newCy) {
    var curCy = rect.y + (rect.height / 2);
    if(newCy != undefined) {
        rect.y += newCy - curCy;
    }
    return curCy;
}

function isRect(obj) {
    return (
        typeof obj.x == 'number' &&
        typeof obj.y == 'number' &&
        typeof obj.cx == 'number' &&
        typeof obj.cy == 'number' &&
        typeof obj.width == 'number' &&
        typeof obj.height == 'number'
    );
}

function trimRect(rect, modifierRect) {
    var x = modifierRect.x > rect.x ? modifierRect.x : rect.x;
    var y = modifierRect.y > rect.y ? modifierRect.y : rect.y;

    if(modifierRect.x + modifierRect.width > rect.x + rect.width) {
        var width = (modifierRect.x + modifierRect.width) - (rect.x + rect.width);
    } else { var width = modifierRect.width; }
    if(modifierRect.y + modifierRect.height > rect.y + rect.height) {
        var height = (modifierRect.y + modifierRect.height) - (rect.y + rect.height);
    } else { var height = modifierRect.height; }

    return Rect(x, y, width, height);
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

function containsRect(rect, subjectRect) {
    return (
        subjectRect.x >= rect.x &&
        subjectRect.y >= rect.y &&
        subjectRect.x + subjectRect.width <= rect.x + rect.width &&
        subjectRect.y + subjectRect.height <= rect.y + rect.height
    );
}

function overlapsRect(rect, subjectRect) {
    return (
        (
            rect.x <= subjectRect.x && rect.x + rect.width > subjectRect.x ||
            subjectRect.x <= rect.x && subjectRect.x + subjectRect.width > rect.x
        ) && (
            rect.y <= subjectRect.y && rect.y + rect.width > subjectRect.y ||
            subjectRect.y <= rect.y && subjectRect.y + subjectRect.width > rect.y
        )
    );
}
