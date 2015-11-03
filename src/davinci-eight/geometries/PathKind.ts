/**
 * @class PathKind
 */
class PathKind {
    /**
     * @property MOVE_TO
     * @type {string}
     * @static
     */
    static MOVE_TO = 'moveTo';
    /**
     * @property LINE_TO
     * @type {string}
     * @static
     */
    static LINE_TO = 'moveTo';
    /**
     * Bezier quadratic curve
     * @property QUADRATIC_CURVE_TO
     * @type {string}
     * @static
     */
    static QUADRATIC_CURVE_TO = 'quadraticCurveTo';
    /**
     * Bezier cubic curve
     * @property BEZIER_CURVE_TO
     * @type {string}
     * @static
     */
    static BEZIER_CURVE_TO = 'bezierCurveTo';
    /**
     * Catmul-rom spline
     * @property CSPLINE_THRU
     * @type {string}
     * @static
     */
    static CSPLINE_THRU = 'splineThru';
    /**
     * @property ARC
     * @type {string}
     * @static
     */
    static ARC = 'arc';
    /**
     * @property ELLIPSE
     * @type {string}
     * @static
     */
    static ELLIPSE = 'ellipse';
}
export = PathKind