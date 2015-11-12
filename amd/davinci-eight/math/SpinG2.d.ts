import Measure = require('../math/Measure');
import Mutable = require('../math/Mutable');
import MutableGeometricElement = require('../math/MutableGeometricElement');
import SpinorE2 = require('../math/SpinorE2');
import Unit = require('../math/Unit');
import VectorE2 = require('../math/VectorE2');
import VectorN = require('../math/VectorN');
/**
 * @class SpinG2
 * @extends VectorN<number>
 */
declare class SpinG2 extends VectorN<number> implements SpinorE2, Measure<SpinG2>, Mutable<number[]>, MutableGeometricElement<SpinorE2, SpinG2, SpinG2, VectorE2> {
    /**
     * The optional unit of measure.
     * @property uom
     * @type {Unit}
     * @beta
     */
    uom: Unit;
    /**
     * Constructs a <code>SpinG2</code> from a <code>number[]</code>.
     * For a <em>geometric</em> implementation, use the static methods.
     * @class SpinG2
     * @constructor
     */
    constructor(coordinates?: number[], modified?: boolean);
    /**
     * The bivector part of this spinor as a number.
     * @property xy
     * @type {number}
     */
    xy: number;
    /**
     * The scalar part of this spinor as a number.
     * @property α
     * @type {number}
     */
    α: number;
    /**
     * <p>
     * <code>this ⟼ this + α * spinor</code>
     * </p>
     * @method add
     * @param spinor {SpinorE2}
     * @param α [number = 1]
     * @return {SpinG2} <code>this</code>
     * @chainable
     */
    add(spinor: SpinorE2, α?: number): SpinG2;
    /**
     * <p>
     * <code>this ⟼ a + b</code>
     * </p>
     * @method add2
     * @param a {SpinorE2}
     * @param b {SpinorE2}
     * @return {SpinG2} <code>this</code>
     * @chainable
     */
    add2(a: SpinorE2, b: SpinorE2): SpinG2;
    /**
     * Intentionally undocumented.
     */
    addPseudo(β: number): SpinG2;
    /**
     * <p>
     * <code>this ⟼ this + α</code>
     * </p>
     * @method addScalar
     * @param α {number}
     * @return {SpinG2} <code>this</code>
     * @chainable
     */
    addScalar(α: number): SpinG2;
    /**
     * @method adj
     * @return {number}
     * @beta
     */
    adj(): SpinG2;
    /**
     * @method angle
     * @return {SpinG2}
     */
    angle(): SpinG2;
    /**
     * @method clone
     * @return {SpinG2} A copy of <code>this</code>.
     * @chainable
     */
    clone(): SpinG2;
    /**
     * <p>
     * <code>this ⟼ (w, -B)</code>
     * </p>
     * @method conj
     * @return {SpinG2} <code>this</code>
     * @chainable
     */
    conj(): SpinG2;
    /**
     * <p>
     * <code>this ⟼ copy(spinor)</code>
     * </p>
     * @method copy
     * @param spinor {SpinorE2}
     * @return {SpinG2} <code>this</code>
     * @chainable
     */
    copy(spinor: SpinorE2): SpinG2;
    /**
     * Sets this spinor to the value of the scalar, <code>α</code>.
     * @method copyScalar
     * @param α {number} The scalar to be copied.
     * @return {SpinG2}
     * @chainable
     */
    copyScalar(α: number): SpinG2;
    /**
     * Intentionally undocumented.
     */
    copySpinor(spinor: SpinorE2): SpinG2;
    /**
     * Intentionally undocumented.
     */
    copyVector(vector: VectorE2): SpinG2;
    cos(): SpinG2;
    cosh(): SpinG2;
    /**
     * <p>
     * <code>this ⟼ this / s</code>
     * </p>
     * @method div
     * @param s {SpinorE2}
     * @return {SpinG2} <code>this</code>
     * @chainable
     */
    div(s: SpinorE2): SpinG2;
    /**
     * <p>
     * <code>this ⟼ a / b</code>
     * </p>
     * @method div2
     * @param a {SpinorE2}
     * @param b {SpinorE2}
     * @return {SpinG2} <code>this</code>
     * @chainable
     */
    div2(a: SpinorE2, b: SpinorE2): SpinG2;
    /**
     * <p>
     * <code>this ⟼ this / α</code>
     * </p>
     * @method divByScalar
     * @param α {number}
     * @return {SpinG2} <code>this</code>
     * @chainable
     */
    divByScalar(α: number): SpinG2;
    /**
     * <p>
     * <code>this ⟼ e<sup>this</sup></code>
     * </p>
     * @method exp
     * @return {SpinG2} <code>this</code>
     * @chainable
     */
    exp(): SpinG2;
    /**
     * <p>
     * <code>this ⟼ conj(this) / quad(this)</code>
     * </p>
     * @method inv
     * @return {SpinG2} <code>this</code>
     * @chainable
     */
    inv(): SpinG2;
    lco(rhs: SpinorE2): SpinG2;
    lco2(a: SpinorE2, b: SpinorE2): SpinG2;
    /**
     * <p>
     * <code>this ⟼ this + α * (target - this)</code>
     * </p>
     * @method lerp
     * @param target {SpinorE2}
     * @param α {number}
     * @return {SpinG2} <code>this</code>
     * @chainable
     */
    lerp(target: SpinorE2, α: number): SpinG2;
    /**
     * <p>
     * <code>this ⟼ a + α * (b - a)</code>
     * <p>
     * @method lerp2
     * @param a {SpinorE2}
     * @param b {SpinorE2}
     * @param α {number}
     * @return {SpinG2} <code>this</code>
     * @chainable
     */
    lerp2(a: SpinorE2, b: SpinorE2, α: number): SpinG2;
    /**
     * <p>
     * <code>this ⟼ log(this)</code>
     * </p>
     * @method log
     * @return {SpinG2} <code>this</code>
     * @chainable
     */
    log(): SpinG2;
    /**
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     * @method magnitude
     * @return {number}
     */
    magnitude(): number;
    /**
     * <p>
     * <code>this ⟼ this * s</code>
     * </p>
     * @method mul
     * @param s {SpinorE2}
     * @return {SpinG2} <code>this</code>
     * @chainable
     */
    mul(s: SpinorE2): SpinG2;
    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     * @method mul2
     * @param a {SpinorE2}
     * @param b {SpinorE2}
     * @return {SpinG2} <code>this</code>
     * @chainable
     */
    mul2(a: SpinorE2, b: SpinorE2): SpinG2;
    /**
     * @method neg
     * @return {SpinG2} <code>this</code>
     * @chainable
     */
    neg(): SpinG2;
    /**
    * <p>
    * <code>this ⟼ sqrt(this * conj(this))</code>
    * </p>
    * @method norm
    * @return {SpinG2} <code>this</code>
    * @chainable
    */
    norm(): SpinG2;
    /**
     * <p>
     * <code>this ⟼ this / magnitude(this)</code>
     * </p>
     * @method direction
     * @return {SpinG2} <code>this</code>
     * @chainable
     */
    direction(): SpinG2;
    /**
     * Sets this spinor to the identity element for multiplication, <b>1</b>.
     * @return {SpinG2} <code>this</code>
     * @chainable
     */
    one(): SpinG2;
    pow(): SpinG2;
    /**
    * <p>
    * <code>this ⟼ this * conj(this)</code>
    * </p>
    * @method quad
    * @return {SpinG2} <code>this</code>
    * @chainable
    */
    quad(): SpinG2;
    sin(): SpinG2;
    sinh(): SpinG2;
    /**
     * @method squaredNorm
     * @return {number} <code>this * conj(this)</code>
     */
    squaredNorm(): number;
    rco(rhs: SpinorE2): SpinG2;
    rco2(a: SpinorE2, b: SpinorE2): SpinG2;
    /**
     * <p>
     * <code>this = (w, B) ⟼ (w, -B)</code>
     * </p>
     * @method reverse
     * @return {SpinG2} <code>this</code>
     * @chainable
     */
    rev(): SpinG2;
    /**
     * Sets this Spinor to the value of its reflection in the plane orthogonal to n.
     * The geometric formula for bivector reflection is B' = n * B * n.
     * @method reflect
     * @param n {VectorE2}
     * @return {SpinG2} <code>this</code>
     * @chainable
     */
    reflect(n: VectorE2): SpinG2;
    /**
     * <p>
     * <code>this = ⟼ rotor * this * rev(rotor)</code>
     * </p>
     * @method rotate
     * @param rotor {SpinorE2}
     * @return {SpinG2} <code>this</code>
     * @chainable
     */
    rotate(rotor: SpinorE2): SpinG2;
    /**
     * <p>
     * Sets this multivector to a rotation from vector <code>a</code> to vector <code>b</code>.
     * </p>
     * @method rotorFromDirections
     * @param a {VectorE2} The <em>from</em> vector.
     * @param b {VectorE2} The <em>to</em> vector.
     * @return {SpinG2} <code>this</code> The rotor representing a rotation from a to b.
     * @chainable
     */
    rotorFromDirections(a: VectorE2, b: VectorE2): SpinG2;
    /**
     * <p>
     * <code>this = ⟼ exp(- B * θ / 2)</code>
     * </p>
     * @method rotorFromGeneratorAngle
     * @param B {SpinorE2}
     * @param θ {number}
     * @return {SpinG2} <code>this</code>
     */
    rotorFromGeneratorAngle(B: SpinorE2, θ: number): SpinG2;
    scp(rhs: SpinorE2): SpinG2;
    scp2(a: SpinorE2, b: SpinorE2): SpinG2;
    /**
     * <p>
     * <code>this ⟼ this * α</code>
     * </p>
     * @method scale
     * @param α {number}
     * @return {SpinG2} <code>this</code>
     */
    scale(α: number): SpinG2;
    slerp(target: SpinorE2, α: number): SpinG2;
    /**
     * <p>
     * <code>this ⟼ this - s * α</code>
     * </p>
     * @method sub
     * @param s {SpinorE2}
     * @param α [number = 1]
     * @return {SpinG2} <code>this</code>
     * @chainable
     */
    sub(s: SpinorE2, α?: number): SpinG2;
    /**
     * <p>
     * <code>this ⟼ a - b</code>
     * </p>
     * @method sub2
     * @param a {SpinorE2}
     * @param b {SpinorE2}
     * @return {SpinG2} <code>this</code>
     * @chainable
     */
    sub2(a: SpinorE2, b: SpinorE2): SpinG2;
    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     * Sets this SpinG2 to the geometric product a * b of the vector arguments.
     * @method spinor
     * @param a {VectorE2}
     * @param b {VectorE2}
     * @return {SpinG2}
     */
    spinor(a: VectorE2, b: VectorE2): SpinG2;
    grade(grade: number): SpinG2;
    toExponential(): string;
    toFixed(digits?: number): string;
    /**
     * @method toString
     * @return {string} A non-normative string representation of the target.
     */
    toString(): string;
    ext(rhs: SpinorE2): SpinG2;
    ext2(a: SpinorE2, b: SpinorE2): SpinG2;
    /**
     * Sets this spinor to the identity element for addition, <b>0</b>.
     * @return {SpinG2} <code>this</code>
     * @chainable
     */
    zero(): SpinG2;
    /**
     * @method copy
     * @param spinor {SpinorE2}
     * @return {SpinG2} A copy of the <code>spinor</code> argument.
     * @static
     */
    static copy(spinor: SpinorE2): SpinG2;
    /**
     * @method lerp
     * @param a {SpinorE2}
     * @param b {SpinorE2}
     * @param α {number}
     * @return {SpinG2} <code>a + α * (b - a)</code>
     * @static
     */
    static lerp(a: SpinorE2, b: SpinorE2, α: number): SpinG2;
    /**
     * Computes the rotor that rotates vector <code>a</code> to vector <code>b</code>.
     * @method rotorFromDirections
     * @param a {VectorE2} The <em>from</em> vector.
     * @param b {VectorE2} The <em>to</em> vector.
     * @return {SpinG2}
     * @static
     */
    static rotorFromDirections(a: VectorE2, b: VectorE2): SpinG2;
}
export = SpinG2;
