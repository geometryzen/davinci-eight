import Euclidean3 = require('../math/Euclidean3');
/**
 * @class PathArgs
 */
interface PathArgs {
    /**
     * @property controlBegin
     * @type [Euclidean3]
     */
    controlBegin?: Euclidean3;
    /**
     * @property controlEnd
     * @type [Euclidean3]
     */
    controlEnd?: Euclidean3;
    /**
     * @property endPoint
     * @type [Euclidean3]
     */
    endPoint?: Euclidean3;
    /**
     * @property radius
     * @type [number]
     */
    radius?: number;
}
export = PathArgs;
