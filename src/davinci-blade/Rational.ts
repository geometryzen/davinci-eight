class Rational {
    private _numer: number;
    private _denom: number;

    /**
     * The Rational class represents a rational number.
     *
     * @class Rational
     * @extends Field
     * @constructor
     * @param {number} n The numerator.
     * @param {number} d The denominator.
     */
    constructor(n: number, d: number) {
        var g;

        var gcd = function(a: number, b: number) {
            var temp;

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
    * The numerator part of the rational number. 
    * 
    * @property numer
    * @type {number}
    */
    get numer(): number {
        return this._numer;
    }

    /**
    * The denominator part of the rational number. 
    * 
    * @property denom
    * @type {number}
    */
    get denom(): number {
        return this._denom;
    }

    /**
    * Returns the sum of this rational number and the argument. 
    *
    * @method add
    * @param {Number|Rational} rhs The number used on the right hand side of the addition operator.
    * @return {Rational} The sum of this rational number and the specified argument.
    */
    add(rhs): Rational {
        if (typeof rhs === 'number') {
            return new Rational(this._numer + this._denom * rhs, this._denom);
        } else {
            return new Rational(this._numer * rhs._denom + this._denom * rhs._numer, this._denom * rhs._denom);
        }
    }

    /**
    * Returns the difference of this rational number and the argument. 
    *
    * @method sub
    * @param {Number|Rational} rhs The number used on the right hand side of the subtraction operator.
    * @return {Rational} The difference of this rational number and the specified argument.
    */
    sub(rhs): Rational {
        if (typeof rhs === 'number') {
            return new Rational(this._numer - this._denom * rhs, this._denom);
        } else {
            return new Rational(this._numer * rhs._denom - this._denom * rhs._numer, this._denom * rhs._denom);
        }
    }

    mul(rhs): Rational {
        if (typeof rhs === 'number') {
            return new Rational(this._numer * rhs, this._denom);
        } else {
            return new Rational(this._numer * rhs._numer, this._denom * rhs._denom);
        }
    }

    // TODO: div testing
    div(rhs): Rational {
        if (typeof rhs === 'number') {
            return new Rational(this._numer, this._denom * rhs);
        } else {
            return new Rational(this._numer * rhs._denom, this._denom * rhs._numer);
        }
    }

    // TODO: isZero testing
    isZero(): boolean {
        return this._numer === 0;
    }

    negative(): Rational {
        return new Rational(-this._numer, this._denom);
    }

    // TODO: equals testing
    equals(other): boolean {
        if (other instanceof Rational) {
            return this._numer * other._denom === this._denom * other._numer;
        } else {
            return false;
        }
    }

    toString(): string {
        return "" + this._numer + "/" + this._denom;
    }

    // TODO: Implement some sort of interning to reduce object creation.
    // Make sure that Rational is immutable!
    static ONE: Rational = new Rational(1, 1);
    static MINUS_ONE: Rational = new Rational(-1, 1);
    static ZERO: Rational = new Rational(0, 1);
}
export = Rational;