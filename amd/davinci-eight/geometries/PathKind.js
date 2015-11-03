define(["require", "exports"], function (require, exports) {
    /**
     * @class PathKind
     */
    var PathKind = (function () {
        function PathKind() {
        }
        /**
         * @property MOVE_TO
         * @type {string}
         * @static
         */
        PathKind.MOVE_TO = 'moveTo';
        /**
         * @property LINE_TO
         * @type {string}
         * @static
         */
        PathKind.LINE_TO = 'moveTo';
        /**
         * Bezier quadratic curve
         * @property QUADRATIC_CURVE_TO
         * @type {string}
         * @static
         */
        PathKind.QUADRATIC_CURVE_TO = 'quadraticCurveTo';
        /**
         * Bezier cubic curve
         * @property BEZIER_CURVE_TO
         * @type {string}
         * @static
         */
        PathKind.BEZIER_CURVE_TO = 'bezierCurveTo';
        /**
         * Catmul-rom spline
         * @property CSPLINE_THRU
         * @type {string}
         * @static
         */
        PathKind.CSPLINE_THRU = 'splineThru';
        /**
         * @property ARC
         * @type {string}
         * @static
         */
        PathKind.ARC = 'arc';
        /**
         * @property ELLIPSE
         * @type {string}
         * @static
         */
        PathKind.ELLIPSE = 'ellipse';
        return PathKind;
    })();
    return PathKind;
});
