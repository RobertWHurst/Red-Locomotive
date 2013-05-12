module.exports = UidRegistry;

function UidRegistry() {
    var uids = [];

    Uid.clear = clearUid;
    return Uid;

    function Uid(id) {
        id = id || '';
        var uid = id || '1';
        var i = 2;
        while(uids.indexOf(uid) != -1) {
            uid = id + i;
            i += 1;
        }
        uids.push(uid);
        return uid;
    }
    function clearUid(uid) {
        uids.splice(uids.indexOf(uid), 1);
    }
}
