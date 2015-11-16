import GeometricE2 = require('../math/GeometricE2');
import GeometricOperators = require('../math/GeometricOperators');
import Measure = require('../math/Measure');
import MutableGeometricElement = require('../math/MutableGeometricElement');
import SpinorE2 = require('../math/SpinorE2');
import Unit = require('../math/Unit');
import VectorE2 = require('../math/VectorE2');
import VectorN = require('../math/VectorN');
/**
 * @class G2
 * @extends VectorN
 * @beta
 */
declare class G2 extends VectorN<number> implements GeometricE2, Measure<G2>, MutableGeometricElement<GeometricE2, G2, SpinorE2, VectorE2>, GeometricOperators<G2> {
    /**
     * @property BASIS_LABELS
     * @type {(string | string[])[]}
     */
    static BASIS_LABELS: (string | string[])[];
    /**
     * The optional unit of measure.
     * @property uom
     * @type {Unit}
     * @beta
     */
    uom: Unit;
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
     * The coordinate corresponding to the <b>e</b><sub>1</sub><b>e</b><sub>2</sub> standard basis bivector.
     * @property β
     * @type {number}
     */
    β: number;
    xy: number;
    /**
     * <p>
     * <code>this ⟼ this + M * α</code>
     * </p>
     * @method add
     * @param M {GeometricE2}
     * @param [α = 1] {number}
     * @return {G2} <code>this</code>
     * @chainable
     */
    add(M: GeometricE2, α?: number): G2;
    /**
     * <p>
     * <code>this ⟼ this + Iβ</code>
     * </p>
     * @method addPseudo
     * @param β {number}
     * @return {G2} <code>this</code>
     * @chainable
     */
    addPseudo(β: number): G2;
    /**
     * <p>
     * <code>this ⟼ this + α</code>
     * </p>
     * @method addScalar
     * @param α {number}
     * @return {G2} <code>this</code>
     * @chainable
     */
    addScalar(α: number): G2;
    /**
     * <p>
     * <code>this ⟼ this + v * α</code>
     * </p>
     * @method addVector
     * @param v {VectorE2}
     * @param [α = 1] {number}
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
    adj(): G2;
    /**
     * @method angle
     * @return {G2}
     */
    angle(): G2;
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
    cos(): G2;
    cosh(): G2;
    distanceTo(point: GeometricE2): number;
    equals(point: GeometricE2): boolean;
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
     * Sets this multivector to the value of the scalar, <code>α</code>.
     * @method copyScalar
     * @return {G2}
     * @chainable
     */
    copyScalar(α: number): G2;
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
     * @method cubicBezier
     * @param t {number}
     * @param controlBegin {GeometricE2}
     * @param controlEnd {GeometricE2}
     * @param endPoint {GeometricE2}
     * @return {G2}
     */
    cubicBezier(t: number, controlBegin: GeometricE2, controlEnd: GeometricE2, endPoint: GeometricE2): G2;
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
     * @method divByScalar
     * @param α {number}
     * @return {G2} <code>this</code>
     * @chainable
     */
    divByScalar(α: number): G2;
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
     * @method lco2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    lco2(a: GeometricE2, b: GeometricE2): G2;
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
     * <code>this ⟼ log(sqrt(w * w + β * β)) + <b>e</b><sub>1</sub><b>e</b><sub>2</sub> * atan2(β, w)</code>
     * </p>
     * @method log
     * @return {G2} <code>this</code>
     * @chainable
     */
    log(): G2;
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
     * @method direction
     * @return {G2} <code>this</code>
     * @chainable
     */
    direction(): G2;
    /**
     * Sets this multivector to the identity element for multiplication, <b>1</b>.
     * @method one
     * @return {G2}
     * @chainable
     */
    one(): G2;
    pow(): G2;
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
     * @method quadraticBezier
     * @param t {number}
     * @param controlPoint {GeometricE2}
     * @param endPoint {GeometricE2}
     * @return {G2}
     */
    quadraticBezier(t: number, controlPoint: GeometricE2, endPoint: GeometricE2): G2;
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
     * @method rco2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    rco2(a: GeometricE2, b: GeometricE2): G2;
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
     * <code>this ⟼ rev(this)</code>
     * </p>
     * @method reverse
     * @return {G2} <code>this</code>
     * @chainable
     */
    rev(): G2;
    sin(): G2;
    sinh(): G2;
    /**
     * @method __tilde__
     * @return {G2}
     */
    __tilde__(): G2;
    /**
     * <p>
     * <code>this ⟼ R * this * rev(R)</code>
     * </p>
     * @method rotate
     * @param R {SpinorE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    rotate(R: SpinorE2): G2;
    /**
     * Sets this multivector to a rotation from vector <code>a</code> to vector <code>b</code>.
     * @method rotorFromDirections
     * @param a {VectorE2} The starting vector
     * @param b {VectorE2} The ending vector
     * @return {G2} <code>this</code> The rotor representing a rotation from a to b.
     * @chainable
     */
    rotorFromDirections(a: VectorE2, b: VectorE2): G2;
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
     * <code>this ⟼ scp(this, m)</code>
     * </p>
     * @method align
     * @param m {GeometricE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    scp(m: GeometricE2): G2;
    /**
     * <p>
     * <code>this ⟼ scp(a, b)</code>
     * </p>
     * @method scp2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    scp2(a: GeometricE2, b: GeometricE2): G2;
    /**
     * <p>
     * <code>this ⟼ this * α</code>
     * </p>
     * @method scale
     * @param α {number}
     */
    scale(α: number): G2;
    slerp(target: GeometricE2, α: number): G2;
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
     * Computes the <em>squared norm</em> of this <code>G2</code> multivector.
     * @method squaredNorm
     * @return {number} <code>this | ~this</code>
     */
    squaredNorm(): number;
    /**
     * <p>
     * <code>this ⟼ this - M * α</code>
     * </p>
     * @method sub
     * @param M {GeometricE2}
     * @param [α = 1] {number}
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
    grade(grade: number): G2;
    /**
     * <p>
     * <code>this ⟼ this ^ m</code>
     * </p>
     * @method wedge
     * @param m {GeometricE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    ext(m: GeometricE2): G2;
    /**
     * <p>
     * <code>this ⟼ a ^ b</code>
     * </p>
     * @method ext2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    ext2(a: GeometricE2, b: GeometricE2): G2;
    /**
     * Sets this multivector to the identity element for addition, <b>0</b>.
     * @method zero
     * @return {G2}
     * @chainable
     */
    zero(): G2;
    /**
     * @method __add__
     * @param rhs {any}
     * @return {G2}
     * @private
     */
    __add__(rhs: any): G2;
    /**
     * @method __div__
     * @param rhs {any}
     * @return {G2}
     * @private
     */
    __div__(rhs: any): G2;
    /**
     * @method __rdiv__
     * @param lhs {any}
     * @return {G2}
     * @private
     */
    __rdiv__(lhs: any): G2;
    /**
     * @method __mul__
     * @param rhs {any}
     * @return {G2}
     * @private
     */
    __mul__(rhs: any): G2;
    /**
     * @method __rmul__
     * @param lhs {any}
     * @return {G2}
     * @private
     */
    __rmul__(lhs: any): G2;
    /**
     * @method __radd__
     * @param lhs {any}
     * @return {G2}
     * @private
     */
    __radd__(lhs: any): G2;
    /**
     * @method __sub__
     * @param rhs {any}
     * @return {G2}
     * @private
     */
    __sub__(rhs: any): G2;
    /**
     * @method __rsub__
     * @param lhs {any}
     * @return {G2}
     * @private
     */
    __rsub__(lhs: any): G2;
    /**
     * @method __wedge__
     * @param rhs {any}
     * @return {G2}
     * @private
     */
    __wedge__(rhs: any): G2;
    /**
     * @method __rwedge__
     * @param lhs {any}
     * @return {G2}
     * @private
     */
    __rwedge__(lhs: any): G2;
    /**
     * @method __lshift__
     * @param other {any}
     * @return {G2}
     * @private
     */
    __lshift__(rhs: any): G2;
    /**
     * @method __rlshift__
     * @param other {any}
     * @return {G2}
     * @private
     */
    __rlshift__(lhs: any): G2;
    /**
     * @method __rshift__
     * @param rhs {any}
     * @return {G2}
     * @private
     */
    __rshift__(rhs: any): G2;
    /**
     * @method __rrshift__
     * @param lhs {any}
     * @return {G2}
     * @private
     */
    __rrshift__(lhs: any): G2;
    /**
     * @method __vbar__
     * @param rhs {any}
     * @return {G2}
     * @private
     */
    __vbar__(rhs: any): G2;
    /**
     * @method __rvbar__
     * @param lhs {any}
     * @return {G2}
     * @private
     */
    __rvbar__(lhs: any): G2;
    /**
     * @method __bang__
     * @return {G2}
     * @private
     * @chainable
     */
    __bang__(): G2;
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
     * Intentionally undocumented.
     */
    static fromCartesian(α: number, x: number, y: number, β: number): G2;
    /**
     * The identity element for addition, <b>0</b>.
     * @property zero
     * @type {G2}
     * @readOnly
     * @static
     */
    static zero: G2;
    /**
     * The identity element for multiplication, <b>1</b>.
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
     * Basis vector corresponding to the <code>β</code> coordinate.
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
    /**
     * Computes the rotor that rotates vector <code>a</code> to vector <code>b</code>.
     * @method rotorFromDirections
     * @param a {VectorE2} The <em>from</em> vector.
     * @param b {VectorE2} The <em>to</em> vector.
     * @return {G2}
     * @static
     */
    static rotorFromDirections(a: VectorE2, b: VectorE2): G2;
}
export = G2;
