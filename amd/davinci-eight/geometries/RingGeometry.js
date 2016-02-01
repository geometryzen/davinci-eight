var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../core/GraphicsProgramSymbols', '../topologies/GridTopology', '../geometries/AxialGeometry', '../math/R2', '../math/G3'], function (require, exports, GraphicsProgramSymbols_1, GridTopology_1, AxialGeometry_1, R2_1, G3_1) {
    var RingGeometry = (function (_super) {
        __extends(RingGeometry, _super);
        function RingGeometry(axis, sliceStart) {
            _super.call(this, axis, sliceStart);
            this.innerRadius = 0;
            this.outerRadius = 1;
            this.thetaSegments = 16;
        }
        RingGeometry.prototype.setAxis = function (axis) {
            _super.prototype.setAxis.call(this, axis);
            return this;
        };
        RingGeometry.prototype.setPosition = function (position) {
            _super.prototype.setPosition.call(this, position);
            return this;
        };
        RingGeometry.prototype.toPrimitives = function () {
            var uSegments = this.thetaSegments;
            var vSegments = 1;
            var topo = new GridTopology_1.default(uSegments, vSegments);
            var a = this.outerRadius;
            var b = this.innerRadius;
            var axis = G3_1.default.fromVector(this.axis);
            var start = G3_1.default.fromVector(this.sliceStart);
            var generator = new G3_1.default().dual(axis);
            for (var uIndex = 0; uIndex < topo.uLength; uIndex++) {
                var u = uIndex / uSegments;
                var rotor = generator.clone().scale(this.sliceAngle * u / 2).exp();
                for (var vIndex = 0; vIndex < topo.vLength; vIndex++) {
                    var v = vIndex / vSegments;
                    var position = start.clone().rotate(rotor).scale(b + (a - b) * v);
                    var vertex = topo.vertex(uIndex, vIndex);
                    vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = position.addVector(this.position);
                    vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = axis;
                    if (this.useTextureCoords) {
                        vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = new R2_1.default([u, v]);
                    }
                }
            }
            return [topo.toDrawPrimitive()];
        };
        RingGeometry.prototype.enableTextureCoords = function (enable) {
            _super.prototype.enableTextureCoords.call(this, enable);
            return this;
        };
        return RingGeometry;
    })(AxialGeometry_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = RingGeometry;
});
