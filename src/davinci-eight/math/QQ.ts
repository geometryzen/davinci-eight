import mustBeInteger = require('../checks/mustBeInteger')
import readOnly = require('../i18n/readOnly')

/**
 * @class QQ
 */
class QQ {
    /**
     * @property _numer
     * @type {number}
     * @private
     */
    private _numer: number;
    /**
     * @property _denom
     * @type {number}
     * @private
     */
    private _denom: number;

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
    constructor(n: number, d: number) {
        mustBeInteger('n', n);
        mustBeInteger('d', d);
        var g: number;

        var gcd = function(a: number, b: number) {
            mustBeInteger('a', a);
            mustBeInteger('b', b);
            var temp: number;

            if (a < 0) {
                a = -a;
            }
            if (b < 0) {
                b = -b;
            }
            if (b > a) {
                temp = a;
                a = b;
                b = temp;
            }
            while (true) {
                a %= b;
                if (a === 0) {
                    return b;
                }
                b %= a;
                if (b === 0) {
                    return a;
                }
            }
        };

        if (d === 0) {
            throw new Error("denominator must not be zero");
        }
        if (n === 0) {
            g = 1;
        }
        else {
            g = gcd(Math.abs(n), Math.abs(d));
        }
        if (d < 0) {
            n = -n;
            d = -d;
        }
        this._numer = n / g;
        this._denom = d / g;
    }

    /**
     * @property numer
     * @type {number}
     * @readOnly
     */
    get numer(): number {
        return this._numer;
    }
    set numer(unused: number) {
        throw new Error(readOnly('numer').message)
    }

    /**
     * @property denom
     * @type {number}
     * @readOnly
     */
    get denom(): number {
        return this._denom;
    }
    set denom(unused: number) {
        throw new Error(readOnly('denom').message)
    }

    /**
     * @method add
     * @param rhs {QQ}
     * @return {QQ}
     */
    add(rhs: QQ): QQ {
        return new QQ(this._numer * rhs._denom + this._denom * rhs._numer, this._denom * rhs._denom);
    }

    /**
     * @method sub
     * @param rhs {QQ}
     * @return {QQ}
     */
    sub(rhs: QQ): QQ {
        return new QQ(this._numer * rhs._denom - this._denom * rhs._numer, this._denom * rhs._denom);
    }

    /**
     * @method mul
     * @param rhs {QQ}
     * @return {QQ}
     */
    mul(rhs: QQ): QQ {
        return new QQ(this._numer * rhs._numer, this._denom * rhs._denom);
    }

    /**
     * @method div
     * @param rhs {QQ}
     * @return {QQ}
     */
    div(rhs: any): QQ {
        if (typeof rhs === 'number') {
            return new QQ(this._numer, this._denom * rhs);
        }
        else {
            return new QQ(this._numer * rhs._denom, this._denom * rhs._numer);
        }
    }

    /**
     * @method isZero
     * @return {boolean}
     */
    isZero(): boolean {
        return this._numer === 0;
    }

    /**
     * Computes the additive inverse of this rational.
     * @method negative
     * @return {QQ}
     */
    negative(): QQ {
        return new QQ(-this._numer, this._denom);
    }

    /**
     * @method equals
     * @param other {QQ}
     * @return {boolean}
     */
    equals(other: QQ): boolean {
        if (other instanceof QQ) {
            return this._numer * other._denom === this._denom * other._numer;
        }
        else {
            return false;
        }
    }

    /**
     * Computes a non-normative string representation of this rational.
     */
    toString(): string {
        return "" + this._numer + "/" + this._denom + ""
    }
    /**
     * @property ONE
     * @type {QQ}
     * @static
     */
    static ONE: QQ = new QQ(1, 1);
    /**
     * @property TWO
     * @type {QQ}
     * @static
     */
    static TWO: QQ = new QQ(2, 1);
    /**
     * @property MINUS_ONE
     * @type {QQ}
     * @static
     */
    static MINUS_ONE: QQ = new QQ(-1, 1);
    /**
     * @property ZERO
     * @type {QQ}
     * @static
     */
    static ZERO: QQ = new QQ(0, 1);
}

export = QQ;