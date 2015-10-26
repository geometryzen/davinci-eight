import GeometricE3 = require('../math/GeometricE3');
import GeometricOperators = require('../math/GeometricOperators');
import MutableGeometricElement3D = require('../math/MutableGeometricElement3D');
import SpinorE3 = require('../math/SpinorE3');
import VectorE3 = require('../math/VectorE3');
import VectorN = require('../math/VectorN');
/**
 * @class G3
 * @extends GeometricE3
 * @beta
 */
declare class G3 extends VectorN<number> implements GeometricE3, MutableGeometricElement3D<GeometricE3, G3, SpinorE3, VectorE3, GeometricE3>, GeometricOperators<G3> {
    /**
     * Constructs a <code>G3</code>.
     * The multivector is initialized to zero.
     * @class G3
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
     * The coordinate corresponding to the <b>e</b><sub>3</sub> standard basis vector.
     * @property z
     * @type {number}
     */
    z: number;
    /**
     * The coordinate corresponding to the <b>e</b><sub>2</sub><b>e</b><sub>3</sub> standard basis bivector.
     * @property yz
     * @type {number}
     */
    yz: number;
    /**
     * The coordinate corresponding to the <b>e</b><sub>3</sub><b>e</b><sub>1</sub> standard basis bivector.
     * @property zx
     * @type {number}
     */
    zx: number;
    /**
     * The coordinate corresponding to the <b>e</b><sub>1</sub><b>e</b><sub>2</sub> standard basis bivector.
     * @property xy
     * @type {number}
     */
    xy: number;
    /**
     * The coordinate corresponding to the I<sub>3</sub> <code>=</code> <b>e</b><sub>1</sub><b>e</b><sub>2</sub><b>e</b><sub>2</sub> standard basis pseudoscalar.
     * @property xyz
     * @type {number}
     */
    xyz: number;
    /**
     * <p>
     * <code>this ⟼ this + M * α</code>
     * </p>
     * @method add
     * @param M {GeometricE3}
     * @param α [number = 1]
     * @return {G3} <code>this</code>
     * @chainable
     */
    add(M: GeometricE3, α?: number): G3;
    /**
     * <p>
     * <code>this ⟼ this + v * α</code>
     * </p>
     * @method addVector
     * @param v {VectorE3}
     * @param α [number = 1]
     * @return {G3} <code>this</code>
     * @chainable
     */
    addVector(v: VectorE3, α?: number): G3;
    /**
     * <p>
     * <code>this ⟼ a + b</code>
     * </p>
     * @method add2
     * @param a {GeometricE3}
     * @param b {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    add2(a: GeometricE3, b: GeometricE3): G3;
    /**
     * @method arg
     * @return {number}
     */
    arg(): number;
    /**
     * @method clone
     * @return {G3} <code>copy(this)</code>
     */
    clone(): G3;
    /**
     * <p>
     * <code>this ⟼ conjugate(this)</code>
     * </p>
     * @method conj
     * @return {G3} <code>this</code>
     * @chainable
     */
    conj(): G3;
    /**
     * <p>
     * <code>this ⟼ this << m</code>
     * </p>
     * @method lco
     * @param m {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    lco(m: GeometricE3): G3;
    /**
     * <p>
     * <code>this ⟼ a << b</code>
     * </p>
     * @method conL2
     * @param a {GeometricE3}
     * @param b {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    conL2(a: GeometricE3, b: GeometricE3): G3;
    /**
     * <p>
     * <code>this ⟼ this >> m</code>
     * </p>
     * @method rco
     * @param m {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    rco(m: GeometricE3): G3;
    /**
     * <p>
     * <code>this ⟼ a >> b</code>
     * </p>
     * @method conR2
     * @param a {GeometricE3}
     * @param b {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    conR2(a: GeometricE3, b: GeometricE3): G3;
    /**
     * <p>
     * <code>this ⟼ copy(v)</code>
     * </p>
     * @method copy
     * @param M {VectorE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    copy(M: GeometricE3): G3;
    /**
     * <p>
     * <code>this ⟼ copy(spinor)</code>
     * </p>
     * @method copySpinor
     * @param spinor {SpinorE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    copySpinor(spinor: SpinorE3): G3;
    /**
     * <p>
     * <code>this ⟼ copyVector(vector)</code>
     * </p>
     * @method copyVector
     * @param vector {VectorE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    copyVector(vector: VectorE3): G3;
    /**
     * <p>
     * <code>this ⟼ this / m</code>
     * </p>
     * @method div
     * @param m {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    div(m: GeometricE3): G3;
    /**
     * <p>
     * <code>this ⟼ this / α</code>
     * </p>
     * @method divideByScalar
     * @param α {number}
     * @return {G3} <code>this</code>
     * @chainable
     */
    divideByScalar(α: number): G3;
    /**
     * <p>
     * <code>this ⟼ a / b</code>
     * </p>
     * @method div2
     * @param a {GeometricE3}
     * @param b {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    div2(a: SpinorE3, b: SpinorE3): G3;
    /**
     * <p>
     * <code>this ⟼ dual(m) = I * m</code>
     * </p>
     * @method dual
     * @param m {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    dual(m: GeometricE3): G3;
    /**
     * <p>
     * <code>this ⟼ e<sup>this</sup></code>
     * </p>
     * @method exp
     * @return {G3} <code>this</code>
     * @chainable
     */
    exp(): G3;
    /**
     * <p>
     * <code>this ⟼ conj(this) / quad(this)</code>
     * </p>
     * @method inv
     * @return {G3} <code>this</code>
     * @chainable
     */
    inv(): G3;
    /**
     * <p>
     * <code>this ⟼ this + α * (target - this)</code>
     * </p>
     * @method lerp
     * @param target {GeometricE3}
     * @param α {number}
     * @return {G3} <code>this</code>
     * @chainable
     */
    lerp(target: GeometricE3, α: number): G3;
    /**
     * <p>
     * <code>this ⟼ a + α * (b - a)</code>
     * </p>
     * @method lerp2
     * @param a {GeometricE3}
     * @param b {GeometricE3}
     * @param α {number}
     * @return {G3} <code>this</code>
     * @chainable
     */
    lerp2(a: GeometricE3, b: GeometricE3, α: number): G3;
    /**
     * <p>
     * <code>this ⟼ log(this)</code>
     * </p>
     * @method log
     * @return {G3} <code>this</code>
     * @chainable
     */
    log(): G3;
    magnitude(): number;
    /**
     * <p>
     * <code>this ⟼ this * s</code>
     * </p>
     * @method mul
     * @param m {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    mul(m: GeometricE3): G3;
    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     * @method mul2
     * @param a {GeometricE3}
     * @param b {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    mul2(a: GeometricE3, b: GeometricE3): G3;
    /**
     * <p>
     * <code>this ⟼ -1 * this</code>
     * </p>
     * @method neg
     * @return {G3} <code>this</code>
     * @chainable
     */
    neg(): G3;
    /**
    * <p>
    * <code>this ⟼ sqrt(this * conj(this))</code>
    * </p>
    * @method norm
    * @return {G3} <code>this</code>
    * @chainable
    */
    norm(): G3;
    /**
     * <p>
     * <code>this ⟼ this / magnitude(this)</code>
     * </p>
     * @method normalize
     * @return {G3} <code>this</code>
     * @chainable
     */
    normalize(): G3;
    /**
     * @method quaditude
     * @return {number} <code>this * conj(this)</code>
     */
    quaditude(): number;
    /**
     * <p>
     * <code>this ⟼ - n * this * n</code>
     * </p>
     * @method reflect
     * @param n {VectorE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    reflect(n: VectorE3): G3;
    /**
     * <p>
     * <code>this ⟼ reverse(this)</code>
     * </p>
     * @method reverse
     * @return {G3} <code>this</code>
     * @chainable
     */
    reverse(): G3;
    /**
     * @method __tilde__
     * @return {G3}
     */
    __tilde__(): G3;
    /**
     * <p>
     * <code>this ⟼ R * this * reverse(R)</code>
     * </p>
     * @method rotate
     * @param R {SpinorE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    rotate(R: SpinorE3): G3;
    /**
     * <p>
     * Computes a rotor, R, from two unit vectors, where
     * R = (1 + b * a) / sqrt(2 * (1 + b << a))
     * </p>
     * @method rotor
     * @param b {VectorE3} The ending unit vector
     * @param a {VectorE3} The starting unit vector
     * @return {G3} <code>this</code> The rotor representing a rotation from a to b.
     * @chainable
     */
    rotor(b: VectorE3, a: VectorE3): G3;
    /**
     * <p>
     * <code>this = ⟼ exp(- dual(a) * θ / 2)</code>
     * </p>
     * @method rotorFromAxisAngle
     * @param axis {VectorE3}
     * @param θ {number}
     * @return {G3} <code>this</code>
     * @chainable
     */
    rotorFromAxisAngle(axis: VectorE3, θ: number): G3;
    /**
     * <p>
     * <code>this = ⟼ exp(- B * θ / 2)</code>
     * </p>
     * @method rotorFromGeneratorAngle
     * @param B {SpinorE3}
     * @param θ {number}
     * @return {G3} <code>this</code>
     * @chainable
     */
    rotorFromGeneratorAngle(B: SpinorE3, θ: number): G3;
    /**
     * <p>
     * <code>this ⟼ align(this, m)</code>
     * </p>
     * @method align
     * @param m {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    align(m: GeometricE3): G3;
    /**
     * <p>
     * <code>this ⟼ align(a, b)</code>
     * </p>
     * @method align2
     * @param a {GeometricE3}
     * @param b {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    align2(a: GeometricE3, b: GeometricE3): G3;
    /**
     * <p>
     * <code>this ⟼ this * α</code>
     * </p>
     * @method scale
     * @param α {number}
     */
    scale(α: number): G3;
    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     * Sets this G3 to the geometric product a * b of the vector arguments.
     * @method spinor
     * @param a {VectorE3}
     * @param b {VectorE3}
     * @return {G3} <code>this</code>
     */
    spinor(a: VectorE3, b: VectorE3): G3;
    /**
     * <p>
     * <code>this ⟼ this - M * α</code>
     * </p>
     * @method sub
     * @param M {GeometricE3}
     * @param α [number = 1]
     * @return {G3} <code>this</code>
     * @chainable
     */
    sub(M: GeometricE3, α?: number): G3;
    /**
     * <p>
     * <code>this ⟼ a - b</code>
     * </p>
     * @method sub2
     * @param a {GeometricE3}
     * @param b {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    sub2(a: GeometricE3, b: GeometricE3): G3;
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
     * @param m {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    wedge(m: GeometricE3): G3;
    /**
     * <p>
     * <code>this ⟼ a ^ b</code>
     * </p>
     * @method wedge2
     * @param a {GeometricE3}
     * @param b {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    wedge2(a: GeometricE3, b: GeometricE3): G3;
    /**
     * @method __add__
     * @param other {any}
     * @return {G3}
     * @private
     */
    __add__(other: any): G3;
    /**
     * @method __div__
     * @param other {any}
     * @return {G3}
     * @private
     */
    __div__(other: any): G3;
    /**
     * @method __mul__
     * @param other {any}
     * @return {G3}
     * @private
     */
    __mul__(other: any): G3;
    /**
     * @method __rmul__
     * @param other {any}
     * @return {G3}
     * @private
     */
    __rmul__(other: any): G3;
    /**
     * @method __radd__
     * @param other {any}
     * @return {G3}
     * @private
     */
    __radd__(other: any): G3;
    /**
     * @method __sub__
     * @param other {any}
     * @return {G3}
     * @private
     */
    __sub__(other: any): G3;
    /**
     * @method __rsub__
     * @param other {any}
     * @return {G3}
     * @private
     */
    __rsub__(other: any): G3;
    /**
     * @method __wedge__
     * @param other {any}
     * @return {G3}
     * @private
     */
    __wedge__(other: any): G3;
    /**
     * @method __rwedge__
     * @param other {any}
     * @return {G3}
     * @private
     */
    __rwedge__(other: any): G3;
    /**
     * @method __lshift__
     * @param other {any}
     * @return {G3}
     * @private
     */
    __lshift__(other: any): G3;
    /**
     * @method __rshift__
     * @param other {any}
     * @return {G3}
     * @private
     */
    __rshift__(other: any): G3;
    /**
     * @method __vbar__
     * @param other {any}
     * @return {G3}
     * @private
     */
    __vbar__(other: any): G3;
    /**
     * @method __pos__
     * @return {G3}
     * @private
     * @chainable
     */
    __pos__(): G3;
    /**
     * @method __neg__
     * @return {G3}
     * @private
     * @chainable
     */
    __neg__(): G3;
    /**
     * @method copy
     * @param M {GeometricE3}
     * @return {G3}
     * @static
     */
    static copy(M: GeometricE3): G3;
    /**
     * @method fromScalar
     * @param α {number}
     * @return {G3}
     * @static
     * @chainable
     */
    static fromScalar(α: number): G3;
    /**
     * @method fromSpinor
     * @param spinor {SpinorE3}
     * @return {G3}
     * @static
     * @chainable
     */
    static fromSpinor(spinor: SpinorE3): G3;
    /**
     * @method fromVector
     * @param vector {VectorE3}
     * @return {G3}
     * @static
     * @chainable
     */
    static fromVector(vector: VectorE3): G3;
    /**
    * @method lerp
    * @param A {GeometricE3}
    * @param B {GeometricE3}
    * @param α {number}
    * @return {G3} <code>A + α * (B - A)</code>
    * @static
    * @chainable
    */
    static lerp(A: GeometricE3, B: GeometricE3, α: number): G3;
}
export = G3;
