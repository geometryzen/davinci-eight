import DivisionRingOperators = require('../math/DivisionRingOperators');
/**
 * @class QQ
 */
declare class QQ implements DivisionRingOperators<QQ> {
    /**
     * @property _numer
     * @type {number}
     * @private
     */
    private _numer;
    /**
     * @property _denom
     * @type {number}
     * @private
     */
    private _denom;
    /**
     * The QQ class represents a rational number, ℚ.
     *
     * The QQ implementation is that of an <em>immutable</em> (value) type.
     *
     * The numerator and denominator are reduced to their lowest form.
     *
     * @class QQ
     * @constructor
     * @param {number} n The numerator, an integer.
     * @param {number} d The denominator, an integer.
     */
    constructor(n: number, d: number);
    /**
     * @property numer
     * @type {number}
     * @readOnly
     */
    numer: number;
    /**
     * @property denom
     * @type {number}
     * @readOnly
     */
    denom: number;
    /**
     * @method add
     * @param rhs {QQ}
     * @return {QQ}
     */
    add(rhs: QQ): QQ;
    /**
     * @method sub
     * @param rhs {QQ}
     * @return {QQ}
     */
    sub(rhs: QQ): QQ;
    /**
     * @method mul
     * @param rhs {QQ}
     * @return {QQ}
     */
    mul(rhs: QQ): QQ;
    /**
     * @method div
     * @param rhs {QQ}
     * @return {QQ}
     */
    div(rhs: any): QQ;
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
     * Computes the multiplicative inverse of this rational number.
     * @method inv
     * @return {QQ}
     */
    inv(): QQ;
    /**
     * Computes the additive inverse of this rational number.
     * @method neg
     * @return {QQ}
     */
    neg(): QQ;
    /**
     * @method equals
     * @param other {QQ}
     * @return {boolean}
     */
    equals(other: QQ): boolean;
    /**
     * Computes a non-normative string representation of this rational.
     */
    toString(): string;
    /**
     * @method __add__
     * @param rhs {any}
     * @return {QQ}
     * @private
     */
    __add__(rhs: any): QQ;
    /**
     * @method __radd__
     * @param lhs {any}
     * @return {QQ}
     * @private
     */
    __radd__(lhs: any): QQ;
    /**
     * @method __sub__
     * @param rhs {any}
     * @return {QQ}
     * @private
     */
    __sub__(rhs: any): QQ;
    /**
     * @method __rsub__
     * @param lhs {any}
     * @return {QQ}
     * @private
     */
    __rsub__(lhs: any): QQ;
    /**
     * @method __mul__
     * @param rhs {any}
     * @return {QQ}
     * @private
     */
    __mul__(rhs: any): QQ;
    /**
     * @method __rmul__
     * @param lhs {any}
     * @return {QQ}
     * @private
     */
    __rmul__(lhs: any): QQ;
    /**
     * @method __div__
     * @param div {any}
     * @return {QQ}
     * @private
     */
    __div__(rhs: any): QQ;
    /**
     * @method __rdiv__
     * @param lhs {any}
     * @return {QQ}
     * @private
     */
    __rdiv__(lhs: any): QQ;
    /**
     * @method __pos__
     * @return {QQ}
     * @private
     */
    __pos__(): QQ;
    /**
     * @method __neg__
     * @return {QQ}
     * @private
     */
    __neg__(): QQ;
    /**
     * @property ONE
     * @type {QQ}
     * @static
     */
    static ONE: QQ;
    /**
     * @property TWO
     * @type {QQ}
     * @static
     */
    static TWO: QQ;
    /**
     * @property MINUS_ONE
     * @type {QQ}
     * @static
     */
    static MINUS_ONE: QQ;
    /**
     * @property ZERO
     * @type {QQ}
     * @static
     */
    static ZERO: QQ;
}
export = QQ;
