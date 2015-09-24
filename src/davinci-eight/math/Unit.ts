import Dimensions = require('../math/Dimensions');
import Rational = require('../math/Rational');
import UnitError = require('../math/UnitError');

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

function assertArgRational(name: string, arg: Rational): Rational {
  if (arg instanceof Rational) {
    return arg;
  }
  else {
    throw new UnitError("Argument '" + arg + "' must be a Rational");
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

var dumbString = function(scale: number, dimensions: Dimensions, labels: string[]) {
  assertArgNumber('scale', scale);
  assertArgDimensions('dimensions', dimensions);
    var operatorStr: string;
    var scaleString: string;
    var unitsString: string;
    var stringify = function(rational: Rational, label: string): string {
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

    operatorStr = scale === 1 || dimensions.isZero() ? "" : " ";
    scaleString = scale === 1 ? "" : "" + scale;
    unitsString = [stringify(dimensions.M, labels[0]), stringify(dimensions.L, labels[1]), stringify(dimensions.T, labels[2]), stringify(dimensions.Q, labels[3]), stringify(dimensions.temperature, labels[4]), stringify(dimensions.amount, labels[5]), stringify(dimensions.intensity, labels[6])].filter(function(x) {
        return typeof x === 'string';
    }).join(" ");
    return "" + scaleString + operatorStr + unitsString;
};

var unitString = function(scale: number, dimensions: Dimensions, labels: string[]): string {
    var patterns =
    [
      [-1,1,-3,1, 2,1, 2,1, 0,1, 0,1, 0,1],
      [-1,1,-2,1, 1,1, 2,1, 0,1, 0,1, 0,1],
      [-1,1,-2,1, 2,1, 2,1, 0,1, 0,1, 0,1],
      [-1,1, 3,1,-2,1, 0,1, 0,1, 0,1, 0,1],
      [ 0,1, 0,1,-1,1, 0,1, 0,1, 0,1, 0,1],
      [ 0,1, 0,1,-1,1, 1,1, 0,1, 0,1, 0,1],
      [ 0,1, 1,1,-2,1, 0,1, 0,1, 0,1, 0,1],
      [ 0,1, 1,1,-1,1, 0,1, 0,1, 0,1, 0,1],
      [ 1,1, 1,1,-1,1, 0,1, 0,1, 0,1, 0,1],
      [ 1,1,-1,1,-2,1, 0,1, 0,1, 0,1, 0,1],
      [ 1,1,-1,1,-1,1, 0,1, 0,1, 0,1, 0,1],
      [ 1,1, 0,1,-3,1, 0,1, 0,1, 0,1, 0,1],
      [ 1,1, 0,1,-2,1, 0,1, 0,1, 0,1, 0,1],
      [ 1,1, 0,1,-1,1,-1,1, 0,1, 0,1, 0,1],
      [ 1,1, 1,1,-3,1, 0,1,-1,1, 0,1, 0,1],
      [ 1,1, 1,1,-2,1,-1,1, 0,1, 0,1, 0,1],
      [ 1,1, 1,1,-2,1, 0,1, 0,1, 0,1, 0,1],
      [ 1,1, 1,1, 0,1,-2,1, 0,1, 0,1, 0,1],
      [ 1,1, 2,1,-2,1, 0,1,-1,1, 0,1, 0,1],
      [ 0,1, 2,1,-2,1, 0,1,-1,1, 0,1, 0,1],
      [ 1,1, 2,1,-2,1, 0,1,-1,1,-1,1, 0,1],
      [ 1,1, 2,1,-2,1, 0,1, 0,1,-1,1, 0,1],
      [ 1,1, 2,1,-2,1, 0,1, 0,1, 0,1, 0,1],
      [ 1,1, 2,1,-1,1, 0,1, 0,1, 0,1, 0,1],
      [ 1,1, 2,1,-3,1, 0,1, 0,1, 0,1, 0,1],
      [ 1,1, 2,1,-2,1,-1,1, 0,1, 0,1, 0,1],
      [ 1,1, 2,1,-1,1,-2,1, 0,1, 0,1, 0,1],
      [ 1,1, 2,1, 0,1,-2,1, 0,1, 0,1, 0,1],
      [ 1,1, 2,1,-1,1,-1,1, 0,1, 0,1, 0,1]
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
    var M           = dimensions.M;
    var L           = dimensions.L;
    var T           = dimensions.T;
    var Q           = dimensions.Q;
    var temperature = dimensions.temperature;
    var amount      = dimensions.amount;
    var intensity   = dimensions.intensity;
    for (var i = 0, len = patterns.length; i < len; i++)
    {
        var pattern = patterns[i];
        if (M.numer           === pattern[0]  && M.denom           === pattern[1]  &&
            L.numer           === pattern[2]  && L.denom           === pattern[3]  &&
            T.numer           === pattern[4]  && T.denom           === pattern[5]  &&
            Q.numer           === pattern[6]  && Q.denom           === pattern[7]  &&
            temperature.numer === pattern[8]  && temperature.denom === pattern[9]  &&
            amount.numer      === pattern[10] && amount.denom      === pattern[11] &&
            intensity.numer   === pattern[12] && intensity.denom   === pattern[13])
        {
            if (scale !== 1)
            {
               return scale + " * " + decodes[i][0];
            }
            else
            {
              return decodes[i][0];
            }
        }
    }
    return dumbString(scale, dimensions, labels);
};

function add(lhs: Unit, rhs: Unit): Unit
{
  return new Unit(lhs.scale + rhs.scale, lhs.dimensions.compatible(rhs.dimensions), lhs.labels);
}

function sub(lhs: Unit, rhs: Unit): Unit
{
  return new Unit(lhs.scale - rhs.scale, lhs.dimensions.compatible(rhs.dimensions), lhs.labels);
}

function mul(lhs: Unit, rhs: Unit): Unit
{
  return new Unit(lhs.scale * rhs.scale, lhs.dimensions.mul(rhs.dimensions), lhs.labels);
}

function scalarMultiply(alpha: number, unit: Unit): Unit
{
  return new Unit(alpha * unit.scale, unit.dimensions, unit.labels);
}

function div(lhs: Unit, rhs: Unit): Unit
{
  return new Unit(lhs.scale / rhs.scale, lhs.dimensions.div(rhs.dimensions), lhs.labels);
}

class Unit {
    /**
     * The Unit class represents the units for a measure.
     *
     * @class Unit
     * @constructor
     * @param {number} scale
     * @param {Dimensions} dimensions
     * @param {string[]} labels The label strings to use for each dimension.
     */
    constructor(public scale: number, public dimensions: Dimensions, public labels: string[]) {
        if (labels.length !== 7) {
            throw new Error("Expecting 7 elements in the labels array.");
        }
        this.scale = scale;
        this.dimensions = dimensions;
        this.labels = labels;
    }

    compatible(rhs: Unit): Unit {
      if (rhs instanceof Unit) {
        this.dimensions.compatible(rhs.dimensions);
        return this;
      }
      else {
        throw new Error("Illegal Argument for Unit.compatible: " + rhs);
      }
    }

    add(rhs: Unit): Unit
    {
      assertArgUnit('rhs', rhs);
      return add(this, rhs);
    }

    __add__(other: any)
    {
      if (other instanceof Unit)
      {
        return add(this, other);
      }
      else
      {
        return;
      }
    }

    __radd__(other: any)
    {
      if (other instanceof Unit)
      {
        return add(other, this);
      }
      else
      {
        return;
      }
    }

    sub(rhs: Unit): Unit
    {
      assertArgUnit('rhs', rhs);
      return sub(this, rhs);
    }

    __sub__(other: any)
    {
      if (other instanceof Unit)
      {
        return sub(this, other);
      }
      else
      {
        return;
      }
    }

    __rsub__(other: any)
    {
      if (other instanceof Unit)
      {
        return sub(other, this);
      }
      else
      {
        return;
      }
    }

    mul(rhs: any): Unit
    {
      assertArgUnit('rhs', rhs);
      return mul(this, rhs);
    }

    __mul__(other: any)
    {
      if (other instanceof Unit)
      {
        return mul(this, other);
      }
      else if (typeof other === 'number')
      {
        return scalarMultiply(other, this);
      }
      else
      {
        return;
      }
    }

    __rmul__(other: any)
    {
      if (other instanceof Unit)
      {
        return mul(other, this);
      }
      else if (typeof other === 'number')
      {
        return scalarMultiply(other, this);
      }
      else
      {
        return;
      }
    }

    div(rhs: Unit): Unit
    {
      assertArgUnit('rhs', rhs);
      return div(this, rhs);
    }

    __div__(other: any)
    {
      if (other instanceof Unit)
      {
        return div(this, other);
      }
      else if (typeof other === 'number')
      {
        return new Unit(this.scale / other, this.dimensions, this.labels);
      }
      else
      {
        return;
      }
    }

    __rdiv__(other: any)
    {
      if (other instanceof Unit)
      {
        return div(other, this);
      }
      else if (typeof other === 'number')
      {
        return new Unit(other / this.scale, this.dimensions.negative(), this.labels);
      }
      else
      {
        return;
      }
    }

    pow(exponent: Rational): Unit
    {
      assertArgRational('exponent', exponent);
      return new Unit(Math.pow(this.scale, exponent.numer/exponent.denom), this.dimensions.pow(exponent), this.labels);
    }

    inverse(): Unit
    {
      return new Unit(1 / this.scale, this.dimensions.negative(), this.labels);
    }

    isUnity(): boolean {
      return this.dimensions.dimensionless() && (this.scale === 1);
    } 

    norm(): Unit {
      return new Unit(Math.abs(this.scale), this.dimensions, this.labels);
    }

    quad(): Unit {
      return new Unit(this.scale * this.scale, this.dimensions.mul(this.dimensions), this.labels);
    }

    toString(): string
    {
      return unitString(this.scale, this.dimensions, this.labels);
    }

    static isUnity(uom: Unit): boolean {
      if (typeof uom === 'undefined') {
        return true;
      }
      else if (uom instanceof Unit) {
        return uom.isUnity();
      }
      else {
        throw new Error("isUnity argument must be a Unit or undefined.");
      }
    }

    static assertDimensionless(uom: Unit) {
      if (!Unit.isUnity(uom)) {
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
          if (lhs.isUnity()) {
            return void 0;
          }
          else {
            throw new UnitError(lhs + " is incompatible with 1");
          }
        }
      }
      else {
        if (rhs) {
          if (rhs.isUnity()) {
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
        else if (Unit.isUnity(rhs)) {
          return lhs;
        }
        else {
          return void 0;
        }
      }
      else if (Unit.isUnity(lhs)) {
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
          return rhs.inverse();
        }
        else {
          return void 0;
        }
      }
    }

    static sqrt(uom: Unit): Unit {
      if (typeof uom !== 'undefined') {
        assertArgUnit('uom', uom);
        if (!uom.isUnity()) {
          return new Unit(Math.sqrt(uom.scale), uom.dimensions.sqrt(), uom.labels);
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
export = Unit;