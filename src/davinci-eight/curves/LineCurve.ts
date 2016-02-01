import Curve from '../curves/Curve';
import Euclidean3 from '../math/Euclidean3';

/**
 * @class LineCurve
 * @extends Curve
 */
// FIXME: Probably should call this a line segment.
export default class LineCurve extends Curve {
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
    constructor(v1: Euclidean3, v2: Euclidean3) {
        super()
        this.v1 = v1
        this.v2 = v2
    }

    /**
     * Returns <code>v1 + t * (v2 - v1)</code>
     * @method getPoint
     * @param t {number}
     * @return {Euclidean3}
     */
    getPoint(t: number): Euclidean3 {
        return this.v1.lerp(this.v2, t)
    }
}
