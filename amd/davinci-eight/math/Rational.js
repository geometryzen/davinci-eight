define(["require", "exports", '../math/RationalError'], function (require, exports, RationalError) {
    function assertArgNumber(name, x) {
        if (typeof x === 'number') {
            return x;
        }
        else {
            throw new RationalError("Argument '" + name + "' must be a number");
        }
    }
    function assertArgRational(name, arg) {
        if (arg instanceof Rational) {
            return arg;
        }
        else {
            throw new RationalError("Argument '" + arg + "' must be a Rational");
        }
    }
    /*
    function assertArgUnitOrUndefined(name: string, uom: Unit): Unit {
      if (typeof uom === 'undefined' || uom instanceof Unit) {
        return uom;
      }
      else {
        throw new RationalError("Argument '" + uom + "' must be a Unit or undefined");
      }
    }
    */
    var Rational = (function () {
        /**
         * The Rational class represents a rational number.
         *
         * @class Rational
         * @extends Field
         * @constructor
         * @param {number} n The numerator.
         * @param {number} d The denominator.
         */
        function Rational(n, d) {
            assertArgNumber('n', n);
            assertArgNumber('d', d);
            var g;
            var gcd = function (a, b) {
                assertArgNumber('a', a);
                assertArgNumber('b', b);
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
            get: function () {
                return this._numer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rational.prototype, "denom", {
            get: function () {
                return this._denom;
            },
            enumerable: true,
            configurable: true
        });
        Rational.prototype.add = function (rhs) {
            assertArgRational('rhs', rhs);
            return new Rational(this._numer * rhs._denom + this._denom * rhs._numer, this._denom * rhs._denom);
        };
        Rational.prototype.sub = function (rhs) {
            assertArgRational('rhs', rhs);
            return new Rational(this._numer * rhs._denom - this._denom * rhs._numer, this._denom * rhs._denom);
        };
        Rational.prototype.mul = function (rhs) {
            assertArgRational('rhs', rhs);
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
