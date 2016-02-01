var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../curves/Curve'], function (require, exports, Curve_1) {
    function interpolate(p0, p1, p2, p3, t) {
        var v20 = p2.sub(p0);
        var v12 = p1.sub(p2);
        var v21 = p2.sub(p1);
        var v31 = p3.sub(p1);
        var t12 = v12.scale(2);
        var hv20 = v20.scale(0.5);
        var hv31 = v31.scale(0.5);
        var t2 = t * t;
        var t3 = t * t2;
        var b3 = t12.add(hv20).add(hv31).scale(t3);
        var b2 = p2.scale(3).sub(p1.scale(3)).sub(v20).sub(hv31).scale(t2);
        var b1 = hv20.scale(t);
        return b3.add(b2).add(b1).add(p1);
    }
    var SplineCurve = (function (_super) {
        __extends(SplineCurve, _super);
        function SplineCurve(points) {
            if (points === void 0) { points = []; }
            _super.call(this);
            this.points = points;
        }
        SplineCurve.prototype.getPoint = function (t) {
            var points = this.points;
            var point = (points.length - 1) * t;
            var intPoint = Math.floor(point);
            var weight = point - intPoint;
            var point0 = points[intPoint == 0 ? intPoint : intPoint - 1];
            var point1 = points[intPoint];
            var point2 = points[intPoint > points.length - 2 ? points.length - 1 : intPoint + 1];
            var point3 = points[intPoint > points.length - 3 ? points.length - 1 : intPoint + 2];
            return interpolate(point0, point1, point2, point3, weight);
        };
        return SplineCurve;
    })(Curve_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SplineCurve;
});
