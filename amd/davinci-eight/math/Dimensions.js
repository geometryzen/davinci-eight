define(["require", "exports", '../math/DimensionError', '../math/Rational'], function (require, exports, DimensionError, Rational) {
    var R0 = Rational.ZERO;
    var R1 = Rational.ONE;
    var M1 = Rational.MINUS_ONE;
    function assertArgNumber(name, x) {
        if (typeof x === 'number') {
            return x;
        }
        else {
            throw new DimensionError("Argument '" + name + "' must be a number");
        }
    }
    function assertArgDimensions(name, arg) {
        if (arg instanceof Dimensions) {
            return arg;
        }
        else {
            throw new DimensionError("Argument '" + arg + "' must be a Dimensions");
        }
    }
    function assertArgRational(name, arg) {
        if (arg instanceof Rational) {
            return arg;
        }
        else {
            throw new DimensionError("Argument '" + arg + "' must be a Rational");
        }
    }
    var Dimensions = (function () {
        /**
         * The Dimensions class captures the physical dimensions associated with a unit of measure.
         *
         * @class Dimensions
         * @constructor
         * @param {Rational} mass The mass component of the dimensions object.
         * @param {Rational} length The length component of the dimensions object.
         * @param {Rational} time The time component of the dimensions object.
         * @param {Rational} charge The charge component of the dimensions object.
         * @param {Rational} temperature The temperature component of the dimensions object.
         * @param {Rational} amount The amount component of the dimensions object.
         * @param {Rational} intensity The intensity component of the dimensions object.
         */
        function Dimensions(theMass, L, T, Q, temperature, amount, intensity) {
            this.L = L;
            this.T = T;
            this.Q = Q;
            this.temperature = temperature;
            this.amount = amount;
            this.intensity = intensity;
            var length = L;
            var time = T;
            var charge = Q;
            if (arguments.length !== 7) {
                throw {
                    name: "DimensionError",
                    message: "Expecting 7 arguments"
                };
            }
            this._mass = theMass;
            if (typeof length === 'number') {
                this.L = new Rational(length, 1);
            }
            else if (length instanceof Rational) {
                this.L = length;
            }
            else {
                throw {
                    name: "DimensionError",
                    message: "length must be a Rational or number"
                };
            }
            if (typeof time === 'number') {
                this.T = new Rational(time, 1);
            }
            else if (time instanceof Rational) {
                this.T = time;
            }
            else {
                throw {
                    name: "DimensionError",
                    message: "time must be a Rational or number"
                };
            }
            if (typeof charge === 'number') {
                this.Q = new Rational(charge, 1);
            }
            else if (charge instanceof Rational) {
                this.Q = charge;
            }
            else {
                throw {
                    name: "DimensionError",
                    message: "charge must be a Rational or number"
                };
            }
            if (typeof temperature === 'number') {
                this.temperature = new Rational(temperature, 1);
            }
            else if (temperature instanceof Rational) {
                this.temperature = temperature;
            }
            else {
                throw {
                    name: "DimensionError",
                    message: "(thermodynamic) temperature must be a Rational or number"
                };
            }
            if (typeof amount === 'number') {
                this.amount = new Rational(amount, 1);
            }
            else if (amount instanceof Rational) {
                this.amount = amount;
            }
            else {
                throw {
                    name: "DimensionError",
                    message: "amount (of substance) must be a Rational or number"
                };
            }
            if (typeof intensity === 'number') {
                this.intensity = new Rational(intensity, 1);
            }
            else if (intensity instanceof Rational) {
                this.intensity = intensity;
            }
            else {
                throw {
                    name: "DimensionError",
                    message: "(luminous) intensity must be a Rational or number"
                };
            }
        }
        Object.defineProperty(Dimensions.prototype, "M", {
            /**
            * The <em>mass</em> component of this dimensions instance.
            *
            * @property M
            * @type {Rational}
            */
            get: function () {
                return this._mass;
            },
            enumerable: true,
            configurable: true
        });
        Dimensions.prototype.compatible = function (rhs) {
            if (this._mass.equals(rhs._mass) && this.L.equals(rhs.L) && this.T.equals(rhs.T) && this.Q.equals(rhs.Q) && this.temperature.equals(rhs.temperature) && this.amount.equals(rhs.amount) && this.intensity.equals(rhs.intensity)) {
                return this;
            }
            else {
                throw new DimensionError("Dimensions must be equal (" + this + ", " + rhs + ")");
            }
        };
        Dimensions.prototype.mul = function (rhs) {
            return new Dimensions(this._mass.add(rhs._mass), this.L.add(rhs.L), this.T.add(rhs.T), this.Q.add(rhs.Q), this.temperature.add(rhs.temperature), this.amount.add(rhs.amount), this.intensity.add(rhs.intensity));
        };
        Dimensions.prototype.div = function (rhs) {
            return new Dimensions(this._mass.sub(rhs._mass), this.L.sub(rhs.L), this.T.sub(rhs.T), this.Q.sub(rhs.Q), this.temperature.sub(rhs.temperature), this.amount.sub(rhs.amount), this.intensity.sub(rhs.intensity));
        };
        Dimensions.prototype.pow = function (exponent) {
            return new Dimensions(this._mass.mul(exponent), this.L.mul(exponent), this.T.mul(exponent), this.Q.mul(exponent), this.temperature.mul(exponent), this.amount.mul(exponent), this.intensity.mul(exponent));
        };
        Dimensions.prototype.sqrt = function () {
            return new Dimensions(this._mass.div(Rational.TWO), this.L.div(Rational.TWO), this.T.div(Rational.TWO), this.Q.div(Rational.TWO), this.temperature.div(Rational.TWO), this.amount.div(Rational.TWO), this.intensity.div(Rational.TWO));
        };
        Dimensions.prototype.dimensionless = function () {
            return this._mass.isZero() && this.L.isZero() && this.T.isZero() && this.Q.isZero() && this.temperature.isZero() && this.amount.isZero() && this.intensity.isZero();
        };
        /**
        * Determines whether all the components of the Dimensions instance are zero.
        *
        * @method isZero
        * @return {boolean} <code>true</code> if all the components are zero, otherwise <code>false</code>.
        */
        Dimensions.prototype.isZero = function () {
            return this._mass.isZero() && this.L.isZero() && this.T.isZero() && this.Q.isZero() && this.temperature.isZero() && this.amount.isZero() && this.intensity.isZero();
        };
        Dimensions.prototype.negative = function () {
            return new Dimensions(this._mass.negative(), this.L.negative(), this.T.negative(), this.Q.negative(), this.temperature.negative(), this.amount.negative(), this.intensity.negative());
        };
        Dimensions.prototype.toString = function () {
            var stringify = function (rational, label) {
                if (rational.numer === 0) {
                    return null;
                }
                else if (rational.denom === 1) {
                    if (rational.numer === 1) {
                        return "" + label;
                    }
                    else {
                        return "" + label + " ** " + rational.numer;
                    }
                }
                return "" + label + " ** " + rational;
            };
            return [stringify(this._mass, 'mass'), stringify(this.L, 'length'), stringify(this.T, 'time'), stringify(this.Q, 'charge'), stringify(this.temperature, 'thermodynamic temperature'), stringify(this.amount, 'amount of substance'), stringify(this.intensity, 'luminous intensity')].filter(function (x) {
                return typeof x === 'string';
            }).join(" * ");
        };
        Dimensions.MASS = new Dimensions(R1, R0, R0, R0, R0, R0, R0);
        Dimensions.LENGTH = new Dimensions(R0, R1, R0, R0, R0, R0, R0);
        Dimensions.TIME = new Dimensions(R0, R0, R1, R0, R0, R0, R0);
        Dimensions.CHARGE = new Dimensions(R0, R0, R0, R1, R0, R0, R0);
        Dimensions.CURRENT = new Dimensions(R0, R0, M1, R1, R0, R0, R0);
        Dimensions.TEMPERATURE = new Dimensions(R0, R0, R0, R0, R1, R0, R0);
        Dimensions.AMOUNT = new Dimensions(R0, R0, R0, R0, R0, R1, R0);
        Dimensions.INTENSITY = new Dimensions(R0, R0, R0, R0, R0, R0, R1);
        return Dimensions;
    })();
    return Dimensions;
});
