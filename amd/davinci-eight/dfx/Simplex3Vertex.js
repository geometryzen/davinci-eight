define(["require", "exports", '../checks/isUndefined', '../math/Vector3', '../dfx/makeSimplex3NormalCallback'], function (require, exports, isUndefined, Vector3, makeSimplex3NormalCallback) {
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
    return Simplex3Vertex;
});
