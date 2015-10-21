import VectorE2 = require('../math/VectorE2');
import LinearElement = require('../math/LinearElement');
import SpinorE2 = require('../math/SpinorE2');
import VectorN = require('../math/VectorN');
/**
 * @class MutableVectorE2
 */
declare class MutableVectorE2 extends VectorN<number> implements VectorE2, LinearElement<VectorE2, MutableVectorE2, SpinorE2, VectorE2> {
    /**
     * @class MutableVectorE2
     * @constructor
     * @param data {number[]} Default is [0, 0].
     * @param modified {boolean} Default is false.
     */
    constructor(data?: number[], modified?: boolean);
    /**
     * @property x
     * @type Number
     */
    x: number;
    /**
     * @property y
     * @type Number
     */
    y: number;
    set(x: number, y: number): MutableVectorE2;
    setX(x: number): MutableVectorE2;
    setY(y: number): MutableVectorE2;
    copy(v: VectorE2): MutableVectorE2;
    add(v: VectorE2, alpha?: number): MutableVectorE2;
    addScalar(s: number): MutableVectorE2;
    sum(a: VectorE2, b: VectorE2): MutableVectorE2;
    sub(v: VectorE2): MutableVectorE2;
    subScalar(s: number): MutableVectorE2;
    diff(a: VectorE2, b: VectorE2): MutableVectorE2;
    multiply(v: VectorE2): MutableVectorE2;
    scale(s: number): MutableVectorE2;
    divide(v: VectorE2): MutableVectorE2;
    divideByScalar(scalar: number): MutableVectorE2;
    min(v: VectorE2): MutableVectorE2;
    max(v: VectorE2): MutableVectorE2;
    floor(): MutableVectorE2;
    ceil(): MutableVectorE2;
    round(): MutableVectorE2;
    roundToZero(): MutableVectorE2;
    negate(): MutableVectorE2;
    distanceTo(position: VectorE2): number;
    dot(v: VectorE2): number;
    magnitude(): number;
    normalize(): MutableVectorE2;
    quaditude(): number;
    quadranceTo(position: VectorE2): number;
    reflect(n: VectorE2): MutableVectorE2;
    rotate(rotor: SpinorE2): MutableVectorE2;
    setMagnitude(l: number): MutableVectorE2;
    lerp(v: VectorE2, alpha: number): MutableVectorE2;
    /**
     * <p>
     * <code>this = a + α * (b - a)</code>
     * </p>
     * @method lerp2
     * @param a {VectorE2}
     * @param b {VectorE2}
     * @param α {number}
     * @return {MutableVectorE2} <code>this</code>
     * @chainable
     */
    lerp2(a: VectorE2, v2: VectorE2, α: number): MutableVectorE2;
    equals(v: VectorE2): boolean;
    fromArray(array: number[], offset?: number): MutableVectorE2;
    fromAttribute(attribute: {
        itemSize: number;
        array: number[];
    }, index: number, offset?: number): MutableVectorE2;
    clone(): MutableVectorE2;
}
export = MutableVectorE2;
