var Rect = require('./rect');
var UidRegistry = require('./uid-registry');

module.exports = QuadTree;

function QuadTree(size, maxLeafsPerNode, maxDepth, x, y) {
    var LeafUid = UidRegistry();
    var leafData = {};
    var fallenLeafs = [];

    size = size || 4096;
    maxLeafsPerNode = maxLeafsPerNode || 4;
    maxDepth = maxDepth || 5;
    x = typeof x == 'number' ? x : -(size / 2);
    y = typeof y == 'number' ? y : -(size / 2);

    if(typeof size != 'number' || (size & (size - 1)) != 0) { throw new Error('Bad size. Must be to the power of by 2.'); }
    if(typeof maxLeafsPerNode != 'number' || maxLeafsPerNode < 1) { throw new Error('bad maxLeafsPerNode. Must be greater than 0.'); }
    if(typeof maxDepth != 'number' || maxDepth < 1) { throw new Error('bad maxDepth. Must be greater than 0.'); }

    var quadTree = Node(x, y, size, 0);

    var api = {};
    api.root = quadTree;
    api.insert = insert;
    api.get = get;
    api.remove = remove;
    return api;

    function Node(x, y, size, depth) {
        var node = Rect(x, y, size, size);
        node.leafs = [];
        node.depth = depth;
        return node;
    }

    function Leaf(data) {
        if(fallenLeafs[0]) {
            var leaf = fallenLeafs.shift();
            leaf.x = data.x;
            leaf.y = data.y;
            leaf.width = data.width;
            leaf.height = data.height;
        } else {
            var leaf = Rect(data.x, data.y, data.width, data.height);
        }
        leaf.uid = LeafUid();
        leafData[leaf.uid] = data;
        return leaf;
    }

    function insert(data) {
        return insertLeaf(quadTree, Leaf(data));
    }

    function get(rect) {
        var leafs = getLeaf(quadTree, rect);
        var results = [];
        var uids = [];
        while(leafs[0]) {
            var leaf = leafs.shift();
            if(uids.indexOf(leaf.uid) == -1) {
                uids.push(leaf.uid);
                results.push(leafData[leaf.uid]);
            }
        }
        return results;
    }

    function remove(rect, data) {
        if(data != undefined) {
            var leafs = removeLeaf(quadTree, rect, filter);
        } else {
            var leafs = removeLeaf(quadTree, rect);
        }

        var results = [];
        var uids = [];
        while(leafs[0]) {
            var leaf = leafs.shift();
            fallenLeafs.push(leaf);
            if(uids.indexOf(leaf.uid) == -1) {
                results.push(leafData[leaf.uid]);
                LeafUid.clear(leaf.uid);
                uids.push(leaf.uid);
            }
        }
        return results;

        function filter(leaf) {
            return leafData[leaf.uid] == data;
        }
    }

    function insertLeaf(node, leaf) {
        if(node.depth == 0 && !Rect.contains(quadTree, leaf)) {
            grow(leaf);
        } else if(node.leafs) {
            node.leafs.push(leaf);
            if(
                node.depth < maxDepth - 1 &&
                node.width > 2 &&
                node.leafs[maxLeafsPerNode - 1]
            ) {
                splitNode(node);
            }
        } else {
            if(Rect.overlaps(node.q0, leaf)) { insertLeaf(node.q0, leaf); }
            if(Rect.overlaps(node.q1, leaf)) { insertLeaf(node.q1, leaf); }
            if(Rect.overlaps(node.q2, leaf)) { insertLeaf(node.q2, leaf); }
            if(Rect.overlaps(node.q3, leaf)) { insertLeaf(node.q3, leaf); }
        }
    }

    function getLeaf(node, rect) {
        var leafs = [];

        if(node.leafs) {
            for(var iI = 0; iI < node.leafs.length; iI += 1) {
                if(Rect.overlaps(rect, node.leafs[iI])) {
                    leafs.push(node.leafs[iI]);
                }
            }
        } else {
            if(Rect.overlaps(node.q0, leaf)) { leafs = leafs.concat(getLeaf(node.q0, rect)); }
            if(Rect.overlaps(node.q1, leaf)) { leafs = leafs.concat(getLeaf(node.q1, rect)); }
            if(Rect.overlaps(node.q2, leaf)) { leafs = leafs.concat(getLeaf(node.q2, rect)); }
            if(Rect.overlaps(node.q3, leaf)) { leafs = leafs.concat(getLeaf(node.q3, rect)); }
        }

        return leafs;
    }

    function removeLeaf(node, rect, callback) {
        var leafs = [];

        if(node.leafs) {
            for(var iI = 0; iI < node.leafs.length; iI += 1) {
                if(Rect.overlaps(rect, node.leafs[iI])) {
                    if(callback != undefined && callback(node.leafs[iI]) == false) { continue; }
                    leafs.push(node.leafs.splice(iI, 1)[0]);
                    iI -= 1;
                }
            }
        } else {
            var empty = true;
            if(Rect.overlaps(rect, node.q0)) { leafs = leafs.concat(removeLeaf(node.q0, rect, callback)); }
            if(Rect.overlaps(rect, node.q1)) { leafs = leafs.concat(removeLeaf(node.q1, rect, callback)); }
            if(Rect.overlaps(rect, node.q2)) { leafs = leafs.concat(removeLeaf(node.q2, rect, callback)); }
            if(Rect.overlaps(rect, node.q3)) { leafs = leafs.concat(removeLeaf(node.q3, rect, callback)); }
            if(empty && (!node.q0.leafs || node.q0.leafs[0])) { empty = false; }
            if(empty && (!node.q1.leafs || node.q1.leafs[0])) { empty = false; }
            if(empty && (!node.q2.leafs || node.q2.leafs[0])) { empty = false; }
            if(empty && (!node.q3.leafs || node.q3.leafs[0])) { empty = false; }
            if(empty) { mergeNode(node); }
        }

        return leafs;
    }

    function splitNode(node) {
        var halfSize = node.width / 2;
        node.q0 = Node(node.x, node.y, halfSize, node.depth + 1);
        node.q1 = Node(node.x + halfSize, node.y, halfSize, node.depth + 1);
        node.q2 = Node(node.x, node.y + halfSize, halfSize, node.depth + 1);
        node.q3 = Node(node.x + halfSize, node.y + halfSize, halfSize, node.depth + 1);
        var leafs = node.leafs;
        node.leafs = undefined;
        while(leafs[0]) { insertLeaf(node, leafs.shift()); }
    }

    function mergeNode(node) {
        node.leafs = [];
    }

    function grow(leaf) {
        //TODO: compute the new size rather than taking stabs at it.
        var newSize = quadTree.width * 2;
        var leafs = getLeaf(quadTree, quadTree);
        if(leaf.cy < quadTree.cy) {
            if(leaf.cx < quadTree.cx) {
                var x = quadTree.x - quadTree.width;
                var y = quadTree.y - quadTree.width;
            } else {
                var x = quadTree.x;
                var y = quadTree.y - quadTree.width;
            }
        } else {
            if(leaf.cx < quadTree.cx) {
                var x = quadTree.x - quadTree.width;
                var y = quadTree.y;
            } else {
                var x = quadTree.x;
                var y = quadTree.y;
            }
        }
        api.root = quadTree = Node(x, y, newSize, 0);
        while(leafs[0]) { insertLeaf(quadTree, leafs.shift()); }
        insertLeaf(quadTree, leaf);
    }
}
