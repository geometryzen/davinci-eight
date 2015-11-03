var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/AxialGeometry', '../topologies/GridTopology', '../core/Symbolic', '../math/R2', '../math/R3'], function (require, exports, AxialGeometry, GridTopology, Symbolic, R2, R3) {
    /**
     * @class ConeGeometry
     */
    var ConeGeometry = (function (_super) {
        __extends(ConeGeometry, _super);
        /**
         * @class ConeGeometry
         * @constructor
         * @param axis {VectorE3} The <code>axis</code> property. This will be normalized to unity.
         * @param sliceStart {VectorE3} A direction, orthogonal to <code>axis</code>.
         */
        function ConeGeometry(axis, sliceStart) {
            _super.call(this, axis, sliceStart);
            /**
             * @property radius
             * @type {number}
             */
            this.radius = 1;
            /**
             * @property height
             * @type {number}
             */
            this.height = 1;
            /**
             * @property thetaSegments
             * @type {number}
             */
            this.thetaSegments = 16;
        }
        /**
         * @method setAxis
         * @param axis {VectorE3}
         * @return {ConeGeometry}
         * @chainable
         */
        ConeGeometry.prototype.setAxis = function (axis) {
            _super.prototype.setAxis.call(this, axis);
            return this;
        };
        /**
         * @method setPosition
         * @param position {VectorE3}
         * @return {ConeGeometry}
         * @chainable
         */
        ConeGeometry.prototype.setPosition = function (position) {
            _super.prototype.setPosition.call(this, position);
            return this;
        };
        /**
         * @method tPrimitives
         * @return {DrawPrimitive[]}
         */
        ConeGeometry.prototype.toPrimitives = function () {
            var topo = new GridTopology(this.thetaSegments, 1);
            var uLength = topo.uLength;
            var uSegments = uLength - 1;
            var vLength = topo.vLength;
            var vSegments = vLength - 1;
            var a = R3.copy(this.sliceStart).normalize().scale(this.radius);
            var b = new R3().cross2(a, this.axis).normalize().scale(this.radius);
            var h = R3.copy(this.axis).scale(this.height);
            for (var uIndex = 0; uIndex < uLength; uIndex++) {
                var u = uIndex / uSegments;
                var theta = this.sliceAngle * u;
                var cosTheta = Math.cos(theta);
                var sinTheta = Math.sin(theta);
                for (var vIndex = 0; vIndex < vLength; vIndex++) {
                    var v = vIndex / vSegments;
                    var position = new R3().add(a, cosTheta * (1 - v)).add(b, sinTheta * (1 - v)).add(h, v);
                    var peak = R3.copy(h).sub(position);
                    var normal = new R3().cross2(peak, position).cross(peak).normalize();
                    var vertex = topo.vertex(uIndex, vIndex);
                    vertex.attributes[Symbolic.ATTRIBUTE_POSITION] = position.add(this.position);
                    vertex.attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
                    if (this.useTextureCoords) {
                        vertex.attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = new R2([u, v]);
                    }
                }
            }
            return [topo.toDrawPrimitive()];
        };
        ConeGeometry.prototype.enableTextureCoords = function (enable) {
            _super.prototype.enableTextureCoords.call(this, enable);
            return this;
        };
        return ConeGeometry;
    })(AxialGeometry);
    return ConeGeometry;
});
