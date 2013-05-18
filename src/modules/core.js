var Clock = require('../lib/clock');
var Dispatcher = require('../lib/dispatcher');
var Emitter = require('../lib/emitter');

module.exports = Core;

function Core(engine, options) {
    var logs = {};
    var clock = Clock(options.coreClock || 1000);

    Emitter(engine);
    engine.start = clock.start;
    engine.stop = clock.stop;
    engine.log = log;
    engine.info = info;
    engine.warn = warn;
    engine.error = error;
    engine.config = getSetConfig;

    clock.onTick = function() { engine.trigger('tick'); };

    function log(log    ) {
        var args = Array.prototype.slice.call(arguments, 1);
        logs[log] = args;
    }

    function info(    ) {
        var args = Array.prototype.slice.call(arguments);
        log.apply(null, ['info'].concat(args));
    }

    function warn(    ) {
        var args = Array.prototype.slice.call(arguments);
        log.apply(null, ['warn'].concat(args));
    }

    function error(    ) {
        var args = Array.prototype.slice.call(arguments);
        log.apply(null, ['error'].concat(args));
    }

    function getSetConfig(key, value) {
        if(value != undefined) {
            options[key] = value
        }
        return options[key];
    }
}
