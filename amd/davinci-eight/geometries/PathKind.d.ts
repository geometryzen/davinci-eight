/**
 * @class PathKind
 */
declare class PathKind {
    /**
     * @property MOVE_TO
     * @type {string}
     * @static
     */
    static MOVE_TO: string;
    /**
     * @property LINE_TO
     * @type {string}
     * @static
     */
    static LINE_TO: string;
    /**
     * Bezier quadratic curve
     * @property QUADRATIC_CURVE_TO
     * @type {string}
     * @static
     */
    static QUADRATIC_CURVE_TO: string;
    /**
     * Bezier cubic curve
     * @property BEZIER_CURVE_TO
     * @type {string}
     * @static
     */
    static BEZIER_CURVE_TO: string;
    /**
     * Catmul-rom spline
     * @property CSPLINE_THRU
     * @type {string}
     * @static
     */
    static CSPLINE_THRU: string;
    /**
     * @property ARC
     * @type {string}
     * @static
     */
    static ARC: string;
    /**
     * @property ELLIPSE
     * @type {string}
     * @static
     */
    static ELLIPSE: string;
}
export = PathKind;
