var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/GridSimplexGeometry', '../math/R3'], function (require, exports, GridSimplexGeometry_1, R3_1) {
    var cos = Math.cos;
    var sin = Math.sin;
    var pi = Math.PI;
    function mobius(u, v) {
        var point = new R3_1.default([0, 0, 0]);
        var R = 1;
        var w = 0.05;
        var s = (2 * u - 1) * w;
        var t = 2 * pi * v;
        point.x = (R + s * cos(t / 2)) * cos(t);
        point.y = (R + s * cos(t / 2)) * sin(t);
        point.z = s * sin(t / 2);
        return point;
    }
    var MobiusStripSimplexGeometry = (function (_super) {
        __extends(MobiusStripSimplexGeometry, _super);
        function MobiusStripSimplexGeometry(uSegments, vSegments) {
            _super.call(this, mobius, uSegments, vSegments);
        }
        return MobiusStripSimplexGeometry;
    })(GridSimplexGeometry_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MobiusStripSimplexGeometry;
});
