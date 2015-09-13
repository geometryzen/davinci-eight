import Cartesian3 = require('../math/Cartesian3');
import VectorN = require('../math/VectorN');
import GeometricElement = require('../math/GeometricElement');
import Mutable = require('../math/Mutable');
import Spinor3Coords = require('../math/Spinor3Coords');
/**
 * @class Spinor3
 */
declare class Spinor3 extends VectorN<number> implements Spinor3Coords, Mutable<number[]>, GeometricElement<Spinor3Coords, Spinor3> {
    constructor(data?: number[], modified?: boolean);
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
    lerp(target: Spinor3Coords, alpha: number): Spinor3;
    magnitude(): number;
    multiply(rhs: Spinor3Coords): Spinor3;
    multiplySpinors(a: Spinor3Coords, b: Spinor3Coords): Spinor3;
    multiplyScalar(scalar: number): Spinor3;
    quaditude(): number;
    reverse(): Spinor3;
    sub(rhs: Spinor3Coords): Spinor3;
    wedgeVectors(a: Cartesian3, b: Cartesian3): Spinor3;
    /**
     * @method toString
     * @return {string} A non-normative string representation of the target.
     */
    toString(): string;
}
export = Spinor3;
