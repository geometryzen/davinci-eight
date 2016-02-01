define(["require", "exports"], function (require, exports) {
    var PathKind = (function () {
        function PathKind() {
        }
        PathKind.MOVE_TO = 'moveTo';
        PathKind.LINE_TO = 'moveTo';
        PathKind.QUADRATIC_CURVE_TO = 'quadraticCurveTo';
        PathKind.BEZIER_CURVE_TO = 'bezierCurveTo';
        PathKind.CSPLINE_THRU = 'splineThru';
        PathKind.ARC = 'arc';
        PathKind.ELLIPSE = 'ellipse';
        return PathKind;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PathKind;
});
