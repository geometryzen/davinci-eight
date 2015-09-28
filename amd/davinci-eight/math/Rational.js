define(["require", "exports", '../checks/mustBeInteger'], function (require, exports, mustBeInteger) {
    /**
     * @class Rational
     */
    var Rational = (function () {
        /**
         * The Rational class represents a rational number.
         *
         * @class Rational
         * @constructor
         * @param {number} n The numerator, an integer.
         * @param {number} d The denominator, an integer.
         */
        function Rational(n, d) {
            mustBeInteger('n', n);
            mustBeInteger('d', d);
            var g;
            var gcd = function (a, b) {
                mustBeInteger('a', a);
                mustBeInteger('b', b);
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
        Object.defineProperty(Rational.prototype, "numer", {
            /**
             * @property numer
             * @type {number}
             * @readOnly
             */
            get: function () {
                return this._numer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rational.prototype, "denom", {
            /**
             * @property denom
             * @type {number}
             * @readOnly
             */
            get: function () {
                return this._denom;
            },
            enumerable: true,
            configurable: true
        });
        Rational.prototype.add = function (rhs) {
            return new Rational(this._numer * rhs._denom + this._denom * rhs._numer, this._denom * rhs._denom);
        };
        Rational.prototype.sub = function (rhs) {
            return new Rational(this._numer * rhs._denom - this._denom * rhs._numer, this._denom * rhs._denom);
        };
        Rational.prototype.mul = function (rhs) {
            return new Rational(this._numer * rhs._numer, this._denom * rhs._denom);
        };
        // TODO: div testing
        Rational.prototype.div = function (rhs) {
            if (typeof rhs === 'number') {
                return new Rational(this._numer, this._denom * rhs);
            }
            else {
                return new Rational(this._numer * rhs._denom, this._denom * rhs._numer);
            }
        };
        Rational.prototype.isZero = function () {
            return this._numer === 0;
        };
        Rational.prototype.negative = function () {
            return new Rational(-this._numer, this._denom);
        };
        Rational.prototype.equals = function (other) {
            if (other instanceof Rational) {
                return this._numer * other._denom === this._denom * other._numer;
            }
            else {
                return false;
            }
        };
        Rational.prototype.toString = function () {
            return "" + this._numer + "/" + this._denom;
        };
        Rational.ONE = new Rational(1, 1);
        Rational.TWO = new Rational(2, 1);
        Rational.MINUS_ONE = new Rational(-1, 1);
        Rational.ZERO = new Rational(0, 1);
        return Rational;
    })();
    return Rational;
});
