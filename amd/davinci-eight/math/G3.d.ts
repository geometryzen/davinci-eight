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
declare class G3 extends VectorN<number> implements GeometricE3, MutableGeometricElement3D<GeometricE3, G3, SpinorE3, VectorE3>, GeometricOperators<G3> {
    /**
     * Constructs a <code>G3</code>.
     * The multivector is initialized to zero.
     * @class G3
     * @beta
     * @constructor
     */
    constructor();
    /**
     * The scalar part of this multivector.
     * @property α
     * @type {number}
     */
    α: number;
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
     * The pseudoscalar part of this multivector.
     * @property β
     * @type {number}
     */
    β: number;
    /**
     * <p>
     * <code>this ⟼ this + M * α</code>
     * </p>
     * @method add
     * @param M {GeometricE3}
     * @param [α = 1] {number}
     * @return {G3} <code>this</code>
     * @chainable
     */
    add(M: GeometricE3, α?: number): G3;
    /**
     * <p>
     * <code>this ⟼ this + Iβ</code>
     * </p>
     * @method addPseudo
     * @param β {number}
     * @return {G3} <code>this</code>
     * @chainable
     */
    addPseudo(β: number): G3;
    /**
     * <p>
     * <code>this ⟼ this + α</code>
     * </p>
     * @method addScalar
     * @param α {number}
     * @return {G3} <code>this</code>
     * @chainable
     */
    addScalar(α: number): G3;
    /**
     * <p>
     * <code>this ⟼ this + v * α</code>
     * </p>
     * @method addVector
     * @param v {VectorE3}
     * @param [α = 1] {number}
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
    adj(): G3;
    /**
     * @method angle
     * @return {G3}
     */
    angle(): G3;
    /**
     * @method clone
     * @return {G3} <code>copy(this)</code>
     * @chainable
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
     * @method lco2
     * @param a {GeometricE3}
     * @param b {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    lco2(a: GeometricE3, b: GeometricE3): G3;
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
     * @method rco2
     * @param a {GeometricE3}
     * @param b {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    rco2(a: GeometricE3, b: GeometricE3): G3;
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
     * Sets this multivector to the value of the scalar, <code>α</code>.
     * @method copyScalar
     * @return {G3}
     * @chainable
     */
    copyScalar(α: number): G3;
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
     * @method divByScalar
     * @param α {number}
     * @return {G3} <code>this</code>
     * @chainable
     */
    divByScalar(α: number): G3;
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
     * @method isOne
     * @return {boolean}
     */
    isOne(): boolean;
    /**
     * @method isZero
     * @return {boolean}
     */
    isZero(): boolean;
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
     * @method direction
     * @return {G3} <code>this</code>
     * @chainable
     */
    direction(): G3;
    /**
     * Sets this multivector to the identity element for multiplication, <b>1</b>.
     * @method one
     * @return {G3}
     * @chainable
     */
    one(): G3;
    /**
    * <p>
    * <code>this ⟼ scp(this, rev(this)) = this | ~this</code>
    * </p>
    * @method quad
    * @return {G3} <code>this</code>
    * @chainable
    */
    quad(): G3;
    /**
     * Computes the <em>squared norm</em> of this multivector.
     * @method squaredNorm
     * @return {number} <code>this * conj(this)</code>
     */
    squaredNorm(): number;
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
     * <code>this ⟼ rev(this)</code>
     * </p>
     * @method reverse
     * @return {G3} <code>this</code>
     * @chainable
     */
    rev(): G3;
    /**
     * @method __tilde__
     * @return {G3}
     */
    __tilde__(): G3;
    /**
     * <p>
     * <code>this ⟼ R * this * rev(R)</code>
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
     * @method rotorFromDirections
     * @param b {VectorE3} The ending unit vector
     * @param a {VectorE3} The starting unit vector
     * @return {G3} <code>this</code> The rotor representing a rotation from a to b.
     * @chainable
     */
    rotorFromDirections(b: VectorE3, a: VectorE3): G3;
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
     * <code>this ⟼ scp(this, m)</code>
     * </p>
     * @method align
     * @param m {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    scp(m: GeometricE3): G3;
    /**
     * <p>
     * <code>this ⟼ scp(a, b)</code>
     * </p>
     * @method scp2
     * @param a {GeometricE3}
     * @param b {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    scp2(a: GeometricE3, b: GeometricE3): G3;
    /**
     * <p>
     * <code>this ⟼ this * α</code>
     * </p>
     * @method scale
     * @param α {number}
     */
    scale(α: number): G3;
    slerp(target: GeometricE3, α: number): G3;
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
     * @param [α = 1] {number}
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
     * Returns a string representing the number in exponential notation.
     * @method toExponential
     * @return {string}
     */
    toExponential(): string;
    /**
     * Returns a string representing the number in fixed-point notation.
     * @method toFixed
     * @param [fractionDigits] {number}
     * @return {string}
     */
    toFixed(fractionDigits?: number): string;
    /**
     * Returns a string representation of the number.
     * @method toString
     * @return {string}
     */
    toString(): string;
    grade(grade: number): G3;
    /**
     * <p>
     * <code>this ⟼ this ^ m</code>
     * </p>
     * @method wedge
     * @param m {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    ext(m: GeometricE3): G3;
    /**
     * <p>
     * <code>this ⟼ a ^ b</code>
     * </p>
     * @method ext2
     * @param a {GeometricE3}
     * @param b {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    ext2(a: GeometricE3, b: GeometricE3): G3;
    /**
     * Sets this multivector to the identity element for addition, <b>0</b>.
     * @method zero
     * @return {G3}
     * @chainable
     */
    zero(): G3;
    /**
     * @method __add__
     * @param rhs {any}
     * @return {G3}
     * @private
     */
    __add__(rhs: any): G3;
    /**
     * @method __div__
     * @param rhs {any}
     * @return {G3}
     * @private
     */
    __div__(rhs: any): G3;
    /**
     * @method __rdiv__
     * @param lhs {any}
     * @return {G3}
     * @private
     */
    __rdiv__(lhs: any): G3;
    /**
     * @method __mul__
     * @param rhs {any}
     * @return {G3}
     * @private
     */
    __mul__(rhs: any): G3;
    /**
     * @method __rmul__
     * @param lhs {any}
     * @return {G3}
     * @private
     */
    __rmul__(lhs: any): G3;
    /**
     * @method __radd__
     * @param lhs {any}
     * @return {G3}
     * @private
     */
    __radd__(lhs: any): G3;
    /**
     * @method __sub__
     * @param rhs {any}
     * @return {G3}
     * @private
     */
    __sub__(rhs: any): G3;
    /**
     * @method __rsub__
     * @param lhs {any}
     * @return {G3}
     * @private
     */
    __rsub__(lhs: any): G3;
    /**
     * @method __wedge__
     * @param rhs {any}
     * @return {G3}
     * @private
     */
    __wedge__(rhs: any): G3;
    /**
     * @method __rwedge__
     * @param lhs {any}
     * @return {G3}
     * @private
     */
    __rwedge__(lhs: any): G3;
    /**
     * @method __lshift__
     * @param rhs {any}
     * @return {G3}
     * @private
     */
    __lshift__(rhs: any): G3;
    /**
     * @method __rlshift__
     * @param other {any}
     * @return {G3}
     * @private
     */
    __rlshift__(lhs: any): G3;
    /**
     * @method __rshift__
     * @param rhs {any}
     * @return {G3}
     * @private
     */
    __rshift__(rhs: any): G3;
    /**
     * @method __rrshift__
     * @param other {any}
     * @return {G3}
     * @private
     */
    __rrshift__(lhs: any): G3;
    /**
     * @method __vbar__
     * @param rhs {any}
     * @return {G3}
     * @private
     */
    __vbar__(rhs: any): G3;
    /**
     * @method __rvbar__
     * @param lhs {any}
     * @return {G3}
     * @private
     */
    __rvbar__(lhs: any): G3;
    /**
     * @method __bang__
     * @return {G3}
     * @private
     * @chainable
     */
    __bang__(): G3;
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
     * The identity element for addition, <b>0</b>.
     * @property zero
     * @type {G3}
     * @readOnly
     * @static
     */
    static zero: G3;
    /**
     * The identity element for multiplication, <b>1</b>.
     * @property one
     * @type {G3}
     * @readOnly
     * @static
     */
    static one: G3;
    /**
     * Basis vector corresponding to the <code>x</code> coordinate.
     * @property e1
     * @type {G3}
     * @readOnly
     * @static
     */
    static e1: G3;
    /**
     * Basis vector corresponding to the <code>y</code> coordinate.
     * @property e2
     * @type {G3}
     * @readOnly
     * @static
     */
    static e2: G3;
    /**
     * Basis vector corresponding to the <code>y</code> coordinate.
     * @property e3
     * @type {G3}
     * @readOnly
     * @static
     */
    static e3: G3;
    /**
     * Basis vector corresponding to the <code>β</code> coordinate.
     * @property I
     * @type {G3}
     * @readOnly
     * @static
     */
    static I: G3;
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
    /**
     * Computes the rotor that rotates vector <code>a</code> to vector <code>b</code>.
     * @method rotorFromDirections
     * @param a {VectorE3} The <em>from</em> vector.
     * @param b {VectorE3} The <em>to</em> vector.
     * @return {G3}
     * @static
     */
    static rotorFromDirections(a: VectorE3, b: VectorE3): G3;
}
export = G3;
