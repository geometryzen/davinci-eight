import VectorE2 = require('../math/VectorE2');
import MutableLinearElement = require('../math/MutableLinearElement');
import SpinorE2 = require('../math/SpinorE2');
import VectorN = require('../math/VectorN');
/**
 * @class R2
 */
declare class R2 extends VectorN<number> implements VectorE2, MutableLinearElement<VectorE2, R2, SpinorE2, VectorE2> {
    /**
     * @class R2
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
    set(x: number, y: number): R2;
    setX(x: number): R2;
    setY(y: number): R2;
    copy(v: VectorE2): R2;
    add(v: VectorE2, alpha?: number): R2;
    add2(a: VectorE2, b: VectorE2): R2;
    /**
     * @method cubicBezier
     * @param t {number}
     * @param controlBegin {VectorE2}
     * @param endPoint {VectorE2}
     * @return {R2}
     */
    cubicBezier(t: number, controlBegin: VectorE2, controlEnd: VectorE2, endPoint: VectorE2): R2;
    sub(v: VectorE2): R2;
    subScalar(s: number): R2;
    sub2(a: VectorE2, b: VectorE2): R2;
    scale(s: number): R2;
    divByScalar(scalar: number): R2;
    min(v: VectorE2): R2;
    max(v: VectorE2): R2;
    floor(): R2;
    ceil(): R2;
    round(): R2;
    roundToZero(): R2;
    /**
     * @method neg
     * @return {R2} <code>this</code>
     * @chainable
     */
    neg(): R2;
    /**
     * @method distanceTo
     * @param point {VectorE2}
     * @return {number}
     */
    distanceTo(position: VectorE2): number;
    dot(v: VectorE2): number;
    /**
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     * @method magnitude
     * @return {number}
     */
    magnitude(): number;
    normalize(): R2;
    squaredNorm(): number;
    quadranceTo(position: VectorE2): number;
    /**
     * @method quadraticBezier
     * @param t {number}
     * @param controlPoint {VectorE2}
     * @param endPoint {VectorE2}
     * @return {R2}
     */
    quadraticBezier(t: number, controlPoint: VectorE2, endPoint: VectorE2): R2;
    reflect(n: VectorE2): R2;
    rotate(rotor: SpinorE2): R2;
    /**
     * this ⟼ this + (v - this) * α
     * @method lerp
     * @param v {VectorE2}
     * @param α {number}
     * @return {R2}
     * @chainable
     */
    lerp(v: VectorE2, α: number): R2;
    /**
     * <p>
     * <code>this ⟼ a + α * (b - a)</code>
     * </p>
     * @method lerp2
     * @param a {VectorE2}
     * @param b {VectorE2}
     * @param α {number}
     * @return {R2} <code>this</code>
     * @chainable
     */
    lerp2(a: VectorE2, b: VectorE2, α: number): R2;
    equals(v: VectorE2): boolean;
    slerp(v: VectorE2, α: number): R2;
    toExponential(): string;
    toFixed(digits?: number): string;
    fromArray(array: number[], offset?: number): R2;
    fromAttribute(attribute: {
        itemSize: number;
        array: number[];
    }, index: number, offset?: number): R2;
    clone(): R2;
    /**
     * Sets this vector to the identity element for addition, <b>0</b>.
     * @method zero
     * @return {R2}
     * @chainable
     */
    zero(): R2;
    /**
     * @method copy
     * @param vector {VectorE2}
     * @return {R2}
     * @static
     */
    static copy(vector: VectorE2): R2;
    /**
     * @method lerp
     * @param a {VectorE2}
     * @param b {VectorE2}
     * @param α {number}
     * @return {R2} <code>a + α * (b - a)</code>
     * @static
     */
    static lerp(a: VectorE2, b: VectorE2, α: number): R2;
    /**
     * @method random
     * @return {R2}
     * @static
     */
    static random(): R2;
}
export = R2;
