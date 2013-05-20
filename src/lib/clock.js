
var setImmediate = (function() {
    return  typeof setImmediate == 'funtion' &&
            setImmediate ||
            typeof requestAnimationFrame == 'funtion' &&
            requestAnimationFrame ||
            function(exec) { setTimeout(exec, 0); };
})();
var requestAnimationFrame = (function() {
    return  typeof requestAnimationFrame == 'funtion' &&
            requestAnimationFrame ||
            function(exec) { setTimeout(exec, 17); };
})();

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

    this.Hz = Hz || 'i';
    this.paused = false;
    this.active = false;
    this._clockTime = Date.now();
    this._tickTime = 0;
    this.onTick = function() {};

    if(typeof window == 'object') {
        var _this = this;
        window.addEventListener('focus', function() {
            if(!_this.paused) { return; }
            _this.paused = false;
            _this._init();
        });
        window.addEventListener('blur', function() {
            if(_this.paused) { return; }
            _this.paused = true;
        });
    }
}

Clock.prototype.start = function() {
    if(this.active) { return; }
    this.active = true;
    this._init();
}
Clock.prototype.stop = function() {
    if(!this.active) { return; }
    this.active = false;
}

Clock.prototype._init = function() {
    this._clockTime = Date.now();
    this._tickTime = 0;
    this._exec();
}
Clock.prototype._exec = function() {

    //exit if paused
    if(this.paused || !this.active) { return; }

    if(typeof this.Hz == 'number') {

        // Compute the tick time and if
        // greater than 1 execute onTick.
        var batchTime = Date.now();
        this._tickTime += (batchTime - this._clockTime) * (this.Hz / 1000);
        var ticks = this._tickTime|0;
        this._tickTime -= ticks;
        this._clockTime = batchTime;
        if(ticks > 0) { this.onTick(); }

    } else {

        // Execute onTick.
        this._clockTime = Date.now();
        this.onTick();

    }

    // Schedule the next cycle.
    if(this.Hz == 'r') {
        requestAnimationFrame(this._exec);
    } else {
        setImmediate(this._exec);
    }
};

module.exports = Clock;
