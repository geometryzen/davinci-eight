define(["require", "exports", '../math/Dimensions', '../math/QQ', '../math/UnitError'], function (require, exports, Dimensions_1, QQ_1, UnitError_1) {
    var LABELS_SI = ['kg', 'm', 's', 'C', 'K', 'mol', 'candela'];
    function assertArgNumber(name, x) {
        if (typeof x === 'number') {
            return x;
        }
        else {
            throw new UnitError_1.default("Argument '" + name + "' must be a number");
        }
    }
    function assertArgDimensions(name, arg) {
        if (arg instanceof Dimensions_1.default) {
            return arg;
        }
        else {
            throw new UnitError_1.default("Argument '" + arg + "' must be a Dimensions");
        }
    }
    function assertArgRational(name, arg) {
        if (arg instanceof QQ_1.default) {
            return arg;
        }
        else {
            throw new UnitError_1.default("Argument '" + arg + "' must be a QQ");
        }
    }
    function assertArgUnit(name, arg) {
        if (arg instanceof Unit) {
            return arg;
        }
        else {
            throw new UnitError_1.default("Argument '" + arg + "' must be a Unit");
        }
    }
    function assertArgUnitOrUndefined(name, arg) {
        if (typeof arg === 'undefined') {
            return arg;
        }
        else {
            return assertArgUnit(name, arg);
        }
    }
    var dumbString = function (multiplier, dimensions, labels) {
        assertArgNumber('multiplier', multiplier);
        assertArgDimensions('dimensions', dimensions);
        var operatorStr;
        var scaleString;
        var unitsString;
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
        operatorStr = multiplier === 1 || dimensions.isOne() ? "" : " ";
        scaleString = multiplier === 1 ? "" : "" + multiplier;
        unitsString = [stringify(dimensions.M, labels[0]), stringify(dimensions.L, labels[1]), stringify(dimensions.T, labels[2]), stringify(dimensions.Q, labels[3]), stringify(dimensions.temperature, labels[4]), stringify(dimensions.amount, labels[5]), stringify(dimensions.intensity, labels[6])].filter(function (x) {
            return typeof x === 'string';
        }).join(" ");
        return "" + scaleString + operatorStr + unitsString;
    };
    var unitString = function (multiplier, dimensions, labels) {
        var patterns = [
            [-1, 1, -3, 1, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1],
            [-1, 1, -2, 1, 1, 1, 2, 1, 0, 1, 0, 1, 0, 1],
            [-1, 1, -2, 1, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1],
            [-1, 1, 3, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [0, 1, 0, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [0, 1, 0, 1, -1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
            [0, 1, 1, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [0, 1, 1, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 1, 1, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 1, -1, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 1, -1, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 1, 0, 1, -3, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 1, 0, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 1, 0, 1, -1, 1, -1, 1, 0, 1, 0, 1, 0, 1],
            [1, 1, 1, 1, -3, 1, 0, 1, -1, 1, 0, 1, 0, 1],
            [1, 1, 1, 1, -2, 1, -1, 1, 0, 1, 0, 1, 0, 1],
            [1, 1, 1, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 1, 1, 1, 0, 1, -2, 1, 0, 1, 0, 1, 0, 1],
            [1, 1, 2, 1, -2, 1, 0, 1, -1, 1, 0, 1, 0, 1],
            [0, 1, 2, 1, -2, 1, 0, 1, -1, 1, 0, 1, 0, 1],
            [1, 1, 2, 1, -2, 1, 0, 1, -1, 1, -1, 1, 0, 1],
            [1, 1, 2, 1, -2, 1, 0, 1, 0, 1, -1, 1, 0, 1],
            [1, 1, 2, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 1, 2, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 1, 2, 1, -3, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 1, 2, 1, -2, 1, -1, 1, 0, 1, 0, 1, 0, 1],
            [1, 1, 2, 1, -1, 1, -2, 1, 0, 1, 0, 1, 0, 1],
            [1, 1, 2, 1, 0, 1, -2, 1, 0, 1, 0, 1, 0, 1],
            [1, 1, 2, 1, -1, 1, -1, 1, 0, 1, 0, 1, 0, 1]
        ];
        var decodes = [
            ["F/m"],
            ["S"],
            ["F"],
            ["N·m ** 2/kg ** 2"],
            ["Hz"],
            ["A"],
            ["m/s ** 2"],
            ["m/s"],
            ["kg·m/s"],
            ["Pa"],
            ["Pa·s"],
            ["W/m ** 2"],
            ["N/m"],
            ["T"],
            ["W/(m·K)"],
            ["V/m"],
            ["N"],
            ["H/m"],
            ["J/K"],
            ["J/(kg·K)"],
            ["J/(mol·K)"],
            ["J/mol"],
            ["J"],
            ["J·s"],
            ["W"],
            ["V"],
            ["Ω"],
            ["H"],
            ["Wb"]
        ];
        var M = dimensions.M;
        var L = dimensions.L;
        var T = dimensions.T;
        var Q = dimensions.Q;
        var temperature = dimensions.temperature;
        var amount = dimensions.amount;
        var intensity = dimensions.intensity;
        for (var i = 0, len = patterns.length; i < len; i++) {
            var pattern = patterns[i];
            if (M.numer === pattern[0] && M.denom === pattern[1] &&
                L.numer === pattern[2] && L.denom === pattern[3] &&
                T.numer === pattern[4] && T.denom === pattern[5] &&
                Q.numer === pattern[6] && Q.denom === pattern[7] &&
                temperature.numer === pattern[8] && temperature.denom === pattern[9] &&
                amount.numer === pattern[10] && amount.denom === pattern[11] &&
                intensity.numer === pattern[12] && intensity.denom === pattern[13]) {
                if (multiplier !== 1) {
                    return multiplier + " * " + decodes[i][0];
                }
                else {
                    return decodes[i][0];
                }
            }
        }
        return dumbString(multiplier, dimensions, labels);
    };
    function add(lhs, rhs) {
        return new Unit(lhs.multiplier + rhs.multiplier, lhs.dimensions.compatible(rhs.dimensions), lhs.labels);
    }
    function sub(lhs, rhs) {
        return new Unit(lhs.multiplier - rhs.multiplier, lhs.dimensions.compatible(rhs.dimensions), lhs.labels);
    }
    function mul(lhs, rhs) {
        return new Unit(lhs.multiplier * rhs.multiplier, lhs.dimensions.mul(rhs.dimensions), lhs.labels);
    }
    function scale(α, unit) {
        return new Unit(α * unit.multiplier, unit.dimensions, unit.labels);
    }
    function div(lhs, rhs) {
        return new Unit(lhs.multiplier / rhs.multiplier, lhs.dimensions.div(rhs.dimensions), lhs.labels);
    }
    var Unit = (function () {
        function Unit(multiplier, dimensions, labels) {
            this.multiplier = multiplier;
            this.dimensions = dimensions;
            this.labels = labels;
            if (labels.length !== 7) {
                throw new Error("Expecting 7 elements in the labels array.");
            }
            this.multiplier = multiplier;
            this.dimensions = dimensions;
            this.labels = labels;
        }
        Unit.prototype.compatible = function (rhs) {
            if (rhs instanceof Unit) {
                this.dimensions.compatible(rhs.dimensions);
                return this;
            }
            else {
                throw new Error("Illegal Argument for Unit.compatible: " + rhs);
            }
        };
        Unit.prototype.add = function (rhs) {
            assertArgUnit('rhs', rhs);
            return add(this, rhs);
        };
        Unit.prototype.__add__ = function (rhs) {
            if (rhs instanceof Unit) {
                return add(this, rhs);
            }
            else {
                return;
            }
        };
        Unit.prototype.__radd__ = function (lhs) {
            if (lhs instanceof Unit) {
                return add(lhs, this);
            }
            else {
                return;
            }
        };
        Unit.prototype.sub = function (rhs) {
            assertArgUnit('rhs', rhs);
            return sub(this, rhs);
        };
        Unit.prototype.__sub__ = function (rhs) {
            if (rhs instanceof Unit) {
                return sub(this, rhs);
            }
            else {
                return;
            }
        };
        Unit.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof Unit) {
                return sub(lhs, this);
            }
            else {
                return;
            }
        };
        Unit.prototype.mul = function (rhs) {
            assertArgUnit('rhs', rhs);
            return mul(this, rhs);
        };
        Unit.prototype.__mul__ = function (rhs) {
            if (rhs instanceof Unit) {
                return mul(this, rhs);
            }
            else if (typeof rhs === 'number') {
                return scale(rhs, this);
            }
            else {
                return;
            }
        };
        Unit.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof Unit) {
                return mul(lhs, this);
            }
            else if (typeof lhs === 'number') {
                return scale(lhs, this);
            }
            else {
                return;
            }
        };
        Unit.prototype.div = function (rhs) {
            assertArgUnit('rhs', rhs);
            return div(this, rhs);
        };
        Unit.prototype.divByScalar = function (α) {
            return new Unit(this.multiplier / α, this.dimensions, this.labels);
        };
        Unit.prototype.__div__ = function (other) {
            if (other instanceof Unit) {
                return div(this, other);
            }
            else if (typeof other === 'number') {
                return new Unit(this.multiplier / other, this.dimensions, this.labels);
            }
            else {
                return;
            }
        };
        Unit.prototype.__rdiv__ = function (other) {
            if (other instanceof Unit) {
                return div(other, this);
            }
            else if (typeof other === 'number') {
                return new Unit(other / this.multiplier, this.dimensions.inv(), this.labels);
            }
            else {
                return;
            }
        };
        Unit.prototype.pow = function (exponent) {
            assertArgRational('exponent', exponent);
            return new Unit(Math.pow(this.multiplier, exponent.numer / exponent.denom), this.dimensions.pow(exponent), this.labels);
        };
        Unit.prototype.inv = function () {
            return new Unit(1 / this.multiplier, this.dimensions.inv(), this.labels);
        };
        Unit.prototype.neg = function () {
            return new Unit(-this.multiplier, this.dimensions, this.labels);
        };
        Unit.prototype.isOne = function () {
            return this.dimensions.isOne() && (this.multiplier === 1);
        };
        Unit.prototype.isZero = function () {
            return this.dimensions.isZero() || (this.multiplier === 0);
        };
        Unit.prototype.lerp = function (target, α) {
            return this;
        };
        Unit.prototype.norm = function () {
            return new Unit(Math.abs(this.multiplier), this.dimensions, this.labels);
        };
        Unit.prototype.quad = function () {
            return new Unit(this.multiplier * this.multiplier, this.dimensions.mul(this.dimensions), this.labels);
        };
        Unit.prototype.reflect = function (n) {
            return this;
        };
        Unit.prototype.rotate = function (rotor) {
            return this;
        };
        Unit.prototype.scale = function (α) {
            return new Unit(this.multiplier * α, this.dimensions, this.labels);
        };
        Unit.prototype.slerp = function (target, α) {
            return this;
        };
        Unit.prototype.toExponential = function () {
            return unitString(this.multiplier, this.dimensions, this.labels);
        };
        Unit.prototype.toFixed = function (digits) {
            return unitString(this.multiplier, this.dimensions, this.labels);
        };
        Unit.prototype.toString = function () {
            return unitString(this.multiplier, this.dimensions, this.labels);
        };
        Unit.prototype.__pos__ = function () {
            return this;
        };
        Unit.prototype.__neg__ = function () {
            return this.neg();
        };
        Unit.isOne = function (uom) {
            if (typeof uom === 'undefined') {
                return true;
            }
            else if (uom instanceof Unit) {
                return uom.isOne();
            }
            else {
                throw new Error("isOne argument must be a Unit or undefined.");
            }
        };
        Unit.assertDimensionless = function (uom) {
            if (!Unit.isOne(uom)) {
                throw new UnitError_1.default("uom must be dimensionless.");
            }
        };
        Unit.compatible = function (lhs, rhs) {
            assertArgUnitOrUndefined('lhs', lhs);
            assertArgUnitOrUndefined('rhs', rhs);
            if (lhs) {
                if (rhs) {
                    return lhs.compatible(rhs);
                }
                else {
                    if (lhs.isOne()) {
                        return void 0;
                    }
                    else {
                        throw new UnitError_1.default(lhs + " is incompatible with 1");
                    }
                }
            }
            else {
                if (rhs) {
                    if (rhs.isOne()) {
                        return void 0;
                    }
                    else {
                        throw new UnitError_1.default("1 is incompatible with " + rhs);
                    }
                }
                else {
                    return void 0;
                }
            }
        };
        Unit.mul = function (lhs, rhs) {
            if (lhs instanceof Unit) {
                if (rhs instanceof Unit) {
                    return lhs.mul(rhs);
                }
                else if (Unit.isOne(rhs)) {
                    return lhs;
                }
                else {
                    return void 0;
                }
            }
            else if (Unit.isOne(lhs)) {
                return rhs;
            }
            else {
                return void 0;
            }
        };
        Unit.div = function (lhs, rhs) {
            if (lhs instanceof Unit) {
                if (rhs instanceof Unit) {
                    return lhs.div(rhs);
                }
                else {
                    return lhs;
                }
            }
            else {
                if (rhs instanceof Unit) {
                    return rhs.inv();
                }
                else {
                    return void 0;
                }
            }
        };
        Unit.sqrt = function (uom) {
            if (typeof uom !== 'undefined') {
                assertArgUnit('uom', uom);
                if (!uom.isOne()) {
                    return new Unit(Math.sqrt(uom.multiplier), uom.dimensions.sqrt(), uom.labels);
                }
                else {
                    return void 0;
                }
            }
            else {
                return void 0;
            }
        };
        Unit.ONE = new Unit(1.0, Dimensions_1.default.ONE, LABELS_SI);
        Unit.KILOGRAM = new Unit(1.0, Dimensions_1.default.MASS, LABELS_SI);
        Unit.METER = new Unit(1.0, Dimensions_1.default.LENGTH, LABELS_SI);
        Unit.SECOND = new Unit(1.0, Dimensions_1.default.TIME, LABELS_SI);
        Unit.COULOMB = new Unit(1.0, Dimensions_1.default.CHARGE, LABELS_SI);
        Unit.AMPERE = new Unit(1.0, Dimensions_1.default.CURRENT, LABELS_SI);
        Unit.KELVIN = new Unit(1.0, Dimensions_1.default.TEMPERATURE, LABELS_SI);
        Unit.MOLE = new Unit(1.0, Dimensions_1.default.AMOUNT, LABELS_SI);
        Unit.CANDELA = new Unit(1.0, Dimensions_1.default.INTENSITY, LABELS_SI);
        return Unit;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Unit;
});
