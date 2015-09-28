/**
 * @class Rational
 */
declare class Rational {
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
     * The Rational class represents a rational number.
     *
     * @class Rational
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
    add(rhs: Rational): Rational;
    sub(rhs: Rational): Rational;
    mul(rhs: Rational): Rational;
    div(rhs: any): Rational;
    isZero(): boolean;
    negative(): Rational;
    equals(other: any): boolean;
    toString(): string;
    static ONE: Rational;
    static TWO: Rational;
    static MINUS_ONE: Rational;
    static ZERO: Rational;
}
export = Rational;
