module.exports = Clock;

/**
 * Clock Class
 *
 * Clock is an EventEmitter that emits a tick
 * event for every millisecond. Because the
 * JavaScript VM can not run a tick each
 * millisecond, the tick event is emitted enough
 * times each tick to compensate for the length
 * of each tick of the VM. For example, if a tick
 * of the VM takes 7ms, the tick event will be
 * emitted 7 times the next tick.
 *
 * new(Clock)([Number Hz=1000]) => Clock clock
 */
function Clock(Hz, maxBatchSize) {

    var clockTime = Date.now();
    var maxBatchSize = maxBatchSize || 10;
    var scheduledTicks = 0;
    var paused = true;
    var visible = true;

    var api = {};
    api.start = start;
    api.stop = stop;
    api.onTick = function() {};

    next = (function() {
        var si = typeof setImmediate == 'function';
        var ra = typeof requestAnimationFrame == 'function';
        if(Hz == 'i' && si) { return setImmediate; }
        else if(Hz == 'r' && ra) { return requestAnimationFrame; }
        else if(si) { return setImmediate; }
        else if(ra) { return requestAnimationFrame; }
        else { return function(callback) { setTimeout(callback, 0); }; }
    })();

    if(typeof window == 'object') {
        window.addEventListener('focus', function() { visible = true; start(); });
        window.addEventListener('blur', function() { visible = false; });
    }

    return api;

    function start() {
        if(paused) { paused = false; }
        clockTime = Date.now();
        scheduledTicks = 0;
        exec();
    }

    function stop() {
        paused = true;
    }

    /**
     * Executed each tick of the JavaScript VM by the
     * constructor. Dispatches the tick event. This
     * is a separate function so it can be
     * overwritten.
     */
    var batchTime, ticks;
    function exec() {

        //exit if paused
        if(paused || !visible) { return; }

        //if target Hz set 
        if(typeof Hz == 'number') {

            //compute clock time and ticks for this batch
            batchTime = Date.now();
            scheduledTicks += (batchTime - clockTime) * (Hz / 1000);
            ticks = scheduledTicks|0;
            scheduledTicks -= ticks;
            clockTime = batchTime;

            //limit the ticks this batch to maxBatchSize
            if(maxBatchSize > 0 && ticks > maxBatchSize) {
                ticks = maxBatchSize;
            }

            //execute each tick
            while(ticks--) { api.onTick(); }
        }

        //max Hz
        else {
            api.onTick();
        }
        
        next(exec);
    }
};
