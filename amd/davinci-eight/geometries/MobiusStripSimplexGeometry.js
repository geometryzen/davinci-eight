var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/GridSimplexGeometry', '../math/R3'], function (require, exports, GridSimplexGeometry, R3) {
    var cos = Math.cos;
    var sin = Math.sin;
    var pi = Math.PI;
    function mobius(u, v) {
        var point = new R3([0, 0, 0]);
        /**
         * radius
         */
        var R = 1;
        /**
         * half-width
         */
        var w = 0.05;
        var s = (2 * u - 1) * w; // [-w, w]
        var t = 2 * pi * v; // [0, 2pi]
        point.x = (R + s * cos(t / 2)) * cos(t);
        point.y = (R + s * cos(t / 2)) * sin(t);
        point.z = s * sin(t / 2);
        return point;
    }
    /**
     * http://virtualmathmuseum.org/Surface/moebius_strip/moebius_strip.html
     */
    var MobiusStripSimplexGeometry = (function (_super) {
        __extends(MobiusStripSimplexGeometry, _super);
        function MobiusStripSimplexGeometry(uSegments, vSegments) {
            _super.call(this, mobius, uSegments, vSegments);
        }
        return MobiusStripSimplexGeometry;
    })(GridSimplexGeometry);
    return MobiusStripSimplexGeometry;
});
