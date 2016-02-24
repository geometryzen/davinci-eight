import core from '../core'
import DivisionRingOperators from './DivisionRingOperators';
import mustBeInteger from '../checks/mustBeInteger';
import readOnly from '../i18n/readOnly';

/**
 * @module EIGHT
 * @submodule math
 */

/**
 * @class QQ
 */
export default class QQ implements DivisionRingOperators<QQ> {
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
        if (core.safemode) {
            mustBeInteger('n', n);
            mustBeInteger('d', d);
        }
        var g: number;

        const gcd = function(a: number, b: number) {
            if (core.safemode) {
                mustBeInteger('a', a);
                mustBeInteger('b', b);
            }
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
    div(rhs: QQ): QQ {
        const numer = this._numer * rhs._denom
        const denom = this._denom * rhs._numer
        if (numer === 0) {
            if (denom === 0) {
                // How do we handle undefined?
                return new QQ(numer, denom)
            }
            else {
                return QQ.ZERO
            }
        }
        else {
            if (denom === 0) {
                // How do we handle division by zero.
                return new QQ(numer, denom)
            }
            else {
                return new QQ(numer, denom)
            }
        }
    }

    /**
     * @method isOne
     * @return {boolean}
     */
    isOne(): boolean {
        return this._numer === 1 && this._denom === 1
    }

    /**
     * @method isZero
     * @return {boolean}
     */
    isZero(): boolean {
        return this._numer === 0 && this._denom === 1
    }

    /**
     * Computes the multiplicative inverse of this rational number.
     * @method inv
     * @return {QQ}
     */
    inv(): QQ {
        return new QQ(this._denom, this._numer);
    }

    /**
     * Computes the additive inverse of this rational number.
     * @method neg
     * @return {QQ}
     */
    neg(): QQ {
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
     * @method __add__
     * @param rhs {any}
     * @return {QQ}
     * @private
     */
    __add__(rhs: any): QQ {
        if (rhs instanceof QQ) {
            return this.add(rhs)
        }
        else {
            return void 0
        }
    }

    /**
     * @method __radd__
     * @param lhs {any}
     * @return {QQ}
     * @private
     */
    __radd__(lhs: any): QQ {
        if (lhs instanceof QQ) {
            return lhs.add(this)
        }
        else {
            return void 0
        }
    }

    /**
     * @method __sub__
     * @param rhs {any}
     * @return {QQ}
     * @private
     */
    __sub__(rhs: any): QQ {
        if (rhs instanceof QQ) {
            return this.sub(rhs)
        }
        else {
            return void 0
        }
    }

    /**
     * @method __rsub__
     * @param lhs {any}
     * @return {QQ}
     * @private
     */
    __rsub__(lhs: any): QQ {
        if (lhs instanceof QQ) {
            return lhs.sub(this)
        }
        else {
            return void 0
        }
    }

    /**
     * @method __mul__
     * @param rhs {any}
     * @return {QQ}
     * @private
     */
    __mul__(rhs: any): QQ {
        if (rhs instanceof QQ) {
            return this.mul(rhs)
        }
        else {
            return void 0
        }
    }

    /**
     * @method __rmul__
     * @param lhs {any}
     * @return {QQ}
     * @private
     */
    __rmul__(lhs: any): QQ {
        if (lhs instanceof QQ) {
            return lhs.mul(this)
        }
        else {
            return void 0
        }
    }

    /**
     * @method __div__
     * @param div {any}
     * @return {QQ}
     * @private
     */
    __div__(rhs: any): QQ {
        if (rhs instanceof QQ) {
            return this.div(rhs)
        }
        else {
            return void 0
        }
    }

    /**
     * @method __rdiv__
     * @param lhs {any}
     * @return {QQ}
     * @private
     */
    __rdiv__(lhs: any): QQ {
        if (lhs instanceof QQ) {
            return lhs.div(this)
        }
        else {
            return void 0
        }
    }

    /**
     * @method __pos__
     * @return {QQ}
     * @private
     */
    __pos__(): QQ {
        return this
    }

    /**
     * @method __neg__
     * @return {QQ}
     * @private
     */
    __neg__(): QQ {
        return this.neg()
    }

    /**
     * @property ONE
     * @type {QQ}
     * @static
     */
    static ONE: QQ = new QQ(1, 1)

    /**
     * @property TWO
     * @type {QQ}
     * @static
     */
    static TWO: QQ = new QQ(2, 1)

    /**
     * @property MINUS_ONE
     * @type {QQ}
     * @static
     */
    static MINUS_ONE: QQ = new QQ(-1, 1)

    /**
     * @property ZERO
     * @type {QQ}
     * @static
     */
    static ZERO: QQ = new QQ(0, 1)
}
