import Curve = require('../curves/Curve');
import Euclidean3 = require('../math/Euclidean3');
/**
 * @class LineCurve
 * @extends Curve
 */
declare class LineCurve extends Curve {
    /**
     * @property v1
     * @type {Euclidean3}
     */
    v1: Euclidean3;
    /**
     * @property v2
     * @type {Euclidean3}
     */
    v2: Euclidean3;
    /**
     * A <em>line segment</em> connecting two points.
     * @class LineCurve
     * @constructor Curve
     * @param v1: {Euclidean3}
     * @param v2: {Euclidean3}
     */
    constructor(v1: Euclidean3, v2: Euclidean3);
    /**
     * Returns <code>v1 + t * (v2 - v1)</code>
     * @method getPoint
     * @param t {number}
     * @return {Euclidean3}
     */
    getPoint(t: number): Euclidean3;
}
export = LineCurve;
