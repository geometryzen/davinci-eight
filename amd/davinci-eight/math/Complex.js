define(["require", "exports", '../math/ComplexError', '../math/Unit', '../math/mathcore'], function (require, exports, ComplexError, Unit, mathcore) {
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
            throw new ComplexError("Argument '" + name + "' must be a number");
        }
    }
    function assertArgComplex(name, arg) {
        if (arg instanceof Complex) {
            return arg;
        }
        else {
            throw new ComplexError("Argument '" + arg + "' must be a Complex");
        }
    }
    function assertArgUnitOrUndefined(name, uom) {
        if (typeof uom === 'undefined' || uom instanceof Unit) {
            return uom;
        }
        else {
            throw new ComplexError("Argument '" + uom + "' must be a Unit or undefined");
        }
    }
    function multiply(a, b) {
        assertArgComplex('a', a);
        assertArgComplex('b', b);
        var x = a.x * b.x - a.y * b.y;
        var y = a.x * b.y + a.y * b.x;
        return new Complex(x, y, Unit.mul(a.uom, b.uom));
    }
    function divide(a, b) {
        assertArgComplex('a', a);
        assertArgComplex('b', b);
        var q = b.x * b.x + b.y * b.y;
        var x = (a.x * b.x + a.y * b.y) / q;
        var y = (a.y * b.x - a.x * b.y) / q;
        return new Complex(x, y, Unit.div(a.uom, b.uom));
    }
    function norm(x, y) {
        return Math.sqrt(x * x + y * y);
    }
    var Complex = (function () {
        /**
         * Constructs a complex number z = (x, y).
         * @param x The real part of the complex number.
         * @param y The imaginary part of the complex number.
         */
        function Complex(x, y, uom) {
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
        Complex.prototype.coordinates = function () {
            return [this.x, this.y];
        };
        Complex.prototype.add = function (rhs) {
            assertArgComplex('rhs', rhs);
            return new Complex(this.x + rhs.x, this.y + rhs.y, Unit.compatible(this.uom, rhs.uom));
        };
        /**
         * __add__ supports operator +(Complex, any)
         */
        Complex.prototype.__add__ = function (other) {
            if (other instanceof Complex) {
                return this.add(other);
            }
            else if (typeof other === 'number') {
                return new Complex(this.x + other, this.y, Unit.compatible(this.uom, undefined));
            }
        };
        /**
         * __radd__ supports operator +(any, Complex)
         */
        Complex.prototype.__radd__ = function (other) {
            if (other instanceof Complex) {
                var lhs = other;
                return new Complex(other.x + this.x, other.y + this.y, Unit.compatible(lhs.uom, this.uom));
            }
            else if (typeof other === 'number') {
                var x = other;
                return new Complex(x + this.x, this.y, Unit.compatible(undefined, this.uom));
            }
        };
        Complex.prototype.sub = function (rhs) {
            assertArgComplex('rhs', rhs);
            return new Complex(this.x - rhs.x, this.y - rhs.y, Unit.compatible(this.uom, rhs.uom));
        };
        Complex.prototype.__sub__ = function (other) {
            if (other instanceof Complex) {
                var rhs = other;
                return new Complex(this.x - rhs.x, this.y - rhs.y, Unit.compatible(this.uom, rhs.uom));
            }
            else if (typeof other === 'number') {
                var x = other;
                return new Complex(this.x - x, this.y, Unit.compatible(this.uom, undefined));
            }
        };
        Complex.prototype.__rsub__ = function (other) {
            if (other instanceof Complex) {
                var lhs = other;
                return new Complex(lhs.x - this.x, lhs.y - this.y, Unit.compatible(lhs.uom, this.uom));
            }
            else if (typeof other === 'number') {
                var x = other;
                return new Complex(x - this.x, -this.y, Unit.compatible(undefined, this.uom));
            }
        };
        Complex.prototype.mul = function (rhs) {
            assertArgComplex('rhs', rhs);
            return multiply(this, rhs);
        };
        Complex.prototype.__mul__ = function (other) {
            if (other instanceof Complex) {
                return multiply(this, other);
            }
            else if (typeof other === 'number') {
                var x = other;
                return new Complex(this.x * x, this.y * x, this.uom);
            }
        };
        Complex.prototype.__rmul__ = function (other) {
            if (other instanceof Complex) {
                return multiply(other, this);
            }
            else if (typeof other === 'number') {
                var x = other;
                return new Complex(x * this.x, x * this.y, this.uom);
            }
        };
        Complex.prototype.div = function (rhs) {
            assertArgComplex('rhs', rhs);
            return divide(this, rhs);
        };
        Complex.prototype.__div__ = function (other) {
            if (other instanceof Complex) {
                return divide(this, other);
            }
            else if (typeof other === 'number') {
                return new Complex(this.x / other, this.y / other, this.uom);
            }
        };
        Complex.prototype.__rdiv__ = function (other) {
            if (other instanceof Complex) {
                return divide(other, this);
            }
            else if (typeof other === 'number') {
                return divide(new Complex(other, 0), this);
            }
        };
        Complex.prototype.wedge = function (rhs) {
            // assertArgComplex('rhs', rhs);
            throw new ComplexError('wedge');
        };
        Complex.prototype.lshift = function (rhs) {
            // assertArgComplex('rhs', rhs);
            throw new ComplexError('lshift');
        };
        Complex.prototype.rshift = function (rhs) {
            // assertArgComplex('rhs', rhs);
            throw new ComplexError('rshift');
        };
        Complex.prototype.pow = function (exponent) {
            // assertArgComplex('rhs', rhs);
            throw new ComplexError('pow');
        };
        Complex.prototype.cos = function () {
            Unit.assertDimensionless(this.uom);
            var x = this.x;
            var y = this.y;
            return new Complex(cos(x) * cosh(y), -sin(x) * sinh(y));
        };
        Complex.prototype.cosh = function () {
            Unit.assertDimensionless(this.uom);
            var x = this.x;
            var y = this.y;
            return new Complex(cosh(x) * cos(y), sinh(x) * sin(y));
        };
        Complex.prototype.exp = function () {
            Unit.assertDimensionless(this.uom);
            var x = this.x;
            var y = this.y;
            var expX = Math.exp(x);
            return new Complex(expX * cos(y), expX * sin(y));
        };
        Complex.prototype.norm = function () {
            var x = this.x;
            var y = this.y;
            return new Complex(Math.sqrt(x * x + y * y), 0, this.uom);
        };
        Complex.prototype.quad = function () {
            var x = this.x;
            var y = this.y;
            return new Complex(x * x + y * y, 0, Unit.mul(this.uom, this.uom));
        };
        Complex.prototype.sin = function () {
            Unit.assertDimensionless(this.uom);
            var x = this.x;
            var y = this.y;
            return new Complex(sin(x) * cosh(y), cos(x) * sinh(y));
        };
        Complex.prototype.sinh = function () {
            Unit.assertDimensionless(this.uom);
            var x = this.x;
            var y = this.y;
            return new Complex(sinh(x) * cos(y), cosh(x) * sin(y));
        };
        Complex.prototype.unit = function () {
            var x = this.x;
            var y = this.y;
            var divisor = norm(x, y);
            return new Complex(x / divisor, y / divisor);
        };
        Complex.prototype.scalar = function () {
            return this.x;
        };
        Complex.prototype.arg = function () {
            return Math.atan2(this.y, this.x);
        };
        Complex.prototype.toStringCustom = function (coordToString) {
            var quantityString = "Complex(" + coordToString(this.x) + ", " + coordToString(this.y) + ")";
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
        Complex.prototype.toExponential = function () {
            return this.toStringCustom(function (coord) { return coord.toExponential(); });
        };
        Complex.prototype.toFixed = function (digits) {
            return this.toStringCustom(function (coord) { return coord.toFixed(digits); });
        };
        Complex.prototype.toString = function () {
            return this.toStringCustom(function (coord) { return coord.toString(); });
        };
        return Complex;
    })();
    return Complex;
});
