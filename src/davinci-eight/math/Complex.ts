import ComplexError = require('../math/ComplexError');
import Measure = require('../math/Measure');
import Unit = require('../math/Unit');
import mathcore = require('../math/mathcore');

var cos  = Math.cos;
var cosh = mathcore.Math.cosh;
var exp  = Math.exp;
var sin  = Math.sin;
var sinh = mathcore.Math.sinh;

function assertArgNumber(name: string, x: number): number {
  if (typeof x === 'number') {
    return x;
  }
  else {
    throw new ComplexError("Argument '" + name + "' must be a number");
  }
}

function assertArgComplex(name: string, arg: Complex): Complex {
  if (arg instanceof Complex) {
    return arg;
  }
  else {
    throw new ComplexError("Argument '" + arg + "' must be a Complex");
  }
}

function assertArgUnitOrUndefined(name: string, uom: Unit): Unit {
  if (typeof uom === 'undefined' || uom instanceof Unit) {
    return uom;
  }
  else {
    throw new ComplexError("Argument '" + uom + "' must be a Unit or undefined");
  }
}

function multiply(a: Complex, b: Complex): Complex {
  assertArgComplex('a', a);
  assertArgComplex('b', b);
  var x = a.x * b.x - a.y * b.y;
  var y = a.x * b.y + a.y * b.x;
  return new Complex(x, y, Unit.mul(a.uom, b.uom));
}

function divide(a: Complex, b: Complex): Complex {
  assertArgComplex('a', a);
  assertArgComplex('b', b);
  var q = b.x * b.x + b.y * b.y;
  var x = (a.x * b.x + a.y * b.y) / q;
  var y = (a.y * b.x - a.x * b.y) / q;
  return new Complex(x, y, Unit.div(a.uom, b.uom));
}

function norm(x: number, y: number): number {
  return Math.sqrt(x * x + y * y);
}

class Complex implements Measure<Complex> {
    /**
     * The real part of the complex number.
     */
    public x: number;
    /**
     * The imaginary part of the complex number.
     */
    public y: number;
    /**
     * The optional unit of measure.
     */
    public uom: Unit;
    /**
     * Constructs a complex number z = (x, y).
     * @param x The real part of the complex number.
     * @param y The imaginary part of the complex number.
     */
    constructor(x: number, y: number, uom?: Unit) {
      this.x = assertArgNumber('x', x);
      this.y = assertArgNumber('y', y);
      this.uom = assertArgUnitOrUndefined('uom', uom);
      if (this.uom && this.uom.scale !== 1) {
        var scale: number = this.uom.scale;
        this.x *= scale;
        this.y *= scale;
        this.uom = new Unit(1, uom.dimensions, uom.labels);
      }
    }

    coordinates(): number[] {
      return [this.x, this.y];
    }

    add(rhs: Complex): Complex {
      assertArgComplex('rhs', rhs);
      return new Complex(this.x + rhs.x, this.y + rhs.y, Unit.compatible(this.uom, rhs.uom));
    }

    /**
     * __add__ supports operator +(Complex, any)
     */
    __add__(other: any): Complex {
      if (other instanceof Complex) {
        return this.add(other);
      }
      else if (typeof other === 'number') {
        return new Complex(this.x + other, this.y, Unit.compatible(this.uom, undefined));
      }
    }

    /**
     * __radd__ supports operator +(any, Complex)
     */
    __radd__(other: any): Complex
    {
      if (other instanceof Complex)
      {
        var lhs: Complex = other;
        return new Complex(other.x + this.x, other.y + this.y, Unit.compatible(lhs.uom, this.uom));
      }
      else if (typeof other === 'number')
      {
        var x: number = other;
        return new Complex(x + this.x, this.y, Unit.compatible(undefined, this.uom));
      }
    }

    sub(rhs: Complex): Complex {
      assertArgComplex('rhs', rhs);
      return new Complex(this.x - rhs.x, this.y - rhs.y, Unit.compatible(this.uom, rhs.uom));
    }

    __sub__(other: any): Complex
    {
      if (other instanceof Complex)
      {
        var rhs: Complex = other;
        return new Complex(this.x - rhs.x, this.y - rhs.y, Unit.compatible(this.uom, rhs.uom));
      }
      else if (typeof other === 'number')
      {
        var x: number = other;
        return new Complex(this.x - x, this.y, Unit.compatible(this.uom, undefined));
      }
    }

    __rsub__(other: any): Complex
    {
      if (other instanceof Complex)
      {
        var lhs: Complex = other;
        return new Complex(lhs.x - this.x, lhs.y - this.y, Unit.compatible(lhs.uom, this.uom));
      }
      else if (typeof other === 'number')
      {
        var x: number = other;
        return new Complex(x - this.x, -this.y, Unit.compatible(undefined, this.uom));
      }
    }

    mul(rhs: Complex): Complex {
      assertArgComplex('rhs', rhs);
      return multiply(this, rhs);
    }

    __mul__(other: any): Complex {
      if (other instanceof Complex) {
        return multiply(this, other);
      }
      else if (typeof other === 'number') {
        var x: number = other;
        return new Complex(this.x * x, this.y * x, this.uom);
      }
    }

    __rmul__(other: any): Complex {
      if (other instanceof Complex) {
        return multiply(other, this);
      }
      else if (typeof other === 'number') {
        var x: number = other;
        return new Complex(x * this.x, x * this.y, this.uom);
      }
    }

    div(rhs: Complex): Complex {
      assertArgComplex('rhs', rhs);
      return divide(this, rhs);
    }

    __div__(other: any): Complex {
      if (other instanceof Complex) {
        return divide(this, other);
      }
      else if (typeof other === 'number') {
        return new Complex(this.x / other, this.y / other, this.uom);
      }
    }

    __rdiv__(other: any): Complex {
      if (other instanceof Complex) {
        return divide(other, this);
      }
      else if (typeof other === 'number') {
        return divide(new Complex(other, 0), this);
      }
    }

    wedge(rhs: Complex): Complex {
      // assertArgComplex('rhs', rhs);
      throw new ComplexError('wedge');
    }

    lshift(rhs: Complex): Complex {
      // assertArgComplex('rhs', rhs);
      throw new ComplexError('lshift');
    }

    rshift(rhs: Complex): Complex {
      // assertArgComplex('rhs', rhs);
      throw new ComplexError('rshift');
    }

    pow(exponent: Complex): Complex {
      // assertArgComplex('rhs', rhs);
      throw new ComplexError('pow');
    }

    cos(): Complex {
      Unit.assertDimensionless(this.uom);
      var x = this.x;
      var y = this.y;
      return new Complex(cos(x) * cosh(y), - sin(x) * sinh(y));
    }

    cosh(): Complex {
      Unit.assertDimensionless(this.uom);
      var x = this.x;
      var y = this.y;
      return new Complex(cosh(x) * cos(y), sinh(x) * sin(y));
    }

    exp(): Complex {
      Unit.assertDimensionless(this.uom);
      var x = this.x;
      var y = this.y;
      var expX = Math.exp(x);
      return new Complex(expX * cos(y), expX * sin(y));
    }

    norm(): Complex {
      var x = this.x;
      var y = this.y;
      return new Complex(Math.sqrt(x * x + y * y), 0, this.uom);
    }

    quad(): Complex {
      var x = this.x;
      var y = this.y;
      return new Complex(x * x + y * y, 0, Unit.mul(this.uom, this.uom));
    }

    sin(): Complex {
      Unit.assertDimensionless(this.uom);
      var x = this.x;
      var y = this.y;
      return new Complex(sin(x) * cosh(y), cos(x) * sinh(y));
    }

    sinh(): Complex {
      Unit.assertDimensionless(this.uom);
      var x = this.x;
      var y = this.y;
      return new Complex(sinh(x) * cos(y), cosh(x) * sin(y));
    }

    unit(): Complex {
      var x = this.x;
      var y = this.y;
      var divisor = norm(x, y);
      return new Complex(x / divisor, y / divisor);
    }

    scalar(): number {
      return this.x;
    }

    arg(): number {
      return Math.atan2(this.y, this.x);
    }

    toStringCustom(coordToString: (x: number) => string): string {
      var quantityString = "Complex(" + coordToString(this.x) + ", " + coordToString(this.y) + ")";
      if (this.uom) {
        var uomString = this.uom.toString().trim();
        if (uomString) {
          return quantityString + ' ' + uomString;
        }
        else {
          return quantityString;
        }
      }
      else {
        return quantityString;
      }
    }

    toExponential(): string {
      return this.toStringCustom(function(coord: number) { return coord.toExponential();});
    }

    toFixed(digits?: number): string {
      return this.toStringCustom(function(coord: number) { return coord.toFixed(digits);});
    }

    toString(): string {
      return this.toStringCustom(function(coord: number) { return coord.toString();});
    }
}

export = Complex;
