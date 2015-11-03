var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../curves/Curve'], function (require, exports, Curve) {
    var QuadraticBezierCurve = (function (_super) {
        __extends(QuadraticBezierCurve, _super);
        function QuadraticBezierCurve(beginPoint, controlPoint, endPoint) {
            _super.call(this);
            this.beginPoint = beginPoint;
            this.controlPoint = controlPoint;
            this.endPoint = endPoint;
        }
        QuadraticBezierCurve.prototype.getPoint = function (t) {
            return this.beginPoint.quadraticBezier(t, this.controlPoint, this.endPoint);
        };
        return QuadraticBezierCurve;
    })(Curve);
    return QuadraticBezierCurve;
});
