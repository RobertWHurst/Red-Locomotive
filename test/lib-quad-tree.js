var RL = require('../');
var should = require('should');


describe('Leaf', function() {

    var leafA;
    beforeEach(function() {
        leafA = new RL.QuadTree.Leaf({x:0, y:10, width:100, height:50}, 'leafA');
    });

    describe('.data', function() {
        it('should be equal to the data given to the leaf constructor', function() {
            leafA.data.should.be.equal('leafA');
        });
    });
});


describe('Node', function() {

    var node, leafA, leafB;
    beforeEach(function() {
        node = new RL.QuadTree.Node(
            0,
            0,
            128,
            0,
            2,
            2
        );
        leafA = new RL.QuadTree.Leaf({
            x: 0,
            y: 10,
            width: 64,
            height: 54
        }, 'leafA');
        leafB = new RL.QuadTree.Leaf({
            x: 64,
            y: 10,
            width: 64,
            height: 54
        }, 'leafB');
    });

    describe('.leafs', function() {
        it('should be an array', function() {
            node.leafs.should.be.instanceOf(Array);
        });
    });

    describe('.depth', function() {
        it('should be a number', function() {
            node.depth.should.be.a('number');
        });
    });

    describe('.maxDepth', function() {
        it('should be a number', function() {
            node.maxDepth.should.be.a('number');
        });
    });

    describe('.maxLeafs', function() {
        it('should be a number', function() {
            node.maxLeafs.should.be.a('number');
        });
    });

    describe('.split', function() {
        it('should split the node into four sub nodes', function() {
            node.split();
            should.exist(node.q0);
            should.exist(node.q1);
            should.exist(node.q2);
            should.exist(node.q3);
            should.not.exist(node.leafs);
        });
        it('should migrate leafs from the node into the correct sub nodes', function() {
            node.insertLeaf(leafA);
            node.split();
            node.q0.leafs[0].data.should.be.equal('leafA');
        });
    });

    describe('.merge', function() {
        it('should merge sub nodes into the parent node', function() {
            node.split();
            node.merge();
            should.not.exist(node.q0);
            should.not.exist(node.q1);
            should.not.exist(node.q2);
            should.not.exist(node.q3);
            should.exist(node.leafs);
        });
        it('should migrate leafs from the sub nodes into the node', function() {
            node.leafs.push(leafA);
            node.split();
            node.merge();
            node.leafs[0].data.should.be.equal('leafA');
        });
    });

    describe('.insertLeaf', function() {
        beforeEach(function() {
            node.insertLeaf(leafA);
        });
        it('should insert a leaf into the node', function() {
            node.leafs[0].data.should.be.equal('leafA');
        });
        it('should automatically split the node once the the number of leafs in the node exceed maxLeafs', function() {
            node.insertLeaf(leafB);
            node.q0.leafs[0].data.should.be.equal('leafA');
            node.q1.leafs[0].data.should.be.equal('leafB');
        });
    });

    describe('.getLeaf', function() {
        beforeEach(function() {
            node.insertLeaf(leafA);
            node.insertLeaf(leafB);
        });
        it('should return leafs that overlap a given rect', function() {
            var leafs = node.getLeaf(node);
            leafs[0].data.should.be.equal('leafA');
            leafs[1].data.should.be.equal('leafB');
        });
    });

    describe('.removeLeaf', function() {
        beforeEach(function() {
            node.insertLeaf(leafA);
            node.insertLeaf(leafB);
        });
        it('should return leafs that overlap a given rect and remove them from the node', function() {
            node.removeLeaf(leafA);
            node.q1.leafs[0].data.should.be.equal('leafB');
            should.not.exist(node.leafs);
            should.not.exist(node.q0.leafs[0]);
            should.exist(node.q0);
            should.exist(node.q1);
            should.exist(node.q2);
            should.exist(node.q3);
        });
    });
});


describe('QuadTree', function() {

    var quadTree, rectA, rectB;
    beforeEach(function() {
        rectA = {x:0, y:0, width:128, height:128};
        rectB = {x:-128, y:-128, width:128, height:128};
        quadTree = new RL.QuadTree(128, 4, 16, 0, 0);
    });

    describe('.root', function() {
        it('should be a RL.QuadTree.Node instance', function() {
            quadTree.root.should.be.instanceOf(RL.QuadTree.Node);
        });
    });

    describe('.insert', function() {
        it('should insert data to the tree', function() {
            quadTree.insert(rectA, 'dataA');
            quadTree.root.leafs[0].data.should.be.equal('dataA');
        });
        it('should grow the tree if the rectangle is outside of the quadTree', function() {
            quadTree.insert(rectA, 'dataA');
            quadTree.insert(rectB, 'dataB');
            quadTree.root.width.should.be.equal(256);
            quadTree.root.height.should.be.equal(256);
            quadTree.root.x.should.be.equal(-128);
            quadTree.root.y.should.be.equal(-128);
        });
    });

    describe('.get', function() {
        it('should retrive data to the tree', function() {
            quadTree.insert(rectA, 'dataA');
            var results = quadTree.get(rectA);
            results[0].data.should.be.equal('dataA');
        });
    });

    describe('.remove', function() {
        it('should remove data to the tree', function() {
            quadTree.insert(rectA, 'dataA');
            var results = quadTree.remove(rectA);
            results[0].data.should.be.equal('dataA');
            should.not.exist(quadTree.root.leafs[0]);
        });
    });
});
