define(["require", "exports", '../math/Euclidean1Error', '../math/Unit'], function (require, exports, Euclidean1Error, Unit) {
    function assertArgNumber(name, x) {
        if (typeof x === 'number') {
            return x;
        }
        else {
            throw new Euclidean1Error("Argument '" + name + "' must be a number");
        }
    }
    function assertArgEuclidean1(name, arg) {
        if (arg instanceof Euclidean1) {
            return arg;
        }
        else {
            throw new Euclidean1Error("Argument '" + arg + "' must be a Euclidean1");
        }
    }
    function assertArgUnitOrUndefined(name, uom) {
        if (typeof uom === 'undefined' || uom instanceof Unit) {
            return uom;
        }
        else {
            throw new Euclidean1Error("Argument '" + uom + "' must be a Unit or undefined");
        }
    }
    var Euclidean1 = (function () {
        /**
         * The Euclidean1 class represents a multivector for a 1-dimensional linear space with a Euclidean metric.
         *
         * @class Euclidean1
         * @constructor
         * @param {number} w The grade zero part of the multivector.
         * @param {number} x The vector component of the multivector in the x-direction.
         * @param uom The optional unit of measure.
         */
        function Euclidean1(w, x, uom) {
            this.w = assertArgNumber('w', w);
            this.x = assertArgNumber('x', x);
            this.uom = assertArgUnitOrUndefined('uom', uom);
            if (this.uom && this.uom.multiplier !== 1) {
                var multiplier = this.uom.multiplier;
                this.w *= multiplier;
                this.x *= multiplier;
                this.uom = new Unit(1, uom.dimensions, uom.labels);
            }
        }
        Euclidean1.prototype.coordinates = function () {
            return [this.w, this.x];
        };
        Euclidean1.prototype.copy = function (source) {
            this.w = source.w;
            this.x = source.x;
            this.uom = source.uom;
            return this;
        };
        Euclidean1.prototype.difference = function (a, b) {
            this.w = a.w - b.w;
            this.x = a.x - b.x;
            this.uom = Unit.compatible(a.uom, b.uom);
            // FIXME this.uom.difference(a.uom, b.uom)
            return this;
        };
        Euclidean1.prototype.add = function (rhs) {
            assertArgEuclidean1('rhs', rhs);
            return new Euclidean1(this.w + rhs.w, this.x + rhs.x, Unit.compatible(this.uom, rhs.uom));
        };
        Euclidean1.prototype.sub = function (rhs) {
            assertArgEuclidean1('rhs', rhs);
            return new Euclidean1(this.w - rhs.w, this.x - rhs.x, Unit.compatible(this.uom, rhs.uom));
        };
        Euclidean1.prototype.mul = function (rhs) {
            // assertArgEuclidean1('rhs', rhs)
            throw new Euclidean1Error('mul');
        };
        Euclidean1.prototype.div = function (rhs) {
            // assertArgEuclidean1('rhs', rhs)
            throw new Euclidean1Error('div');
        };
        Euclidean1.prototype.divByScalar = function (α) {
            return new Euclidean1(this.w / α, this.x / α, this.uom);
        };
        Euclidean1.prototype.scp = function (rhs) {
            throw new Euclidean1Error('wedge');
        };
        Euclidean1.prototype.ext = function (rhs) {
            throw new Euclidean1Error('wedge');
        };
        Euclidean1.prototype.lerp = function (target, α) {
            // FIXME: TODO
            return this;
        };
        Euclidean1.prototype.lco = function (rhs) {
            // assertArgEuclidean1('rhs', rhs)
            throw new Euclidean1Error('lshift');
        };
        Euclidean1.prototype.rco = function (rhs) {
            // assertArgEuclidean1('rhs', rhs)
            throw new Euclidean1Error('rshift');
        };
        Euclidean1.prototype.pow = function (exponent) {
            // assertArgEuclidean1('rhs', rhs)
            throw new Euclidean1Error('pow');
        };
        Euclidean1.prototype.cos = function () {
            throw new Euclidean1Error('cos');
        };
        Euclidean1.prototype.cosh = function () {
            throw new Euclidean1Error('cosh');
        };
        Euclidean1.prototype.exp = function () {
            throw new Euclidean1Error('exp');
        };
        Euclidean1.prototype.norm = function () {
            return new Euclidean1(Math.sqrt(this.w * this.w + this.x * this.x), 0, this.uom);
        };
        Euclidean1.prototype.quad = function () {
            return new Euclidean1(this.w * this.w + this.x * this.x, 0, Unit.mul(this.uom, this.uom));
        };
        Euclidean1.prototype.scale = function (α) {
            return new Euclidean1(α * this.w, α * this.x, this.uom);
        };
        Euclidean1.prototype.sin = function () {
            throw new Euclidean1Error('sin');
        };
        Euclidean1.prototype.sinh = function () {
            throw new Euclidean1Error('sinh');
        };
        Euclidean1.prototype.slerp = function (target, α) {
            // FIXME: TODO
            return this;
        };
        Euclidean1.prototype.unitary = function () {
            throw new Euclidean1Error('unitary');
        };
        Euclidean1.prototype.gradeZero = function () {
            return this.w;
        };
        Euclidean1.prototype.toExponential = function () {
            return "Euclidean1";
        };
        Euclidean1.prototype.toFixed = function (digits) {
            return "Euclidean1";
        };
        Euclidean1.prototype.toString = function () {
            return "Euclidean1";
        };
        return Euclidean1;
    })();
    return Euclidean1;
});
