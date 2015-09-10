var isUndefined = require('../checks/isUndefined');
var Vector3 = require('../math/Vector3');
var makeFaceNormalCallback = require('../dfx/makeFaceNormalCallback');
// Remark: If positions are defined as VectorN (as they may be), then normals must be custom.
var FaceVertex = (function () {
    function FaceVertex(position, normal) {
        this.attributes = {};
        this.position = position;
        this.normal = normal;
    }
    Object.defineProperty(FaceVertex.prototype, "parent", {
        get: function () {
            return this._parent;
        },
        set: function (value) {
            this._parent = value;
            if (isUndefined(this.normal)) {
                // Interesting how we start out as a Vector3.
                this.normal = new Vector3();
                this.normal.callback = makeFaceNormalCallback(this._parent);
            }
        },
        enumerable: true,
        configurable: true
    });
    return FaceVertex;
})();
module.exports = FaceVertex;
