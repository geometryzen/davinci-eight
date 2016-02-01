define(["require", "exports", '../checks/mustBeInteger', '../i18n/readOnly'], function (require, exports, mustBeInteger_1, readOnly_1) {
    var QQ = (function () {
        function QQ(n, d) {
            mustBeInteger_1.default('n', n);
            mustBeInteger_1.default('d', d);
            var g;
            var gcd = function (a, b) {
                mustBeInteger_1.default('a', a);
                mustBeInteger_1.default('b', b);
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
            set: function (unused) {
                throw new Error(readOnly_1.default('numer').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QQ.prototype, "denom", {
            get: function () {
                return this._denom;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('denom').message);
            },
            enumerable: true,
            configurable: true
        });
        QQ.prototype.add = function (rhs) {
            return new QQ(this._numer * rhs._denom + this._denom * rhs._numer, this._denom * rhs._denom);
        };
        QQ.prototype.sub = function (rhs) {
            return new QQ(this._numer * rhs._denom - this._denom * rhs._numer, this._denom * rhs._denom);
        };
        QQ.prototype.mul = function (rhs) {
            return new QQ(this._numer * rhs._numer, this._denom * rhs._denom);
        };
        QQ.prototype.div = function (rhs) {
            if (typeof rhs === 'number') {
                return new QQ(this._numer, this._denom * rhs);
            }
            else {
                return new QQ(this._numer * rhs._denom, this._denom * rhs._numer);
            }
        };
        QQ.prototype.isOne = function () {
            return this._numer === 1 && this._denom === 1;
        };
        QQ.prototype.isZero = function () {
            return this._numer === 0 && this._denom === 1;
        };
        QQ.prototype.inv = function () {
            return new QQ(this._denom, this._numer);
        };
        QQ.prototype.neg = function () {
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
            return "" + this._numer + "/" + this._denom + "";
        };
        QQ.prototype.__add__ = function (rhs) {
            if (rhs instanceof QQ) {
                return this.add(rhs);
            }
            else {
                return void 0;
            }
        };
        QQ.prototype.__radd__ = function (lhs) {
            if (lhs instanceof QQ) {
                return lhs.add(this);
            }
            else {
                return void 0;
            }
        };
        QQ.prototype.__sub__ = function (rhs) {
            if (rhs instanceof QQ) {
                return this.sub(rhs);
            }
            else {
                return void 0;
            }
        };
        QQ.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof QQ) {
                return lhs.sub(this);
            }
            else {
                return void 0;
            }
        };
        QQ.prototype.__mul__ = function (rhs) {
            if (rhs instanceof QQ) {
                return this.mul(rhs);
            }
            else {
                return void 0;
            }
        };
        QQ.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof QQ) {
                return lhs.mul(this);
            }
            else {
                return void 0;
            }
        };
        QQ.prototype.__div__ = function (rhs) {
            if (rhs instanceof QQ) {
                return this.div(rhs);
            }
            else {
                return void 0;
            }
        };
        QQ.prototype.__rdiv__ = function (lhs) {
            if (lhs instanceof QQ) {
                return lhs.div(this);
            }
            else {
                return void 0;
            }
        };
        QQ.prototype.__pos__ = function () {
            return this;
        };
        QQ.prototype.__neg__ = function () {
            return this.neg();
        };
        QQ.ONE = new QQ(1, 1);
        QQ.TWO = new QQ(2, 1);
        QQ.MINUS_ONE = new QQ(-1, 1);
        QQ.ZERO = new QQ(0, 1);
        return QQ;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = QQ;
});
