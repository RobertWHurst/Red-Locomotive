
var Clock = require('../lib/clock');
var Dispatcher = require('../lib/dispatcher');
var Emitter = require('../lib/emitter');

module.exports = function(engine) {

    engine._coreClock = new Clock(engine.config.coreClockHz || 'i');
    engine._coreClock.onTick = function() {
        engine.trigger('_tick');
        engine.trigger('tick');
    };
    engine._watched = [];
    engine.start = start;
    engine.stop = stop;
    engine.log = log;
    engine.info = info;
    engine.warn = warn;
    engine.error = error;
    engine.watch = watch;
    engine.unwatch = unwatch;

    function start() {
        engine._coreClock.start();
    }

    function stop() {
        engine._coreClock.stop();
    }

    function log(log    ) {
        var args = Array.prototype.slice.call(arguments, 1);
        engine._logs[log] = args;
    }

    function info(    ) {
        var args = Array.prototype.slice.call(arguments);
        engine.log.apply(null, ['info'].concat(args));
    }

    function warn(    ) {
        var args = Array.prototype.slice.call(arguments);
        engine.log.apply(null, ['warn'].concat(args));
    }

    function error(    ) {
        var args = Array.prototype.slice.call(arguments);
        engine.log.apply(null, ['error'].concat(args));
    }

    function watch(object, property, callback) {
        if(property instanceof Array) {
            while(property[0]) {
                watch(object, property.shift(), callback);
            }
        } else {
            var origionalValue = object[property];
            engine._watched.push({
                watcher: watcher,
                object: object,
                property: property,
                callback: callback
            });
            engine.bind('_tick', watcher);
        }

        function watcher() {
            if(origionalValue !== object[property]) {
                callback(property, origionalValue, object[property]);
                origionalValue = object[property];
            }
        }
    }

    function unwatch(object, property, callback) {
        if(property instanceof Array) {
            while(property[0]) {
                unwatch(object, property.shift(), callback);
            }
        } else {
            for(var i = 0; i < engine._watched.length; i += 1) {
                var watched = engine._watched[i];
                if(
                    watched.object === object &&
                    watched.property === property &&
                    watched.callback === callback
                ) {
                    engine.unbind('_tick', watched.watcher);
                }
            }
        }
    }
};
