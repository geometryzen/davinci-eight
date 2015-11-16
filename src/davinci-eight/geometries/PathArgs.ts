import Euclidean3 = require('../math/Euclidean3');

/**
 * @class PathArgs
 */
interface PathArgs {

    /**
     * @property controlBegin
     * @type {Euclidean3}
     * @optional
     */
    controlBegin?: Euclidean3;

    /**
     * @property controlEnd
     * @type {Euclidean3}
     * @optional
     */
    controlEnd?: Euclidean3;

    /**
     * @property endPoint
     * @type {Euclidean3}
     * @optional
     */
    endPoint?: Euclidean3;
    /**
     * @property radius
     * @type {number}
     * @optional
     */
    radius?: number;
}

export = PathArgs