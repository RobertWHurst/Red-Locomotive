var UidRegistry = require('../').UidRegistry;

describe('UidRegistry()', function() {
    it('should return a uidRegistry instance', function() {
        var uidRegistry = UidRegistry();
        if(typeof uidRegistry != 'function') { throw new Error('uidRegistry must be a function'); }
    });
});
describe('uidRegistry()', function() {
    var uidRegistry;
    beforeEach(function() {
        uidRegistry = UidRegistry();
    });
    it('should return a uid', function() {
        var uids = [];
        var uidTestRange = 500;
        var i = uidTestRange;
        while(i--) { uids.push(uidRegistry('uid')); }
        for(i = 0; i < uidTestRange; i++) {
            var a = uids[i];
            for(var ii = 0; ii < uidTestRange; ii++) {
                if(ii == i) { continue; }
                var b = uids[ii];
                if(a == b) { throw new Error('uid collision. uids must be unique'); }
            }
        }
    });
});