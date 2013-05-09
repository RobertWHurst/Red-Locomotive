module.exports = attachAllTools;
module.exports.random = random;
module.exports.tan = tan;
module.exports.sin = sin;
module.exports.cos = cos;
module.exports.atan = atan;
module.exports.asin = asin;
module.exports.acos = acos;
module.exports.extend = extend;

var tanMap = {};
var sinMap = {};
var cosMap = {};
var atanMap = {};
var asinMap = {};
var acosMap = {};

function attachAllTools(obj) {
    for(var tool in module.exports) {
        if(module.exports.hasOwnProperty(tool)) {
            obj[tool] = module.exports[tool];
        }
    }
}

function random(limit) {
    return Math.floor(Math.random() * (limit || 100)) || 0
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
