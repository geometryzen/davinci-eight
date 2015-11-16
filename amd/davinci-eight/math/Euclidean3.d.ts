import GeometricE3 = require('../math/GeometricE3');
import GeometricOperators = require('../math/GeometricOperators');
import ImmutableMeasure = require('../math/ImmutableMeasure');
import GeometricElement = require('../math/GeometricElement');
import SpinorE3 = require('../math/SpinorE3');
import TrigMethods = require('../math/TrigMethods');
import Unit = require('../math/Unit');
import VectorE3 = require('../math/VectorE3');
/**
 * @class Euclidean3
 */
declare class Euclidean3 implements ImmutableMeasure<Euclidean3>, GeometricE3, GeometricElement<Euclidean3, Euclidean3, SpinorE3, VectorE3>, GeometricOperators<Euclidean3>, TrigMethods<Euclidean3> {
    static BASIS_LABELS_GEOMETRIC: string[][];
    static BASIS_LABELS_HAMILTON: string[][];
    static BASIS_LABELS_STANDARD: string[][];
    static BASIS_LABELS_STANDARD_HTML: string[][];
    /**
     * @property BASIS_LABELS
     * @type {string[][]}
     */
    static BASIS_LABELS: string[][];
    /**
     * @property zero
     * @type {Euclidean3}
     * @static
     */
    static zero: Euclidean3;
    /**
     * @property one
     * @type {Euclidean3}
     * @static
     */
    static one: Euclidean3;
    /**
     * @property e1
     * @type {Euclidean3}
     * @static
     */
    static e1: Euclidean3;
    /**
     * @property e2
     * @type {Euclidean3}
     * @static
     */
    static e2: Euclidean3;
    /**
     * @property e3
     * @type {Euclidean3}
     * @static
     */
    static e3: Euclidean3;
    /**
     * @property kilogram
     * @type {Euclidean3}
     * @static
     */
    static kilogram: Euclidean3;
    /**
     * @property meter
     * @type {Euclidean3}
     * @static
     */
    static meter: Euclidean3;
    /**
     * @property second
     * @type {Euclidean3}
     * @static
     */
    static second: Euclidean3;
    /**
     * @property coulomb
     * @type {Euclidean3}
     * @static
     */
    static coulomb: Euclidean3;
    /**
     * @property ampere
     * @type {Euclidean3}
     * @static
     */
    static ampere: Euclidean3;
    /**
     * @property kelvin
     * @type {Euclidean3}
     * @static
     */
    static kelvin: Euclidean3;
    /**
     * @property mole
     * @type {Euclidean3}
     * @static
     */
    static mole: Euclidean3;
    /**
     * @property candela
     * @type {Euclidean3}
     * @static
     */
    static candela: Euclidean3;
    /**
     * @property w
     * @type {number}
     * @private
     */
    private w;
    /**
     * The `x` property is the x coordinate of the grade one (vector) part of the Euclidean3 multivector.
     * @property x
     * @type {number}
     */
    x: number;
    /**
     * The `y` property is the y coordinate of the grade one (vector) part of the Euclidean3 multivector.
     * @property y
     * @type {number}
     */
    y: number;
    /**
     * The `z` property is the z coordinate of the grade one (vector) part of the Euclidean3 multivector.
     * @property z
     * @type {number}
     */
    z: number;
    /**
     * The `xy` property is the xy coordinate of the grade two (bivector) part of the Euclidean3 multivector.
     * @property xy
     * @type {number}
     */
    xy: number;
    /**
     * The `yz` property is the yz coordinate of the grade two (bivector) part of the Euclidean3 multivector.
     * @property yz
     * @type {number}
     */
    yz: number;
    /**
     * The `zx` property is the zx coordinate of the grade two (bivector) part of the Euclidean3 multivector.
     * @property zx
     * @type {number}
     */
    zx: number;
    /**
     * @property xyz
     * @type {number}
     * @private
     */
    private xyz;
    /**
     * The optional unit of measure.
     * @property uom
     * @type {Unit}
     */
    uom: Unit;
    /**
     * The Euclidean3 class represents a multivector for a 3-dimensional vector space with a Euclidean metric.
     * Constructs a Euclidean3 from its coordinates.
     * @constructor
     * @param {number} α The scalar part of the multivector.
     * @param {number} x The vector component of the multivector in the x-direction.
     * @param {number} y The vector component of the multivector in the y-direction.
     * @param {number} z The vector component of the multivector in the z-direction.
     * @param {number} xy The bivector component of the multivector in the xy-plane.
     * @param {number} yz The bivector component of the multivector in the yz-plane.
     * @param {number} zx The bivector component of the multivector in the zx-plane.
     * @param {number} β The pseudoscalar part of the multivector.
     * @param uom The optional unit of measure.
     */
    constructor(α: number, x: number, y: number, z: number, xy: number, yz: number, zx: number, β: number, uom?: Unit);
    /**
     * The scalar part of this multivector.
     * @property α
     * @return {number}
     */
    α: number;
    /**
     * The pseudoscalar part of this multivector.
     * @property β
     * @return {number}
     */
    β: number;
    /**
     * @method fromCartesian
     * @param α {number}
     * @param x {number}
     * @param y {number}
     * @param z {number}
     * @param xy {number}
     * @param yz {number}
     * @param zx {number}
     * @param β {number}
     * @param uom [Unit]
     * @return {Euclidean3}
     * @chainable
     * @static
     */
    static fromCartesian(α: number, x: number, y: number, z: number, xy: number, yz: number, zx: number, β: number, uom: Unit): Euclidean3;
    /**
     * @property coords
     * @type {number[]}
     */
    coords: number[];
    /**
     * @method coordinate
     * @param index {number}
     * @return {number}
     */
    coordinate(index: number): number;
    /**
     * Computes the sum of this Euclidean3 and another considered to be the rhs of the binary addition, `+`, operator.
     * This method does not change this Euclidean3.
     * @method add
     * @param rhs {Euclidean3}
     * @return {Euclidean3} This Euclidean3 plus rhs.
     */
    add(rhs: Euclidean3): Euclidean3;
    /**
     * Computes <code>this + Iβ</code>
     * @method addPseudo
     * @param β {number}
     * @return {Euclidean3} <code>this</code>
     * @chainable
     */
    addPseudo(β: number): Euclidean3;
    /**
     * Computes <code>this + α</code>
     * @method addScalar
     * @param α {number}
     * @return {Euclidean3} <code>this</code>
     * @chainable
     */
    addScalar(α: number): Euclidean3;
    /**
     * @method __add__
     * @param rhs {any}
     * @return {Euclidean3}
     * @private
     */
    __add__(rhs: any): Euclidean3;
    /**
     * @method __radd__
     * @param lhs {any}
     * @return {Euclidean3}
     * @private
     */
    __radd__(lhs: any): Euclidean3;
    /**
     * @method adj
     * @return {Euclidean3}
     * @chainable
     * @beta
     */
    adj(): Euclidean3;
    /**
     * @method angle
     * @return {Euclidean3}
     */
    angle(): Euclidean3;
    /**
     * Computes the <e>Clifford conjugate</em> of this multivector.
     * The grade multiplier is -1<sup>x(x+1)/2</sup>
     * @method conj
     * @return {Euclidean3}
     * @chainable
     */
    conj(): Euclidean3;
    /**
     * @method cubicBezier
     * @param t {number}
     * @param controlBegin {GeometricE3}
     * @param controlEnd {GeometricE3}
     * @param endPoint {GeometricE3}
     * @return {Euclidean3}
     * @chainable
     */
    cubicBezier(t: number, controlBegin: GeometricE3, controlEnd: GeometricE3, endPoint: GeometricE3): Euclidean3;
    /**
     * @method direction
     * @return {Euclidean3}
     */
    direction(): Euclidean3;
    /**
     * @method sub
     * @param rhs {Euclidean3}
     * @return {Euclidean3}
     */
    sub(rhs: Euclidean3): Euclidean3;
    /**
     * @method __sub__
     * @param rhs {any}
     * @return {Euclidean3}
     * @private
     */
    __sub__(rhs: any): Euclidean3;
    /**
     * @method __rsub__
     * @param lhs {any}
     * @return {Euclidean3}
     * @private
     */
    __rsub__(lhs: any): Euclidean3;
    /**
     * @method mul
     * @param rhs {Euclidean3}
     */
    mul(rhs: Euclidean3): Euclidean3;
    /**
     * @method __mul__
     * @param rhs {any}
     * @return {Euclidean3}
     * @private
     */
    __mul__(rhs: any): any;
    /**
     * @method __rmul__
     * @param lhs {any}
     * @return {Euclidean3}
     * @private
     */
    __rmul__(lhs: any): any;
    /**
     * @method scale
     * @param α {number}
     * @return {Euclidean3}
     */
    scale(α: number): Euclidean3;
    /**
     * @method div
     * @param rhs {Euclidean3}
     * @return {Euclidean3}
     */
    div(rhs: Euclidean3): Euclidean3;
    /**
     * @method divByScalar
     * @param α {number}
     * @return {Euclidean3}
     */
    divByScalar(α: number): Euclidean3;
    /**
     * @method __div__
     * @param rhs {any}
     * @return {Euclidean3}
     * @private
     */
    __div__(rhs: any): Euclidean3;
    /**
     * @method __rdiv__
     * @param lhs {any}
     * @return {Euclidean3}
     * @private
     */
    __rdiv__(lhs: any): Euclidean3;
    /**
     * @method dual
     * @return {Euclidean3}
     * @beta
     */
    dual(): Euclidean3;
    /**
     * @method scp
     * @param rhs {Euclidean3}
     * @return {Euclidean3}
     */
    scp(rhs: Euclidean3): Euclidean3;
    /**
     * @method ext
     * @param rhs {Euclidean3}
     * @return {Euclidean3}
     */
    ext(rhs: Euclidean3): Euclidean3;
    /**
     * @method __vbar__
     * @param rhs {any}
     * @return {Euclidean3}
     * @private
     */
    __vbar__(rhs: any): Euclidean3;
    /**
     * @method __rvbar__
     * @param lhs {any}
     * @return {Euclidean3}
     * @private
     */
    __rvbar__(lhs: any): Euclidean3;
    /**
     * @method __wedge__
     * @param rhs {any}
     * @return {Euclidean3}
     * @private
     */
    __wedge__(rhs: any): Euclidean3;
    /**
     * @method __rwedge__
     * @param lhs {any}
     * @return {Euclidean3}
     * @private
     */
    __rwedge__(lhs: any): Euclidean3;
    /**
     * @method lco
     * @param rhs {Euclidean3}
     * @return {Euclidean3}
     */
    lco(rhs: Euclidean3): Euclidean3;
    /**
     * @method __lshift__
     * @param rhs {any}
     * @return {Euclidean3}
     * @private
     */
    __lshift__(rhs: any): Euclidean3;
    /**
     * @method __rlshift__
     * @param lhs {any}
     * @return {Euclidean3}
     * @private
     */
    __rlshift__(lhs: any): Euclidean3;
    /**
     * @method rco
     * @param rhs {Euclidean3}
     * @return {Euclidean3}
     */
    rco(rhs: Euclidean3): Euclidean3;
    /**
     * @method __rshift__
     * @param rhs {any}
     * @return {Euclidean3}
     * @private
     */
    __rshift__(rhs: any): Euclidean3;
    /**
     * @method __rrshift__
     * @param lhs {any}
     * @return {Euclidean3}
     * @private
     */
    __rrshift__(lhs: any): Euclidean3;
    /**
     * @method pow
     * @param exponent {Euclidean3}
     * @return {Euclidean3}
     * @beta
     */
    pow(exponent: Euclidean3): Euclidean3;
    /**
     * @method __bang__
     * @return {Euclidean3}
     * @private
     */
    __bang__(): Euclidean3;
    /**
     * Unary plus(+).
     * @method __pos__
     * @return {Euclidean3}
     * @private
     */
    __pos__(): Euclidean3;
    /**
     * @method neg
     * @return {Euclidean3} <code>-1 * this</code>
     */
    neg(): Euclidean3;
    /**
     * Unary minus (-).
     * @method __neg__
     * @return {Euclidean3}
     * @private
     */
    __neg__(): Euclidean3;
    /**
     * @method rev
     * @return {Euclidean3}
     */
    rev(): Euclidean3;
    /**
     * ~ (tilde) produces reversion.
     * @method __tilde__
     * @return {Euclidean3}
     * @private
     */
    __tilde__(): Euclidean3;
    /**
     * @method grade
     * @param grade {number}
     * @return {Euclidean3}
     */
    grade(grade: number): Euclidean3;
    /**
     * Intentionally undocumented
     */
    /**
     * @method cross
     * @param vector {Euclidean3}
     * @return {Euclidean3}
     */
    cross(vector: Euclidean3): Euclidean3;
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
     * @method lerp
     * @param target {Euclidean3}
     * @param α {number}
     * @return {Euclidean3}
     */
    lerp(target: Euclidean3, α: number): Euclidean3;
    /**
     * @method cos
     * @return {Euclidean3}
     */
    cos(): Euclidean3;
    /**
     * @method cosh
     * @return {Euclidean3}
     */
    cosh(): Euclidean3;
    /**
     * @method distanceTo
     * @param point {Euclidean3}
     * @return {number}
     */
    distanceTo(point: Euclidean3): number;
    /**
     * @method equals
     * @param other {Euclidean3}
     * @return {boolean}
     */
    equals(other: Euclidean3): boolean;
    /**
     * @method exp
     * @return {Euclidean3}
     */
    exp(): Euclidean3;
    /**
     * Computes the <em>inverse</em> of this multivector, if it exists.
     * inv(A) = ~A / (A * ~A)
     * @method inv
     * @return {Euclidean3}
     * @beta
     */
    inv(): Euclidean3;
    /**
     * @method log
     * @return {Euclidean3}
     */
    log(): Euclidean3;
    /**
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     * @method magnitude
     * @return {number}
     */
    magnitude(): number;
    /**
     * Computes the magnitude of this Euclidean3. The magnitude is the square root of the quadrance.
     * @method norm
     * @return {Euclidean3}
     */
    norm(): Euclidean3;
    /**
     * Computes the quadrance of this Euclidean3. The quadrance is the square of the magnitude.
     * @method quad
     * @return {Euclidean3}
     */
    quad(): Euclidean3;
    /**
     * @method quadraticBezier
     * @param t {number}
     * @param controlPoint {GeometricE3}
     * @param endPoint {GeometricE3}
     * @return {Euclidean3}
     */
    quadraticBezier(t: number, controlPoint: GeometricE3, endPoint: GeometricE3): Euclidean3;
    /**
     * @method squaredNorm
     * @return {number}
     */
    squaredNorm(): number;
    /**
     * Computes the <em>reflection</em> of this multivector in the plane with normal <code>n</code>.
     * @method reflect
     * @param n {VectorE3}
     * @return {Euclidean3}
     */
    reflect(n: VectorE3): Euclidean3;
    /**
     * @method rotate
     * @param s {SpinorE3}
     * @return {Euclidean3}
     */
    rotate(s: SpinorE3): Euclidean3;
    /**
     * @method sin
     * @return {Euclidean3}
     */
    sin(): Euclidean3;
    /**
     * @method sinh
     * @return {Euclidean3}
     */
    sinh(): Euclidean3;
    /**
     * @method slerp
     * @param target {Euclidean3}
     * @param α {number}
     * @return {Euclidean3}
     */
    slerp(target: Euclidean3, α: number): Euclidean3;
    /**
     * @method sqrt
     * @return {Euclidean3}
     */
    sqrt(): Euclidean3;
    /**
     * @method tan
     * @return {Euclidean3}
     */
    tan(): Euclidean3;
    /**
     * Intentionally undocumented.
     */
    toStringCustom(coordToString: (x: number) => string, labels: (string | string[])[]): string;
    /**
     * @method toExponential
     * @return {string}
     */
    toExponential(): string;
    /**
     * @method toFixed
     * @param [digits] {number}
     * @return {string}
     */
    toFixed(digits?: number): string;
    /**
     * @method toString
     * @return {string}
     */
    toString(): string;
    /**
     * Provides access to the internals of Euclidean3 in order to use `product` functions.
     */
    private static mutator(M);
    /**
     * @method copy
     * @param m {GeometricE3}
     * @return {Euclidean3}
     * @static
     */
    static copy(m: GeometricE3): Euclidean3;
    /**
     * @method fromSpinorE3
     * @param spinor {SpinorE3}
     * @return {Euclidean3}
     * @static
     */
    static fromSpinorE3(spinor: SpinorE3): Euclidean3;
    /**
     * @method fromVectorE3
     * @param vector {VectorE3}
     * @return {Euclidean3}
     * @static
     */
    static fromVectorE3(vector: VectorE3): Euclidean3;
}
export = Euclidean3;
