define(["require", "exports", '../math/Vector3'], function (require, exports, Vector3) {
    /**
     * This only works if the position property has dimensionality 3.
     */
    function makeSimplex3NormalCallback(face) {
        return function () {
            // TODO: rework this so that it does not create any temporary objects, other than the final number[].
            var vA = new Vector3(face.a.position.data);
            var vB = new Vector3(face.b.position.data);
            var vC = new Vector3(face.c.position.data);
            var cb = new Vector3().subVectors(vC, vB);
            var ab = new Vector3().subVectors(vA, vB);
            var normal = new Vector3().crossVectors(cb, ab).normalize();
            return [normal.x, normal.y, normal.z];
        };
    }
    return makeSimplex3NormalCallback;
});
