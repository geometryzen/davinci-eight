import Dimensions = require('davinci-blade/Dimensions');
import Rational = require('davinci-blade/Rational');

var dumbString = function(scale: number, dimensions: Dimensions, labels: string[]) {
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

    compatible(rhs: Unit) {
        var dimensions;

        if (rhs instanceof Unit) {
            dimensions = this.dimensions.compatible(rhs.dimensions);
            return this;
        } else {
            throw new Error("Illegal Argument for Unit.compatible: " + rhs);
        }
    }

    add(rhs: Unit): Unit
    {
        if (rhs instanceof Unit)
        {
            return add(this, rhs);
        }
        else
        {
            throw new Error("Illegal Argument for Unit.add: " + rhs);
        }
    }

    __add__(other)
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

    __radd__(other)
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
      if (rhs instanceof Unit)
      {
        return sub(this, rhs);
      }
      else
      {
          throw new Error("Illegal Argument for Unit.sub: " + rhs);
      }
    }

    __sub__(other)
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

    __rsub__(other)
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
      if (typeof rhs === 'number')
      {
        return scalarMultiply(rhs, this);
      }
      else if (rhs instanceof Unit)
      {
        return mul(this, rhs);
      }
      else
      {
        throw new Error("Illegal Argument for mul: " + rhs);
      }
    }

    __mul__(other)
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

    __rmul__(other)
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

    div(rhs: any): Unit
    {
      if (typeof rhs === 'number')
      {
        return new Unit(this.scale / rhs, this.dimensions, this.labels);
      }
      else if (rhs instanceof Unit)
      {
        return div(this, rhs);
      }
      else
      {
        throw new Error("Illegal Argument for div: " + rhs);
      }
    }

    __div__(other)
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

    __rdiv__(other)
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

    pow(rhs: number): Unit
    {
      if (typeof rhs === 'number')
      {
          return new Unit(Math.pow(this.scale, rhs), this.dimensions.pow(rhs), this.labels);
      }
      else
      {
          throw new Error("Illegal Argument for div: " + rhs);
      }
    }

    inverse(): Unit
    {
        return new Unit(1 / this.scale, this.dimensions.negative(), this.labels);
    }

    toString(): string
    {
        return unitString(this.scale, this.dimensions, this.labels);
    }
}
export = Unit;