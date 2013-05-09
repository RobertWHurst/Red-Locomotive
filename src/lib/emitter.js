module.exports = Emitter;

function Emitter(base) {
    var listeners = {};

    var api = base || {};
    api.trigger = trigger;
    api.bind = bind;
    api.unbind = unbind;
    return api;

    function trigger(event, a1, a2, a3, a4, a5, a6, a7, a8, a9, aL) {
        if(!listeners[event] || listeners[event].length < 1) { return; }
        if(typeof aL != 'undefined') {
            var args = Array.prototype.slice.call(arguments, [1]);
        }
        for(var iL = 0; iL < listeners[event].length; iL += 1) {
            if(args) {
                listeners[event][iL].apply(null, args);
            } else {
                listeners[event][iL](a1, a2, a3, a4, a5, a6, a7, a8, a9);
            }
        }
    }

    function bind(event, listener) {
        if(!listeners[event]) { listeners[event] = []; }
        listeners[event].push(listener);
    }

    function unbind(event, listener) {
        for(var iL = 0; iL < listeners.length; iL += 1) {
            if(listeners[event][iL] == listener) {
                listeners[event].splice(iL, 1);
            }
        }
    }
};