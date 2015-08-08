import Cartesian3 = require('../math/Cartesian3');
/**
 * @class ArrowOptions
 */
interface ArrowOptions {
    /**
     * @property axis {Cartesian3}
     */
    axis?: Cartesian3;
    flavor?: number;
    coneHeight?: number;
    wireFrame?: boolean;
}
export = ArrowOptions;
