
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


function Clock(Hz) {

    this.Hz = Hz || 'i';
    this.onTick = function() {};
    this._paused = false;
    this._active = false;
    this._clockTime = Date.now();
    this._tickTime = 0;

    // if in a browser, the clock should
    // automatically pause so the browser doesn't
    // cause issues when it throttles the shit
    // out of the VM instance.
    if(typeof window == 'object') {
        var _this = this;
        window.addEventListener('focus', function() {
            if(!_this._paused) { return; }
            _this._paused = false;
            _this._init();
        });
        window.addEventListener('blur', function() {
            if(_this._paused) { return; }
            _this._paused = true;
        });
    }
};

Clock.prototype.start = function() {
    if(this._active) { return; }
    this._active = true;
    this._init();
};

Clock.prototype.stop = function() {
    if(!this._active) { return; }
    this._active = false;
};

Clock.prototype._init = function() {
    this._clockTime = Date.now();
    this._tickTime = 0;
    this._exec();
};

Clock.prototype._exec = function() {

    //exit if paused
    if(this._paused || !this._active) { return; }

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
    var _this = this;
    if(this.Hz == 'r') {
        requestAnimationFrame(function() { _this._exec(); });
    } else {
        setImmediate(function() { _this._exec(); });
    }
};

module.exports = Clock;
