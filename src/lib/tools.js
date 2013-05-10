Tools.extend = extend;
Tools.random = random;
Tools.round = round;
Tools.pow = pow;
Tools.tan = tan;
Tools.sin = sin;
Tools.cos = cos;
Tools.atan = atan;
Tools.asin = asin;
Tools.acos = acos;
module.exports = Tools;

var roundMap = {};
var powMap = {};
var tanMap = {};
var sinMap = {};
var cosMap = {};
var atanMap = {};
var asinMap = {};
var acosMap = {};

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
    return Math.floor(Math.random() * (limit || 100)) || 0
}

function round(number, precision) {
    var key = number + '^' + precision;
    if(!roundMap[key]) {
        m = precision != undefined ? pow(10, precision) : 1;
        roundMap[key] = Math.round(number * m) / m;
    }
    return roundMap[key];
}

function pow(number, power) {
    var key = number + '^' + power;
    if(!powMap[key]) {
        powMap[key] = Math.pow(number, power);
    }
    return powMap[key];
}

function tan(input) {
    if (!tanMap[input]) {
        tanMap[input] = Math.tan(input * Math.PI / 180)
    }
    return tanMap[input]
}

function sin(input) {
    if (!sinMap[input]) {
        sinMap[input] = Math.sin(input * Math.PI / 180)
    }
    return sinMap[input]
}

function cos(input) {
    if (!cosMap[input]) {
        cosMap[input] = Math.cos(input * Math.PI / 180)
    }
    return cosMap[input]
}

function atan(input) {
    if (!atanMap[input]) {
        atanMap[input] = Math.atan(input) / Math.PI * 180
    }
    return atanMap[input]
}

function asin(input) {
    if (!asinMap[input]) {
        asinMap[input] = Math.asin(input) / Math.PI * 180
    }
    return asinMap[input]
}

function acos(input) {
    if (!acosMap[input]) {
        acosMap[input] = Math.acos(input) / Math.PI * 180
    }
    return acosMap[input]
}
