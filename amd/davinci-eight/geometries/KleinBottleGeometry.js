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
    function klein(u, v) {
        var x;
        var y;
        var z;
        u = u * 2 * pi;
        v = v * 2 * pi;
        if (u < pi) {
            x = 3 * cos(u) * (1 + sin(u)) + (2 * (1 - cos(u) / 2)) * cos(u) * cos(v);
            z = -8 * sin(u) - 2 * (1 - cos(u) / 2) * sin(u) * cos(v);
        }
        else {
            x = 3 * cos(u) * (1 + sin(u)) + (2 * (1 - cos(u) / 2)) * cos(v + pi);
            z = -8 * sin(u);
        }
        y = -2 * (1 - cos(u) / 2) * sin(v);
        return new Vector3(x, y, z);
    }
    /**
     * By connecting the edge of a Mobius Strip we get a Klein Bottle.
     * http://virtualmathmuseum.org/Surface/klein_bottle/klein_bottle.html
     */
    var KleinBottleGeometry = (function (_super) {
        __extends(KleinBottleGeometry, _super);
        function KleinBottleGeometry(uSegments, vSegments) {
            _super.call(this, klein, uSegments, vSegments);
        }
        return KleinBottleGeometry;
    })(ParametricGeometry);
    return KleinBottleGeometry;
});
