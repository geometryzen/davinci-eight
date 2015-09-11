var isUndefined = require('../checks/isUndefined');
var Vector3 = require('../math/Vector3');
var makeSimplex3NormalCallback = require('../dfx/makeSimplex3NormalCallback');
// Remark: If positions are defined as VectorN (as they may be), then normals must be custom.
var Simplex3Vertex = (function () {
    function Simplex3Vertex(position, normal) {
        this.attributes = {};
        this.position = position;
        this.normal = normal;
    }
    Object.defineProperty(Simplex3Vertex.prototype, "parent", {
        get: function () {
            return this._parent;
        },
        set: function (value) {
            this._parent = value;
            if (isUndefined(this.normal)) {
                this.normal = new Vector3();
                this.normal.callback = makeSimplex3NormalCallback(this._parent);
            }
        },
        enumerable: true,
        configurable: true
    });
    return Simplex3Vertex;
})();
module.exports = Simplex3Vertex;
