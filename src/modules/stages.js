var UidRegistry = require('../lib/uid-registry');
var QuadTree = require('../lib/quad-tree');
var t = require('../lib/tools');

module.exports = function(engine, config) {
    var StageUid = UidRegistry();
    var Element = engine.Element;

    engine.Stage = Stage;

    function Stage(id) {
        Element.call(this, id);
        this._upgrade();
    }
    t.inherit(Stage, Element);
};
