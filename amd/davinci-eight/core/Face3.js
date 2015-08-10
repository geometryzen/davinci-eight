define(["require", "exports", '../math/Vector3'], function (require, exports, Vector3) {
    /**
     * @class Face3
     */
    var Face3 = (function () {
        /**
         * @class Face3
         * @constructor
         * @param a {number}
         * @param b {number}
         * @param c {number}
         * @param normal {Vector3} The face normal.
         * @param vertexNormals {Vector3[]} The per-vertex normals for this face.
         */
        function Face3(a, b, c, normal, vertexNormals) {
            if (normal === void 0) { normal = new Vector3(); }
            if (vertexNormals === void 0) { vertexNormals = []; }
            this.a = a;
            this.b = b;
            this.c = c;
            this.normal = normal;
            this.vertexNormals = vertexNormals;
        }
        return Face3;
    })();
    return Face3;
});
