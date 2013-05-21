
function Rect(x, y, width, height) {
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 0;
    this.height = height || 0;
}
Rect.prototype.merge = function(rect) {
    var x = this.x < rect.x ? this.x : rect.x;
    var y = this.y < rect.y ? this.y : rect.y;

    if(this.x + this.width > rect.x + rect.width) {
        var width = (this.x - x) + this.width;
    } else {
        var width = (rect.x - x) + rect.width;
    }
    if(this.y + this.height > rect.y + rect.height) {
        var height = (this.y - y) + this.height;
    } else {
        var height = (rect.y - y) + rect.height;
    }

    return new Rect(x, y, width, height);
}

Rect.prototype.split = function() {
    return [
        new Rect(this.x + this.width / 2, this.y, this.width / 2, this.height / 2),
        new Rect(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, this.height / 2),
        new Rect(this.x, this.y + this.height / 2, this.width / 2, this.height / 2),
        new Rect(this.x, this.y, this.width / 2, this.height / 2)
    ];
}

Rect.prototype.clip = function(rect) {
    if(!this.overlaps(rect)) { return [this]; }

    var ax = this.x;
    var ay = this.y;
    var aw = this.width;
    var ah = this.height;

    var bx = rect.x;
    var by = rect.y;
    var bw = rect.width;
    var bh = rect.height;

    var rects = [];
    var rx, ry, rw, rh;

    if(ay < by) {
        rx = ax;
        ry = ay;
        rw = aw;
        rh = by - ry;
        rects.push(new Rect(rx, ry, rw, rh));
    }

    if(ax < bx) {
        rx = ax;
        ry = Math.max(ay, by);
        rw = bx - rx;
        rh = Math.min(ay + ah, by + bh) - ry;
        rects.push(new Rect(rx, ry, rw, rh));
    }

    if(ax + aw > bx + bw) {
        rx = bx + bw;
        ry = Math.max(ay, by);
        rw = ax + aw - rx;
        rh = Math.min(ay + ah, by + bh) - ry;
        rects.push(new Rect(rx, ry, rw, rh));
    }

    if(ay + ah > by + bh) {
        rx = ax;
        ry = by + bh;
        rw = ax + aw - rx;
        rh = ay + ah - ry;
        rects.push(new Rect(rx, ry, rw, rh));
    }

    return rects;
}

Rect.prototype.trim = function(rect) {
    var x = this.x > rect.x ? this.x : rect.x;
    var y = this.y > rect.y ? this.y : rect.y;

    if(this.x + this.width < rect.x + rect.width) {
        var width = (this.x - x) + this.width;
    } else {
        var width = (rect.x - x) + rect.width;
    }
    if(this.y + this.height < rect.y + rect.height) {
        var height = (this.y - y) + this.height;
    } else {
        var height = (rect.y - y) + rect.height;
    }

    return new Rect(x, y, width, height);

}

Rect.prototype.contains = function(rect) {
    return (
        rect.x >= this.x &&
        rect.y >= this.y &&
        rect.x + rect.width <= this.x + this.width &&
        rect.y + rect.height <= this.y + this.height
    );
}

Rect.prototype.overlaps = function(rect) {
    var ax = this.x;
    var axx = this.x + this.width - 1;
    var ay = this.y;
    var ayy = this.y + this.height - 1;

    var bx = rect.x;
    var bxx = rect.x + rect.width - 1;
    var by = rect.y;
    var byy = rect.y + rect.height - 1;

    return axx >= bx && ax <= bxx && ayy >= by && ay <= byy
}

module.exports = Rect;
