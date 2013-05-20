
function Dispatcher() {
    this.listeners = [];
}
Dispatcher.extend = function(base) {
    Dispatcher.call(base);
    base.trigger = Dispatcher.prototype.trigger;
    base.bind = Dispatcher.prototype.bind;
    base.unbind = Dispatcher.prototype.unbind;
};
Dispatcher.prototype.trigger = function(a1, a2, a3, a4, a5, a6, a7, a8, a9, aL) {
    if(typeof aL != 'undefined') {
        var args = Array.prototype.slice.call(arguments, [1]);
    }
    for(var iL = 0; iL < this.listeners.length; iL += 1) {
        if(args) { this.listeners[iL].apply(null, args); }
        else { this.listeners[iL](a1, a2, a3, a4, a5, a6, a7, a8, a9); }
    }
};
Dispatcher.prototype.bind = function(listener) {
    this.listeners.push(listener);
};
Dispatcher.prototype.unbind = function(listener) {
    for(var iL = 0; iL < this.listeners.length; iL += 1) {
        if(this.listeners[iL] == listener) {
            this.listeners.splice(iL, 1);
            iL -= 1;
        }
    }
};

module.exports = Dispatcher;
