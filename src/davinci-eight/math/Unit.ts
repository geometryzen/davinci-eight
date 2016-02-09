import DivisionRingOperators from '../math/DivisionRingOperators';
import Dimensions from '../math/Dimensions';
import LinearElement from '../math/LinearElement';
import QQ from '../math/QQ';
import UnitError from '../math/UnitError';

var LABELS_SI = ['kg', 'm', 's', 'C', 'K', 'mol', 'candela'];

function assertArgNumber(name: string, x: number): number {
    if (typeof x === 'number') {
        return x;
    }
    else {
        throw new UnitError("Argument '" + name + "' must be a number");
    }
}

function assertArgDimensions(name: string, arg: Dimensions): Dimensions {
    if (arg instanceof Dimensions) {
        return arg;
    }
    else {
        throw new UnitError("Argument '" + arg + "' must be a Dimensions");
    }
}

function assertArgRational(name: string, arg: QQ): QQ {
    if (arg instanceof QQ) {
        return arg;
    }
    else {
        throw new UnitError("Argument '" + arg + "' must be a QQ");
    }
}

function assertArgUnit(name: string, arg: Unit): Unit {
    if (arg instanceof Unit) {
        return arg;
    }
    else {
        throw new UnitError("Argument '" + arg + "' must be a Unit");
    }
}

function assertArgUnitOrUndefined(name: string, arg: Unit): Unit {
    if (typeof arg === 'undefined') {
        return arg;
    }
    else {
        return assertArgUnit(name, arg);
    }
}

var dumbString = function(multiplier: number, dimensions: Dimensions, labels: string[]) {
    assertArgNumber('multiplier', multiplier);
    assertArgDimensions('dimensions', dimensions);
    var operatorStr: string;
    var scaleString: string;
    var unitsString: string;
    var stringify = function(rational: QQ, label: string): string {
        if (rational.numer === 0) {
            return null;
        } else if (rational.denom === 1) {
            if (rational.numer === 1) {
                return "" + label;
            } else {
                return "" + label + " ** " + rational.numer;
            }
        }
        return "" + label + " ** " + rational;
    };

    operatorStr = multiplier === 1 || dimensions.isOne() ? "" : " ";
    scaleString = multiplier === 1 ? "" : "" + multiplier;
    unitsString = [stringify(dimensions.M, labels[0]), stringify(dimensions.L, labels[1]), stringify(dimensions.T, labels[2]), stringify(dimensions.Q, labels[3]), stringify(dimensions.temperature, labels[4]), stringify(dimensions.amount, labels[5]), stringify(dimensions.intensity, labels[6])].filter(function(x) {
        return typeof x === 'string';
    }).join(" ");
    return "" + scaleString + operatorStr + unitsString;
};

var unitString = function(multiplier: number, dimensions: Dimensions, labels: string[]): string {
    var patterns =
        [
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
    var decodes =
        [
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

function add(lhs: Unit, rhs: Unit): Unit {
    return new Unit(lhs.multiplier + rhs.multiplier, lhs.dimensions.compatible(rhs.dimensions), lhs.labels);
}

function sub(lhs: Unit, rhs: Unit): Unit {
    return new Unit(lhs.multiplier - rhs.multiplier, lhs.dimensions.compatible(rhs.dimensions), lhs.labels);
}

function mul(lhs: Unit, rhs: Unit): Unit {
    return new Unit(lhs.multiplier * rhs.multiplier, lhs.dimensions.mul(rhs.dimensions), lhs.labels);
}

function scale(α: number, unit: Unit): Unit {
    return new Unit(α * unit.multiplier, unit.dimensions, unit.labels);
}

function div(lhs: Unit, rhs: Unit): Unit {
    return new Unit(lhs.multiplier / rhs.multiplier, lhs.dimensions.div(rhs.dimensions), lhs.labels);
}

/**
 * @module EIGHT
 * @submodule math
 */

/**
 * @class Unit
 */
export default class Unit implements DivisionRingOperators<Unit>, LinearElement<Unit, Unit, Unit, Unit> {
    public static ONE = new Unit(1.0, Dimensions.ONE, LABELS_SI);
    public static KILOGRAM = new Unit(1.0, Dimensions.MASS, LABELS_SI);
    public static METER = new Unit(1.0, Dimensions.LENGTH, LABELS_SI);
    public static SECOND = new Unit(1.0, Dimensions.TIME, LABELS_SI);
    public static COULOMB = new Unit(1.0, Dimensions.CHARGE, LABELS_SI);
    public static AMPERE = new Unit(1.0, Dimensions.CURRENT, LABELS_SI);
    public static KELVIN = new Unit(1.0, Dimensions.TEMPERATURE, LABELS_SI);
    public static MOLE = new Unit(1.0, Dimensions.AMOUNT, LABELS_SI);
    public static CANDELA = new Unit(1.0, Dimensions.INTENSITY, LABELS_SI);
    /**
     * The Unit class represents the units for a measure.
     *
     * @class Unit
     * @constructor
     * @param {number} multiplier
     * @param {Dimensions} dimensions
     * @param {string[]} labels The label strings to use for each dimension.
     */
    constructor(public multiplier: number, public dimensions: Dimensions, public labels: string[]) {
        if (labels.length !== 7) {
            throw new Error("Expecting 7 elements in the labels array.");
        }
        this.multiplier = multiplier;
        this.dimensions = dimensions;
        this.labels = labels;
    }

    /**
     * @method compatible
     * @param rhs {Unit}
     * @return {Unit}
     */
    compatible(rhs: Unit): Unit {
        if (rhs instanceof Unit) {
            this.dimensions.compatible(rhs.dimensions);
            return this;
        }
        else {
            throw new Error("Illegal Argument for Unit.compatible: " + rhs);
        }
    }

    /**
     * @method add
     * @param rhs {Unit}
     * @return {Unit}
     */
    add(rhs: Unit): Unit {
        assertArgUnit('rhs', rhs);
        return add(this, rhs);
    }

    /**
     * @method __add__
     * @param rhs {Unit}
     * @return {Unit}
     * @private
     */
    __add__(rhs: any) {
        if (rhs instanceof Unit) {
            return add(this, rhs);
        }
        else {
            return;
        }
    }

    /**
     * @method __radd__
     * @param lhs {Unit}
     * @return {Unit}
     * @private
     */
    __radd__(lhs: any) {
        if (lhs instanceof Unit) {
            return add(lhs, this);
        }
        else {
            return;
        }
    }


    /**
     * @method sub
     * @param rhs {Unit}
     * @return {Unit}
     */
    sub(rhs: Unit): Unit {
        assertArgUnit('rhs', rhs);
        return sub(this, rhs);
    }

    /**
     * @method __sub__
     * @param rhs {Unit}
     * @return {Unit}
     */
    __sub__(rhs: any) {
        if (rhs instanceof Unit) {
            return sub(this, rhs);
        }
        else {
            return;
        }
    }

    /**
     * @method __rsub__
     * @param lhs {Unit}
     * @return {Unit}
     */
    __rsub__(lhs: any) {
        if (lhs instanceof Unit) {
            return sub(lhs, this);
        }
        else {
            return;
        }
    }


    /**
     * @method mul
     * @param rhs {Unit}
     * @return {Unit}
     */
    mul(rhs: any): Unit {
        assertArgUnit('rhs', rhs);
        return mul(this, rhs);
    }

    /**
     * @method __mul__
     * @param rhs {Unit}
     * @return {Unit}
     */
    __mul__(rhs: any) {
        if (rhs instanceof Unit) {
            return mul(this, rhs);
        }
        else if (typeof rhs === 'number') {
            return scale(rhs, this);
        }
        else {
            return;
        }
    }

    /**
     * @method __rmul__
     * @param lhs {Unit}
     * @return {Unit}
     */
    __rmul__(lhs: any) {
        if (lhs instanceof Unit) {
            return mul(lhs, this);
        }
        else if (typeof lhs === 'number') {
            return scale(lhs, this);
        }
        else {
            return;
        }
    }

    div(rhs: Unit): Unit {
        assertArgUnit('rhs', rhs);
        return div(this, rhs);
    }

    divByScalar(α: number): Unit {
        return new Unit(this.multiplier / α, this.dimensions, this.labels);
    }

    __div__(other: any) {
        if (other instanceof Unit) {
            return div(this, other);
        }
        else if (typeof other === 'number') {
            return new Unit(this.multiplier / other, this.dimensions, this.labels);
        }
        else {
            return;
        }
    }

    __rdiv__(other: any) {
        if (other instanceof Unit) {
            return div(other, this);
        }
        else if (typeof other === 'number') {
            return new Unit(other / this.multiplier, this.dimensions.inv(), this.labels);
        }
        else {
            return;
        }
    }

    pow(exponent: QQ): Unit {
        assertArgRational('exponent', exponent);
        return new Unit(Math.pow(this.multiplier, exponent.numer / exponent.denom), this.dimensions.pow(exponent), this.labels);
    }

    /**
     * @method inv
     * @return {Unit}
     */
    inv(): Unit {
        return new Unit(1 / this.multiplier, this.dimensions.inv(), this.labels);
    }

    /**
     * @method neg
     * @return {Unit}
     */
    neg(): Unit {
        return new Unit(-this.multiplier, this.dimensions, this.labels);
    }

    /**
     * @method isOne
     * @return {boolean}
     */
    isOne(): boolean {
        return this.dimensions.isOne() && (this.multiplier === 1)
    }

    /**
     * @method isZero
     * @return {boolean}
     */
    isZero(): boolean {
        return this.dimensions.isZero() || (this.multiplier === 0)
    }

    /**
     * @method lerp
     * @param target: {Unit}
     * @param α {number}
     * @return {Unit}
     */
    lerp(target: Unit, α: number): Unit {
        return this
    }

    /**
     * @method norm
     * @return {Unit}
     */
    norm(): Unit {
        return new Unit(Math.abs(this.multiplier), this.dimensions, this.labels);
    }

    /**
     * @method quad
     * @return {Unit}
     */
    quad(): Unit {
        return new Unit(this.multiplier * this.multiplier, this.dimensions.mul(this.dimensions), this.labels);
    }

    /**
     * @method reflect
     * @param n {Unit}
     * @return {Unit}
     */
    reflect(n: Unit): Unit {
        return this;
    }

    /**
     * @method rotate
     * @param rotor {Unit}
     * @return {Unit}
     */
    rotate(rotor: Unit): Unit {
        return this;
    }

    scale(α: number): Unit {
        return new Unit(this.multiplier * α, this.dimensions, this.labels);
    }

    /**
     * @method slerp
     * @param target: {Unit}
     * @param α {number}
     * @return {Unit}
     */
    slerp(target: Unit, α: number): Unit {
        return this
    }

    toExponential(): string {
        return unitString(this.multiplier, this.dimensions, this.labels);
    }

    toFixed(digits?: number): string {
        return unitString(this.multiplier, this.dimensions, this.labels);
    }

    toString(): string {
        return unitString(this.multiplier, this.dimensions, this.labels);
    }

    /**
     * @method __pos__
     * @return {Unit}
     * @private
     */
    __pos__(): Unit {
        return this
    }

    /**
     * @method __neg__
     * @return {Unit}
     * @private
     */
    __neg__(): Unit {
        return this.neg()
    }

    /**
     * @method isOne
     * @param uom {Unit}
     * @return {boolean}
     * @static
     */
    static isOne(uom: Unit): boolean {
        if (typeof uom === 'undefined') {
            return true;
        }
        else if (uom instanceof Unit) {
            return uom.isOne();
        }
        else {
            throw new Error("isOne argument must be a Unit or undefined.");
        }
    }

    static assertDimensionless(uom: Unit) {
        if (!Unit.isOne(uom)) {
            throw new UnitError("uom must be dimensionless.");
        }
    }

    static compatible(lhs: Unit, rhs: Unit): Unit {
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
                    throw new UnitError(lhs + " is incompatible with 1");
                }
            }
        }
        else {
            if (rhs) {
                if (rhs.isOne()) {
                    return void 0;
                }
                else {
                    throw new UnitError("1 is incompatible with " + rhs);
                }
            }
            else {
                return void 0;
            }
        }
    }

    static mul(lhs: Unit, rhs: Unit): Unit {
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
    }

    static div(lhs: Unit, rhs: Unit): Unit {
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
    }

    static sqrt(uom: Unit): Unit {
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
    }
}
