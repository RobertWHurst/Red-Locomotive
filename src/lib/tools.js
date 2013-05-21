
function extend(    ) {
    var objs = Array.prototype.slice.call(arguments);
    var newObj = objs[0] instanceof Array ? [] : {};
    var deepCopy = objs[objs.length - 1] == true;
    if(deepCopy) { objs.pop(); }
    while(objs[0]) {
        var obj = objs.shift();
        if(typeof obj !== 'object') { throw new Error('all arguments must be an object'); }
        for(var key in obj) {
            if(!obj.hasOwnProperty(key)) { continue; }
            if(deepCopy && typeof obj[key] == 'object') {
                newObj[key] = extend(obj[key], true);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    return newObj;
}

function inherit(SubjectClass    ) {
    var classes = Array.prototype.slice.call(arguments, 1);

    // copy each prototype (de-reference) so the
    // original is not modified.
    var prototypes = [];
    for(var i = 0; i < classes.length; i += 1) {
        prototypes.push(classes[i].prototype);
    }

    // create the merged prototype and restore the
    // correct constructor
    SubjectClass.prototype = Object.create(extend.apply(null, prototypes));
    SubjectClass.prototype.constructor = SubjectClass;
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

function tools(base) {
    for(var tool in tools) {
        if(tools.hasOwnProperty(tool)) {
            base[tool] = module.exports[tool];
        }
    }
}
tools.extend = extend;
tools.inherit = inherit;
tools.random = random;
tools.round = round;
tools.tan = tan;
tools.sin = sin;
tools.cos = cos;
tools.atan = atan;
tools.asin = asin;
tools.acos = acos;

module.exports = tools;