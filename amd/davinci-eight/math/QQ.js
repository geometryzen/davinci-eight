define(["require", "exports", '../checks/mustBeInteger', '../i18n/readOnly'], function (require, exports, mustBeInteger, readOnly) {
    /**
     * @class QQ
     */
    var QQ = (function () {
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
        function QQ(n, d) {
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
        Object.defineProperty(QQ.prototype, "numer", {
            /**
             * @property numer
             * @type {number}
             * @readOnly
             */
            get: function () {
                return this._numer;
            },
            set: function (unused) {
                throw new Error(readOnly('numer').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QQ.prototype, "denom", {
            /**
             * @property denom
             * @type {number}
             * @readOnly
             */
            get: function () {
                return this._denom;
            },
            set: function (unused) {
                throw new Error(readOnly('denom').message);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method add
         * @param rhs {QQ}
         * @return {QQ}
         */
        QQ.prototype.add = function (rhs) {
            return new QQ(this._numer * rhs._denom + this._denom * rhs._numer, this._denom * rhs._denom);
        };
        /**
         * @method sub
         * @param rhs {QQ}
         * @return {QQ}
         */
        QQ.prototype.sub = function (rhs) {
            return new QQ(this._numer * rhs._denom - this._denom * rhs._numer, this._denom * rhs._denom);
        };
        /**
         * @method mul
         * @param rhs {QQ}
         * @return {QQ}
         */
        QQ.prototype.mul = function (rhs) {
            return new QQ(this._numer * rhs._numer, this._denom * rhs._denom);
        };
        /**
         * @method div
         * @param rhs {QQ}
         * @return {QQ}
         */
        QQ.prototype.div = function (rhs) {
            if (typeof rhs === 'number') {
                return new QQ(this._numer, this._denom * rhs);
            }
            else {
                return new QQ(this._numer * rhs._denom, this._denom * rhs._numer);
            }
        };
        /**
         * @method isZero
         * @return {boolean}
         */
        QQ.prototype.isZero = function () {
            return this._numer === 0;
        };
        /**
         * Computes the additive inverse of this rational.
         * @method negative
         * @return {QQ}
         */
        QQ.prototype.negative = function () {
            return new QQ(-this._numer, this._denom);
        };
        /**
         * @method equals
         * @param other {QQ}
         * @return {boolean}
         */
        QQ.prototype.equals = function (other) {
            if (other instanceof QQ) {
                return this._numer * other._denom === this._denom * other._numer;
            }
            else {
                return false;
            }
        };
        /**
         * Computes a non-normative string representation of this rational.
         */
        QQ.prototype.toString = function () {
            return "" + this._numer + "/" + this._denom + "";
        };
        /**
         * @property ONE
         * @type {QQ}
         * @static
         */
        QQ.ONE = new QQ(1, 1);
        /**
         * @property TWO
         * @type {QQ}
         * @static
         */
        QQ.TWO = new QQ(2, 1);
        /**
         * @property MINUS_ONE
         * @type {QQ}
         * @static
         */
        QQ.MINUS_ONE = new QQ(-1, 1);
        /**
         * @property ZERO
         * @type {QQ}
         * @static
         */
        QQ.ZERO = new QQ(0, 1);
        return QQ;
    })();
    return QQ;
});
