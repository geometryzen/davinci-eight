var Vector3 = require('../math/Vector3');
var Color = require('../core/Color');
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
    function Face3(a, b, c, vertexNormals) {
        if (vertexNormals === void 0) { vertexNormals = []; }
        this.normal = new Vector3();
        this.color = new Color();
        this.a = a;
        this.b = b;
        this.c = c;
        this.vertexNormals = vertexNormals;
    }
    Face3.prototype.clone = function () {
        var face = new Face3(this.a, this.b, this.c);
        face.normal = Vector3.copy(this.normal);
        face.color = Color.copy(this.color);
        face.materialIndex = this.materialIndex;
        for (var i = 0, il = this.vertexNormals.length; i < il; i++) {
            face.vertexNormals[i] = Vector3.copy(this.vertexNormals[i]);
        }
        for (var i = 0, il = this.vertexColors.length; i < il; i++) {
            face.vertexColors[i] = Color.copy(this.vertexColors[i]);
        }
        for (var i = 0, il = this.vertexTangents.length; i < il; i++) {
            face.vertexTangents[i] = Vector3.copy(this.vertexTangents[i]);
        }
        return face;
    };
    return Face3;
})();
module.exports = Face3;
