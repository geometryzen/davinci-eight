var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/CartesianE3', '../core/Geometry', './CylinderBuilder', './CylinderPrimitivesBuilder'], function (require, exports, CartesianE3_1, Geometry_1, CylinderBuilder_1, CylinderPrimitivesBuilder_1) {
    var e1 = CartesianE3_1.default.fromVectorE3({ x: 1, y: 0, z: 0 });
    var e2 = CartesianE3_1.default.fromVectorE3({ x: 0, y: 1, z: 0 });
    function primitives() {
        if (false) {
            var builder = new CylinderPrimitivesBuilder_1.default(e2, e1);
            return builder.toPrimitives();
        }
        else {
            var builder = new CylinderBuilder_1.default(e2);
            return builder.toPrimitives();
        }
    }
    var CylinderGeometry = (function (_super) {
        __extends(CylinderGeometry, _super);
        function CylinderGeometry() {
            _super.call(this, primitives());
        }
        return CylinderGeometry;
    })(Geometry_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CylinderGeometry;
});
