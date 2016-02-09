var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../core/Geometry', './CylinderBuilder'], function (require, exports, Geometry_1, CylinderBuilder_1) {
    function primitives() {
        var builder = new CylinderBuilder_1.default();
        return builder.toPrimitives();
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
