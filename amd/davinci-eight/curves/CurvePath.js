var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../curves/Curve', '../curves/LineCurve'], function (require, exports, Curve, LineCurve) {
    /**
     * @class CurvePath
     * @extends Curve
     */
    var CurvePath = (function (_super) {
        __extends(CurvePath, _super);
        /**
         * @class CurvePath
         * @constructor
         */
        function CurvePath() {
            _super.call(this);
            this.curves = [];
            // this.bends = [];
            this.autoClose = false; // Automatically closes the path
        }
        /**
         * @method add
         * @param curve {Curve}
         * @return {number}
         */
        CurvePath.prototype.add = function (curve) {
            return this.curves.push(curve);
        };
        CurvePath.prototype.checkConnection = function () {
            // TODO
            // If the ending of curve is not connected to the starting
            // or the next curve, then, this is not a real path
        };
        CurvePath.prototype.closePath = function () {
            // TODO Test
            // and verify for vector3 (needs to implement equals)
            // Add a line curve if start and end of lines are not connected
            var startPoint = this.curves[0].getPoint(0);
            var endPoint = this.curves[this.curves.length - 1].getPoint(1);
            if (!startPoint.equals(endPoint)) {
                this.curves.push(new LineCurve(endPoint, startPoint));
            }
        };
        // To get accurate point with reference to
        // entire path distance at time t,
        // following has to be done:
        // 1. Length of each sub path have to be known
        // 2. Locate and identify type of curve
        // 3. Get t for the curve
        // 4. Return curve.getPointAt(t')
        CurvePath.prototype.getPoint = function (t) {
            var d = t * this.getLength();
            var curveLengths = this.getCurveLengths();
            var i = 0;
            var diff;
            var curve;
            // To think about boundaries points.
            while (i < curveLengths.length) {
                if (curveLengths[i] >= d) {
                    diff = curveLengths[i] - d;
                    curve = this.curves[i];
                    var u = 1 - diff / curve.getLength();
                    return curve.getPointAt(u);
                }
                i++;
            }
            return null;
            // loop where sum != 0, sum > d , sum+1 <d
        };
        // We cannot use the default Curve getPoint() with getLength() because in
        // Curve, getLength() depends on getPoint() but in CurvePath
        // getPoint() depends on getLength
        CurvePath.prototype.getLength = function () {
            var lens = this.getCurveLengths();
            return lens[lens.length - 1];
        };
        // Compute lengths and cache them
        // We cannot overwrite getLengths() because UtoT mapping uses it.
        CurvePath.prototype.getCurveLengths = function () {
            // We use cache values if curves and cache array are same length
            if (this.cacheLengths && this.cacheLengths.length == this.curves.length) {
                return this.cacheLengths;
            }
            // Get length of subsurve
            // Push sums into cached array
            var lengths = [];
            var sums = 0;
            var i;
            var il = this.curves.length;
            for (i = 0; i < il; i++) {
                sums += this.curves[i].getLength();
                lengths.push(sums);
            }
            this.cacheLengths = lengths;
            return lengths;
        };
        return CurvePath;
    })(Curve);
    return CurvePath;
});
