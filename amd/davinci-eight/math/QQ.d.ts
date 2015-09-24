declare class QQ {
    private _numer;
    private _denom;
    /**
     * The QQ class represents a rational number.
     *
     * @class QQ
     * @extends Field
     * @constructor
     * @param {number} n The numerator.
     * @param {number} d The denominator.
     */
    constructor(n: number, d: number);
    numer: number;
    denom: number;
    add(rhs: QQ): QQ;
    sub(rhs: QQ): QQ;
    mul(rhs: QQ): QQ;
    div(rhs: any): QQ;
    isZero(): boolean;
    negative(): QQ;
    equals(other: any): boolean;
    toString(): string;
    static ONE: QQ;
    static TWO: QQ;
    static MINUS_ONE: QQ;
    static ZERO: QQ;
}
export = QQ;
