var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", './AxialPrimitivesBuilder', '../core/GraphicsProgramSymbols', './GridTopology', '../math/R2', '../math/R3'], function (require, exports, AxialPrimitivesBuilder_1, GraphicsProgramSymbols_1, GridTopology_1, R2_1, R3_1) {
    var ConeGeometry = (function (_super) {
        __extends(ConeGeometry, _super);
        function ConeGeometry(axis, sliceStart) {
            _super.call(this, axis, sliceStart);
            this.radius = 1;
            this.height = 1;
            this.thetaSegments = 16;
        }
        ConeGeometry.prototype.setAxis = function (axis) {
            _super.prototype.setAxis.call(this, axis);
            return this;
        };
        ConeGeometry.prototype.setPosition = function (position) {
            _super.prototype.setPosition.call(this, position);
            return this;
        };
        ConeGeometry.prototype.toPrimitives = function () {
            var topo = new GridTopology_1.default(this.thetaSegments, 1);
            var uLength = topo.uLength;
            var uSegments = uLength - 1;
            var vLength = topo.vLength;
            var vSegments = vLength - 1;
            var a = R3_1.default.copy(this.sliceStart).direction().scale(this.radius);
            var b = new R3_1.default().cross2(a, this.axis).direction().scale(this.radius);
            var h = R3_1.default.copy(this.axis).scale(this.height);
            for (var uIndex = 0; uIndex < uLength; uIndex++) {
                var u = uIndex / uSegments;
                var theta = this.sliceAngle * u;
                var cosTheta = Math.cos(theta);
                var sinTheta = Math.sin(theta);
                for (var vIndex = 0; vIndex < vLength; vIndex++) {
                    var v = vIndex / vSegments;
                    var position = new R3_1.default().add(a, cosTheta * (1 - v)).add(b, sinTheta * (1 - v)).add(h, v);
                    var peak = R3_1.default.copy(h).sub(position);
                    var normal = new R3_1.default().cross2(peak, position).cross(peak).direction();
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
        ConeGeometry.prototype.enableTextureCoords = function (enable) {
            _super.prototype.enableTextureCoords.call(this, enable);
            return this;
        };
        return ConeGeometry;
    })(AxialPrimitivesBuilder_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ConeGeometry;
});
