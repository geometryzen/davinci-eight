declare class Rational {
    private _numer;
    private _denom;
    /**
     * The Rational class represents a rational number.
     *
     * @class Rational
     * @extends Field
     * @constructor
     * @param {number} n The numerator.
     * @param {number} d The denominator.
     */
    constructor(n: number, d: number);
    /**
    * The numerator part of the rational number.
    *
    * @property numer
    * @type {number}
    */
    numer: number;
    /**
    * The denominator part of the rational number.
    *
    * @property denom
    * @type {number}
    */
    denom: number;
    /**
    * Returns the sum of this rational number and the argument.
    *
    * @method add
    * @param {Number|Rational} rhs The number used on the right hand side of the addition operator.
    * @return {Rational} The sum of this rational number and the specified argument.
    */
    add(rhs: any): Rational;
    /**
    * Returns the difference of this rational number and the argument.
    *
    * @method sub
    * @param {Number|Rational} rhs The number used on the right hand side of the subtraction operator.
    * @return {Rational} The difference of this rational number and the specified argument.
    */
    sub(rhs: any): Rational;
    mul(rhs: any): Rational;
    div(rhs: any): Rational;
    isZero(): boolean;
    negative(): Rational;
    equals(other: any): boolean;
    toString(): string;
    static ONE: Rational;
    static MINUS_ONE: Rational;
    static ZERO: Rational;
}
export = Rational;
