import { __extends } from "tslib";
import { GridSimplexBuilder } from '../geometries/GridSimplexBuilder';
import { Vector3 } from '../math/Vector3';
/**
 * @hidden
 */
var cos = Math.cos;
/**
 * @hidden
 */
var sin = Math.sin;
/**
 * @hidden
 */
var pi = Math.PI;
/**
 * @hidden
 */
function mobius(u, v) {
    var point = new Vector3([0, 0, 0]);
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
var MobiusStripSimplexGeometry = /** @class */ (function (_super) {
    __extends(MobiusStripSimplexGeometry, _super);
    function MobiusStripSimplexGeometry(uSegments, vSegments) {
        return _super.call(this, mobius, uSegments, vSegments) || this;
    }
    return MobiusStripSimplexGeometry;
}(GridSimplexBuilder));
export { MobiusStripSimplexGeometry };
