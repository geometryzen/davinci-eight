define(["require", "exports", '../math/mathcore', '../checks/mustBeNumber', '../math/Unit'], function (require, exports, mathcore, mustBeNumber, Unit) {
    var atan2 = Math.atan2;
    var cos = Math.cos;
    var cosh = mathcore.Math.cosh;
    var exp = Math.exp;
    var sin = Math.sin;
    var sinh = mathcore.Math.sinh;
    var sqrt = Math.sqrt;
    function mul(a, b) {
        var x = a.x * b.x - a.y * b.y;
        var y = a.x * b.y + a.y * b.x;
        return new CC(x, y, Unit.mul(a.uom, b.uom));
    }
    function divide(a, b) {
        var q = b.x * b.x + b.y * b.y;
        var x = (a.x * b.x + a.y * b.y) / q;
        var y = (a.y * b.x - a.x * b.y) / q;
        return new CC(x, y, Unit.div(a.uom, b.uom));
    }
    function norm(x, y) {
        return sqrt(x * x + y * y);
    }
    /**
     * @class CC
     */
    var CC = (function () {
        /**
         * @class CC
         * @constructor
         * CConstructs a complex number z = (x, y).
         * @param x The real part of the complex number.
         * @param y The imaginary part of the complex number.
         */
        function CC(x, y, uom) {
            this.x = mustBeNumber('x', x);
            this.y = mustBeNumber('y', y);
            this.uom = uom;
            if (this.uom && this.uom.multiplier !== 1) {
                var multiplier = this.uom.multiplier;
                this.x *= multiplier;
                this.y *= multiplier;
                this.uom = new Unit(1, uom.dimensions, uom.labels);
            }
        }
        CC.prototype.coordinates = function () {
            return [this.x, this.y];
        };
        /**
         * @method add
         * @param rhs {CC}
         * @return {CC}
         */
        CC.prototype.add = function (rhs) {
            return new CC(this.x + rhs.x, this.y + rhs.y, Unit.compatible(this.uom, rhs.uom));
        };
        /**
         * @method __add__
         * @param other {number | CC}
         * @return {CC}
         * @private
         */
        CC.prototype.__add__ = function (other) {
            if (other instanceof CC) {
                return this.add(other);
            }
            else if (typeof other === 'number') {
                return new CC(this.x + other, this.y, Unit.compatible(this.uom, undefined));
            }
            else {
                return void 0;
            }
        };
        /**
         * __radd__ supports operator +(any, CC)
         */
        CC.prototype.__radd__ = function (other) {
            if (other instanceof CC) {
                var lhs = other;
                return new CC(other.x + this.x, other.y + this.y, Unit.compatible(lhs.uom, this.uom));
            }
            else if (typeof other === 'number') {
                var x = other;
                return new CC(x + this.x, this.y, Unit.compatible(undefined, this.uom));
            }
        };
        /**
         * @method sub
         * @param rhs {CC}
         * @return {CC}
         */
        CC.prototype.sub = function (rhs) {
            return new CC(this.x - rhs.x, this.y - rhs.y, Unit.compatible(this.uom, rhs.uom));
        };
        CC.prototype.__sub__ = function (other) {
            if (other instanceof CC) {
                var rhs = other;
                return new CC(this.x - rhs.x, this.y - rhs.y, Unit.compatible(this.uom, rhs.uom));
            }
            else if (typeof other === 'number') {
                var x = other;
                return new CC(this.x - x, this.y, Unit.compatible(this.uom, undefined));
            }
        };
        CC.prototype.__rsub__ = function (other) {
            if (other instanceof CC) {
                var lhs = other;
                return new CC(lhs.x - this.x, lhs.y - this.y, Unit.compatible(lhs.uom, this.uom));
            }
            else if (typeof other === 'number') {
                var x = other;
                return new CC(x - this.x, -this.y, Unit.compatible(undefined, this.uom));
            }
        };
        /**
         * @method mul
         * @param rhs {CC}
         * @return {CC}
         */
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
        /**
         * @method div
         * @param rhs {CC}
         * @return {CC}
         */
        CC.prototype.div = function (rhs) {
            return divide(this, rhs);
        };
        /**
         * @method divByScalar
         * @param α {number}
         * @return {CC}
         */
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
        /**
         * @method align
         * @param rhs {CC}
         * @return {CC}
         */
        CC.prototype.scp = function (rhs) {
            return new CC(this.x * rhs.x - this.y * rhs.y, 0, Unit.mul(this.uom, this.uom));
        };
        CC.prototype.__vbar__ = function (other) {
            throw new Error("");
        };
        CC.prototype.__rvbar__ = function (other) {
            throw new Error("");
        };
        /**
         * @method wedge
         * @param rhs {CC}
         * @return {CC}
         */
        CC.prototype.ext = function (rhs) {
            throw new Error('wedge');
        };
        CC.prototype.__wedge__ = function (other) {
            throw new Error("");
        };
        CC.prototype.__rwedge__ = function (other) {
            throw new Error("");
        };
        CC.prototype.lerp = function (target, α) {
            return this;
        };
        /**
         * @method lco
         * @param rhs {CC}
         * @return {CC}
         */
        CC.prototype.lco = function (rhs) {
            throw new Error('lco');
        };
        /**
         * @method rco
         * @param rhs {CC}
         * @return {CC}
         */
        CC.prototype.rco = function (rhs) {
            throw new Error('rco');
        };
        /**
         * @method pow
         * @param exponent {CC}
         * @return {CC}
         */
        CC.prototype.pow = function (exponent) {
            throw new Error('pow');
        };
        /**
         * @method cos
         * @return {CC}
         */
        CC.prototype.cos = function () {
            Unit.assertDimensionless(this.uom);
            var x = this.x;
            var y = this.y;
            return new CC(cos(x) * cosh(y), -sin(x) * sinh(y));
        };
        /**
         * @method cosh
         * @return {CC}
         */
        CC.prototype.cosh = function () {
            Unit.assertDimensionless(this.uom);
            var x = this.x;
            var y = this.y;
            return new CC(cosh(x) * cos(y), sinh(x) * sin(y));
        };
        /**
         * @method exp
         * @return {CC}
         */
        CC.prototype.exp = function () {
            Unit.assertDimensionless(this.uom);
            var x = this.x;
            var y = this.y;
            var expX = exp(x);
            return new CC(expX * cos(y), expX * sin(y));
        };
        /**
         * Computes the multiplicative inverse of this complex number.
         * @method inv
         * @return {CC}
         */
        CC.prototype.inv = function () {
            var x = this.x;
            var y = this.y;
            var d = x * x + y * y;
            return new CC(this.x / d, -this.y / d, this.uom ? this.uom.inv() : void 0);
        };
        /**
         * @method isOne
         * @return {boolean}
         */
        CC.prototype.isOne = function () {
            return this.x === 1 && this.y === 0;
        };
        /**
         * @method isZero
         * @return {boolean}
         */
        CC.prototype.isZero = function () {
            return this.x === 0 && this.y === 0;
        };
        /**
         * Computes the additive inverse of this complex number.
         * @method neg
         * @return {CC}
         */
        CC.prototype.neg = function () {
            return new CC(-this.x, -this.y, this.uom);
        };
        /**
         * @method norm
         * @return {CC}
         */
        CC.prototype.norm = function () {
            var x = this.x;
            var y = this.y;
            return new CC(sqrt(x * x + y * y), 0, this.uom);
        };
        /**
         * @method quad
         * @return {CC}
         */
        CC.prototype.quad = function () {
            var x = this.x;
            var y = this.y;
            return new CC(x * x + y * y, 0, Unit.mul(this.uom, this.uom));
        };
        /**
         * @method scale
         * @param α {number}
         * @return {CC}
         */
        CC.prototype.scale = function (α) {
            return new CC(α * this.x, α * this.y, this.uom);
        };
        /**
         * @method sin
         * @return {CC}
         */
        CC.prototype.sin = function () {
            Unit.assertDimensionless(this.uom);
            var x = this.x;
            var y = this.y;
            return new CC(sin(x) * cosh(y), cos(x) * sinh(y));
        };
        /**
         * @method sinh
         * @return {CC}
         */
        CC.prototype.sinh = function () {
            Unit.assertDimensionless(this.uom);
            var x = this.x;
            var y = this.y;
            return new CC(sinh(x) * cos(y), cosh(x) * sin(y));
        };
        CC.prototype.slerp = function (target, α) {
            return this;
        };
        /**
         * @method unitary
         * @return {CC}
         */
        CC.prototype.unitary = function () {
            var x = this.x;
            var y = this.y;
            var divisor = norm(x, y);
            return new CC(x / divisor, y / divisor);
        };
        /**
         * @method gradeZero
         * @return {number}
         */
        CC.prototype.gradeZero = function () {
            return this.x;
        };
        /**
         * @method arg
         * @return {number}
         */
        CC.prototype.arg = function () {
            return atan2(this.y, this.x);
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
        /**
         * @method __rshift__
         * @param other {number|CC}
         * @return {CC}
         * @private
         */
        CC.prototype.__rshift__ = function (other) {
            throw new Error("");
        };
        /**
         * @method __rrshift__
         * @param other {number|CC}
         * @return {CC}
         * @private
         */
        CC.prototype.__rrshift__ = function (other) {
            throw new Error("");
        };
        /**
         * @method __pos__
         * @return {CC}
         * @private
         */
        CC.prototype.__pos__ = function () {
            return this;
        };
        /**
         * @method __neg__
         * @return {CC}
         * @private
         */
        CC.prototype.__neg__ = function () {
            return this.neg();
        };
        /**
         * @method __tilde__
         * @return {CC}
         * @private
         */
        CC.prototype.__tilde__ = function () {
            return new CC(this.x, -this.y);
        };
        return CC;
    })();
    return CC;
});
