var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/AxialGeometry', '../topologies/GridTopology', '../checks/mustBeBoolean', '../core/Symbolic', '../math/Vector2', '../math/Vector3'], function (require, exports, AxialGeometry, GridTopology, mustBeBoolean, Symbolic, Vector2, Vector3) {
    /**
     * @class ConeGeometry
     */
    var ConeGeometry = (function (_super) {
        __extends(ConeGeometry, _super);
        /**
         * @class ConeGeometry
         * @constructor
         */
        function ConeGeometry() {
            _super.call(this);
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
            this.thetaSegments = 8;
        }
        ConeGeometry.prototype.setPosition = function (position) {
            this.position = position;
            return this;
        };
        ConeGeometry.prototype.toPrimitives = function () {
            var topo = new GridTopology(this.thetaSegments, 1);
            var uLength = topo.uLength;
            var uSegments = uLength - 1;
            var vLength = topo.vLength;
            var vSegments = vLength - 1;
            var a = Vector3.copy(this.sliceStart).normalize().scale(this.radius);
            var b = new Vector3().crossVectors(a, this.axis).normalize().scale(this.radius);
            var h = Vector3.copy(this.axis).scale(this.height);
            for (var uIndex = 0; uIndex < uLength; uIndex++) {
                var u = uIndex / uSegments;
                var theta = this.sliceAngle * u;
                var cosTheta = Math.cos(theta);
                var sinTheta = Math.sin(theta);
                for (var vIndex = 0; vIndex < vLength; vIndex++) {
                    var v = vIndex / vSegments;
                    var position = new Vector3().add(a, cosTheta * (1 - v)).add(b, sinTheta * (1 - v)).add(h, v);
                    var peak = Vector3.copy(h).sub(position);
                    var normal = new Vector3().crossVectors(peak, position).cross(peak).normalize();
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
        ConeGeometry.prototype.enableTextureCoords = function (enable) {
            mustBeBoolean('enable', enable);
            this.useTextureCoords = enable;
            return this;
        };
        return ConeGeometry;
    })(AxialGeometry);
    return ConeGeometry;
});
