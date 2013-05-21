var RL = require('../');
var should = require('should');

describe('Element', function() {

    var element, elementA, elementB;
    beforeEach(function() {
        var rl = new RL();
        element = new rl.Element();
        elementA = new rl.Element();
        elementB = new rl.Element();
    });

    describe('.uid', function() {
        it('should be a generated uid if an id was not given to the element contructor', function() {
            elementA.uid.should.be.a('string');
            elementB.uid.should.not.equal(element.uid);
        });
        it('should be emutable', function() {
            var uid = element.uid;
            element.uid = 'fakeID';
            element.uid.should.equal(uid);
            element.uid.should.not.equal('fakeID');
        });
    });
    describe('.x', function() {
        it('should be zero by default', function() {
            element.x.should.be.equal(0);
        });
    });
    describe('.y', function() {
        it('should be zero by default', function() {
            element.y.should.be.equal(0);
        });
    });
    describe('.z', function() {
        it('should be zero by default', function() {
            element.z.should.be.equal(0);
        });
    });
    describe('.width', function() {
        it('should be zero by default', function() {
            element.width.should.be.equal(0);
        });
    });
    describe('.height', function() {
        it('should be zero by default', function() {
            element.height.should.be.equal(0);
        });
    });

    //TODO: These need to be added
    describe('.append', function() {});
    describe('.remove', function() {});
    describe('.clear', function() {});
});