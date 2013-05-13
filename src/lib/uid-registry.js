module.exports = UidRegistry;

var baseStr = 'abcdefghijklmnopqrstuvwxyz01234567890';
var baseStrLn = baseStr.length;
function UidRegistry() {
    var uids = [];

    Uid.clear = clearUid;
    return Uid;

    function Uid(uid) {
        if(uid) {
            if(uids.indexOf(uid) > -1) {
                throw new Error('uid "' + uid + '" already in use.');
            }
            uids.push(uid);
            return uid;
        } else {
            uid = '';
            while(!uid || uids.indexOf(uid) != -1) {
                var i = 5;
                while(i--) { uid += baseStr[Math.floor(Math.random() * baseStrLn)]; }
            }
            uids.push(uid);
            return uid;
        }
    }

    function clearUid(uid) {
        uids.splice(uids.indexOf(uid), 1);
    }
}
