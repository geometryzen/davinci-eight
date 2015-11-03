var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../curves/Curve'], function (require, exports, Curve) {
    var CubicBezierCurve = (function (_super) {
        __extends(CubicBezierCurve, _super);
        function CubicBezierCurve(beginPoint, controlBegin, controlEnd, endPoint) {
            _super.call(this);
            this.beginPoint = beginPoint;
            this.controlBegin = controlBegin;
            this.controlEnd = controlEnd;
            this.endPoint = endPoint;
        }
        CubicBezierCurve.prototype.getPoint = function (t) {
            return this.beginPoint.cubicBezier(t, this.controlBegin, this.controlEnd, this.endPoint);
        };
        return CubicBezierCurve;
    })(Curve);
    return CubicBezierCurve;
});
