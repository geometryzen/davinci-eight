var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/GridBuilder', '../math/R3'], function (require, exports, GridBuilder_1, R3_1) {
    var cos = Math.cos;
    var sin = Math.sin;
    var pi = Math.PI;
    function klein(u, v) {
        var point = new R3_1.default();
        u = u * 2 * pi;
        v = v * 2 * pi;
        if (u < pi) {
            point.x = 3 * cos(u) * (1 + sin(u)) + (2 * (1 - cos(u) / 2)) * cos(u) * cos(v);
            point.z = -8 * sin(u) - 2 * (1 - cos(u) / 2) * sin(u) * cos(v);
        }
        else {
            point.x = 3 * cos(u) * (1 + sin(u)) + (2 * (1 - cos(u) / 2)) * cos(v + pi);
            point.z = -8 * sin(u);
        }
        point.y = -2 * (1 - cos(u) / 2) * sin(v);
        return point.scale(0.1);
    }
    var KleinBottleSimplexGeometry = (function (_super) {
        __extends(KleinBottleSimplexGeometry, _super);
        function KleinBottleSimplexGeometry(uSegments, vSegments) {
            _super.call(this, klein, uSegments, vSegments);
        }
        return KleinBottleSimplexGeometry;
    })(GridBuilder_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = KleinBottleSimplexGeometry;
});
