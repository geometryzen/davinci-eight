var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/AxialGeometry', '../topologies/GridTopology', '../checks/mustBeBoolean', '../math/Spinor3', '../core/Symbolic', '../math/Vector2', '../math/Vector3'], function (require, exports, AxialGeometry, GridTopology, mustBeBoolean, Spinor3, Symbolic, Vector2, Vector3) {
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
             * @property thetaSegments
             * @type {number}
             */
            this.thetaSegments = 8;
        }
        CylinderGeometry.prototype.setPosition = function (position) {
            this.position = position;
            return this;
        };
        CylinderGeometry.prototype.toPrimitives = function () {
            var uSegments = this.thetaSegments;
            var vSegments = 1;
            var topo = new GridTopology(uSegments, vSegments);
            var axis = this.axis;
            var generator = new Spinor3().dual(axis);
            for (var uIndex = 0; uIndex < topo.uLength; uIndex++) {
                var u = uIndex / uSegments;
                var rotor = generator.clone().scale(this.sliceAngle * u / 2).exp();
                for (var vIndex = 0; vIndex < topo.vLength; vIndex++) {
                    var v = vIndex / vSegments;
                    var normal = Vector3.copy(this.sliceStart).rotate(rotor);
                    var position = normal.clone().scale(this.radius).add(this.axis, v * this.height);
                    var vertex = topo.vertex(uIndex, vIndex);
                    vertex.attributes[Symbolic.ATTRIBUTE_POSITION] = position.add(this.position);
                    vertex.attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
                    if (this.useTextureCoords) {
                        vertex.attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = new Vector2([u, v]);
                    }
                }
            }
            return [topo.toDrawPrimitive()];
        };
        CylinderGeometry.prototype.enableTextureCoords = function (enable) {
            mustBeBoolean('enable', enable);
            this.useTextureCoords = enable;
            return this;
        };
        return CylinderGeometry;
    })(AxialGeometry);
    return CylinderGeometry;
});
