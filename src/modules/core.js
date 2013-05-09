var Clock = require('../lib/clock')
var Dispatcher = require('../lib/dispatcher')

module.exports = Core

function Core(engine, options) {

    var clock = Dispatcher()
    Clock(1000).onTick = clock.trigger

    var tanMap = {}
    var sinMap = {}
    var cosMap = {}
    var atanMap = {}
    var asinMap = {}
    var acosMap = {}

    engine.clock = {}
    engine.clock.start = clock.start
    engine.clock.stop = clock.stop
    engine.clock.bind = clock.bind
    engine.clock.unbind = clock.unbind
    engine.random = random
    engine.distance = distance
    engine.degree = degree
    engine.vector = vector
    engine.coords = coords
    engine.tan = tan
    engine.sin = sin
    engine.cos = cos
    engine.atan = atan
    engine.asin = asin
    engine.acos = acos
    engine.log = log
    engine.error = error

    function random(limit) {
        return Math.floor(Math.random() * (limit || 100)) || 0
    }

    /**
     * Returns the distance from an x and y offset
     * @param x
     * @param y
     */
    function distance(x, y) {

        x = x < 0 ? -x : x
        y = y < 0 ? -y : y

        //use pythagoras theorem to find the distance.
        return Math.sqrt(Math.pow(y, 2) + Math.pow(x, 2))
    }

    function quad(x, y) {
        if(x > -1) {
            if(y < 0) {
                //q0
                return { 'q': 0, 'o': x, 'a': -y }
            } else {
                //q1
                return { 'q': 1, 'o': y, 'a': x }
            }
        } else {
            if(y > -1) {
                //q2
                return { 'q': 2, 'o': -x, 'a': y }
            } else {
                //q3
                return { 'q': 3, 'o': y, 'a': -x }
            }
        }
    }

    function aquad(degree, o, a) {
        if(degree < 90) {
            //q0
            return { 'x': o, 'y': -a }
        } else if (degree < 180) {
            //q1
            return { 'x': a, 'y': o }
        } else if (degree < 270) {
            //q2
            return { 'x': -o, 'y': a }
        } else {
            //q3
            return { 'x': -a, 'y': -o }
        }
    }

    function degree90(a, b) {

        //rectify a and b
        a = a < 0 ? -a : a
        b = b < 0 ? -b : b

        return atan(a / b)
    }

    /**
     * Returns degree of an x and y offset.
     * @param x
     * @param y
     */
    function degree(x, y) {

        //quadrify x and y
        var t = quad(x, y)
        return degree90(t.o, t.a) + (90 * t.q)

    }

    function vector(xDistance, yDistance) {
        return [degree(xDistance, yDistance), distance(xDistance, yDistance)]
    }

    /**
     * Returns the end coordinates of a vector starting at 0, 0.
     * @param degree
     * @param distance
     */
    function coords(degree, distance) {

        //if the distance is less than one whole pixel then return 0 x 0 y
        if(distance < 1) { return {'x': 0, 'y': 0} }

        var degree90 = degree % 90

        //get the opposite and adjacent
        var o = Math.round(sin(degree90) * distance)
        var a = Math.round(cos(degree90) * distance)

        //interse quadrify
        return aquad(degree, o, a)
    }

    function tan(input) {
        if (!tanMap[input]) {
            tanMap[input] = Math.tan(input * Math.PI / 180)
        }
        return tanMap[input]
    }

    function sin(input) {
        if (!sinMap[input]) {
            sinMap[input] = Math.sin(input * Math.PI / 180)
        }
        return sinMap[input]
    }

    function cos(input) {
        if (!cosMap[input]) {
            cosMap[input] = Math.cos(input * Math.PI / 180)
        }
        return cosMap[input]
    }

    function atan(input) {
        if (!atanMap[input]) {
            atanMap[input] = Math.atan(input) / Math.PI * 180
        }
        return atanMap[input]
    }

    function asin(input) {
        if (!asinMap[input]) {
            asinMap[input] = Math.asin(input) / Math.PI * 180
        }
        return asinMap[input]
    }

    function acos(input) {
        if (!acosMap[input]) {
            acosMap[input] = Math.acos(input) / Math.PI * 180
        }
        return acosMap[input]
    }

    /**
     * Draws everything!!!
     */
    // function draw() {
        
    //     var viewports = engine.viewport.get('all'),
    //         elements = engine.element.get('all'),
    //         viewport,
    //         element,
    //         x,
    //         y,
    //         stack

    //     //loop through each viewport
    //     for (var viewportName in viewports) {
    //         if (viewports.hasOwnProperty(viewportName)) {
    //             viewport = viewports[viewportName]

    //             //clear the stack
    //             stack = []

    //             //get the viewport context
    //             var context = viewport.bitmap.context

    //             //empty the viewport
    //             if(viewport.fillStyle) {
    //                 context.fillStyle = viewport.fillStyle
    //                 context.fillRect(0, 0, viewport.width, viewport.height)
    //             } else {
    //                 context.clearRect(0, 0, viewport.width, viewport.height)
    //             }

    //             //sort the elements
    //             for (var elementName in elements) {
    //                 if (elements.hasOwnProperty(elementName)) {

    //                     //get the element
    //                     element = elements[elementName]

    //                     x = element.x - viewport.x
    //                     y = element.y - viewport.y

    //                     //Make sure the element is in view
    //                     if (
    //                         x + element.width > 0 && x < viewport.width - 1 &&
    //                         y + element.height > 0 && y < viewport.height - 1
    //                     ) {

    //                         //store the element in a stack sorted by z height
    //                         if (!stack[element.z]) {
    //                             stack[element.z] = []
    //                         }
    //                         stack[element.z].push(element)
    //                     }
    //                 }
    //             }

    //             //anounce a new draw cycle and pass the stack to it
    //             newEvent('draw', stack)

    //             //draw the new content
    //             for (var z in stack) {
    //                 if (stack.hasOwnProperty(z)) {
    //                     for (var i = 0 i < stack[z].length i += 1) {

    //                         //get the element
    //                         element = stack[z][i]

    //                         //Errors
    //                         if(typeof element.spriteSheet !== 'object') { error('Element "' + element.name + '" does not have a spriteSheet.') }
    //                         if(typeof element.spriteSheet.sprites !== 'object') { error('SpriteSheet "' + element.spriteSheet.name + '" does not have a sprites array.') }
    //                         if(typeof element.spritePos !== 'object') { error('Element "' + element.name + '" does not have a spritePos array.') }
    //                         if(typeof element.spritePos[0] !== 'number') { error('Element "' + element.name + '"\'s spritePos array doesn\'t have an X position.') }
    //                         if(typeof element.spritePos[1] !== 'number') { error('Element "' + element.name + '"\'s spritePos array doesn\'t have a Y position.') }
    //                         if(typeof element.spriteSheet.sprites[element.spritePos[0]] !== 'object') { error('SpriteSheet "' + element.spriteSheet.name + '" does not have a sprite at "' + element.spritePos[0] + '" X.') }
    //                         if(typeof element.spriteSheet.sprites[element.spritePos[0]][element.spritePos[1]] !== 'object') { error('SpriteSheet "' + element.spriteSheet.name + '" does not have a sprite at "' + element.spritePos[0] + '" X and "' + element.spritePos[1] + '" Y.') }
    //                         if(typeof element.spriteSheet.sprites[element.spritePos[0]][element.spritePos[1]].canvas[0] !== 'object') { error('SpriteSheet "' + element.spriteSheet.name + '"\'s sprite at "' + element.spritePos[0] + '" X and "' + element.spritePos[1] + '" Y does not have a bitmap.') }


    //                         //x and y
    //                         x = element.x - viewport.x
    //                         y = element.y - viewport.y

    //                         var sprite = element.spriteSheet.sprites[element.spritePos[0]][element.spritePos[1]],
    //                             imageData = sprite.canvas[0]

    //                         //draw to the context
    //                         viewport.bitmap.context.drawImage(imageData, x, y)

    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }

    function log(    ) { console.log.apply(console, arguments) }
    function error(err) { throw new Error(err) }
}
