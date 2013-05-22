var Rect = require('./rect');
var t = require('./tools');


function Leaf(rect, data) {
    Rect.call(this, rect.x, rect.y, rect.width, rect.height);
    this.data = data;
}
Leaf.prototype = Object.create(Rect.prototype);
Leaf.prototype.constructor = Leaf;


function Node(x, y, size, depth, maxDepth, maxLeafs) {
    Rect.call(this, x, y, size, size);
    this.leafs = [];
    this.depth = depth;
    this.maxDepth = maxDepth;
    this.maxLeafs = maxLeafs;
}
t.inherit(Node, Rect);

Node.prototype.split = function() {

    // figure out the half width.
    var halfSize = this.width / 2;

    // create four nodes, one in each new
    // quadrant.
    this.q0 = new Node(
        this.x,
        this.y,
        halfSize,
        this.depth + 1,
        this.maxDepth,
        this.maxLeafs
    );
    this.q1 = new Node(
        this.x + halfSize,
        this.y,
        halfSize,
        this.depth + 1,
        this.maxDepth,
        this.maxLeafs
    );
    this.q2 = new Node(
        this.x,
        this.y + halfSize,
        halfSize,
        this.depth + 1,
        this.maxDepth,
        this.maxLeafs
    );
    this.q3 = new Node(
        this.x + halfSize,
        this.y + halfSize,
        halfSize,
        this.depth + 1,
        this.maxDepth,
        this.maxLeafs
    );

    //migrate leafs into the new sub nodes.
    var leafs = this.leafs;
    this.leafs = undefined;
    while(leafs[0]) { this.insertLeaf(leafs.shift()); }
};

Node.prototype.merge = function() {

    // migrate all leafs within sub nodes into
    // this node.
    this.leafs = this.getLeaf(this);

    // remove each sub node.
    this.q0 = undefined;
    this.q1 = undefined;
    this.q2 = undefined;
    this.q3 = undefined;
};

Node.prototype.insertLeaf = function(leaf) {
    if(this.leafs) {

        //add the leaf to the node's leaf array.
        this.leafs.push(leaf);

        //if the node is over capacity split it.
        if(
            this.depth < this.maxDepth - 1 &&
            this.width > 2 &&
            this.leafs[this.maxLeafs - 1]
        ) { 
            this.split();
        }

    } else {

        //insert leaf into overlapping sub nodes.
        if(leaf.overlaps(this.q0)) { this.q0.insertLeaf(leaf); }
        if(leaf.overlaps(this.q1)) { this.q1.insertLeaf(leaf); }
        if(leaf.overlaps(this.q2)) { this.q2.insertLeaf(leaf); }
        if(leaf.overlaps(this.q3)) { this.q3.insertLeaf(leaf); }
    }
};

Node.prototype.getLeaf = function(results, rect, data) {

    // if a results array is provided then use it
    // This helps reduce memory usage when
    // recursing.
    //if no results array is given then shift the
    // arguments over to the left 1 position.
    if(
        results.x != undefined &&
        results.y != undefined &&
        results.width != undefined &&
        results.height != undefined
    ) {
        data = rect;
        rect = results;
        results = [];
    }

    if(this.leafs) {

        // seach this node for any leafs within
        // the search rect. If data is given,
        // make sure the search data matches the
        // leaf data.
        for(var iI = 0, ln = this.leafs.length; iI < ln; iI += 1) {
            if(
                this.leafs[iI].overlaps(rect) && 
                (
                    data == undefined ||
                    this.leafs[iI].data == data
                )
            ) {
                results.push(this.leafs[iI]);
            }
        }

    } else {

        // search each sub node for leafs within
        // the rect, and if defined, leafs that
        // share the same data given
        if(this.q0.overlaps(rect)) {
            this.q0.getLeaf(results, rect, data);
        }
        if(this.q1.overlaps(rect)) {
            this.q1.getLeaf(results, rect, data);
        }
        if(this.q2.overlaps(rect)) {
            this.q2.getLeaf(results, rect, data);
        }
        if(this.q3.overlaps(rect)) {
            this.q3.getLeaf(results, rect, data);
        }

    }
    return results;
};
Node.prototype.removeLeaf = function(leaf) {
    if(this.leafs) {

        // find and remove the given leaf from the
        // current node.
        for(var iI = 0, ln = this.leafs.length; iI < ln; iI += 1) {
            if(leaf == this.leafs[iI]) {
                this.leafs.splice(iI, 1);
                iI -= 1;
                ln -= 1;
            }
        }

    } else {

        // remove the given leaf from each sub 
        // node that overlaps the given leaf.
        if(leaf.overlaps(this.q0)) { this.q0.removeLeaf(leaf); }
        if(leaf.overlaps(this.q1)) { this.q1.removeLeaf(leaf); }
        if(leaf.overlaps(this.q2)) { this.q2.removeLeaf(leaf); }
        if(leaf.overlaps(this.q3)) { this.q3.removeLeaf(leaf); }

        // check if the subnodes are empty. if
        // they are then merge them into this
        // node.
        // TODO: It might be a good idea to add a
        // minimum number of leafs prior to a
        // merge.
        var empty = true;
        if(empty && (!this.q0.leafs || this.q0.leafs[0])) { empty = false; }
        if(empty && (!this.q1.leafs || this.q1.leafs[0])) { empty = false; }
        if(empty && (!this.q2.leafs || this.q2.leafs[0])) { empty = false; }
        if(empty && (!this.q3.leafs || this.q3.leafs[0])) { empty = false; }
        if(empty) { this.merge(); }
    }
};


function QuadTree(size, maxLeafs, maxDepth, x, y) {

    size = size || 8192;
    x = x != undefined ? x : -(size / 2);
    y = y != undefined ? y : -(size / 2);
    maxLeafs = maxLeafs || 32;
    maxDepth = maxDepth || 8;

    if(typeof x != 'number') { throw new Error('if given x must be a number'); }
    if(typeof y != 'number') { throw new Error('if given y must be a number'); }
    if(typeof size != 'number' || (size & (size - 1)) != 0) { throw new Error('size must be a number to the power of by two'); }
    if(typeof maxLeafs != 'number' || maxLeafs < 1) { throw new Error('maxLeafs must be a number greater than zero'); }
    if(typeof maxDepth != 'number' || maxDepth < 1) { throw new Error('maxDepth must be greater than zero'); }

    this.root = new Node(
        x,
        y,
        size,
        0,
        maxDepth,
        maxLeafs
    );
}
QuadTree.Node = Node;
QuadTree.Leaf = Leaf;

QuadTree.prototype.insert = function(rect, data) {
    
    // create a leaf.
    var leaf = new Leaf(rect, data);

    // if the rect is outside of the quad tree
    // then grow. Otherwise insert the leaf.
    if(!this.root.contains(rect)) {
        this._grow(leaf);
    } else {
        this.root.insertLeaf(leaf)
    }
};

QuadTree.prototype.get = function(rect, data) {

    // get the leafs from the root node that
    // overlap the search rect, and if provided,
    // share the given data.
    var leafs = this.root.getLeaf(rect, data);

    // Remove duplicate leafs, then take the
    // remaining leafs and format the results so
    // that each results record contains a .rect
    // and .data property.
    var results = [];
    var uniqueLeafs = [];
    while(leafs[0]) {
        var leaf = leafs.shift();
        if(uniqueLeafs.indexOf(leaf) != -1) { continue; }
        uniqueLeafs.push(leaf);
        var result = {};
        result.rect = new Rect(leaf.x, leaf.y, leaf.width, leaf.height);
        if(leaf.data != undefined) { result.data = leaf.data; }
        results.push(result);
    }
    return results;
};

QuadTree.prototype.remove = function(rect, data) {

    // get the leafs from the root node that
    // overlap the search rect, and if provided,
    // share the given data.
    var leafs = this.root.getLeaf(rect, data);

    // Remove duplicate leafs, then take the
    // remaining leafs and format the results so
    // that each results record contains a .rect
    // and .data property. Once each leaf is
    // added to the results, delete the leaf.
    var results = [];
    var uniqueLeafs = [];
    while(leafs[0]) {
        var leaf = leafs.shift();
        if(uniqueLeafs.indexOf(leaf) != -1) { continue; }
        uniqueLeafs.push(leaf);
        var result = {};
        result.rect = new Rect(leaf.x, leaf.y, leaf.width, leaf.height);
        if(leaf.data != undefined) { result.data = leaf.data; }
        results.push(result);
        this.root.removeLeaf(leaf);
    }
    return results;
};

QuadTree.prototype.truncate = function() {

    // replace the entire root node; deleting all
    // data within the previous root node and its
    // tree or sub nodes.
    this.root = new Node(
        this.root.x,
        this.root.y,
        this.root.width,
        0,
        this.root.maxDepth,
        this.root.maxLeafs
    );

};

QuadTree.prototype._grow = function(leaf) {

    var lx = leaf.x;
    var ly = leaf.y;
    var lw = leaf.width;
    var lh = leaf.height;

    var rx = this.root.x;
    var ry = this.root.y;
    var rw = this.root.width;
    var rh = this.root.height;

    // calculate the new position and dimentions
    // of root to contain the new leaf.
    while(lx < rx) {
        rx -= rw;
        rw *= 2;
    }
    while(ly < ry) {
        ry -= rh;
        rh *= 2;
    }
    while(lx + lw > rx + rw) {
        rw *= 2;
    }
    while(ly + lh > ry + rh) {
        rh *= 2;
    }

    // collect all of the leafs from the previous
    // tree and migrate them into the new tree.
    var leafs = [leaf];
    this.root.getLeaf(this.root);

    // create the new root node and migrate the
    // existing data in the current root node
    // into the new root node.
    this.root = new Node(
        rx,
        ry,
        Math.max(rw, rh),
        0,
        this.root.maxDepth + 1,
        this.root.maxLeafs
    );
    while(leafs[0]) { this.root.insertLeaf(leafs.shift()); }
}

module.exports = QuadTree;
