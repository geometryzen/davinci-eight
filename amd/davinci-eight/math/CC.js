define(["require", "exports", '../math/CCError', '../math/Unit', '../math/mathcore'], function (require, exports, CCError, Unit, mathcore) {
    var cos = Math.cos;
    var cosh = mathcore.Math.cosh;
    var exp = Math.exp;
    var sin = Math.sin;
    var sinh = mathcore.Math.sinh;
    function assertArgNumber(name, x) {
        if (typeof x === 'number') {
            return x;
        }
        else {
            throw new CCError("Argument '" + name + "' must be a number");
        }
    }
    function assertArgComplex(name, arg) {
        if (arg instanceof CC) {
            return arg;
        }
        else {
            throw new CCError("Argument '" + arg + "' must be a CC");
        }
    }
    function assertArgUnitOrUndefined(name, uom) {
        if (typeof uom === 'undefined' || uom instanceof Unit) {
            return uom;
        }
        else {
            throw new CCError("Argument '" + uom + "' must be a Unit or undefined");
        }
    }
    function multiply(a, b) {
        assertArgComplex('a', a);
        assertArgComplex('b', b);
        var x = a.x * b.x - a.y * b.y;
        var y = a.x * b.y + a.y * b.x;
        return new CC(x, y, Unit.mul(a.uom, b.uom));
    }
    function divide(a, b) {
        assertArgComplex('a', a);
        assertArgComplex('b', b);
        var q = b.x * b.x + b.y * b.y;
        var x = (a.x * b.x + a.y * b.y) / q;
        var y = (a.y * b.x - a.x * b.y) / q;
        return new CC(x, y, Unit.div(a.uom, b.uom));
    }
    function norm(x, y) {
        return Math.sqrt(x * x + y * y);
    }
    var CC = (function () {
        /**
         * Constructs a complex number z = (x, y).
         * @param x The real part of the complex number.
         * @param y The imaginary part of the complex number.
         */
        function CC(x, y, uom) {
            this.x = assertArgNumber('x', x);
            this.y = assertArgNumber('y', y);
            this.uom = assertArgUnitOrUndefined('uom', uom);
            if (this.uom && this.uom.scale !== 1) {
                var scale = this.uom.scale;
                this.x *= scale;
                this.y *= scale;
                this.uom = new Unit(1, uom.dimensions, uom.labels);
            }
        }
        CC.prototype.coordinates = function () {
            return [this.x, this.y];
        };
        CC.prototype.add = function (rhs) {
            assertArgComplex('rhs', rhs);
            return new CC(this.x + rhs.x, this.y + rhs.y, Unit.compatible(this.uom, rhs.uom));
        };
        /**
         * __add__ supports operator +(CC, any)
         */
        CC.prototype.__add__ = function (other) {
            if (other instanceof CC) {
                return this.add(other);
            }
            else if (typeof other === 'number') {
                return new CC(this.x + other, this.y, Unit.compatible(this.uom, undefined));
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
        CC.prototype.sub = function (rhs) {
            assertArgComplex('rhs', rhs);
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
        CC.prototype.mul = function (rhs) {
            assertArgComplex('rhs', rhs);
            return multiply(this, rhs);
        };
        CC.prototype.__mul__ = function (other) {
            if (other instanceof CC) {
                return multiply(this, other);
            }
            else if (typeof other === 'number') {
                var x = other;
                return new CC(this.x * x, this.y * x, this.uom);
            }
        };
        CC.prototype.__rmul__ = function (other) {
            if (other instanceof CC) {
                return multiply(other, this);
            }
            else if (typeof other === 'number') {
                var x = other;
                return new CC(x * this.x, x * this.y, this.uom);
            }
        };
        CC.prototype.div = function (rhs) {
            assertArgComplex('rhs', rhs);
            return divide(this, rhs);
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
        CC.prototype.wedge = function (rhs) {
            // assertArgComplex('rhs', rhs);
            throw new CCError('wedge');
        };
        CC.prototype.lshift = function (rhs) {
            // assertArgComplex('rhs', rhs);
            throw new CCError('lshift');
        };
        CC.prototype.rshift = function (rhs) {
            // assertArgComplex('rhs', rhs);
            throw new CCError('rshift');
        };
        CC.prototype.pow = function (exponent) {
            // assertArgComplex('rhs', rhs);
            throw new CCError('pow');
        };
        CC.prototype.cos = function () {
            Unit.assertDimensionless(this.uom);
            var x = this.x;
            var y = this.y;
            return new CC(cos(x) * cosh(y), -sin(x) * sinh(y));
        };
        CC.prototype.cosh = function () {
            Unit.assertDimensionless(this.uom);
            var x = this.x;
            var y = this.y;
            return new CC(cosh(x) * cos(y), sinh(x) * sin(y));
        };
        CC.prototype.exp = function () {
            Unit.assertDimensionless(this.uom);
            var x = this.x;
            var y = this.y;
            var expX = Math.exp(x);
            return new CC(expX * cos(y), expX * sin(y));
        };
        CC.prototype.norm = function () {
            var x = this.x;
            var y = this.y;
            return new CC(Math.sqrt(x * x + y * y), 0, this.uom);
        };
        CC.prototype.quad = function () {
            var x = this.x;
            var y = this.y;
            return new CC(x * x + y * y, 0, Unit.mul(this.uom, this.uom));
        };
        CC.prototype.sin = function () {
            Unit.assertDimensionless(this.uom);
            var x = this.x;
            var y = this.y;
            return new CC(sin(x) * cosh(y), cos(x) * sinh(y));
        };
        CC.prototype.sinh = function () {
            Unit.assertDimensionless(this.uom);
            var x = this.x;
            var y = this.y;
            return new CC(sinh(x) * cos(y), cosh(x) * sin(y));
        };
        CC.prototype.unit = function () {
            var x = this.x;
            var y = this.y;
            var divisor = norm(x, y);
            return new CC(x / divisor, y / divisor);
        };
        CC.prototype.scalar = function () {
            return this.x;
        };
        CC.prototype.arg = function () {
            return Math.atan2(this.y, this.x);
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
        return CC;
    })();
    return CC;
});
