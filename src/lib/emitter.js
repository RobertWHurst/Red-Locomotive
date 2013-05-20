
function Emitter() {
    this.listeners = {};
}
Emitter.extend = function(base) {
    Emitter.call(base);
    base.trigger = Emitter.prototype.trigger;
    base.bind = Emitter.prototype.bind;
    base.unbind = Emitter.prototype.unbind;
};
Emitter.prototype.trigger = function(event, a1, a2, a3, a4, a5, a6, a7, a8, a9, aL) {
    if(!this.listeners[event] || this.listeners[event].length < 1) { return; }
    if(typeof aL != 'undefined') {
        var args = Array.prototype.slice.call(arguments, [1]);
    }
    for(var iL = 0; iL < this.listeners[event].length; iL += 1) {
        if(args) {
            this.listeners[event][iL].apply(null, args);
        } else {
            this.listeners[event][iL](a1, a2, a3, a4, a5, a6, a7, a8, a9);
        }
    }
};
Emitter.prototype.bind = function(event, listener) {
    if(!this.listeners[event]) { this.listeners[event] = []; }
    this.listeners[event].push(listener);
};
Emitter.prototype.unbind = function(event, listener) {
    if(!this.listeners[event]) { return; }
    for(var iL = 0; iL < this.listeners[event].length; iL += 1) {
        if(this.listeners[event][iL] == listener) {
            this.listeners[event].splice(iL, 1);
            iL -= 1;
        }
    }
};

module.exports = Emitter;
