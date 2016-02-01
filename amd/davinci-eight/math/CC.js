define(["require", "exports", '../math/mathcore', '../checks/mustBeInteger', '../checks/mustBeNumber', '../i18n/readOnly', '../math/Unit'], function (require, exports, mathcore_1, mustBeInteger_1, mustBeNumber_1, readOnly_1, Unit_1) {
    var atan2 = Math.atan2;
    var cos = Math.cos;
    var cosh = mathcore_1.default.Math.cosh;
    var exp = Math.exp;
    var log = Math.log;
    var sin = Math.sin;
    var sinh = mathcore_1.default.Math.sinh;
    var sqrt = Math.sqrt;
    function mul(a, b) {
        var x = a.α * b.α - a.β * b.β;
        var y = a.α * b.β + a.β * b.α;
        return new CC(x, y, Unit_1.default.mul(a.uom, b.uom));
    }
    function divide(a, b) {
        var q = b.α * b.α + b.β * b.β;
        var x = (a.α * b.α + a.β * b.β) / q;
        var y = (a.β * b.α - a.α * b.β) / q;
        return new CC(x, y, Unit_1.default.div(a.uom, b.uom));
    }
    function norm(x, y) {
        return sqrt(x * x + y * y);
    }
    var CC = (function () {
        function CC(α, β, uom) {
            this.x = mustBeNumber_1.default('α', α);
            this.y = mustBeNumber_1.default('β', β);
            this.uom = uom;
            if (this.uom && this.uom.multiplier !== 1) {
                var multiplier = this.uom.multiplier;
                this.x *= multiplier;
                this.y *= multiplier;
                this.uom = new Unit_1.default(1, uom.dimensions, uom.labels);
            }
        }
        Object.defineProperty(CC.prototype, "α", {
            get: function () {
                return this.x;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('α').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CC.prototype, "β", {
            get: function () {
                return this.y;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('β').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CC.prototype, "xy", {
            get: function () {
                return this.y;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('xy').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CC.prototype, "coords", {
            get: function () {
                return [this.x, this.y];
            },
            enumerable: true,
            configurable: true
        });
        CC.prototype.add = function (rhs) {
            return new CC(this.x + rhs.x, this.y + rhs.y, Unit_1.default.compatible(this.uom, rhs.uom));
        };
        CC.prototype.angle = function () {
            return new CC(0, atan2(this.β, this.α));
        };
        CC.prototype.__add__ = function (other) {
            if (other instanceof CC) {
                return this.add(other);
            }
            else if (typeof other === 'number') {
                return new CC(this.x + other, this.y, Unit_1.default.compatible(this.uom, undefined));
            }
            else {
                return void 0;
            }
        };
        CC.prototype.__radd__ = function (other) {
            if (other instanceof CC) {
                var lhs = other;
                return new CC(other.x + this.x, other.y + this.y, Unit_1.default.compatible(lhs.uom, this.uom));
            }
            else if (typeof other === 'number') {
                var x = other;
                return new CC(x + this.x, this.y, Unit_1.default.compatible(undefined, this.uom));
            }
        };
        CC.prototype.sub = function (rhs) {
            return new CC(this.x - rhs.x, this.y - rhs.y, Unit_1.default.compatible(this.uom, rhs.uom));
        };
        CC.prototype.__sub__ = function (other) {
            if (other instanceof CC) {
                var rhs = other;
                return new CC(this.x - rhs.x, this.y - rhs.y, Unit_1.default.compatible(this.uom, rhs.uom));
            }
            else if (typeof other === 'number') {
                var x = other;
                return new CC(this.x - x, this.y, Unit_1.default.compatible(this.uom, undefined));
            }
        };
        CC.prototype.__rsub__ = function (other) {
            if (other instanceof CC) {
                var lhs = other;
                return new CC(lhs.x - this.x, lhs.y - this.y, Unit_1.default.compatible(lhs.uom, this.uom));
            }
            else if (typeof other === 'number') {
                var x = other;
                return new CC(x - this.x, -this.y, Unit_1.default.compatible(undefined, this.uom));
            }
        };
        CC.prototype.mul = function (rhs) {
            return mul(this, rhs);
        };
        CC.prototype.__mul__ = function (other) {
            if (other instanceof CC) {
                return mul(this, other);
            }
            else if (typeof other === 'number') {
                var x = other;
                return new CC(this.x * x, this.y * x, this.uom);
            }
        };
        CC.prototype.__rmul__ = function (other) {
            if (other instanceof CC) {
                return mul(other, this);
            }
            else if (typeof other === 'number') {
                var x = other;
                return new CC(x * this.x, x * this.y, this.uom);
            }
        };
        CC.prototype.div = function (rhs) {
            return divide(this, rhs);
        };
        CC.prototype.divByScalar = function (α) {
            return new CC(this.x / α, this.y / α, this.uom);
        };
        CC.prototype.__div__ = function (other) {
            if (other instanceof CC) {
                return divide(this, other);
            }
            else if (typeof other === 'number') {
                return new CC(this.x / other, this.y / other, this.uom);
            }
        };
        CC.prototype.__rdiv__ = function (other) {
            if (other instanceof CC) {
                return divide(other, this);
            }
            else if (typeof other === 'number') {
                return divide(new CC(other, 0), this);
            }
        };
        CC.prototype.scp = function (rhs) {
            return new CC(this.x * rhs.x - this.y * rhs.y, 0, Unit_1.default.mul(this.uom, this.uom));
        };
        CC.prototype.__vbar__ = function (other) {
            throw new Error("");
        };
        CC.prototype.__rvbar__ = function (other) {
            throw new Error("");
        };
        CC.prototype.ext = function (rhs) {
            throw new Error('wedge');
        };
        CC.prototype.__wedge__ = function (other) {
            throw new Error("");
        };
        CC.prototype.__rwedge__ = function (other) {
            throw new Error("");
        };
        CC.prototype.grade = function (grade) {
            mustBeInteger_1.default('grade', grade);
            switch (grade) {
                case 0: return new CC(this.x, 0, this.uom);
                case 2: return new CC(0, this.y, this.uom);
                default: return new CC(0, 0, this.uom);
            }
        };
        CC.prototype.lco = function (rhs) {
            throw new Error('lco');
        };
        CC.prototype.lerp = function (target, α) {
            return this;
        };
        CC.prototype.log = function () {
            Unit_1.default.assertDimensionless(this.uom);
            var α = this.α;
            var β = this.β;
            return new CC(log(sqrt(α * α + β * β)), atan2(β, α));
        };
        CC.prototype.rco = function (rhs) {
            throw new Error('rco');
        };
        CC.prototype.pow = function (exponent) {
            throw new Error('pow');
        };
        CC.prototype.cos = function () {
            Unit_1.default.assertDimensionless(this.uom);
            var x = this.x;
            var y = this.y;
            return new CC(cos(x) * cosh(y), -sin(x) * sinh(y));
        };
        CC.prototype.cosh = function () {
            Unit_1.default.assertDimensionless(this.uom);
            var x = this.x;
            var y = this.y;
            return new CC(cosh(x) * cos(y), sinh(x) * sin(y));
        };
        CC.prototype.exp = function () {
            Unit_1.default.assertDimensionless(this.uom);
            var x = this.x;
            var y = this.y;
            var expX = exp(x);
            return new CC(expX * cos(y), expX * sin(y));
        };
        CC.prototype.inv = function () {
            var x = this.x;
            var y = this.y;
            var d = x * x + y * y;
            return new CC(this.x / d, -this.y / d, this.uom ? this.uom.inv() : void 0);
        };
        CC.prototype.isOne = function () {
            return this.x === 1 && this.y === 0;
        };
        CC.prototype.isZero = function () {
            return this.x === 0 && this.y === 0;
        };
        CC.prototype.magnitude = function () {
            return sqrt(this.squaredNorm());
        };
        CC.prototype.neg = function () {
            return new CC(-this.x, -this.y, this.uom);
        };
        CC.prototype.norm = function () {
            return new CC(this.magnitude(), 0, this.uom);
        };
        CC.prototype.quad = function () {
            var x = this.x;
            var y = this.y;
            return new CC(this.squaredNorm(), 0, Unit_1.default.mul(this.uom, this.uom));
        };
        CC.prototype.squaredNorm = function () {
            var x = this.x;
            var y = this.y;
            return x * x + y * y;
        };
        CC.prototype.scale = function (α) {
            return new CC(α * this.x, α * this.y, this.uom);
        };
        CC.prototype.sin = function () {
            Unit_1.default.assertDimensionless(this.uom);
            var x = this.x;
            var y = this.y;
            return new CC(sin(x) * cosh(y), cos(x) * sinh(y));
        };
        CC.prototype.sinh = function () {
            Unit_1.default.assertDimensionless(this.uom);
            var x = this.x;
            var y = this.y;
            return new CC(sinh(x) * cos(y), cosh(x) * sin(y));
        };
        CC.prototype.slerp = function (target, α) {
            return this;
        };
        CC.prototype.direction = function () {
            var x = this.x;
            var y = this.y;
            var divisor = norm(x, y);
            return new CC(x / divisor, y / divisor);
        };
        CC.prototype.tan = function () {
            return this.sin().div(this.cos());
        };
        CC.prototype.toStringCustom = function (coordToString) {
            var quantityString = "CC(" + coordToString(this.x) + ", " + coordToString(this.y) + ")";
            if (this.uom) {
                var uomString = this.uom.toString().trim();
                if (uomString) {
                    return quantityString + ' ' + uomString;
                }
                else {
                    return quantityString;
                }
            }
            else {
                return quantityString;
            }
        };
        CC.prototype.toExponential = function () {
            return this.toStringCustom(function (coord) { return coord.toExponential(); });
        };
        CC.prototype.toFixed = function (digits) {
            return this.toStringCustom(function (coord) { return coord.toFixed(digits); });
        };
        CC.prototype.toString = function () {
            return this.toStringCustom(function (coord) { return coord.toString(); });
        };
        CC.prototype.__lshift__ = function (other) {
            throw new Error("");
        };
        CC.prototype.__rlshift__ = function (other) {
            throw new Error("");
        };
        CC.prototype.__rshift__ = function (other) {
            throw new Error("");
        };
        CC.prototype.__rrshift__ = function (other) {
            throw new Error("");
        };
        CC.prototype.__bang__ = function () {
            return this.inv();
        };
        CC.prototype.__pos__ = function () {
            return this;
        };
        CC.prototype.__neg__ = function () {
            return this.neg();
        };
        CC.prototype.__tilde__ = function () {
            return new CC(this.x, -this.y);
        };
        return CC;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CC;
});
