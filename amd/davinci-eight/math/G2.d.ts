import GeometricE2 = require('../math/GeometricE2');
import GeometricOperators = require('../math/GeometricOperators');
import MutableGeometricElement = require('../math/MutableGeometricElement');
import SpinorE2 = require('../math/SpinorE2');
import VectorE2 = require('../math/VectorE2');
import VectorN = require('../math/VectorN');
/**
 * @class G2
 * @extends GeometricE2
 * @beta
 */
declare class G2 extends VectorN<number> implements GeometricE2, MutableGeometricElement<GeometricE2, G2, SpinorE2, VectorE2, GeometricE2>, GeometricOperators<G2> {
    /**
     * Constructs a <code>G2</code>.
     * The multivector is initialized to zero.
     * @class G2
     * @beta
     * @constructor
     */
    constructor();
    /**
     * The coordinate corresponding to the unit standard basis scalar.
     * @property w
     * @type {number}
     */
    w: number;
    /**
     * The coordinate corresponding to the <b>e</b><sub>1</sub> standard basis vector.
     * @property x
     * @type {number}
     */
    x: number;
    /**
     * The coordinate corresponding to the <b>e</b><sub>2</sub> standard basis vector.
     * @property y
     * @type {number}
     */
    y: number;
    /**
     * The coordinate corresponding to the <b>e</b><sub>1</sub><b>e</b><sub>2</sub> standard basis bivector.
     * @property xy
     * @type {number}
     */
    xy: number;
    /**
     * <p>
     * <code>this ⟼ this + M * α</code>
     * </p>
     * @method add
     * @param M {GeometricE2}
     * @param α [number = 1]
     * @return {G2} <code>this</code>
     * @chainable
     */
    add(M: GeometricE2, α?: number): G2;
    /**
     * <p>
     * <code>this ⟼ this + v * α</code>
     * </p>
     * @method addVector
     * @param v {VectorE2}
     * @param α [number = 1]
     * @return {G2} <code>this</code>
     * @chainable
     */
    addVector(v: VectorE2, α?: number): G2;
    /**
     * <p>
     * <code>this ⟼ a + b</code>
     * </p>
     * @method add2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    add2(a: GeometricE2, b: GeometricE2): G2;
    /**
     * Assuming <code>this = A * exp(B * θ)</code>, returns the <em>principal value</em> of θ.
     * @method arg
     * @return {number}
     */
    arg(): number;
    /**
     * @method clone
     * @return {G2} <code>copy(this)</code>
     */
    clone(): G2;
    /**
     * <p>
     * <code>this ⟼ conjugate(this)</code>
     * </p>
     * @method conj
     * @return {G2} <code>this</code>
     * @chainable
     */
    conj(): G2;
    /**
     * <p>
     * <code>this ⟼ this << m</code>
     * </p>
     * @method lco
     * @param m {GeometricE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    lco(m: GeometricE2): G2;
    /**
     * <p>
     * <code>this ⟼ a << b</code>
     * </p>
     * @method conL2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    conL2(a: GeometricE2, b: GeometricE2): G2;
    /**
     * <p>
     * <code>this ⟼ this >> m</code>
     * </p>
     * @method rco
     * @param m {GeometricE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    rco(m: GeometricE2): G2;
    /**
     * <p>
     * <code>this ⟼ a >> b</code>
     * </p>
     * @method conR2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    conR2(a: GeometricE2, b: GeometricE2): G2;
    /**
     * <p>
     * <code>this ⟼ copy(M)</code>
     * </p>
     * @method copy
     * @param M {GeometricE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    copy(M: GeometricE2): G2;
    /**
     * <p>
     * <code>this ⟼ copy(spinor)</code>
     * </p>
     * @method copySpinor
     * @param spinor {SpinorE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    copySpinor(spinor: SpinorE2): G2;
    /**
     * <p>
     * <code>this ⟼ copyVector(vector)</code>
     * </p>
     * @method copyVector
     * @param vector {VectorE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    copyVector(vector: VectorE2): G2;
    /**
     * <p>
     * <code>this ⟼ this / m</code>
     * </p>
     * @method div
     * @param m {GeometricE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    div(m: GeometricE2): G2;
    /**
     * <p>
     * <code>this ⟼ this / α</code>
     * </p>
     * @method divideByScalar
     * @param α {number}
     * @return {G2} <code>this</code>
     * @chainable
     */
    divideByScalar(α: number): G2;
    /**
     * <p>
     * <code>this ⟼ a / b</code>
     * </p>
     * @method div2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    div2(a: SpinorE2, b: SpinorE2): G2;
    /**
     * <p>
     * <code>this ⟼ dual(m) = I * m</code>
     * </p>
     * @method dual
     * @param m {GeometricE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    dual(m: GeometricE2): G2;
    /**
     * <p>
     * <code>this ⟼ e<sup>this</sup></code>
     * </p>
     * @method exp
     * @return {G2} <code>this</code>
     * @chainable
     */
    exp(): G2;
    /**
     * <p>
     * <code>this ⟼ conj(this) / quad(this)</code>
     * </p>
     * @method inv
     * @return {G2} <code>this</code>
     * @chainable
     */
    inv(): G2;
    /**
     * <p>
     * <code>this ⟼ this + α * (target - this)</code>
     * </p>
     * @method lerp
     * @param target {GeometricE2}
     * @param α {number}
     * @return {G2} <code>this</code>
     * @chainable
     */
    lerp(target: GeometricE2, α: number): G2;
    /**
     * <p>
     * <code>this ⟼ a + α * (b - a)</code>
     * </p>
     * @method lerp2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @param α {number}
     * @return {G2} <code>this</code>
     * @chainable
     */
    lerp2(a: GeometricE2, b: GeometricE2, α: number): G2;
    /**
     * <p>
     * <code>this ⟼ log(sqrt(w * w + xy * xy)) + <b>e</b><sub>1</sub><b>e</b><sub>2</sub> * atan2(xy, w)</code>
     * </p>
     * @method log
     * @return {G2} <code>this</code>
     * @chainable
     */
    log(): G2;
    /**
     * @method magnitude
     * @return {number}
     */
    magnitude(): number;
    /**
     * <p>
     * <code>this ⟼ this * s</code>
     * </p>
     * @method mul
     * @param m {GeometricE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    mul(m: GeometricE2): G2;
    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     * @method mul2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    mul2(a: GeometricE2, b: GeometricE2): G2;
    /**
     * <p>
     * <code>this ⟼ -1 * this</code>
     * </p>
     * @method neg
     * @return {G2} <code>this</code>
     * @chainable
     */
    neg(): G2;
    /**
    * <p>
    * <code>this ⟼ sqrt(this * conj(this))</code>
    * </p>
    * @method norm
    * @return {G2} <code>this</code>
    * @chainable
    */
    norm(): G2;
    /**
     * <p>
     * <code>this ⟼ this / magnitude(this)</code>
     * </p>
     * @method normalize
     * @return {G2} <code>this</code>
     * @chainable
     */
    normalize(): G2;
    /**
     * <p>
     * Updates <code>this</code> target to be the <em>quad</em> or <em>squared norm</em> of the target.
     * </p>
     * <p>
     * <code>this ⟼ scp(this, rev(this)) = this | ~this</code>
     * </p>
     * @method quad
     * @return {G2} <code>this</code>
     * @chainable
     */
    quad(): G2;
    /**
     * Computes the <em>squared norm</em> of this <code>G2</code> multivector.
     * @method quaditude
     * @return {number} <code>this | ~this</code>
     */
    quaditude(): number;
    /**
     * <p>
     * <code>this ⟼ - n * this * n</code>
     * </p>
     * @method reflect
     * @param n {VectorE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    reflect(n: VectorE2): G2;
    /**
     * <p>
     * <code>this ⟼ reverse(this)</code>
     * </p>
     * @method reverse
     * @return {G2} <code>this</code>
     * @chainable
     */
    reverse(): G2;
    /**
     * @method __tilde__
     * @return {G2}
     */
    __tilde__(): G2;
    /**
     * <p>
     * <code>this ⟼ R * this * reverse(R)</code>
     * </p>
     * @method rotate
     * @param R {SpinorE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    rotate(R: SpinorE2): G2;
    /**
     * <p>
     * Computes a rotor, R, from two unit vectors, where
     * R = (1 + b * a) / sqrt(2 * (1 + b << a))
     * </p>
     * @method rotor
     * @param b {VectorE2} The ending unit vector
     * @param a {VectorE2} The starting unit vector
     * @return {G2} <code>this</code> The rotor representing a rotation from a to b.
     * @chainable
     */
    rotor(b: VectorE2, a: VectorE2): G2;
    /**
     * <p>
     * <code>this = ⟼ exp(- B * θ / 2)</code>
     * </p>
     * @method rotorFromGeneratorAngle
     * @param B {SpinorE2}
     * @param θ {number}
     * @return {G2} <code>this</code>
     */
    rotorFromGeneratorAngle(B: SpinorE2, θ: number): G2;
    /**
     * <p>
     * <code>this ⟼ align(this, m)</code>
     * </p>
     * @method align
     * @param m {GeometricE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    align(m: GeometricE2): G2;
    /**
     * <p>
     * <code>this ⟼ align(a, b)</code>
     * </p>
     * @method align2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    align2(a: GeometricE2, b: GeometricE2): G2;
    /**
     * <p>
     * <code>this ⟼ this * α</code>
     * </p>
     * @method scale
     * @param α {number}
     */
    scale(α: number): G2;
    /**
     * <p>
     * <code>this ⟼ a * b = a · b + a ^ b</code>
     * </p>
     * Sets this G2 to the geometric product a * b of the vector arguments.
     * @method spinor
     * @param a {VectorE2}
     * @param b {VectorE2}
     * @return {G2} <code>this</code>
     */
    spinor(a: VectorE2, b: VectorE2): G2;
    /**
     * <p>
     * <code>this ⟼ this - M * α</code>
     * </p>
     * @method sub
     * @param M {GeometricE2}
     * @param α [number = 1]
     * @return {G2} <code>this</code>
     * @chainable
     */
    sub(M: GeometricE2, α?: number): G2;
    /**
     * <p>
     * <code>this ⟼ a - b</code>
     * </p>
     * @method sub2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    sub2(a: GeometricE2, b: GeometricE2): G2;
    /**
     * Returns a string representing the number in fixed-point notation.
     * @method toFixed
     * @param fractionDigits [number]
     * @return {string}
     */
    toFixed(fractionDigits?: number): string;
    /**
     * Returns a string representation of the number.
     * @method toString
     * @return {string}
     */
    toString(): string;
    /**
     * <p>
     * <code>this ⟼ this ^ m</code>
     * </p>
     * @method wedge
     * @param m {GeometricE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    wedge(m: GeometricE2): G2;
    /**
     * <p>
     * <code>this ⟼ a ^ b</code>
     * </p>
     * @method wedge2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    wedge2(a: GeometricE2, b: GeometricE2): G2;
    /**
     * @method __add__
     * @param other {any}
     * @return {G2}
     * @private
     */
    __add__(other: any): G2;
    /**
     * @method __div__
     * @param other {any}
     * @return {G2}
     * @private
     */
    __div__(other: any): G2;
    /**
     * @method __mul__
     * @param other {any}
     * @return {G2}
     * @private
     */
    __mul__(other: any): G2;
    /**
     * @method __rmul__
     * @param other {any}
     * @return {G2}
     * @private
     */
    __rmul__(other: any): G2;
    /**
     * @method __radd__
     * @param other {any}
     * @return {G2}
     * @private
     */
    __radd__(other: any): G2;
    /**
     * @method __sub__
     * @param other {any}
     * @return {G2}
     * @private
     */
    __sub__(other: any): G2;
    /**
     * @method __rsub__
     * @param other {any}
     * @return {G2}
     * @private
     */
    __rsub__(other: any): G2;
    /**
     * @method __wedge__
     * @param other {any}
     * @return {G2}
     * @private
     */
    __wedge__(other: any): G2;
    /**
     * @method __rwedge__
     * @param other {any}
     * @return {G2}
     * @private
     */
    __rwedge__(other: any): G2;
    /**
     * @method __lshift__
     * @param other {any}
     * @return {G2}
     * @private
     */
    __lshift__(other: any): G2;
    /**
     * @method __rshift__
     * @param other {any}
     * @return {G2}
     * @private
     */
    __rshift__(other: any): G2;
    /**
     * @method __vbar__
     * @param other {any}
     * @return {G2}
     * @private
     */
    __vbar__(other: any): G2;
    /**
     * @method __pos__
     * @return {G2}
     * @private
     * @chainable
     */
    __pos__(): G2;
    /**
     * @method __neg__
     * @return {G2}
     * @private
     * @chainable
     */
    __neg__(): G2;
    /**
     * The identity element for addition.
     * @property zero
     * @type {G2}
     * @readOnly
     * @static
     */
    static zero: G2;
    /**
     * The identity element for multiplication.
     * @property one
     * @type {G2}
     * @readOnly
     * @static
     */
    static one: G2;
    /**
     * Basis vector corresponding to the <code>x</code> coordinate.
     * @property e1
     * @type {G2}
     * @readOnly
     * @static
     */
    static e1: G2;
    /**
     * Basis vector corresponding to the <code>y</code> coordinate.
     * @property e2
     * @type {G2}
     * @readOnly
     * @static
     */
    static e2: G2;
    /**
     * Basis vector corresponding to the <code>xy</code> coordinate.
     * @property I
     * @type {G2}
     * @readOnly
     * @static
     */
    static I: G2;
    /**
     * @method copy
     * @param M {GeometricE2}
     * @return {G2}
     * @static
     */
    static copy(M: GeometricE2): G2;
    /**
     * @method fromScalar
     * @param α {number}
     * @return {G2}
     * @static
     * @chainable
     */
    static fromScalar(α: number): G2;
    /**
     * @method fromSpinor
     * @param spinor {SpinorE2}
     * @return {G2}
     * @static
     */
    static fromSpinor(spinor: SpinorE2): G2;
    /**
     * @method fromVector
     * @param vector {VectorE2}
     * @return {G2}
     * @static
     */
    static fromVector(vector: VectorE2): G2;
    /**
    * @method lerp
    * @param A {GeometricE2}
    * @param B {GeometricE2}
    * @param α {number}
    * @return {G2} <code>A + α * (B - A)</code>
    * @static
    */
    static lerp(A: GeometricE2, B: GeometricE2, α: number): G2;
}
export = G2;
