define(["require", "exports", '../topologies/GridTopology', '../core/Symbolic', '../math/Vector2', '../math/Vector3'], function (require, exports, GridTopology, Symbolic, Vector2, Vector3) {
    /**
     * @class ConeGeometry
     */
    var ConeGeometry = (function () {
        /**
         * @class ConeGeometry
         * @constructor
         * @param radius {number}
         * @param height {number}
         * @param axis {Cartesian3}
         */
        function ConeGeometry(radius, height, axis) {
            this.radius = radius;
            this.height = height;
            this.axis = Vector3.copy(axis).normalize();
        }
        ConeGeometry.prototype.regenerate = function () {
            this.topo = new GridTopology(16, 1);
            var uLength = this.topo.uLength;
            var uSegments = uLength - 1;
            var vLength = this.topo.vLength;
            var vSegments = vLength - 1;
            var a = Vector3.random().cross(this.axis).normalize().scale(this.radius);
            var b = new Vector3().crossVectors(a, this.axis).normalize().scale(this.radius);
            var h = Vector3.copy(this.axis).scale(this.height);
            for (var uIndex = 0; uIndex < uLength; uIndex++) {
                var u = uIndex / uSegments;
                var theta = 2 * Math.PI * u;
                var cosTheta = Math.cos(theta);
                var sinTheta = Math.sin(theta);
                for (var vIndex = 0; vIndex < vLength; vIndex++) {
                    var v = vIndex / vSegments;
                    var position = new Vector3().add(a, cosTheta * (1 - v)).add(b, sinTheta * (1 - v)).add(h, v);
                    var peak = Vector3.copy(h).sub(position);
                    var normal = new Vector3().crossVectors(peak, position).cross(peak).normalize();
                    var vertex = this.topo.vertex(uIndex, vIndex);
                    vertex.attributes[Symbolic.ATTRIBUTE_POSITION] = position;
                    vertex.attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
                    vertex.attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = new Vector2([u, v]);
                }
            }
        };
        /**
         * @method toPrimitives
         * @return {DrawPrimitive[]}
         */
        ConeGeometry.prototype.toPrimitives = function () {
            this.regenerate();
            // FIXME: Rename toPrimitive
            return [this.topo.toDrawPrimitive()];
        };
        return ConeGeometry;
    })();
    return ConeGeometry;
});
