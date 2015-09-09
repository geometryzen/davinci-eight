var Vector3 = require('../math/Vector3');
function makeFaceNormalCallback(face) {
    return function () {
        var vA = face.a.position;
        var vB = face.b.position;
        var vC = face.c.position;
        // TODO: rework this so that it does not create any temporary objects, other than the final number[].
        var cb = new Vector3().subVectors(vC, vB);
        var ab = new Vector3().subVectors(vA, vB);
        var normal = new Vector3().crossVectors(cb, ab).normalize();
        return [normal.x, normal.y, normal.z];
    };
}
module.exports = makeFaceNormalCallback;
