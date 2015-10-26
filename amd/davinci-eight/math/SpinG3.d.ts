import MutableGeometricElement3D = require('../math/MutableGeometricElement3D');
import Mutable = require('../math/Mutable');
import SpinorE3 = require('../math/SpinorE3');
import VectorE3 = require('../math/VectorE3');
import VectorN = require('../math/VectorN');
/**
 * @class SpinG3
 * @extends VectorN<number>
 */
declare class SpinG3 extends VectorN<number> implements SpinorE3, Mutable<number[]>, MutableGeometricElement3D<SpinorE3, SpinG3, SpinG3, VectorE3, VectorE3> {
    /**
     * @class SpinG3
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
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    add(spinor: SpinorE3, α?: number): SpinG3;
    /**
     * <p>
     * <code>this ⟼ a + b</code>
     * </p>
     * @method add2
     * @param a {SpinorE3}
     * @param b {SpinorE3}
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    add2(a: SpinorE3, b: SpinorE3): SpinG3;
    /**
     * @method adj
     * @return {number}
     * @beta
     */
    adj(): SpinG3;
    /**
     * @method arg
     * @return {number}
     */
    arg(): number;
    /**
     * @method clone
     * @return {SpinG3} A copy of <code>this</code>.
     * @chainable
     */
    clone(): SpinG3;
    /**
     * <p>
     * <code>this ⟼ (w, -B)</code>
     * </p>
     * @method conj
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    conj(): SpinG3;
    lco(rhs: SpinorE3): SpinG3;
    lco2(a: SpinorE3, b: SpinorE3): SpinG3;
    rco(rhs: SpinorE3): SpinG3;
    rco2(a: SpinorE3, b: SpinorE3): SpinG3;
    /**
     * <p>
     * <code>this ⟼ copy(spinor)</code>
     * </p>
     * @method copy
     * @param spinor {SpinorE3}
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    copy(spinor: SpinorE3): SpinG3;
    copySpinor(spinor: SpinorE3): SpinG3;
    copyVector(vector: VectorE3): SpinG3;
    /**
     * <p>
     * <code>this ⟼ this / s</code>
     * </p>
     * @method div
     * @param s {SpinorE3}
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    div(s: SpinorE3): SpinG3;
    /**
     * <p>
     * <code>this ⟼ a / b</code>
     * </p>
     * @method div2
     * @param a {SpinorE3}
     * @param b {SpinorE3}
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    div2(a: SpinorE3, b: SpinorE3): SpinG3;
    /**
     * <p>
     * <code>this ⟼ this / α</code>
     * </p>
     * @method divByScalar
     * @param α {number}
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    divByScalar(α: number): SpinG3;
    /**
     * <p>
     * <code>this ⟼ dual(v) = I * v</code>
     * </p>
     * @method dual
     * @param v {VectorE3} The vector whose dual will be used to set this spinor.
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    dual(v: VectorE3): SpinG3;
    /**
     * <p>
     * <code>this ⟼ e<sup>this</sup></code>
     * </p>
     * @method exp
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    exp(): SpinG3;
    /**
     * <p>
     * <code>this ⟼ conj(this) / quad(this)</code>
     * </p>
     * @method inv
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    inv(): SpinG3;
    /**
     * <p>
     * <code>this ⟼ this + α * (target - this)</code>
     * </p>
     * @method lerp
     * @param target {SpinorE3}
     * @param α {number}
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    lerp(target: SpinorE3, α: number): SpinG3;
    /**
     * <p>
     * <code>this ⟼ a + α * (b - a)</code>
     * <p>
     * @method lerp2
     * @param a {SpinorE3}
     * @param b {SpinorE3}
     * @param α {number}
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    lerp2(a: SpinorE3, b: SpinorE3, α: number): SpinG3;
    /**
     * <p>
     * <code>this ⟼ log(this)</code>
     * </p>
     * @method log
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    log(): SpinG3;
    magnitude(): number;
    /**
     * <p>
     * <code>this ⟼ this * s</code>
     * </p>
     * @method mul
     * @param s {SpinorE3}
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    mul(s: SpinorE3): SpinG3;
    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     * @method mul2
     * @param a {SpinorE3}
     * @param b {SpinorE3}
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    mul2(a: SpinorE3, b: SpinorE3): SpinG3;
    /**
     * @method neg
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    neg(): SpinG3;
    /**
    * <p>
    * <code>this ⟼ sqrt(this * conj(this))</code>
    * </p>
    * @method norm
    * @return {SpinG3} <code>this</code>
    * @chainable
    */
    norm(): SpinG3;
    /**
     * <p>
     * <code>this ⟼ this / magnitude(this)</code>
     * </p>
     * @method normalize
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    normalize(): SpinG3;
    /**
    * <p>
    * <code>this ⟼ this * conj(this)</code>
    * </p>
    * @method quad
    * @return {SpinG3} <code>this</code>
    * @chainable
    */
    quad(): SpinG3;
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
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    rev(): SpinG3;
    /**
     * Sets this Spinor to the value of its reflection in the plane orthogonal to n.
     * The geometric formula for bivector reflection is B' = n * B * n.
     * @method reflect
     * @param n {VectorE3}
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    reflect(n: VectorE3): SpinG3;
    /**
     * <p>
     * <code>this = ⟼ rotor * this * rev(rotor)</code>
     * </p>
     * @method rotate
     * @param rotor {SpinorE3}
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    rotate(rotor: SpinorE3): SpinG3;
    /**
     * <p>
     * Computes a rotor, R, from two unit vectors, where
     * R = (1 + b * a) / sqrt(2 * (1 + b << a))
     * </p>
     * @method rotor
     * @param b {VectorE3} The ending unit vector
     * @param a {VectorE3} The starting unit vector
     * @return {SpinG3} <code>this</code> The rotor representing a rotation from a to b.
     * @chainable
     */
    rotor(b: VectorE3, a: VectorE3): SpinG3;
    /**
     * <p>
     * <code>this = ⟼ exp(- dual(a) * θ / 2)</code>
     * </p>
     * @method rotorFromAxisAngle
     * @param axis {VectorE3}
     * @param θ {number}
     * @return {SpinG3} <code>this</code>
     */
    rotorFromAxisAngle(axis: VectorE3, θ: number): SpinG3;
    /**
     * <p>
     * <code>this = ⟼ exp(- B * θ / 2)</code>
     * </p>
     * @method rotorFromGeneratorAngle
     * @param B {SpinorE3}
     * @param θ {number}
     * @return {SpinG3} <code>this</code>
     */
    rotorFromGeneratorAngle(B: SpinorE3, θ: number): SpinG3;
    scp(rhs: SpinorE3): SpinG3;
    scp2(a: SpinorE3, b: SpinorE3): SpinG3;
    /**
     * <p>
     * <code>this ⟼ this * α</code>
     * </p>
     * @method scale
     * @param α {number}
     * @return {SpinG3} <code>this</code>
     */
    scale(α: number): SpinG3;
    slerp(target: SpinorE3, α: number): SpinG3;
    /**
     * <p>
     * <code>this ⟼ this - s * α</code>
     * </p>
     * @method sub
     * @param s {SpinorE3}
     * @param α [number = 1]
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    sub(s: SpinorE3, α?: number): SpinG3;
    /**
     * <p>
     * <code>this ⟼ a - b</code>
     * </p>
     * @method sub2
     * @param a {SpinorE3}
     * @param b {SpinorE3}
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    sub2(a: SpinorE3, b: SpinorE3): SpinG3;
    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     * Sets this SpinG3 to the geometric product a * b of the vector arguments.
     * @method spinor
     * @param a {VectorE3}
     * @param b {VectorE3}
     * @return {SpinG3}
     */
    spinor(a: VectorE3, b: VectorE3): SpinG3;
    toExponential(): string;
    toFixed(digits?: number): string;
    /**
     * @method toString
     * @return {string} A non-normative string representation of the target.
     */
    toString(): string;
    ext(rhs: SpinorE3): SpinG3;
    ext2(a: SpinorE3, b: SpinorE3): SpinG3;
    /**
     * @method copy
     * @param spinor {SpinorE3}
     * @return {SpinG3} A copy of the <code>spinor</code> argument.
     * @static
     */
    static copy(spinor: SpinorE3): SpinG3;
    /**
     * @method lerp
     * @param a {SpinorE3}
     * @param b {SpinorE3}
     * @param α {number}
     * @return {SpinG3} <code>a + α * (b - a)</code>
     * @static
     */
    static lerp(a: SpinorE3, b: SpinorE3, α: number): SpinG3;
}
export = SpinG3;
