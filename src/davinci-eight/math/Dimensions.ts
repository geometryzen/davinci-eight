import mustBeObject = require('../checks/mustBeObject')
import QQ = require('../math/QQ')

var R0 = QQ.ZERO;
var R1 = QQ.ONE;
var M1 = QQ.MINUS_ONE;

function assertArgDimensions(name: string, arg: Dimensions): Dimensions {
    if (arg instanceof Dimensions) {
        return arg;
    }
    else {
        throw new Error("Argument '" + arg + "' must be a Dimensions");
    }
}

function assertArgRational(name: string, arg: QQ): QQ {
    if (arg instanceof QQ) {
        return arg;
    }
    else {
        throw new Error("Argument '" + arg + "' must be a QQ");
    }
}

/**
 * @class Dimensions
 */
class Dimensions {
    /**
     * @property MASS
     * @type {Dimensions}
     * @static
     */
    public static MASS = new Dimensions(R1, R0, R0, R0, R0, R0, R0);
    /**
     * @property LENGTH
     * @type {Dimensions}
     * @static
     */
    public static LENGTH = new Dimensions(R0, R1, R0, R0, R0, R0, R0);
    /**
     * @property TIME
     * @type {Dimensions}
     * @static
     */
    public static TIME = new Dimensions(R0, R0, R1, R0, R0, R0, R0);
    /**
     * @property CHARGE
     * @type {Dimensions}
     * @static
     */
    public static CHARGE = new Dimensions(R0, R0, R0, R1, R0, R0, R0);
    /**
     * @property CURRENT
     * @type {Dimensions}
     * @static
     */
    public static CURRENT = new Dimensions(R0, R0, M1, R1, R0, R0, R0);
    /**
     * @property TEMPERATURE
     * @type {Dimensions}
     * @static
     */
    public static TEMPERATURE = new Dimensions(R0, R0, R0, R0, R1, R0, R0);
    /**
     * @property AMOUNT
     * @type {Dimensions}
     * @static
     */
    public static AMOUNT = new Dimensions(R0, R0, R0, R0, R0, R1, R0);
    /**
     * @property INTENSITY
     * @type {Dimensions}
     * @static
     */
    public static INTENSITY = new Dimensions(R0, R0, R0, R0, R0, R0, R1);
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
    constructor(public M: QQ, public L: QQ, public T: QQ, public Q: QQ, public temperature: QQ, public amount: QQ, public intensity: QQ) {
        assertArgRational('M', M)
        assertArgRational('L', L)
        assertArgRational('T', T)
        assertArgRational('Q', Q)
        assertArgRational('temperature', temperature)
        assertArgRational('amount', amount)
        assertArgRational('intensity', intensity)
        if (arguments.length !== 7) {
            throw new Error("Expecting 7 arguments")
        }
    }
    /**
     * Returns the dimensions if they are all equal, otherwise throws an <code>Error</code>
     * @method compatible
     * @param rhs {Dimensions}
     * @return {Dimensions} <code>this</code>
     */
    compatible(rhs: Dimensions): Dimensions {
        if (this.M.equals(rhs.M) && this.L.equals(rhs.L) && this.T.equals(rhs.T) && this.Q.equals(rhs.Q) && this.temperature.equals(rhs.temperature) && this.amount.equals(rhs.amount) && this.intensity.equals(rhs.intensity)) {
            return this;
        }
        else {
            throw new Error("Dimensions must be equal (" + this + ", " + rhs + ")");
        }
    }
    /**
     * Multiplies dimensions by adding rational exponents.
     * @method mul
     * @param rhs {Dimensions}
     * @return {Dimensions} <code>this * rhs</code>
     */
    mul(rhs: Dimensions): Dimensions {
        return new Dimensions(this.M.add(rhs.M), this.L.add(rhs.L), this.T.add(rhs.T), this.Q.add(rhs.Q), this.temperature.add(rhs.temperature), this.amount.add(rhs.amount), this.intensity.add(rhs.intensity));
    }
    /**
     * Divides dimensions by subtracting rational exponents.
     * @method div
     * @param rhs {Dimensions}
     * @return {Dimensions} <code>this / rhs</code>
     */
    div(rhs: Dimensions): Dimensions {
        return new Dimensions(this.M.sub(rhs.M), this.L.sub(rhs.L), this.T.sub(rhs.T), this.Q.sub(rhs.Q), this.temperature.sub(rhs.temperature), this.amount.sub(rhs.amount), this.intensity.sub(rhs.intensity));
    }
    /**
     * Computes the power function by multiplying rational exponents.
     * @method div
     * @param rhs {Dimensions}
     * @return {Dimensions} <code>pow(this, rhs)</code>
     */
    pow(exponent: QQ): Dimensions {
        return new Dimensions(this.M.mul(exponent), this.L.mul(exponent), this.T.mul(exponent), this.Q.mul(exponent), this.temperature.mul(exponent), this.amount.mul(exponent), this.intensity.mul(exponent));
    }
    /**
     * Computes the square root by dividing each rational component by two.
     * @method sqrt
     * @return {Dimensions}
     */
    sqrt(): Dimensions {
        return new Dimensions(this.M.div(QQ.TWO), this.L.div(QQ.TWO), this.T.div(QQ.TWO), this.Q.div(QQ.TWO), this.temperature.div(QQ.TWO), this.amount.div(QQ.TWO), this.intensity.div(QQ.TWO));
    }
    /**
     * Determines whether the quantity is dimensionless (all rational components must be zero).
     * @method dimensionless
     * @return {boolean}
     */
    dimensionless(): boolean {
        return this.M.isZero() && this.L.isZero() && this.T.isZero() && this.Q.isZero() && this.temperature.isZero() && this.amount.isZero() && this.intensity.isZero();
    }
    /**
     * Determines whether all the components of the Dimensions instance are zero. 
     *
     * @method isZero
     * @return {boolean} <code>true</code> if all the components are zero, otherwise <code>false</code>.
     */
    isZero(): boolean {
        return this.M.isZero() && this.L.isZero() && this.T.isZero() && this.Q.isZero() && this.temperature.isZero() && this.amount.isZero() && this.intensity.isZero();
    }
    /**
     * Computes the inverse by multiplying all exponents by <code>-1</code>.
     * @method negative
     * @return {Dimensions}
     */
    negative(): Dimensions {
        return new Dimensions(this.M.negative(), this.L.negative(), this.T.negative(), this.Q.negative(), this.temperature.negative(), this.amount.negative(), this.intensity.negative());
    }
    /**
     * Creates a representation of this <code>Dimensions</code> instance.
     * @method toString
     * @return {string}
     */
    toString(): string {
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

        return [stringify(this.M, 'mass'), stringify(this.L, 'length'), stringify(this.T, 'time'), stringify(this.Q, 'charge'), stringify(this.temperature, 'thermodynamic temperature'), stringify(this.amount, 'amount of substance'), stringify(this.intensity, 'luminous intensity')].filter(function(x) {
            return typeof x === 'string';
        }).join(" * ");
    }
}

export = Dimensions;
