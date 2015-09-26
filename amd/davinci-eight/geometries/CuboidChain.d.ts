import Chain = require('../dfx/Chain');
/**
 * @class CuboidChain
 * @extends Chain
 */
declare class CuboidChain extends Chain {
    constructor(x?: number, y?: number, z?: number, xSeg?: number, ySeg?: number, zSeg?: number, wireFrame?: boolean);
}
export = CuboidChain;
