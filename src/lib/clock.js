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
function Clock(Hz) {

    Hz = Hz || 0;

    var clockTime = Date.now();
    var maxBatchSize = 0;
    var scheduledTicks = 0;
    var paused = true;

    var api = {};
    api.start = start;
    api.stop = stop;
    api.onTick = function() {};
    return api;

    function start() {
        if(!paused) { return; }
        paused = false;
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
    function exec() {

        //exit if paused
        if(paused) { return; }

        //if target Hz set 
        if(Hz > 0) {

            //compute clock time and ticks for this batch
            var batchTime = Date.now();
            scheduledTicks += (batchTime - clockTime) * (Hz / 1000);
            var ticks = Math.floor(scheduledTicks);
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
            var start = Date.now();
            var iX = 0;
            while(iX < 100 && (Date.now() - start) < 30) {
                api.onTick();
                iX += 1;
            }
        }

        //schedule the next batch
        if(typeof setImmediate == 'function') { setImmediate(exec); }
        else if(typeof requestAnimationFrame == 'function') { requestAnimationFrame(exec); }
        else { setTimeout(exec, 0); }
    }
};
