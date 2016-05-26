import DivisionRingOperators from '../math/DivisionRingOperators';
import {QQ} from '../math/QQ';
import notSupported from '../i18n/notSupported';

const R0 = QQ.valueOf(0, 1)
const R1 = QQ.valueOf(1, 1)
const R2 = QQ.valueOf(2, 1)
const M1 = QQ.valueOf(-1, 1)

function assertArgRational(name: string, arg: QQ): QQ {
    if (arg instanceof QQ) {
        return arg;
    }
    else {
        throw new Error("Argument '" + arg + "' must be a QQ");
    }
}

/**
 * Keeps track of the dimensions of a physical quantity using seven rational exponents.
 * Each of the exponents corresponds to a dimension in the S.I. system of units.
 */
export class Dimensions implements DivisionRingOperators<Dimensions, Dimensions> {

    /**
     * All exponents are zero, a dimensionless quantity.
     */
    public static ONE = new Dimensions(R0, R0, R0, R0, R0, R0, R0);

    /**
     * M<sup>1</sup>
     */
    public static MASS = new Dimensions(R1, R0, R0, R0, R0, R0, R0);

    /**
     * L<sup>1</sup>
     */
    public static LENGTH = new Dimensions(R0, R1, R0, R0, R0, R0, R0);

    /**
     * T<sup>1</sup>
     */
    public static TIME = new Dimensions(R0, R0, R1, R0, R0, R0, R0);

    /**
     * Q<sup>1</sup>
     */
    public static CHARGE = new Dimensions(R0, R0, R0, R1, R0, R0, R0);

    /**
     * Q<sup>1</sup>T<sup>-1<sup>
     */
    public static CURRENT = new Dimensions(R0, R0, M1, R1, R0, R0, R0);

    /**
     *
     */
    public static TEMPERATURE = new Dimensions(R0, R0, R0, R0, R1, R0, R0);

    /**
     *
     */
    public static AMOUNT = new Dimensions(R0, R0, R0, R0, R0, R1, R0);

    /**
     *
     */
    public static INTENSITY = new Dimensions(R0, R0, R0, R0, R0, R0, R1);

    /**
     * The Dimensions class captures the physical dimensions associated with a unit of measure.
     *
     * @param M The mass component of the dimensions object.
     * @param L The length component of the dimensions object.
     * @param T The time component of the dimensions object.
     * @param Q The charge component of the dimensions object.
     * @param temperature The temperature component of the dimensions object.
     * @param amount The amount component of the dimensions object.
     * @param intensity The intensity component of the dimensions object.
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
     *
     * @param rhs
     * @returns
     */
    compatible(rhs: Dimensions): Dimensions {
        if (this.M.equals(rhs.M) && this.L.equals(rhs.L) && this.T.equals(rhs.T) && this.Q.equals(rhs.Q) && this.temperature.equals(rhs.temperature) && this.amount.equals(rhs.amount) && this.intensity.equals(rhs.intensity)) {
            return this
        }
        else {
            if (this.isOne()) {
                if (rhs.isOne()) {
                    throw new Error()
                }
                else {
                    throw new Error("Dimensions must be equal (dimensionless, " + rhs + ")")
                }
            }
            else {
                if (rhs.isOne()) {
                    throw new Error("Dimensions must be equal (" + this + ", dimensionless)")
                }
                else {
                    throw new Error("Dimensions must be equal (" + this + ", " + rhs + ")")
                }
            }
        }
    }

    /**
     * Multiplies dimensions by adding rational exponents.
     *
     * @param rhs
     * @returns <code>this * rhs</code>
     */
    mul(rhs: Dimensions): Dimensions {
        return new Dimensions(this.M.add(rhs.M), this.L.add(rhs.L), this.T.add(rhs.T), this.Q.add(rhs.Q), this.temperature.add(rhs.temperature), this.amount.add(rhs.amount), this.intensity.add(rhs.intensity));
    }

    /**
     * Divides dimensions by subtracting rational exponents.
     *
     * @param rhs
     * @returns <code>this / rhs</code>
     */
    div(rhs: Dimensions): Dimensions {
        return new Dimensions(this.M.sub(rhs.M), this.L.sub(rhs.L), this.T.sub(rhs.T), this.Q.sub(rhs.Q), this.temperature.sub(rhs.temperature), this.amount.sub(rhs.amount), this.intensity.sub(rhs.intensity));
    }

    /**
     * Computes the power function by multiplying rational exponents.
     *
     * @param rhs
     * @returns <code>pow(this, rhs)</code>
     */
    pow(exponent: QQ): Dimensions {
        return new Dimensions(this.M.mul(exponent), this.L.mul(exponent), this.T.mul(exponent), this.Q.mul(exponent), this.temperature.mul(exponent), this.amount.mul(exponent), this.intensity.mul(exponent));
    }

    /**
     * Computes the square root by dividing each rational component by two.
     *
     * @returns
     */
    sqrt(): Dimensions {
        return new Dimensions(this.M.div(R2), this.L.div(R2), this.T.div(R2), this.Q.div(R2), this.temperature.div(R2), this.amount.div(R2), this.intensity.div(R2));
    }

    /**
     * Determines whether all the exponents of this dimensions number are zero.
     * This implies a dimensionless quantity. 
     *
     * @returns <code>true</code> if all the exponents are zero, otherwise <code>false</code>.
     */
    isOne(): boolean {
        return this.M.isZero() && this.L.isZero() && this.T.isZero() && this.Q.isZero() && this.temperature.isZero() && this.amount.isZero() && this.intensity.isZero();
    }

    /**
     * Intentionally undocumented.
     */
    isZero(): boolean {
        throw new Error(notSupported('isZero').message)
    }

    /**
     * Computes the multiplicative inverse of this dimensions number.
     * This is achived by changing the signs of all the exponent quantities.
     *
     * @returns
     */
    inv(): Dimensions {
        return new Dimensions(this.M.neg(), this.L.neg(), this.T.neg(), this.Q.neg(), this.temperature.neg(), this.amount.neg(), this.intensity.neg());
    }

    /**
     * Intentionally undocumented.
     */
    neg(): Dimensions {
        throw new Error(notSupported('neg').message)
    }

    /**
     * Creates a representation of this <code>Dimensions</code> instance.
     *
     * @returns
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

    /**
     * @param rhs
     * @returns
     */
    __add__(rhs: Dimensions): Dimensions {
        if (rhs instanceof Dimensions) {
            return this.compatible(rhs)
        }
        else {
            return void 0
        }
    }

    /**
     * @param lhs
     * @returns
     */
    __radd__(lhs: Dimensions): Dimensions {
        if (lhs instanceof Dimensions) {
            return lhs.compatible(this)
        }
        else {
            return void 0
        }
    }

    /**
     *
     * @param rhs
     * @returns
     */
    __sub__(rhs: Dimensions): Dimensions {
        if (rhs instanceof Dimensions) {
            return this.compatible(rhs)
        }
        else {
            return void 0
        }
    }

    /**
     *
     * @param lhs
     * @returns
     */
    __rsub__(lhs: Dimensions): Dimensions {
        if (lhs instanceof Dimensions) {
            return lhs.compatible(this)
        }
        else {
            return void 0
        }
    }

    /**
     *
     * @param rhs
     * @returns
     */
    __mul__(rhs: Dimensions): Dimensions {
        if (rhs instanceof Dimensions) {
            return this.mul(rhs)
        }
        else {
            return void 0
        }
    }

    /**
     *
     * @param lhs
     * @returns
     */
    __rmul__(lhs: Dimensions): Dimensions {
        if (lhs instanceof Dimensions) {
            return lhs.mul(this)
        }
        else {
            return void 0
        }
    }

    /**
     *
     * @param rhs
     * @returns
     */
    __div__(rhs: Dimensions): Dimensions {
        if (rhs instanceof Dimensions) {
            return this.div(rhs)
        }
        else {
            return void 0
        }
    }

    /**
     * @param lhs
     * @returns
     */
    __rdiv__(lhs: Dimensions): Dimensions {
        if (lhs instanceof Dimensions) {
            return lhs.div(this)
        }
        else {
            return void 0
        }
    }

    /**
     * @returns
     */
    __pos__(): Dimensions {
        return this
    }

    /**
     *
     * @returns
     */
    __neg__(): Dimensions {
        return this
    }
}
