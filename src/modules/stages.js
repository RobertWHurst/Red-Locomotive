var UidRegistry = require('../lib/uid-registry');
var QuadTree = require('../lib/quad-tree');

module.exports = Stages;

function Stages(engine, config){
    var StageUid = UidRegistry();
    var Element = engine.Element;

    var stages = {};

    engine.Stage = Stage;
    engine.Stage.rawAccess = rawAccess;

    function Stage(id) {

        var stage = Element.rawAccess(Element(id));
        stages[stage.uid] = stage;

        var api = {};
        api.uid = stage.uid;

        //stage api
        api.clear = stage.api.clear;

        //children api
        api.append = stage.api.append;
        api.remove = stage.api.remove;

        return api;
    }

    function rawAccess(api) {
        return stages[api.uid];
    }
}
