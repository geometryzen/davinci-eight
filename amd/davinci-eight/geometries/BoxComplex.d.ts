import Complex = require('../dfx/Complex');
/**
 * @class BoxComplex
 * @extends Complex
 */
declare class BoxComplex extends Complex {
    constructor(x?: number, y?: number, z?: number, xSeg?: number, ySeg?: number, zSeg?: number, wireFrame?: boolean);
}
export = BoxComplex;
