import VectorE1 = require('../math/VectorE1');
import LinearElement = require('../math/LinearElement');
import Matrix = require('../math/Matrix');
import SpinorE1 = require('../math/SpinorE1');
import VectorN = require('../math/VectorN');
/**
 * @class MutableNumber
 */
declare class MutableNumber extends VectorN<number> implements VectorE1, LinearElement<VectorE1, MutableNumber, SpinorE1, VectorE1>, Matrix<MutableNumber> {
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
    copy(v: VectorE1): MutableNumber;
    add(vector: VectorE1, alpha?: number): MutableNumber;
    add2(a: VectorE1, b: VectorE1): MutableNumber;
    determinant(): number;
    exp(): MutableNumber;
    sub(v: VectorE1): MutableNumber;
    subScalar(s: number): MutableNumber;
    sub2(a: VectorE1, b: VectorE1): MutableNumber;
    identity(): MutableNumber;
    multiply(v: VectorE1): MutableNumber;
    scale(scalar: number): MutableNumber;
    divide(v: VectorE1): MutableNumber;
    divideByScalar(scalar: number): MutableNumber;
    min(v: VectorE1): MutableNumber;
    max(v: VectorE1): MutableNumber;
    floor(): MutableNumber;
    ceil(): MutableNumber;
    round(): MutableNumber;
    roundToZero(): MutableNumber;
    negate(): MutableNumber;
    distanceTo(position: VectorE1): number;
    dot(v: VectorE1): number;
    magnitude(): number;
    normalize(): MutableNumber;
    product(a: VectorE1, b: VectorE1): MutableNumber;
    quaditude(): number;
    quadranceTo(position: VectorE1): number;
    reflect(n: VectorE1): MutableNumber;
    rotate(rotor: SpinorE1): MutableNumber;
    setMagnitude(l: number): MutableNumber;
    /**
     * this ⟼ this + α * (v - this)</code>
     * @method lerp
     * @param v {VectorE1}
     * @param α {number}
     * @return {MutanbleNumber}
     * @chainable
     */
    lerp(v: VectorE1, α: number): MutableNumber;
    /**
     * <p>
     * <code>this ⟼ a + α * (b - a)</code>
     * </p>
     * @method lerp2
     * @param a {MutableNumber}
     * @param b {MutableNumber}
     * @param α {number}
     * @return {MutableNumber}
     * @chainable
     */
    lerp2(a: MutableNumber, b: MutableNumber, α: number): MutableNumber;
    equals(v: VectorE1): boolean;
    fromArray(array: number[], offset?: number): MutableNumber;
    toArray(array?: number[], offset?: number): number[];
    fromAttribute(attribute: {
        itemSize: number;
        array: number[];
    }, index: number, offset?: number): MutableNumber;
    clone(): MutableNumber;
}
export = MutableNumber;
