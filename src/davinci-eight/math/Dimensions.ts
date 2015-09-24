import DimensionError = require('../math/DimensionError')
import QQ = require('../math/QQ')

var R0 = QQ.ZERO;
var R1 = QQ.ONE;

function assertArgNumber(name: string, x: number): number {
  if (typeof x === 'number') {
    return x;
  }
  else {
    throw new DimensionError("Argument '" + name + "' must be a number");
  }
}

function assertArgDimensions(name: string, arg: Dimensions): Dimensions {
  if (arg instanceof Dimensions) {
    return arg;
  }
  else {
    throw new DimensionError("Argument '" + arg + "' must be a Dimensions");
  }
}

function assertArgRational(name: string, arg: QQ): QQ {
  if (arg instanceof QQ) {
    return arg;
  }
  else {
    throw new DimensionError("Argument '" + arg + "' must be a QQ");
  }
}

class Dimensions {
    public static MASS   = new Dimensions(R1, R0, R0, R0, R0, R0, R0);
    public static LENGTH = new Dimensions(R0, R1, R0, R0, R0, R0, R0);
    public static TIME   = new Dimensions(R0, R0, R1, R0, R0, R0, R0);

    private _mass: QQ;
    /**
     * The Dimensions class captures the physical dimensions associated with a unit of measure.
     *
     * @class Dimensions
     * @constructor
     * @param {QQ} mass The mass component of the dimensions object.
     * @param {QQ} length The length component of the dimensions object.
     * @param {QQ} time The time component of the dimensions object.
     * @param {QQ} charge The charge component of the dimensions object.
     * @param {QQ} temperature The temperature component of the dimensions object.
     * @param {QQ} amount The amount component of the dimensions object.
     * @param {QQ} intensity The intensity component of the dimensions object.
     */
    constructor(theMass: QQ, public L: any, public T: any, public Q: any, public temperature: any, public amount: any, public intensity: any) {
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
            this.L = new QQ(length, 1);
        } else if (length instanceof QQ) {
            this.L = length;
        } else {
            throw {
                name: "DimensionError",
                message: "length must be a QQ or number"
            };
        }
        if (typeof time === 'number') {
            this.T = new QQ(time, 1);
        } else if (time instanceof QQ) {
            this.T = time;
        } else {
            throw {
                name: "DimensionError",
                message: "time must be a QQ or number"
            };
        }
        if (typeof charge === 'number') {
            this.Q = new QQ(charge, 1);
        } else if (charge instanceof QQ) {
            this.Q = charge;
        } else {
            throw {
                name: "DimensionError",
                message: "charge must be a QQ or number"
            };
        }
        if (typeof temperature === 'number') {
            this.temperature = new QQ(temperature, 1);
        } else if (temperature instanceof QQ) {
            this.temperature = temperature;
        } else {
            throw {
                name: "DimensionError",
                message: "(thermodynamic) temperature must be a QQ or number"
            };
        }
        if (typeof amount === 'number') {
            this.amount = new QQ(amount, 1);
        } else if (amount instanceof QQ) {
            this.amount = amount;
        } else {
            throw {
                name: "DimensionError",
                message: "amount (of substance) must be a QQ or number"
            };
        }
        if (typeof intensity === 'number') {
            this.intensity = new QQ(intensity, 1);
        } else if (intensity instanceof QQ) {
            this.intensity = intensity;
        } else {
            throw {
                name: "DimensionError",
                message: "(luminous) intensity must be a QQ or number"
            };
        }
    }

    /**
    * The <em>mass</em> component of this dimensions instance. 
    * 
    * @property M
    * @type {QQ}
    */
    get M(): QQ {
        return this._mass;
    }

    compatible(rhs: Dimensions): Dimensions {
      if (this._mass.equals(rhs._mass) && this.L.equals(rhs.L) && this.T.equals(rhs.T) && this.Q.equals(rhs.Q) && this.temperature.equals(rhs.temperature) && this.amount.equals(rhs.amount) && this.intensity.equals(rhs.intensity)) {
        return this;
      }
      else {
        throw new DimensionError("Dimensions must be equal (" + this + ", " + rhs + ")");
      }
    }

    mul(rhs: Dimensions): Dimensions {
        return new Dimensions(this._mass.add(rhs._mass), this.L.add(rhs.L), this.T.add(rhs.T), this.Q.add(rhs.Q), this.temperature.add(rhs.temperature), this.amount.add(rhs.amount), this.intensity.add(rhs.intensity));
    }

    div(rhs: Dimensions): Dimensions {
      return new Dimensions(this._mass.sub(rhs._mass), this.L.sub(rhs.L), this.T.sub(rhs.T), this.Q.sub(rhs.Q), this.temperature.sub(rhs.temperature), this.amount.sub(rhs.amount), this.intensity.sub(rhs.intensity));
    }

    pow(exponent: QQ): Dimensions {
      return new Dimensions(this._mass.mul(exponent), this.L.mul(exponent), this.T.mul(exponent), this.Q.mul(exponent), this.temperature.mul(exponent), this.amount.mul(exponent), this.intensity.mul(exponent));
    }

    sqrt(): Dimensions {
      return new Dimensions(this._mass.div(QQ.TWO), this.L.div(QQ.TWO), this.T.div(QQ.TWO), this.Q.div(QQ.TWO), this.temperature.div(QQ.TWO), this.amount.div(QQ.TWO), this.intensity.div(QQ.TWO));
    }

    dimensionless(): boolean {
      return this._mass.isZero() && this.L.isZero() && this.T.isZero() && this.Q.isZero() && this.temperature.isZero() && this.amount.isZero() && this.intensity.isZero();
    }

    /**
    * Determines whether all the components of the Dimensions instance are zero. 
    *
    * @method isZero
    * @return {boolean} <code>true</code> if all the components are zero, otherwise <code>false</code>.
    */
    isZero(): boolean {
      return this._mass.isZero() && this.L.isZero() && this.T.isZero() && this.Q.isZero() && this.temperature.isZero() && this.amount.isZero() && this.intensity.isZero();
    }

    negative(): Dimensions {
      return new Dimensions(this._mass.negative(), this.L.negative(), this.T.negative(), this.Q.negative(), this.temperature.negative(), this.amount.negative(), this.intensity.negative());
    }

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

        return [stringify(this._mass, 'mass'), stringify(this.L, 'length'), stringify(this.T, 'time'), stringify(this.Q, 'charge'), stringify(this.temperature, 'thermodynamic temperature'), stringify(this.amount, 'amount of substance'), stringify(this.intensity, 'luminous intensity')].filter(function(x) {
            return typeof x === 'string';
        }).join(" * ");
    }
}
export = Dimensions;
