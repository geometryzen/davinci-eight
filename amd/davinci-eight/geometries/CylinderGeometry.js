var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/AxialGeometry', '../topologies/GridTopology', '../math/SpinG3', '../core/Symbolic', '../math/R2', '../math/R3'], function (require, exports, AxialGeometry, GridTopology, SpinG3, Symbolic, R2, R3) {
    /**
     * @class CylinderGeometry
     */
    var CylinderGeometry = (function (_super) {
        __extends(CylinderGeometry, _super);
        /**
         * @class CylinderGeometry
         * @constructor
         */
        function CylinderGeometry() {
            _super.call(this);
            /**
             * @property radius
             * @type {number}
             * @default 1
             */
            this.radius = 1;
            /**
             * @property height
             * @type {number}
             * @default 1
             */
            this.height = 1;
            /**
             * @property thetaSegments
             * @type {number}
             * @default 16
             */
            this.thetaSegments = 16;
        }
        CylinderGeometry.prototype.setAxis = function (axis) {
            _super.prototype.setAxis.call(this, axis);
            return this;
        };
        CylinderGeometry.prototype.setPosition = function (position) {
            _super.prototype.setPosition.call(this, position);
            return this;
        };
        CylinderGeometry.prototype.toPrimitives = function () {
            var uSegments = this.thetaSegments;
            var vSegments = 1;
            var topo = new GridTopology(uSegments, vSegments);
            var axis = this.axis;
            var generator = SpinG3.dual(axis);
            for (var uIndex = 0; uIndex < topo.uLength; uIndex++) {
                var u = uIndex / uSegments;
                var rotor = generator.clone().scale(this.sliceAngle * u / 2).exp();
                for (var vIndex = 0; vIndex < topo.vLength; vIndex++) {
                    var v = vIndex / vSegments;
                    var normal = R3.copy(this.sliceStart).rotate(rotor);
                    var position = normal.clone().scale(this.radius).add(this.axis, v * this.height);
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
        CylinderGeometry.prototype.enableTextureCoords = function (enable) {
            _super.prototype.enableTextureCoords.call(this, enable);
            return this;
        };
        return CylinderGeometry;
    })(AxialGeometry);
    return CylinderGeometry;
});
