import Spinor3Coords = require('../math/Spinor3Coords');
import Mutable = require('../math/Mutable');
/**
 * @class Spinor3
 */
declare class Spinor3 implements Spinor3Coords, Mutable<number[]> {
    private $data;
    private $callback;
    modified: boolean;
    constructor(data?: number[]);
    data: number[];
    callback: () => number[];
    /**
     * @property yz
     * @type Number
     */
    yz: number;
    /**
     * @property zx
     * @type Number
     */
    zx: number;
    /**
     * @property xy
     * @type Number
     */
    xy: number;
    /**
     * @property w
     * @type Number
     */
    w: number;
    clone(): Spinor3;
    copy(spinor: Spinor3Coords): Spinor3;
    /**
     * @method toString
     * @return {string} A non-normative string representation of the target.
     */
    toString(): string;
}
export = Spinor3;
