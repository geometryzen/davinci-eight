var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ParametricSurfaceGeometry = require('../geometries/ParametricSurfaceGeometry');
var Vector3 = require('../math/Vector3');
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
    return point;
}
/**
 * By connecting the edge of a Mobius Strip we get a Klein Bottle.
 * http://virtualmathmuseum.org/Surface/klein_bottle/klein_bottle.html
 * @class KleinBottleGeometry
 * @extends ParametricSurfaceGeometry
 */
var KleinBottleGeometry = (function (_super) {
    __extends(KleinBottleGeometry, _super);
    /**
     * @class KleinBottleGeometry
     * @constructor
     * @param uSegments {number}
     * @param vSegments {number}
     */
    function KleinBottleGeometry(uSegments, vSegments) {
        _super.call(this, klein, uSegments, vSegments);
    }
    return KleinBottleGeometry;
})(ParametricSurfaceGeometry);
module.exports = KleinBottleGeometry;
