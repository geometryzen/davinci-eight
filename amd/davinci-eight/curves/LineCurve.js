var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../curves/Curve'], function (require, exports, Curve_1) {
    var LineCurve = (function (_super) {
        __extends(LineCurve, _super);
        function LineCurve(v1, v2) {
            _super.call(this);
            this.v1 = v1;
            this.v2 = v2;
        }
        LineCurve.prototype.getPoint = function (t) {
            return this.v1.lerp(this.v2, t);
        };
        return LineCurve;
    })(Curve_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = LineCurve;
});
