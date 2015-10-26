import QQ = require('../math/QQ');
/**
 * @class Dimensions
 */
declare class Dimensions {
    M: QQ;
    L: QQ;
    T: QQ;
    Q: QQ;
    temperature: QQ;
    amount: QQ;
    intensity: QQ;
    /**
     * @property MASS
     * @type {Dimensions}
     * @static
     */
    static MASS: Dimensions;
    /**
     * @property LENGTH
     * @type {Dimensions}
     * @static
     */
    static LENGTH: Dimensions;
    /**
     * @property TIME
     * @type {Dimensions}
     * @static
     */
    static TIME: Dimensions;
    /**
     * @property CHARGE
     * @type {Dimensions}
     * @static
     */
    static CHARGE: Dimensions;
    /**
     * @property CURRENT
     * @type {Dimensions}
     * @static
     */
    static CURRENT: Dimensions;
    /**
     * @property TEMPERATURE
     * @type {Dimensions}
     * @static
     */
    static TEMPERATURE: Dimensions;
    /**
     * @property AMOUNT
     * @type {Dimensions}
     * @static
     */
    static AMOUNT: Dimensions;
    /**
     * @property INTENSITY
     * @type {Dimensions}
     * @static
     */
    static INTENSITY: Dimensions;
    /**
     * The Dimensions class captures the physical dimensions associated with a unit of measure.
     *
     * @class Dimensions
     * @constructor
     * @param {QQ} M The mass component of the dimensions object.
     * @param {QQ} L The length component of the dimensions object.
     * @param {QQ} T The time component of the dimensions object.
     * @param {QQ} Q The charge component of the dimensions object.
     * @param {QQ} temperature The temperature component of the dimensions object.
     * @param {QQ} amount The amount component of the dimensions object.
     * @param {QQ} intensity The intensity component of the dimensions object.
     */
    constructor(M: QQ, L: QQ, T: QQ, Q: QQ, temperature: QQ, amount: QQ, intensity: QQ);
    /**
     * Returns the dimensions if they are all equal, otherwise throws an <code>Error</code>
     * @method compatible
     * @param rhs {Dimensions}
     * @return {Dimensions} <code>this</code>
     */
    compatible(rhs: Dimensions): Dimensions;
    /**
     * Multiplies dimensions by adding rational exponents.
     * @method mul
     * @param rhs {Dimensions}
     * @return {Dimensions} <code>this * rhs</code>
     */
    mul(rhs: Dimensions): Dimensions;
    /**
     * Divides dimensions by subtracting rational exponents.
     * @method div
     * @param rhs {Dimensions}
     * @return {Dimensions} <code>this / rhs</code>
     */
    div(rhs: Dimensions): Dimensions;
    /**
     * Computes the power function by multiplying rational exponents.
     * @method div
     * @param rhs {Dimensions}
     * @return {Dimensions} <code>pow(this, rhs)</code>
     */
    pow(exponent: QQ): Dimensions;
    /**
     * Computes the square root by dividing each rational component by two.
     * @method sqrt
     * @return {Dimensions}
     */
    sqrt(): Dimensions;
    /**
     * Determines whether the quantity is dimensionless (all rational components must be zero).
     * @method dimensionless
     * @return {boolean}
     */
    dimensionless(): boolean;
    /**
     * Determines whether all the components of the Dimensions instance are zero.
     *
     * @method isZero
     * @return {boolean} <code>true</code> if all the components are zero, otherwise <code>false</code>.
     */
    isZero(): boolean;
    /**
     * Computes the inverse by multiplying all exponents by <code>-1</code>.
     * @method neg
     * @return {Dimensions}
     */
    neg(): Dimensions;
    /**
     * Creates a representation of this <code>Dimensions</code> instance.
     * @method toString
     * @return {string}
     */
    toString(): string;
}
export = Dimensions;
