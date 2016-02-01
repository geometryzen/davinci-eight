var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../curves/Curve', '../curves/LineCurve'], function (require, exports, Curve_1, LineCurve_1) {
    var CurvePath = (function (_super) {
        __extends(CurvePath, _super);
        function CurvePath() {
            _super.call(this);
            this.curves = [];
            this.autoClose = false;
        }
        CurvePath.prototype.add = function (curve) {
            return this.curves.push(curve);
        };
        CurvePath.prototype.checkConnection = function () {
        };
        CurvePath.prototype.closePath = function () {
            var startPoint = this.curves[0].getPoint(0);
            var endPoint = this.curves[this.curves.length - 1].getPoint(1);
            if (!startPoint.equals(endPoint)) {
                this.curves.push(new LineCurve_1.default(endPoint, startPoint));
            }
        };
        CurvePath.prototype.getPoint = function (t) {
            var d = t * this.getLength();
            var curveLengths = this.getCurveLengths();
            var i = 0;
            var diff;
            var curve;
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
        };
        CurvePath.prototype.getLength = function () {
            var lens = this.getCurveLengths();
            return lens[lens.length - 1];
        };
        CurvePath.prototype.getCurveLengths = function () {
            if (this.cacheLengths && this.cacheLengths.length == this.curves.length) {
                return this.cacheLengths;
            }
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
    })(Curve_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CurvePath;
});
