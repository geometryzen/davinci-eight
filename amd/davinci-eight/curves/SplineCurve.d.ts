import Curve = require('../curves/Curve');
import Euclidean3 = require('../math/Euclidean3');
/**
 * @class SplineCurve
 */
declare class SplineCurve extends Curve {
    points: Euclidean3[];
    /**
     * @class SplineCurve
     * @constructor
     */
    constructor(points?: Euclidean3[]);
    /**
     * @method getPoint
     * @param t {number}
     * @return {Euclidean3}
     */
    getPoint(t: number): Euclidean3;
}
export = SplineCurve;
