Tools.extend = extend;
Tools.random = random;
Tools.round = round;
Tools.tan = tan;
Tools.sin = sin;
Tools.cos = cos;
Tools.atan = atan;
Tools.asin = asin;
Tools.acos = acos;
module.exports = Tools;

function Tools(base) {
    for(var tool in Tools) {
        if(Tools.hasOwnProperty(tool)) {
            base[tool] = module.exports[tool];
        }
    }
}

function extend(    ) {
    var objs = Array.prototype.slice.call(arguments);
    var newObj = {};
    while(objs[0]) {
        var obj = objs.shift();
        for(var key in obj) {
            if(!obj.hasOwnProperty(key)) { continue; }
            newObj[key] = obj[key];
        }
    }
    return newObj;
}

function random(limit) {
    return Math.random() * (limit || 100) || 0
}

function round(number, precision) {
    if(number % 1 == 0) { return number; }
    precision = precision || 0;
    m = precision != undefined ? Math.pow(10, precision) : 1;
    return Math.round(number * m) / m;
}

function tan(input) {
    return Math.tan(input * Math.PI / 180);
}

function sin(input) {
    return Math.sin(input * Math.PI / 180);
}

function cos(input) {
    return Math.cos(input * Math.PI / 180);
}

function atan(input) {
    return Math.atan(input) / Math.PI * 180;
}

function asin(input) {
    return Math.asin(input) / Math.PI * 180;
}

function acos(input) {
    return Math.acos(input) / Math.PI * 180;
}
