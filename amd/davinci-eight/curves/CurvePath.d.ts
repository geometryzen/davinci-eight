import Curve = require('../curves/Curve');
import Euclidean3 = require('../math/Euclidean3');
/**
 * @class CurvePath
 * @extends Curve
 */
declare class CurvePath extends Curve {
    curves: Curve[];
    autoClose: boolean;
    cacheLengths: number[];
    /**
     * @class CurvePath
     * @constructor
     */
    constructor();
    /**
     * @method add
     * @param curve {Curve}
     * @return {number}
     */
    add(curve: Curve): number;
    checkConnection(): void;
    closePath(): void;
    getPoint(t: number): Euclidean3;
    getLength(): number;
    getCurveLengths(): number[];
}
export = CurvePath;
