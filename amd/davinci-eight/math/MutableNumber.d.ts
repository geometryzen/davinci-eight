import Cartesian1 = require('../math/Cartesian1');
import LinearElement = require('../math/LinearElement');
import Matrix = require('../math/Matrix');
import Spinor1Coords = require('../math/Spinor1Coords');
import VectorN = require('../math/VectorN');
/**
 * @class MutableNumber
 */
declare class MutableNumber extends VectorN<number> implements Cartesian1, LinearElement<Cartesian1, MutableNumber, Spinor1Coords, Cartesian1>, Matrix<MutableNumber> {
    /**
     * @class MutableNumber
     * @constructor
     * @param data {number[]} Default is [0].
     * @param modified {boolean} Default is false.
     */
    constructor(data?: number[], modified?: boolean);
    /**
     * @property x
     * @type Number
     */
    x: number;
    set(x: number): MutableNumber;
    setX(x: number): MutableNumber;
    copy(v: Cartesian1): MutableNumber;
    add(vector: Cartesian1, alpha?: number): MutableNumber;
    addScalar(s: number): MutableNumber;
    determinant(): number;
    sum(a: Cartesian1, b: Cartesian1): MutableNumber;
    exp(): MutableNumber;
    sub(v: Cartesian1): MutableNumber;
    subScalar(s: number): MutableNumber;
    diff(a: Cartesian1, b: Cartesian1): MutableNumber;
    identity(): MutableNumber;
    multiply(v: Cartesian1): MutableNumber;
    scale(scalar: number): MutableNumber;
    divide(v: Cartesian1): MutableNumber;
    divideByScalar(scalar: number): MutableNumber;
    min(v: Cartesian1): MutableNumber;
    max(v: Cartesian1): MutableNumber;
    floor(): MutableNumber;
    ceil(): MutableNumber;
    round(): MutableNumber;
    roundToZero(): MutableNumber;
    negate(): MutableNumber;
    distanceTo(position: Cartesian1): number;
    dot(v: Cartesian1): number;
    magnitude(): number;
    normalize(): MutableNumber;
    product(a: Cartesian1, b: Cartesian1): MutableNumber;
    quaditude(): number;
    quadranceTo(position: Cartesian1): number;
    reflect(n: Cartesian1): MutableNumber;
    rotate(rotor: Spinor1Coords): MutableNumber;
    setMagnitude(l: number): MutableNumber;
    lerp(v: Cartesian1, alpha: number): MutableNumber;
    /**
     * <p>
     * <code>this = a + α * (b - a)</code>
     * </p>
     * @method lerp2
     * @param a {MutableNumber}
     * @param b {MutableNumber}
     * @param α {number}
     * @return {MutableNumber}
     * @chainable
     */
    lerp2(a: MutableNumber, b: MutableNumber, α: number): MutableNumber;
    equals(v: Cartesian1): boolean;
    fromArray(array: number[], offset?: number): MutableNumber;
    toArray(array?: number[], offset?: number): number[];
    fromAttribute(attribute: {
        itemSize: number;
        array: number[];
    }, index: number, offset?: number): MutableNumber;
    clone(): MutableNumber;
}
export = MutableNumber;
