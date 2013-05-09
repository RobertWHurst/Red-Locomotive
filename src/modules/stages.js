var UidRegistry = require('../lib/uid-registry');
var QuadTree = require('../lib/quad-tree');

module.exports = Stages;

function Stages(engine, config){
    var StageUid = UidRegistry();
    var Element = engine.Element;

    var stages = {};

    engine.Stage = Stage;

    function Stage(id) {
        var uid = StageUid(id);

        var stage = {};
        stage.uid = uid;
        stage.index = QuadTree();
        stage.redraw = true; //set to true for first draw

        stages[uid] = stage;

        var api = {};
        api.uid = uid;

        //stage api
        api.clear = clear;

        //children api
        api.append = appendChild;
        api.remove = removeChild;

        return api;

        function clear() {
            delete stages[uid];
            StageUid.clear(uid);
        }

        function appendChild(api) {
            var element = Element.rawAccess(api);
            element.parent = stage;
            stage.redraw = true;
            stage.index.insert(element);
        }

        function removeChild(api) {
            var element = Element.rawAccess(api);
            stage.redraw = true;
            stage.index.remove(element, element);
            delete element.parent;
        }
    }
}
