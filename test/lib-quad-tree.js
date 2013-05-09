var QuadTree = require('../').QuadTree;

describe('QuadTree()', function() {
    it('should return a quadTree instance', function() {
        var q = QuadTree();
        if(typeof q != 'object') { throw new Error('quadTree must be an object'); }
        if(typeof q.root != 'object') { throw new Error('quadTree.root must be a object'); }
        if(typeof q.insert != 'function') { throw new Error('quadTree.insert must be a function'); }
        if(typeof q.remove != 'function') { throw new Error('quadTree.remove must be a function'); }
        if(typeof q.get != 'function') { throw new Error('quadTree.get must be a function'); }
    });
    it('should accept a custom inital size', function() {
        try{
            QuadTree(100);
            throw new Error('quadTree size must be enforced to be a power of two');
        } catch(e) {}
        var q = QuadTree(256);
        if(q.root.width != 256) { throw new Error('quadTree size incorrect'); }
    });
    it('should accept a custom maximum leafs per node', function() {
        var q = QuadTree(null, 2);
        q.insert({x:-100,y:-100,width:100,height:100});
        q.insert({x:100,y:-100,width:100,height:100});
        if(q.root.leafs) { throw new Error('quadTree should have split'); }
        if(!q.root.q0.leafs[0]) { throw new Error('quadTree root.q0 should have one leaf'); }
        if(!q.root.q1.leafs[0]) { throw new Error('quadTree root.q1 should have one leaf'); }
    });
    it('should accept a custom maximum tree depth', function() {
        var q = QuadTree(null, 1, 1);
        q.insert({x:-100,y:-100,width:100,height:100});
        q.insert({x:100,y:-100,width:100,height:100});
        if(!q.root.leafs) { throw new Error('quadTree should have not have split'); }
        if(!q.root.leafs[1]) { throw new Error('quadTree root should have two leafs'); }
    });
    it('should accept a custom initial x and y position', function() {
        var q = QuadTree(null, null, null, 200, 100);
        if(q.root.x != 200) { throw new Error('quadTree root.x should be 200'); }
        if(q.root.y != 100) { throw new Error('quadTree root.x should be 100'); }
    });
});

describe('quadTree{}', function() {
    var q;

    beforeEach(function() {
        q = QuadTree(128, 4);
    });

    it('should index inserted data', function() {
        var data = {x: 0, y: 0, width: 100, height: 100};
        q.insert(data);
        var leaf = q.root.leafs[0];
        if(leaf.x != data.x) { throw new Error('leaf did not mach x coordinate'); }
        if(leaf.y != data.y) { throw new Error('leaf did not mach y coordinate'); }
        if(leaf.width != data.width) { throw new Error('leaf did not mach width'); }
        if(leaf.height != data.height) { throw new Error('leaf did not mach height'); }
    });

    it('should return inserted data within an given area', function() {
        var data = {x: -64, y: -64, width: 64, height: 64 };
        q.insert(data);
        var results = q.get({x: 0, y: 0, width: 64, height: 64 });
        if(results[0]) { throw new Error('should not return data from empty region'); }
        results = q.get({x: -64, y: -64, width: 64, height: 64 });
        if(results[0] != data) { throw new Error('did not return previously inserted data'); }
    });

    it('should remove inserted data within an given area', function() {
        var data0 = {x: -64, y: -64, width: 64, height: 64 };
        var data1 = {x: 0, y: 0, width: 64, height: 64 };
        q.insert(data0);
        q.insert(data1);
        q.remove({x: 0, y: 0, width: 64, height: 64 });
        if(q.root.leafs[0].x != data0.x) { throw new Error('remaining leaf did not mach x coordinate'); }
        if(q.root.leafs[0].y != data0.y) { throw new Error('remaining leaf did not mach y coordinate'); }
        if(q.root.leafs[0].width != data0.width) { throw new Error('remaining leaf did not mach width'); }
        if(q.root.leafs[0].height != data0.height) { throw new Error('remaining leaf did not mach height'); }
        if(q.root.leafs[1]) { throw new Error('leaf was not removed'); }
    });

    it('should remove only given data when specified', function() {
        var data0 = {x: -64, y: -64, width: 64, height: 64 };
        var data1 = {x: -32, y: -32, width: 64, height: 64 };
        q.insert(data0);
        q.insert(data1);
        q.remove({x: -32, y: -32, width: 64, height: 64 }, data1);
        if(q.root.leafs[0].x != data0.x) { throw new Error('remaining leaf did not mach x coordinate'); }
        if(q.root.leafs[0].y != data0.y) { throw new Error('remaining leaf did not mach y coordinate'); }
        if(q.root.leafs[0].width != data0.width) { throw new Error('remaining leaf did not mach width'); }
        if(q.root.leafs[0].height != data0.height) { throw new Error('remaining leaf did not mach height'); }
        if(q.root.leafs[1]) { throw new Error('leaf was not removed'); }
    });

    it('should split any node once the maximum leaf count has been reached', function() {
        var data = {};
        data.q0 = {x: -64, y: -64, width: 64, height: 64};
        data.q1 = {x: 0, y: -64, width: 64, height: 64};
        data.q2 = {x: -64, y: 0, width: 64, height: 64};
        data.q3 = {x: 0, y: 0, width: 64, height: 64};
        q.insert(data.q0);
        q.insert(data.q1);
        q.insert(data.q2);
        q.insert(data.q3);
        var nodes = ['q0', 'q1', 'q2', 'q3'];
        while(nodes[0]) {
            var node = nodes.shift();
            var leaf = q.root[node].leafs[0];
            if(leaf.x != data[node].x) { throw new Error('leaf did not mach x coordinate'); }
            if(leaf.y != data[node].y) { throw new Error('leaf did not mach y coordinate'); }
            if(leaf.width != data[node].width) { throw new Error('leaf did not mach width'); }
            if(leaf.height != data[node].height) { throw new Error('leaf did not mach height'); }
        }
    });

    it
});
