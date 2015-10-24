import GeometricOperators = require('../math/GeometricOperators');
import Measure = require('../math/Measure');
import TrigMethods = require('../math/TrigMethods');
import Unit = require('../math/Unit');
/**
 * @class CC
 */
declare class CC implements Measure<CC>, GeometricOperators<CC>, TrigMethods<CC> {
    /**
     * The real part of the complex number.
     * @property x
     * @type {number}
     */
    x: number;
    /**
     * The imaginary part of the complex number.
     * @property y
     * @type {number}
     */
    y: number;
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
     * @param x The real part of the complex number.
     * @param y The imaginary part of the complex number.
     */
    constructor(x: number, y: number, uom?: Unit);
    coordinates(): number[];
    /**
     * @method add
     * @param rhs {CC}
     * @return {CC}
     */
    add(rhs: CC): CC;
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
    __div__(other: any): CC;
    __rdiv__(other: any): CC;
    /**
     * @method align
     * @param rhs {CC}
     * @return {CC}
     */
    align(rhs: CC): CC;
    __vbar__(other: any): CC;
    __rvbar__(other: any): CC;
    /**
     * @method wedge
     * @param rhs {CC}
     * @return {CC}
     */
    wedge(rhs: CC): CC;
    __wedge__(other: any): CC;
    __rwedge__(other: any): CC;
    /**
     * @method lco
     * @param rhs {CC}
     * @return {CC}
     */
    lco(rhs: CC): CC;
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
     * @method sin
     * @return {CC}
     */
    sin(): CC;
    /**
     * @method sinh
     * @return {CC}
     */
    sinh(): CC;
    /**
     * @method unitary
     * @return {CC}
     */
    unitary(): CC;
    /**
     * @method gradeZero
     * @return {number}
     */
    gradeZero(): number;
    /**
     * @method arg
     * @return {number}
     */
    arg(): number;
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
