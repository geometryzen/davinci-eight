var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/AxialGeometry', '../core/GraphicsProgramSymbols', '../topologies/GridTopology', '../math/SpinG3', '../math/R2', '../math/R3'], function (require, exports, AxialGeometry_1, GraphicsProgramSymbols_1, GridTopology_1, SpinG3_1, R2_1, R3_1) {
    var CylinderGeometry = (function (_super) {
        __extends(CylinderGeometry, _super);
        function CylinderGeometry(axis, sliceStart) {
            _super.call(this, axis, sliceStart);
            this.radius = 1;
            this.height = 1;
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
            var topo = new GridTopology_1.default(uSegments, vSegments);
            var axis = this.axis;
            var generator = SpinG3_1.default.dual(axis);
            for (var uIndex = 0; uIndex < topo.uLength; uIndex++) {
                var u = uIndex / uSegments;
                var rotor = generator.clone().scale(this.sliceAngle * u / 2).exp();
                for (var vIndex = 0; vIndex < topo.vLength; vIndex++) {
                    var v = vIndex / vSegments;
                    var normal = R3_1.default.copy(this.sliceStart).rotate(rotor);
                    var position = normal.clone().scale(this.radius).add(this.axis, v * this.height);
                    var vertex = topo.vertex(uIndex, vIndex);
                    vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = position.add(this.position);
                    vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = normal;
                    if (this.useTextureCoords) {
                        vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = new R2_1.default([u, v]);
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
    })(AxialGeometry_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CylinderGeometry;
});
