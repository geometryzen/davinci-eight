/**
 * @class QQ
 */
declare class QQ {
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
     * @method isZero
     * @return {boolean}
     */
    isZero(): boolean;
    /**
     * Computes the additive inverse of this rational.
     * @method negative
     * @return {QQ}
     */
    negative(): QQ;
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
