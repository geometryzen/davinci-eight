import MutableGeometricElement = require('../math/MutableGeometricElement');
import Mutable = require('../math/Mutable');
import SpinorE3 = require('../math/SpinorE3');
import VectorE3 = require('../math/VectorE3');
import VectorN = require('../math/VectorN');
/**
 * @class MutableSpinorE3
 * @extends VectorN<number>
 */
declare class MutableSpinorE3 extends VectorN<number> implements SpinorE3, Mutable<number[]>, MutableGeometricElement<SpinorE3, MutableSpinorE3, MutableSpinorE3, VectorE3, VectorE3> {
    /**
     * @class MutableSpinorE3
     * @constructor
     * @param data [number[] = [0, 0, 0, 1]] Corresponds to the basis e2e3, e3e1, e1e2, 1
     * @param modified [boolean = false]
     */
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
    /**
     * <p>
     * <code>this ⟼ this + α * spinor</code>
     * </p>
     * @method add
     * @param spinor {SpinorE3}
     * @param α [number = 1]
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    add(spinor: SpinorE3, α?: number): MutableSpinorE3;
    /**
     * <p>
     * <code>this ⟼ a + b</code>
     * </p>
     * @method add2
     * @param a {SpinorE3}
     * @param b {SpinorE3}
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    add2(a: SpinorE3, b: SpinorE3): MutableSpinorE3;
    /**
     * @method clone
     * @return {MutableSpinorE3} A copy of <code>this</code>.
     * @chainable
     */
    clone(): MutableSpinorE3;
    /**
     * <p>
     * <code>this ⟼ (w, -B)</code>
     * </p>
     * @method conj
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    conj(): MutableSpinorE3;
    conL(rhs: SpinorE3): MutableSpinorE3;
    conL2(a: SpinorE3, b: SpinorE3): MutableSpinorE3;
    conR(rhs: SpinorE3): MutableSpinorE3;
    conR2(a: SpinorE3, b: SpinorE3): MutableSpinorE3;
    /**
     * <p>
     * <code>this ⟼ copy(spinor)</code>
     * </p>
     * @method copy
     * @param spinor {SpinorE3}
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    copy(spinor: SpinorE3): MutableSpinorE3;
    /**
     * <p>
     * <code>this ⟼ this / s</code>
     * </p>
     * @method div
     * @param s {SpinorE3}
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    div(s: SpinorE3): MutableSpinorE3;
    /**
     * <p>
     * <code>this ⟼ a / b</code>
     * </p>
     * @method div2
     * @param a {SpinorE3}
     * @param b {SpinorE3}
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    div2(a: SpinorE3, b: SpinorE3): MutableSpinorE3;
    /**
     * <p>
     * <code>this ⟼ this / α</code>
     * </p>
     * @method divideByScalar
     * @param α {number}
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    divideByScalar(α: number): MutableSpinorE3;
    /**
     * <p>
     * <code>this ⟼ dual(v) = I * v</code>
     * </p>
     * Notice that the dual of a vector is related to the spinor by the right-hand rule.
     * @method dual
     * @param v {VectorE3} The vector whose dual will be used to set this spinor.
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    dual(v: VectorE3): MutableSpinorE3;
    /**
     * <p>
     * <code>this ⟼ e<sup>this</sup></code>
     * </p>
     * @method exp
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    exp(): MutableSpinorE3;
    /**
     * <p>
     * <code>this ⟼ conj(this) / quad(this)</code>
     * </p>
     * @method inv
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    inv(): MutableSpinorE3;
    /**
     * <p>
     * <code>this ⟼ this + α * (target - this)</code>
     * </p>
     * @method lerp
     * @param target {SpinorE3}
     * @param α {number}
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    lerp(target: SpinorE3, α: number): MutableSpinorE3;
    /**
     * <p>
     * <code>this ⟼ a + α * (b - a)</code>
     * <p>
     * @method lerp2
     * @param a {SpinorE3}
     * @param b {SpinorE3}
     * @param α {number}
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    lerp2(a: SpinorE3, b: SpinorE3, α: number): MutableSpinorE3;
    /**
     * <p>
     * <code>this ⟼ log(this)</code>
     * </p>
     * @method log
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    log(): MutableSpinorE3;
    magnitude(): number;
    /**
     * <p>
     * <code>this ⟼ this * s</code>
     * </p>
     * @method mul
     * @param s {SpinorE3}
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    mul(s: SpinorE3): MutableSpinorE3;
    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     * @method mul2
     * @param a {SpinorE3}
     * @param b {SpinorE3}
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    mul2(a: SpinorE3, b: SpinorE3): MutableSpinorE3;
    /**
    * <p>
    * <code>this ⟼ sqrt(this * conj(this))</code>
    * </p>
    * @method norm
    * @return {MutableSpinorE3} <code>this</code>
    * @chainable
    */
    norm(): MutableSpinorE3;
    /**
     * <p>
     * <code>this ⟼ this / magnitude(this)</code>
     * </p>
     * @method normalize
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    normalize(): MutableSpinorE3;
    /**
     * @method quaditude
     * @return {number} <code>this * conj(this)</code>
     */
    quaditude(): number;
    /**
     * <p>
     * <code>this = (w, B) ⟼ (w, -B)</code>
     * </p>
     * @method reverse
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    reverse(): MutableSpinorE3;
    /**
     * Sets this Spinor to the value of its reflection in the plane orthogonal to n.
     * The geometric formula for bivector reflection is B' = n * B * n.
     * @method reflect
     * @param n {VectorE3}
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    reflect(n: VectorE3): MutableSpinorE3;
    /**
     * <p>
     * <code>this = ⟼ rotor * this * reverse(rotor)</code>
     * </p>
     * @method rotate
     * @param rotor {SpinorE3}
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    rotate(rotor: SpinorE3): MutableSpinorE3;
    /**
     * <p>
     * Computes a rotor, R, from two unit vectors, where
     * R = (1 + b * a) / sqrt(2 * (1 + b << a))
     * </p>
     * @method rotor
     * @param b {VectorE3} The ending unit vector
     * @param a {VectorE3} The starting unit vector
     * @return {MutableSpinorE3} <code>this</code> The rotor representing a rotation from a to b.
     * @chainable
     */
    rotor(b: VectorE3, a: VectorE3): MutableSpinorE3;
    /**
     * <p>
     * <code>this = ⟼ exp(- dual(a) * θ / 2)</code>
     * </p>
     * @method rotorFromAxisAngle
     * @param axis {VectorE3}
     * @param θ {number}
     * @return {MutableSpinorE3} <code>this</code>
     */
    rotorFromAxisAngle(axis: VectorE3, θ: number): MutableSpinorE3;
    align(rhs: SpinorE3): MutableSpinorE3;
    align2(a: SpinorE3, b: SpinorE3): MutableSpinorE3;
    /**
     * <p>
     * <code>this ⟼ this * α</code>
     * </p>
     * @method scale
     * @param α {number}
     * @return {MutableSpinorE3} <code>this</code>
     */
    scale(α: number): MutableSpinorE3;
    /**
     * <p>
     * <code>this ⟼ this - s * α</code>
     * </p>
     * @method sub
     * @param s {SpinorE3}
     * @param α [number = 1]
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    sub(s: SpinorE3, α?: number): MutableSpinorE3;
    /**
     * <p>
     * <code>this ⟼ a - b</code>
     * </p>
     * @method sub2
     * @param a {SpinorE3}
     * @param b {SpinorE3}
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    sub2(a: SpinorE3, b: SpinorE3): MutableSpinorE3;
    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     * Sets this MutableSpinorE3 to the geometric product a * b of the vector arguments.
     * @method spinor
     * @param a {VectorE3}
     * @param b {VectorE3}
     * @return {MutableSpinorE3}
     */
    spinor(a: VectorE3, b: VectorE3): MutableSpinorE3;
    /**
     * @method toString
     * @return {string} A non-normative string representation of the target.
     */
    toString(): string;
    wedge(rhs: SpinorE3): MutableSpinorE3;
    wedge2(a: SpinorE3, b: SpinorE3): MutableSpinorE3;
    /**
     * @method copy
     * @param spinor {SpinorE3}
     * @return {MutableSpinorE3} A copy of the <code>spinor</code> argument.
     * @static
     */
    static copy(spinor: SpinorE3): MutableSpinorE3;
    /**
     * @method lerp
     * @param a {SpinorE3}
     * @param b {SpinorE3}
     * @param α {number}
     * @return {MutableSpinorE3} <code>a + α * (b - a)</code>
     * @static
     */
    static lerp(a: SpinorE3, b: SpinorE3, α: number): MutableSpinorE3;
}
export = MutableSpinorE3;
