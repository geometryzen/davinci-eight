import Complex = require('../dfx/Complex');
/**
 * @class CuboidComplex
 * @extends Complex
 */
declare class CuboidComplex extends Complex {
    constructor(x?: number, y?: number, z?: number, xSeg?: number, ySeg?: number, zSeg?: number, wireFrame?: boolean);
}
export = CuboidComplex;
