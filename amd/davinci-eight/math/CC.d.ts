import GeometricOperators = require('../math/GeometricOperators');
import Measure = require('../math/Measure');
import SpinorE2 = require('../math/SpinorE2');
import TrigMethods = require('../math/TrigMethods');
import Unit = require('../math/Unit');
/**
 * @class CC
 */
declare class CC implements Measure<CC>, GeometricOperators<CC>, TrigMethods<CC>, SpinorE2 {
    /**
     * The <em>real</em> part of the complex number.
     * @property x
     * @type {number}
     * @private
     */
    private x;
    /**
     * The <em>imaginary</em> part of the complex number.
     * @property y
     * @type {number}
     * @private
     */
    private y;
    /**
     * The optional unit of measure.
     * @property uom
     * @type {Unit}
     */
    uom: Unit;
    /**
     * @class CC
     * @constructor
     * CConstructs a complex number z = (x, y).
     * @param α The <em>scalar</em> or <em>real</em> part of the complex number.
     * @param β The <em>pseudoscalar</em> or <em>imaginary</em> part of the complex number.
     */
    constructor(α: number, β: number, uom?: Unit);
    /**
     * The <em>real</em> or <em>scalar</em> part of this complex number.
     * @property α
     * @return {number}
     */
    α: number;
    /**
     * The <em>imaginary</em> or <em>pseudoscalar</em> part of this complex number.
     * @property β
     * @return {number}
     */
    β: number;
    xy: number;
    /**
     * @property coords
     * @type {number[]}
     * @readOnly
     */
    coords: number[];
    /**
     * @method add
     * @param rhs {CC}
     * @return {CC}
     */
    add(rhs: CC): CC;
    /**
     * complex.angle() => complex.log().grade(2)
     * @method angle
     * @return {CC}
     */
    angle(): CC;
    /**
     * @method __add__
     * @param other {number | CC}
     * @return {CC}
     * @private
     */
    __add__(other: number | CC): CC;
    /**
     * __radd__ supports operator +(any, CC)
     */
    __radd__(other: any): CC;
    /**
     * @method sub
     * @param rhs {CC}
     * @return {CC}
     */
    sub(rhs: CC): CC;
    __sub__(other: any): CC;
    __rsub__(other: any): CC;
    /**
     * @method mul
     * @param rhs {CC}
     * @return {CC}
     */
    mul(rhs: CC): CC;
    __mul__(other: any): CC;
    __rmul__(other: any): CC;
    /**
     * @method div
     * @param rhs {CC}
     * @return {CC}
     */
    div(rhs: CC): CC;
    /**
     * @method divByScalar
     * @param α {number}
     * @return {CC}
     */
    divByScalar(α: number): CC;
    __div__(other: any): CC;
    __rdiv__(other: any): CC;
    /**
     * @method align
     * @param rhs {CC}
     * @return {CC}
     */
    scp(rhs: CC): CC;
    __vbar__(other: any): CC;
    __rvbar__(other: any): CC;
    /**
     * @method wedge
     * @param rhs {CC}
     * @return {CC}
     */
    ext(rhs: CC): CC;
    __wedge__(other: any): CC;
    __rwedge__(other: any): CC;
    grade(grade: number): CC;
    /**
     * @method lco
     * @param rhs {CC}
     * @return {CC}
     */
    lco(rhs: CC): CC;
    lerp(target: CC, α: number): CC;
    log(): CC;
    /**
     * @method rco
     * @param rhs {CC}
     * @return {CC}
     */
    rco(rhs: CC): CC;
    /**
     * @method pow
     * @param exponent {CC}
     * @return {CC}
     */
    pow(exponent: CC): CC;
    /**
     * @method cos
     * @return {CC}
     */
    cos(): CC;
    /**
     * @method cosh
     * @return {CC}
     */
    cosh(): CC;
    /**
     * @method exp
     * @return {CC}
     */
    exp(): CC;
    /**
     * Computes the multiplicative inverse of this complex number.
     * @method inv
     * @return {CC}
     */
    inv(): CC;
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
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     * @method magnitude
     * @return {number}
     */
    magnitude(): number;
    /**
     * Computes the additive inverse of this complex number.
     * @method neg
     * @return {CC}
     */
    neg(): CC;
    /**
     * @method norm
     * @return {CC}
     */
    norm(): CC;
    /**
     * @method quad
     * @return {CC}
     */
    quad(): CC;
    /**
     * @method squaredNorm
     * @return {number}
     */
    squaredNorm(): number;
    /**
     * @method scale
     * @param α {number}
     * @return {CC}
     */
    scale(α: number): CC;
    /**
     * @method sin
     * @return {CC}
     */
    sin(): CC;
    /**
     * @method sinh
     * @return {CC}
     */
    sinh(): CC;
    slerp(target: CC, α: number): CC;
    /**
     * @method direction
     * @return {CC}
     */
    direction(): CC;
    /**
     * @method tan
     * @return {CC}
     */
    tan(): CC;
    toStringCustom(coordToString: (x: number) => string): string;
    toExponential(): string;
    toFixed(digits?: number): string;
    toString(): string;
    __lshift__(other: any): CC;
    __rlshift__(other: any): CC;
    /**
     * @method __rshift__
     * @param other {number|CC}
     * @return {CC}
     * @private
     */
    __rshift__(other: number | CC): CC;
    /**
     * @method __rrshift__
     * @param other {number|CC}
     * @return {CC}
     * @private
     */
    __rrshift__(other: any): CC;
    /**
     * @method __bang__
     * @return {CC}
     * @private
     */
    __bang__(): CC;
    /**
     * @method __pos__
     * @return {CC}
     * @private
     */
    __pos__(): CC;
    /**
     * @method __neg__
     * @return {CC}
     * @private
     */
    __neg__(): CC;
    /**
     * @method __tilde__
     * @return {CC}
     * @private
     */
    __tilde__(): CC;
}
export = CC;
