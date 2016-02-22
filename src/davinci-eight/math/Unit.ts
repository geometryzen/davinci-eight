import DivisionRingOperators from '../math/DivisionRingOperators';
import Dimensions from '../math/Dimensions';
import LinearElement from '../math/LinearElement';
import notImplemented from '../i18n/notImplemented';
import QQ from '../math/QQ';

// const NAMES_SI = ['kilogram', 'meter', 'second', 'coulomb', 'kelvin', 'mole', 'candela'];
const SYMBOLS_SI = ['kg', 'm', 's', 'C', 'K', 'mol', 'cd'];

const patterns =
    [
        [-1, 1, -3, 1, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1],  // F/m
        [-1, 1, -2, 1, 1, 1, 2, 1, 0, 1, 0, 1, 0, 1],  // S
        [-1, 1, -2, 1, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1],  // F
        [-1, 1, +0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],  // C/kg
        [+0, 1, -3, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],  // C/m ** 3
        [+0, 1, 2, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],  // J/kg
        [+0, 1, 0, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],  // Hz
        [+0, 1, 0, 1, -1, 1, 1, 1, 0, 1, 0, 1, 0, 1],  // A
        [0, 1, 1, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],   // m/s ** 2
        [0, 1, 1, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],   // m/s
        [1, 1, 1, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],   // kg·m/s
        [1, 1, -1, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],  // Pa
        [1, 1, -1, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],  // Pa·s
        [1, 1, 0, 1, -3, 1, 0, 1, 0, 1, 0, 1, 0, 1],   // W/m ** 2
        [1, 1, 0, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],   // N/m
        [1, 1, 0, 1, -1, 1, -1, 1, 0, 1, 0, 1, 0, 1],  // T
        [1, 1, 1, 1, -3, 1, 0, 1, -1, 1, 0, 1, 0, 1],  // W/(m·K)
        [1, 1, 1, 1, -2, 1, -1, 1, 0, 1, 0, 1, 0, 1],  // V/m
        [1, 1, 1, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],   // N
        [1, 1, 1, 1, 0, 1, -2, 1, 0, 1, 0, 1, 0, 1],   // H/m
        [1, 1, 2, 1, -2, 1, 0, 1, -1, 1, 0, 1, 0, 1],  // J/K
        [0, 1, 2, 1, -2, 1, 0, 1, -1, 1, 0, 1, 0, 1],  // J/(kg·K)
        [1, 1, 2, 1, -2, 1, 0, 1, -1, 1, -1, 1, 0, 1], // J/(mol·K)
        [1, 1, 2, 1, -2, 1, 0, 1, 0, 1, -1, 1, 0, 1],  // J/(mol)
        [1, 1, 2, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],   // J
        [1, 1, 2, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],   // J·s
        [1, 1, 2, 1, -3, 1, 0, 1, 0, 1, 0, 1, 0, 1],   // W
        [1, 1, 2, 1, -2, 1, -1, 1, 0, 1, 0, 1, 0, 1],  // V
        [1, 1, 2, 1, -1, 1, -2, 1, 0, 1, 0, 1, 0, 1],  // Ω
        [1, 1, 2, 1, 0, 1, -2, 1, 0, 1, 0, 1, 0, 1],   // H
        [1, 1, 2, 1, -1, 1, -1, 1, 0, 1, 0, 1, 0, 1]   // Wb
    ];

const decodes =
    [
        ["F/m"],
        ["S"],
        ["F"],
        ["C/kg"],
        ["C/m ** 3"],
        ["J/kg"],
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

const dumbString = function(multiplier: number, formatted: string, dimensions: Dimensions, labels: string[]) {
    const stringify = function(rational: QQ, label: string): string {
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

    const operatorStr = multiplier === 1 || dimensions.isOne() ? "" : " ";
    const scaleString = multiplier === 1 ? "" : formatted;
    const unitsString = [stringify(dimensions.M, labels[0]), stringify(dimensions.L, labels[1]), stringify(dimensions.T, labels[2]), stringify(dimensions.Q, labels[3]), stringify(dimensions.temperature, labels[4]), stringify(dimensions.amount, labels[5]), stringify(dimensions.intensity, labels[6])].filter(function(x) {
        return typeof x === 'string';
    }).join(" ");
    return "" + scaleString + operatorStr + unitsString;
};

const unitString = function(multiplier: number, formatted: string, dimensions: Dimensions, labels: string[]): string {
    const M = dimensions.M;
    const L = dimensions.L;
    const T = dimensions.T;
    const Q = dimensions.Q;
    const temperature = dimensions.temperature;
    const amount = dimensions.amount;
    const intensity = dimensions.intensity;
    for (let i = 0, len = patterns.length; i < len; i++) {
        const pattern = patterns[i];
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
    return dumbString(multiplier, formatted, dimensions, labels);
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
    /**
     * @property ONE
     * @type Unit
     * @static
     */
    public static ONE = new Unit(1.0, Dimensions.ONE, SYMBOLS_SI);
    /**
     * @property KILOGRAM
     * @type Unit
     * @static
     */
    public static KILOGRAM = new Unit(1.0, Dimensions.MASS, SYMBOLS_SI);
    /**
     * @property METER
     * @type Unit
     * @static
     */
    public static METER = new Unit(1.0, Dimensions.LENGTH, SYMBOLS_SI);
    /**
     * @property SECOND
     * @type Unit
     * @static
     */
    public static SECOND = new Unit(1.0, Dimensions.TIME, SYMBOLS_SI);
    /**
     * @property COULOMB
     * @type Unit
     * @static
     */
    public static COULOMB = new Unit(1.0, Dimensions.CHARGE, SYMBOLS_SI);
    /**
     * @property AMPERE
     * @type Unit
     * @static
     */
    public static AMPERE = new Unit(1.0, Dimensions.CURRENT, SYMBOLS_SI);
    /**
     * @property KELVIN
     * @type Unit
     * @static
     */
    public static KELVIN = new Unit(1.0, Dimensions.TEMPERATURE, SYMBOLS_SI);
    /**
     * @property MOLE
     * @type Unit
     * @static
     */
    public static MOLE = new Unit(1.0, Dimensions.AMOUNT, SYMBOLS_SI);
    /**
     * @property CANDELA
     * @type Unit
     * @static
     */
    public static CANDELA = new Unit(1.0, Dimensions.INTENSITY, SYMBOLS_SI);
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
        return add(this, rhs);
    }

    /**
     * @method __add__
     * @param rhs {Unit}
     * @return {Unit}
     * @private
     */
    __add__(rhs: Unit) {
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
    __radd__(lhs: Unit) {
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
        return sub(this, rhs);
    }

    /**
     * @method __sub__
     * @param rhs {Unit}
     * @return {Unit}
     */
    __sub__(rhs: Unit) {
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
    __rsub__(lhs: Unit) {
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
    mul(rhs: Unit): Unit {
        return mul(this, rhs);
    }

    /**
     * @method __mul__
     * @param rhs {number | Unit}
     * @return {Unit}
     */
    __mul__(rhs: number | Unit) {
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
     * @param lhs {number | Unit}
     * @return {Unit}
     */
    __rmul__(lhs: number | Unit) {
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
        return div(this, rhs);
    }

    divByScalar(α: number): Unit {
        return new Unit(this.multiplier / α, this.dimensions, this.labels);
    }

    __div__(other: number | Unit) {
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

    __rdiv__(other: number | Unit) {
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

    /**
     * Intentionaly undocumented.
     */
    pattern(): string {
        const ns: number[] = []
        ns.push(this.dimensions.M.numer)
        ns.push(this.dimensions.M.denom)
        ns.push(this.dimensions.L.numer)
        ns.push(this.dimensions.L.denom)
        ns.push(this.dimensions.T.numer)
        ns.push(this.dimensions.T.denom)
        ns.push(this.dimensions.Q.numer)
        ns.push(this.dimensions.Q.denom)
        ns.push(this.dimensions.temperature.numer)
        ns.push(this.dimensions.temperature.denom)
        ns.push(this.dimensions.amount.numer)
        ns.push(this.dimensions.amount.denom)
        ns.push(this.dimensions.intensity.numer)
        ns.push(this.dimensions.intensity.denom)
        return JSON.stringify(ns)
    }

    pow(exponent: QQ): Unit {
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
        throw new Error(notImplemented('lerp').message)
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
        throw new Error(notImplemented('slerp').message)
    }

    /**
     * @method toExponential
     * @return {string}
     */
    toExponential(): string {
        return unitString(this.multiplier, this.multiplier.toExponential(), this.dimensions, this.labels);
    }

    /**
     * @method toFixed
     * @param [fractionDigits] {number}
     * @return {string}
     */
    toFixed(fractionDigits?: number): string {
        return unitString(this.multiplier, this.multiplier.toFixed(fractionDigits), this.dimensions, this.labels);
    }

    /**
     * @method toString
     * @return {string}
     */
    toString(): string {
        return unitString(this.multiplier, this.multiplier.toString(), this.dimensions, this.labels);
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
        if (uom === void 0) {
            return true;
        }
        else if (uom instanceof Unit) {
            return uom.isOne();
        }
        else {
            throw new Error("isOne argument must be a Unit or undefined.");
        }
    }

    /**
     * @method assertDimensionless
     * @param uom {Unit}
     * @return {void}
     * @static
     */
    static assertDimensionless(uom: Unit): void {
        if (!Unit.isOne(uom)) {
            throw new Error("uom must be dimensionless.");
        }
    }

    static compatible(lhs: Unit, rhs: Unit): Unit {
        if (lhs) {
            if (rhs) {
                return lhs.compatible(rhs);
            }
            else {
                if (lhs.isOne()) {
                    return void 0;
                }
                else {
                    throw new Error(lhs + " is incompatible with 1");
                }
            }
        }
        else {
            if (rhs) {
                if (rhs.isOne()) {
                    return void 0;
                }
                else {
                    throw new Error("1 is incompatible with " + rhs);
                }
            }
            else {
                return void 0;
            }
        }
    }

    static mul(lhs: Unit, rhs: Unit): Unit {
        if (lhs) {
            if (rhs) {
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
        if (lhs) {
            if (rhs) {
                return lhs.div(rhs);
            }
            else {
                return lhs;
            }
        }
        else {
            if (rhs) {
                return rhs.inv();
            }
            else {
                return void 0;
            }
        }
    }

    static sqrt(uom: Unit): Unit {
        if (typeof uom !== 'undefined') {
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
