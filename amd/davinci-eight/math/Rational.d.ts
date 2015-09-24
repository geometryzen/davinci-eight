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
    numer: number;
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
