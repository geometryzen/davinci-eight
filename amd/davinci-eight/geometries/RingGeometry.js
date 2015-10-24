var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../topologies/GridTopology', '../geometries/AxialGeometry', '../core/Symbolic', '../math/R2', '../math/G3'], function (require, exports, GridTopology, AxialGeometry, Symbolic, R2, G3) {
    /**
     * @class RingGeometry
     */
    var RingGeometry = (function (_super) {
        __extends(RingGeometry, _super);
        /**
         * @class RingGeometry
         * @constructor
         */
        function RingGeometry() {
            _super.call(this);
            /**
             * @property innerRadius
             * @type {number}
             */
            this.innerRadius = 0;
            /**
             * @property outerRadius
             * @type {number}
             */
            this.outerRadius = 1;
            /**
             * @property thetaSegments
             * @type {number}
             */
            this.thetaSegments = 16;
        }
        /**
         * @method setAxis
         * @param axis
         * @return {RingGeometry}
         * @chainable
         */
        RingGeometry.prototype.setAxis = function (axis) {
            _super.prototype.setAxis.call(this, axis);
            return this;
        };
        /**
         * @method setPosition
         * @param position {VectorE3}
         * @return {RingGeometry}
         * @chainable
         */
        RingGeometry.prototype.setPosition = function (position) {
            _super.prototype.setPosition.call(this, position);
            return this;
        };
        /**
         * @method toPrimitives
         * @return {DrawPrimitive[]}
         */
        RingGeometry.prototype.toPrimitives = function () {
            var uSegments = this.thetaSegments;
            var vSegments = 1;
            var topo = new GridTopology(uSegments, vSegments);
            var a = this.outerRadius;
            var b = this.innerRadius;
            var axis = G3.fromVector(this.axis);
            var start = G3.fromVector(this.sliceStart);
            var generator = new G3().dual(this.axis);
            for (var uIndex = 0; uIndex < topo.uLength; uIndex++) {
                var u = uIndex / uSegments;
                var rotor = generator.clone().scale(this.sliceAngle * u / 2).exp();
                for (var vIndex = 0; vIndex < topo.vLength; vIndex++) {
                    var v = vIndex / vSegments;
                    var position = start.clone().rotate(rotor).scale(b + (a - b) * v);
                    var vertex = topo.vertex(uIndex, vIndex);
                    vertex.attributes[Symbolic.ATTRIBUTE_POSITION] = position.addVector(this.position);
                    vertex.attributes[Symbolic.ATTRIBUTE_NORMAL] = axis;
                    if (this.useTextureCoords) {
                        vertex.attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = new R2([u, v]);
                    }
                }
            }
            return [topo.toDrawPrimitive()];
        };
        /**
         * @method enableTextureCoords
         * @param enable {boolean}
         * @return {RingGeometry}
         * @chainable
         */
        RingGeometry.prototype.enableTextureCoords = function (enable) {
            _super.prototype.enableTextureCoords.call(this, enable);
            return this;
        };
        return RingGeometry;
    })(AxialGeometry);
    return RingGeometry;
});
