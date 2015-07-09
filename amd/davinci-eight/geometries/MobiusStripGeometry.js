var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../geometries/ParametricGeometry', '../math/Vector3'], function (require, exports, ParametricGeometry, Vector3) {
    var cos = Math.cos;
    var sin = Math.sin;
    var pi = Math.PI;
    function mobius(u, v) {
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
        var x = (R + s * cos(t / 2)) * cos(t);
        var y = (R + s * cos(t / 2)) * sin(t);
        var z = s * sin(t / 2);
        return new Vector3(x, y, z);
    }
    /**
     * http://virtualmathmuseum.org/Surface/moebius_strip/moebius_strip.html
     */
    var MobiusStripGeometry = (function (_super) {
        __extends(MobiusStripGeometry, _super);
        function MobiusStripGeometry(uSegments, vSegments) {
            _super.call(this, mobius, uSegments, vSegments);
        }
        return MobiusStripGeometry;
    })(ParametricGeometry);
    return MobiusStripGeometry;
});
