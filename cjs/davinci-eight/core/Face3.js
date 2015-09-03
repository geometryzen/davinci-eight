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
     * @param normals {Cartesian3[]} The per-vertex normals for this face (3) or face normal (1).
     */
    function Face3(a, b, c, normals) {
        if (normals === void 0) { normals = []; }
        this.a = a;
        this.b = b;
        this.c = c;
        this.normals = normals;
    }
    return Face3;
})();
module.exports = Face3;
