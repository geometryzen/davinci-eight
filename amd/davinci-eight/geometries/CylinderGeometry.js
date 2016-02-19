var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/R3', '../core/GeometryContainer', '../core/GeometryPrimitive', './CylinderBuilder'], function (require, exports, R3_1, GeometryContainer_1, GeometryPrimitive_1, CylinderBuilder_1) {
    function primitives() {
        var builder = new CylinderBuilder_1.default(R3_1.default.e2);
        builder.setPosition(R3_1.default.e2.scale(0.5));
        return builder.toPrimitives();
    }
    var CylinderGeometry = (function (_super) {
        __extends(CylinderGeometry, _super);
        function CylinderGeometry() {
            _super.call(this);
            var ps = primitives();
            var iLen = ps.length;
            for (var i = 0; i < iLen; i++) {
                var dataSource = ps[i];
                var geometry = new GeometryPrimitive_1.default(dataSource);
                this.addPart(geometry);
                geometry.release();
            }
        }
        return CylinderGeometry;
    })(GeometryContainer_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CylinderGeometry;
});
