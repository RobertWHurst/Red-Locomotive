var Clock = require('../lib/clock')
var Dispatcher = require('../lib/dispatcher')

module.exports = Core

function Core(engine, options) {

    var clock = Dispatcher()
    Clock(1000).onTick = clock.trigger

    engine.clock = {}
    engine.clock.start = clock.start
    engine.clock.stop = clock.stop
    engine.clock.bind = clock.bind
    engine.clock.unbind = clock.unbind
    engine.log = log
    engine.error = error

    function log(    ) { console.log.apply(console, arguments) }
    function error(err) { throw new Error(err) }
}
