var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../curves/Curve'], function (require, exports, Curve) {
    /**
     * @class LineCurve
     * @extends Curve
     */
    // FIXME: Probably should call this a line segment.
    var LineCurve = (function (_super) {
        __extends(LineCurve, _super);
        /**
         * A <em>line segment</em> connecting two points.
         * @class LineCurve
         * @constructor Curve
         * @param v1: {Euclidean3}
         * @param v2: {Euclidean3}
         */
        function LineCurve(v1, v2) {
            _super.call(this);
            this.v1 = v1;
            this.v2 = v2;
        }
        /**
         * Returns <code>v1 + t * (v2 - v1)</code>
         * @method getPoint
         * @param t {number}
         * @return {Euclidean3}
         */
        LineCurve.prototype.getPoint = function (t) {
            return this.v1.lerp(this.v2, t);
        };
        return LineCurve;
    })(Curve);
    return LineCurve;
});
