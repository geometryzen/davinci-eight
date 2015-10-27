import DivisionRingOperators = require('../math/DivisionRingOperators');
import Dimensions = require('../math/Dimensions');
import LinearElement = require('../math/LinearElement');
import QQ = require('../math/QQ');
/**
 * @class Unit
 */
declare class Unit implements DivisionRingOperators<Unit>, LinearElement<Unit, Unit, Unit, Unit> {
    multiplier: number;
    dimensions: Dimensions;
    labels: string[];
    static ONE: Unit;
    static KILOGRAM: Unit;
    static METER: Unit;
    static SECOND: Unit;
    static COULOMB: Unit;
    static AMPERE: Unit;
    static KELVIN: Unit;
    static MOLE: Unit;
    static CANDELA: Unit;
    /**
     * The Unit class represents the units for a measure.
     *
     * @class Unit
     * @constructor
     * @param {number} multiplier
     * @param {Dimensions} dimensions
     * @param {string[]} labels The label strings to use for each dimension.
     */
    constructor(multiplier: number, dimensions: Dimensions, labels: string[]);
    /**
     * @method compatible
     * @param rhs {Unit}
     * @return {Unit}
     */
    compatible(rhs: Unit): Unit;
    /**
     * @method add
     * @param rhs {Unit}
     * @return {Unit}
     */
    add(rhs: Unit): Unit;
    /**
     * @method __add__
     * @param rhs {Unit}
     * @return {Unit}
     * @private
     */
    __add__(rhs: any): Unit;
    /**
     * @method __radd__
     * @param lhs {Unit}
     * @return {Unit}
     * @private
     */
    __radd__(lhs: any): Unit;
    /**
     * @method sub
     * @param rhs {Unit}
     * @return {Unit}
     */
    sub(rhs: Unit): Unit;
    /**
     * @method __sub__
     * @param rhs {Unit}
     * @return {Unit}
     */
    __sub__(rhs: any): Unit;
    /**
     * @method __rsub__
     * @param lhs {Unit}
     * @return {Unit}
     */
    __rsub__(lhs: any): Unit;
    /**
     * @method mul
     * @param rhs {Unit}
     * @return {Unit}
     */
    mul(rhs: any): Unit;
    /**
     * @method __mul__
     * @param rhs {Unit}
     * @return {Unit}
     */
    __mul__(rhs: any): Unit;
    /**
     * @method __rmul__
     * @param lhs {Unit}
     * @return {Unit}
     */
    __rmul__(lhs: any): Unit;
    div(rhs: Unit): Unit;
    divByScalar(α: number): Unit;
    __div__(other: any): Unit;
    __rdiv__(other: any): Unit;
    pow(exponent: QQ): Unit;
    /**
     * @method inv
     * @return {Unit}
     */
    inv(): Unit;
    /**
     * @method neg
     * @return {Unit}
     */
    neg(): Unit;
    /**
     * @method isOne
     * @return {boolean}
     */
    isOne(): boolean;
    /**
     * @method isZero
     * @return {boolean}
     */
    isZero(): boolean;
    /**
     * @method lerp
     * @param target: {Unit}
     * @param α {number}
     * @return {Unit}
     */
    lerp(target: Unit, α: number): Unit;
    /**
     * @method norm
     * @return {Unit}
     */
    norm(): Unit;
    /**
     * @method quad
     * @return {Unit}
     */
    quad(): Unit;
    /**
     * @method reflect
     * @param n {Unit}
     * @return {Unit}
     */
    reflect(n: Unit): Unit;
    /**
     * @method rotate
     * @param rotor {Unit}
     * @return {Unit}
     */
    rotate(rotor: Unit): Unit;
    scale(α: number): Unit;
    /**
     * @method slerp
     * @param target: {Unit}
     * @param α {number}
     * @return {Unit}
     */
    slerp(target: Unit, α: number): Unit;
    toExponential(): string;
    toFixed(digits?: number): string;
    toString(): string;
    /**
     * @method __pos__
     * @return {Unit}
     * @private
     */
    __pos__(): Unit;
    /**
     * @method __neg__
     * @return {Unit}
     * @private
     */
    __neg__(): Unit;
    /**
     * @method isOne
     * @param uom {Unit}
     * @return {boolean}
     * @static
     */
    static isOne(uom: Unit): boolean;
    static assertDimensionless(uom: Unit): void;
    static compatible(lhs: Unit, rhs: Unit): Unit;
    static mul(lhs: Unit, rhs: Unit): Unit;
    static div(lhs: Unit, rhs: Unit): Unit;
    static sqrt(uom: Unit): Unit;
}
export = Unit;
