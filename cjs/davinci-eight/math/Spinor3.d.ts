import AbstractVector = require('../math/AbstractVector');
import GeometricElement = require('../math/GeometricElement');
import Mutable = require('../math/Mutable');
import Spinor3Coords = require('../math/Spinor3Coords');
/**
 * @class Spinor3
 */
declare class Spinor3 extends AbstractVector implements Spinor3Coords, Mutable<number[]>, GeometricElement<Spinor3Coords, Spinor3> {
    constructor(data?: number[]);
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
    add(rhs: Spinor3Coords): Spinor3;
    addVectors(a: Spinor3Coords, b: Spinor3Coords): Spinor3;
    clone(): Spinor3;
    copy(spinor: Spinor3Coords): Spinor3;
    divideScalar(scalar: number): Spinor3;
    exp(): Spinor3;
    magnitude(): number;
    multiply(rhs: Spinor3Coords): Spinor3;
    multiplyScalar(scalar: number): Spinor3;
    quaditude(): number;
    sub(rhs: Spinor3Coords): Spinor3;
    /**
     * @method toString
     * @return {string} A non-normative string representation of the target.
     */
    toString(): string;
}
export = Spinor3;
