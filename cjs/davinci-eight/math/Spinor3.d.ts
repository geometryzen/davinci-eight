import Spinor3Coords = require('../math/Spinor3Coords');
/**
 * @class Spinor3
 */
declare class Spinor3 implements Spinor3Coords {
    /**
     * @property xy The bivector coordinate corresponding to the xy subspace.
     * @type Number
     * @default 0
     */
    yz: number;
    zx: number;
    xy: number;
    w: number;
    constructor(spinor?: {
        yz: number;
        zx: number;
        xy: number;
        w: number;
    });
    clone(): Spinor3;
    /**
     * @method toString
     * @return {string} A non-normative string representation of the target.
     */
    toString(): string;
}
export = Spinor3;
