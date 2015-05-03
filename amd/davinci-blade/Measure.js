define(["require", "exports", 'davinci-blade/Unit'], function (require, exports, Unit) {
    function mul(lhs, rhs) {
        return new Measure(lhs.quantity.mul(rhs.quantity), lhs.uom.mul(rhs.uom));
    }
    function div(lhs, rhs) {
        return new Measure(lhs.quantity.div(rhs.quantity), lhs.uom.div(rhs.uom));
    }
    var Measure = (function () {
        /**
         * A Measure is a composite consisting of a quantity and a unit of measure.
         *
         * @class Measure
         * @constructor
         * @param {QuantityOfMeasure<T>} quantity The <em>quantity</em> part of the measure.
         * @param {Unit} uom The unit-of-measure part of the measure.
         */
        function Measure(quantity, uom) {
            if (uom.scale === 1) {
                this._quantity = quantity;
                this._uom = uom;
            }
            else {
                this._quantity = quantity.scalarMultiply(uom.scale);
                this._uom = new Unit(1, uom.dimensions, uom.labels);
            }
        }
        Object.defineProperty(Measure.prototype, "quantity", {
            /**
            * The quantity part of the measure.
            *
            * @property quantity
            * @type {GeometricQuantity<T>}
            */
            get: function () {
                return this._quantity;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Measure.prototype, "uom", {
            /**
            * The unit part of the measure.
            *
            * @property uom
            * @type {Unit}
            */
            get: function () {
                return this._uom;
            },
            enumerable: true,
            configurable: true
        });
        Measure.prototype.add = function (rhs) {
            if (rhs instanceof Measure) {
                return new Measure(this.quantity.add(rhs.quantity), this.uom.compatible(rhs.uom));
            }
            else {
                throw new Error("Measure.add(rhs): rhs must be a Measure.");
            }
        };
        Measure.prototype.sub = function (rhs) {
            if (rhs instanceof Measure) {
                return new Measure(this.quantity.sub(rhs.quantity), this.uom.compatible(rhs.uom));
            }
            else {
                throw new Error("Measure.sub(rhs): rhs must be a Measure.");
            }
        };
        Measure.prototype.mul = function (rhs) {
            if (rhs instanceof Measure) {
                return new Measure(this.quantity.mul(rhs.quantity), this.uom.mul(rhs.uom));
            }
            else if (rhs instanceof Unit) {
                return new Measure(this.quantity, this.uom.mul(rhs));
            }
            else if (typeof rhs === 'number') {
                var other = rhs;
                return this.scalarMultiply(other);
            }
            else {
                throw new Error("Measure.mul(rhs): rhs must be a [Measure, Unit, number].");
            }
        };
        Measure.prototype.__mul__ = function (other) {
            if (other instanceof Measure) {
                return new Measure(this.quantity.mul(other.quantity), this.uom.mul(other.uom));
            }
            else if (other instanceof Unit) {
                return new Measure(this.quantity, this.uom.mul(other));
            }
            else if (typeof other === 'number') {
                return this.scalarMultiply(other);
            }
            else {
                return;
            }
        };
        Measure.prototype.__rmul__ = function (other) {
            if (other instanceof Measure) {
                return mul(other, this);
            }
            else if (other instanceof Unit) {
                return new Measure(this.quantity, this.uom.mul(other));
            }
            else if (typeof other === 'number') {
                return this.scalarMultiply(other);
            }
            else {
                return;
            }
        };
        Measure.prototype.scalarMultiply = function (rhs) {
            return new Measure(this.quantity.mul(rhs), this.uom);
        };
        Measure.prototype.div = function (rhs) {
            if (rhs instanceof Measure) {
                return new Measure(this.quantity.div(rhs.quantity), this.uom.div(rhs.uom));
            }
            else if (rhs instanceof Unit) {
                return new Measure(this.quantity, this.uom.div(rhs));
            }
            else if (typeof rhs === 'number') {
                return new Measure(this.quantity.div(rhs), this.uom);
            }
            else {
                throw new Error("Measure.div(rhs): rhs must be a [Measure, Unit, number].");
            }
        };
        Measure.prototype.__div__ = function (other) {
            if (other instanceof Measure) {
                return new Measure(this.quantity.div(other.quantity), this.uom.div(other.uom));
            }
            else if (other instanceof Unit) {
                return new Measure(this.quantity, this.uom.div(other));
            }
            else if (typeof other === 'number') {
                return new Measure(this.quantity.div(other), this.uom);
            }
            else {
                return;
            }
        };
        Measure.prototype.__rdiv__ = function (other) {
            if (other instanceof Measure) {
                return div(other, this);
            }
            else {
                return;
            }
        };
        Measure.prototype.wedge = function (rhs) {
            if (rhs instanceof Measure) {
                return new Measure(this.quantity.wedge(rhs.quantity), this.uom.mul(rhs.uom));
            }
            else {
                throw new Error("Measure.wedge(rhs): rhs must be a Measure.");
            }
        };
        Measure.prototype.foo = function () {
            return;
        };
        Measure.prototype.lshift = function (rhs) {
            if (rhs instanceof Measure) {
                return new Measure(this.quantity.lshift(rhs.quantity), this.uom.mul(rhs.uom));
            }
            else {
                throw new Error("Measure.lshift(rhs): rhs must be a Measure.");
            }
        };
        Measure.prototype.rshift = function (rhs) {
            if (rhs instanceof Measure) {
                return new Measure(this.quantity.rshift(rhs.quantity), this.uom.mul(rhs.uom));
            }
            else {
                throw new Error("Measure.rshift(rhs): rhs must be a Measure.");
            }
        };
        Measure.prototype.norm = function () {
            return new Measure(this.quantity.norm(), this.uom.norm());
        };
        Measure.prototype.quad = function () {
            return new Measure(this.quantity.quad(), this.uom.quad());
        };
        Measure.prototype.toString = function () {
            return "" + this.quantity + " " + this.uom;
        };
        return Measure;
    })();
    return Measure;
});
