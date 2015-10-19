define(["require", "exports", '../topologies/GridTopology', '../core/Symbolic', '../math/Vector2', '../math/Vector3'], function (require, exports, GridTopology, Symbolic, Vector2, Vector3) {
    function side(basis, uSegments, vSegments) {
        var normal = Vector3.copy(basis[0]).cross(basis[1]).normalize();
        var aNeg = Vector3.copy(basis[0]).scale(-0.5);
        var aPos = Vector3.copy(basis[0]).scale(+0.5);
        var bNeg = Vector3.copy(basis[1]).scale(-0.5);
        var bPos = Vector3.copy(basis[1]).scale(+0.5);
        var cPos = Vector3.copy(basis[2]).scale(+0.5);
        var side = new GridTopology(uSegments, vSegments);
        for (var uIndex = 0; uIndex < side.uLength; uIndex++) {
            for (var vIndex = 0; vIndex < side.vLength; vIndex++) {
                var u = uIndex / uSegments;
                var v = vIndex / vSegments;
                var a = Vector3.copy(aNeg).lerp(aPos, u);
                var b = Vector3.copy(bNeg).lerp(bPos, v);
                var vertex = side.vertex(uIndex, vIndex);
                vertex.attributes[Symbolic.ATTRIBUTE_POSITION] = Vector3.copy(a).add(b).add(cPos);
                vertex.attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
                vertex.attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = new Vector2([u, v]);
            }
        }
        return side;
    }
    var CuboidGeometry = (function () {
        function CuboidGeometry() {
            this.iSegments = 1;
            this.jSegments = 1;
            this.kSegments = 1;
            this._a = Vector3.e1;
            this._b = Vector3.e2;
            this._c = Vector3.e3;
            this.sides = [];
        }
        CuboidGeometry.prototype.regenerate = function () {
            this.sides = [];
            // front
            this.sides.push(side([this._a, this._b, this._c], this.iSegments, this.jSegments));
            // right
            this.sides.push(side([Vector3.copy(this._c).scale(-1), this._b, this._a], this.kSegments, this.jSegments));
            // left
            this.sides.push(side([this._c, this._b, Vector3.copy(this._a).scale(-1)], this.kSegments, this.jSegments));
            // back
            this.sides.push(side([Vector3.copy(this._a).scale(-1), this._b, Vector3.copy(this._c).scale(-1)], this.iSegments, this.jSegments));
            // top
            this.sides.push(side([this._a, Vector3.copy(this._c).scale(-1), this._b], this.iSegments, this.kSegments));
            // bottom
            this.sides.push(side([this._a, this._c, Vector3.copy(this._b).scale(-1)], this.iSegments, this.kSegments));
        };
        CuboidGeometry.prototype.toPrimitives = function () {
            return this.sides.map(function (side) { return side.toDrawPrimitive(); });
        };
        return CuboidGeometry;
    })();
    return CuboidGeometry;
});
