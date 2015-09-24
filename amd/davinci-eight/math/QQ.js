define(["require", "exports", '../math/QQError'], function (require, exports, QQError) {
    function assertArgNumber(name, x) {
        if (typeof x === 'number') {
            return x;
        }
        else {
            throw new QQError("Argument '" + name + "' must be a number");
        }
    }
    function assertArgRational(name, arg) {
        if (arg instanceof QQ) {
            return arg;
        }
        else {
            throw new QQError("Argument '" + arg + "' must be a QQ");
        }
    }
    /*
    function assertArgUnitOrUndefined(name: string, uom: Unit): Unit {
      if (typeof uom === 'undefined' || uom instanceof Unit) {
        return uom;
      }
      else {
        throw new QQError("Argument '" + uom + "' must be a Unit or undefined");
      }
    }
    */
    var QQ = (function () {
        /**
         * The QQ class represents a rational number.
         *
         * @class QQ
         * @extends Field
         * @constructor
         * @param {number} n The numerator.
         * @param {number} d The denominator.
         */
        function QQ(n, d) {
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
        Object.defineProperty(QQ.prototype, "numer", {
            get: function () {
                return this._numer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QQ.prototype, "denom", {
            get: function () {
                return this._denom;
            },
            enumerable: true,
            configurable: true
        });
        QQ.prototype.add = function (rhs) {
            assertArgRational('rhs', rhs);
            return new QQ(this._numer * rhs._denom + this._denom * rhs._numer, this._denom * rhs._denom);
        };
        QQ.prototype.sub = function (rhs) {
            assertArgRational('rhs', rhs);
            return new QQ(this._numer * rhs._denom - this._denom * rhs._numer, this._denom * rhs._denom);
        };
        QQ.prototype.mul = function (rhs) {
            assertArgRational('rhs', rhs);
            return new QQ(this._numer * rhs._numer, this._denom * rhs._denom);
        };
        // TODO: div testing
        QQ.prototype.div = function (rhs) {
            if (typeof rhs === 'number') {
                return new QQ(this._numer, this._denom * rhs);
            }
            else {
                return new QQ(this._numer * rhs._denom, this._denom * rhs._numer);
            }
        };
        QQ.prototype.isZero = function () {
            return this._numer === 0;
        };
        QQ.prototype.negative = function () {
            return new QQ(-this._numer, this._denom);
        };
        QQ.prototype.equals = function (other) {
            if (other instanceof QQ) {
                return this._numer * other._denom === this._denom * other._numer;
            }
            else {
                return false;
            }
        };
        QQ.prototype.toString = function () {
            return "" + this._numer + "/" + this._denom;
        };
        QQ.ONE = new QQ(1, 1);
        QQ.TWO = new QQ(2, 1);
        QQ.MINUS_ONE = new QQ(-1, 1);
        QQ.ZERO = new QQ(0, 1);
        return QQ;
    })();
    return QQ;
});
