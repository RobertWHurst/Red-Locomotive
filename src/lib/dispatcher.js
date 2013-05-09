module.exports = Dispatcher;

function Dispatcher() {
    var listeners = [];

    var api = {};
    api.trigger = trigger;
    api.bind = bind;
    api.unbind = unbind;
    return api;

    function trigger(a1, a2, a3, a4, a5, a6, a7, a8, a9, aL) {
        if(typeof aL != 'undefined') {
            var args = Array.prototype.slice.call(arguments, [1]);
        }
        for(var iL = 0; iL < listeners.length; iL += 1) {
            if(args) { listeners[iL].apply(null, args); }
            else { listeners[iL](a1, a2, a3, a4, a5, a6, a7, a8, a9); }
        }
    }

    function bind(listener) {
        listeners.push(listener);
    }

    function unbind(listener) {
        for(var iL = 0; iL < listeners.length; iL += 1) {
            if(listeners[iL] == listener) {
                listeners.splice(iL, 1);
            }
        }
    }
};