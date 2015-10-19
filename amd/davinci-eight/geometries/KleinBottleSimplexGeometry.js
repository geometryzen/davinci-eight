var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/GridSimplexGeometry', '../math/Vector3'], function (require, exports, GridSimplexGeometry, Vector3) {
    var cos = Math.cos;
    var sin = Math.sin;
    var pi = Math.PI;
    function klein(u, v) {
        var point = new Vector3();
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
    /**
     * By connecting the edge of a Mobius Strip we get a Klein Bottle.
     * http://virtualmathmuseum.org/Surface/klein_bottle/klein_bottle.html
     * @class KleinBottleSimplexGeometry
     * @extends GridSimplexGeometry
     */
    var KleinBottleSimplexGeometry = (function (_super) {
        __extends(KleinBottleSimplexGeometry, _super);
        /**
         * @class KleinBottleSimplexGeometry
         * @constructor
         * @param uSegments {number}
         * @param vSegments {number}
         */
        function KleinBottleSimplexGeometry(uSegments, vSegments) {
            _super.call(this, klein, uSegments, vSegments);
        }
        return KleinBottleSimplexGeometry;
    })(GridSimplexGeometry);
    return KleinBottleSimplexGeometry;
});
