var baseStr = 'abcdefghijklmnopqrstuvwxyz01234567890';
var baseStrLn = baseStr.length;

function UidRegistry() {
    this.uids = [];
}
UidRegistry.prototype.generate = function(uid) {
    if(uid != undefined) {
        if(this.uids.indexOf(uid) > -1) {
            throw new Error('uid "' + uid + '" already in use.');
        }
        this.uids.push(uid);
        return uid;
    } else {
        uid = '';
        while(!uid || this.uids.indexOf(uid) != -1) {
            var i = 5;
            while(i--) { uid += baseStr[Math.floor(Math.random() * baseStrLn)]; }
        }
        this.uids.push(uid);
        return uid;
    }
};
UidRegistry.prototype.clear = function(uid) {
    this.uids.splice(this.uids.indexOf(uid), 1);
};

module.exports = UidRegistry;
