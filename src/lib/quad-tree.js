var Rect = require('./rect');

module.exports = QuadTree;

function QuadTree(size, maxLeafsPerNode, maxDepth, x, y) {

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
    api.empty = empty;
    return api;

    function Node(x, y, size, depth) {
        var node = {
            x: x,
            y: y,
            width: size,
            height: size
        };
        node.leafs = [];
        node.depth = depth;
        return node;
    }

    function Leaf(rect, data) {
        var leaf = {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            data: data
        };
        return leaf;
    }

    function insert(rect, data) {
        return insertLeaf(quadTree, Leaf(rect, data));
    }

    function get(rect, data) {
        var leafs = [];
        if(data != undefined) {
            getLeaf(leafs, quadTree, rect, dataFilter);
        } else {
            getLeaf(leafs, quadTree, rect);
        }

        var results = [];
        var uniqueLeafs = [];
        while(leafs[0]) {
            var leaf = leafs.shift();
            if(uniqueLeafs.indexOf(leaf) != -1) { continue; }
            uniqueLeafs.push(leaf);
            var result = {};
            result.rect = Rect(leaf.x, leaf.y, leaf.width, leaf.height);
            if(leaf.data != undefined) { result.data = leaf.data; }
            results.push(result);
        }
        return results;

        function dataFilter(leaf) {
            return leaf.data == data;
        }
    }

    function remove(rect, data) {
        var leafs =[];
        if(data != undefined) {
            getLeaf(leafs, quadTree, rect, data);
        } else {
            getLeaf(leafs, quadTree, rect);
        }

        var results = [];
        var uniqueLeafs = [];
        while(leafs[0]) {
            var leaf = leafs.shift();
            if(uniqueLeafs.indexOf(leaf) != -1) { continue; }
            uniqueLeafs.push(leaf);

            var result = {};
            result.rect = Rect(leaf.x, leaf.y, leaf.width, leaf.height);
            if(leaf.data != undefined) { result.data = leaf.data; }
            results.push(result);

            removeLeaf(quadTree, leaf);
        }
        return results;
    }

    function empty() {
        quadTree = api.root = Node(x, y, size, 0);
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

    function getLeaf(leafs, node, rect, data) {
        if(node.leafs) {
            for(var iI = 0, ln = node.leafs.length; iI < ln; iI += 1) {
                if(Rect.overlaps(rect, node.leafs[iI])) {
                    if(data != undefined && node.leafs[iI].data != data) { continue; }
                    leafs.push(node.leafs[iI]);
                }
            }
        } else {
            if(Rect.overlaps(node.q0, rect)) { getLeaf(leafs, node.q0, rect, data); }
            if(Rect.overlaps(node.q1, rect)) { getLeaf(leafs, node.q1, rect, data); }
            if(Rect.overlaps(node.q2, rect)) { getLeaf(leafs, node.q2, rect, data); }
            if(Rect.overlaps(node.q3, rect)) { getLeaf(leafs, node.q3, rect, data); }
        }

        return leafs;
    }

    function removeLeaf(node, leaf) {
        if(node.leafs) {
            for(var iI = 0, ln = node.leafs.length; iI < ln; iI += 1) {
                if(leaf == node.leafs[iI]) {
                    node.leafs.splice(iI, 1);
                    iI -= 1; ln -= 1;
                }
            }
        } else {
            var empty = true;
            if(Rect.overlaps(leaf, node.q0)) { removeLeaf(node.q0, leaf); }
            if(Rect.overlaps(leaf, node.q1)) { removeLeaf(node.q1, leaf); }
            if(Rect.overlaps(leaf, node.q2)) { removeLeaf(node.q2, leaf); }
            if(Rect.overlaps(leaf, node.q3)) { removeLeaf(node.q3, leaf); }
            if(empty && (!node.q0.leafs || node.q0.leafs[0])) { empty = false; }
            if(empty && (!node.q1.leafs || node.q1.leafs[0])) { empty = false; }
            if(empty && (!node.q2.leafs || node.q2.leafs[0])) { empty = false; }
            if(empty && (!node.q3.leafs || node.q3.leafs[0])) { empty = false; }
            if(empty) { mergeNode(node); }
        }
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
        node.q0 = undefined;
        node.q1 = undefined;
        node.q2 = undefined;
        node.q3 = undefined;
        node.leafs = [];
    }

    function grow(leaf) {
        //TODO: compute the new size rather than taking stabs at it.
        var newSize = quadTree.width * 2;
        var leafs = [];
        getLeaf(leafs, quadTree, quadTree);
        if(leaf.y + (leaf.height / 2) < quadTree.y + (quadTree.height / 2)) {
            if(leaf.x + (leaf.width / 2) < quadTree.x + (quadTree.width / 2)) {
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
