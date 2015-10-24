import R3 = require('../math/R3');
/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * Extensible curve object
 *
 * Some common of Curve methods
 * .getPoint(t), getTangent(t)
 * .getPointAt(u), getTagentAt(u)
 * .getPoints(), .getSpacedPoints()
 * .getLength()
 * .updateArcLengths()
 *
 * This following classes subclasses Curve:
 *
 * LineCurve
 * QuadraticBezierCurve
 * CubicBezierCurve
 * SplineCurve
 * ArcCurve
 * EllipseCurve
 * ClosedSplineCurve
 *
 */
declare class Curve {
    private cacheArcLengths;
    private needsUpdate;
    private __arcLengthDivisions;
    constructor();
    /**
     * Virtual base class method to overwrite and implement in subclasses
     * t belongs to [0, 1]
     */
    getPoint(t: number): R3;
    /**
     * Get point at relative position in curve according to arc length
     */
    getPointAt(u: number): R3;
    getPoints(divisions?: number): R3[];
    getSpacedPoints(divisions?: number): R3[];
    getLength(): number;
    getLengths(divisions?: number): number[];
    updateArcLengths(): void;
    /**
     * Given u ( 0 .. 1 ), get a t to find p. This gives you points which are equi distance
     */
    getUtoTmapping(u: number, distance?: number): number;
    /**
     * Returns a unit vector tangent at t
     * In case any sub curve does not implement its tangent derivation,
     * 2 points a small delta apart will be used to find its gradient
     * which seems to give a reasonable approximation
     */
    getTangent(t: number): R3;
    getTangentAt(u: number): R3;
}
export = Curve;
