// TODO: Add special methods and unit of measure.
//import Unit = require('../math/Unit');
import QQError = require('../math/QQError')

function assertArgNumber(name: string, x: number): number {
  if (typeof x === 'number') {
    return x;
  }
  else {
    throw new QQError("Argument '" + name + "' must be a number");
  }
}

function assertArgRational(name: string, arg: QQ): QQ {
  if (arg instanceof QQ) {
    return arg;
  }
  else {
    throw new QQError("Argument '" + arg + "' must be a QQ");
  }
}
/*
function assertArgUnitOrUndefined(name: string, uom: Unit): Unit {
  if (typeof uom === 'undefined' || uom instanceof Unit) {
    return uom;
  }
  else {
    throw new QQError("Argument '" + uom + "' must be a Unit or undefined");
  }
}
*/
class QQ {
  private _numer: number;
  private _denom: number;

  /**
   * The QQ class represents a rational number.
   *
   * @class QQ
   * @extends Field
   * @constructor
   * @param {number} n The numerator.
   * @param {number} d The denominator.
   */
  constructor(n: number, d: number) {
    assertArgNumber('n', n);
    assertArgNumber('d', d);
    var g: number;

    var gcd = function(a: number, b: number) {
      assertArgNumber('a', a);
      assertArgNumber('b', b);
      var temp: number;

      if (a < 0) {
          a = -a;
      }
      if (b < 0) {
          b = -b;
      }
      if (b > a) {
          temp = a;
          a = b;
          b = temp;
      }
      while (true) {
          a %= b;
          if (a === 0) {
              return b;
          }
          b %= a;
          if (b === 0) {
              return a;
          }
      }
    };

    if (d === 0) {
      throw new Error("denominator must not be zero");
    }
    if (n === 0) {
      g = 1;
    }
    else {
      g = gcd(Math.abs(n), Math.abs(d));
    }
    if (d < 0) {
      n = -n;
      d = -d;
    }
    this._numer = n / g;
    this._denom = d / g;
  }

  get numer(): number {
    return this._numer;
  }

  get denom(): number {
    return this._denom;
  }

  add(rhs: QQ): QQ {
    assertArgRational('rhs', rhs);
    return new QQ(this._numer * rhs._denom + this._denom * rhs._numer, this._denom * rhs._denom);
  }

  sub(rhs: QQ): QQ {
    assertArgRational('rhs', rhs);
    return new QQ(this._numer * rhs._denom - this._denom * rhs._numer, this._denom * rhs._denom);
  }

  mul(rhs: QQ): QQ {
    assertArgRational('rhs', rhs);
    return new QQ(this._numer * rhs._numer, this._denom * rhs._denom);
  }

  // TODO: div testing
  div(rhs: any): QQ {
    if (typeof rhs === 'number') {
        return new QQ(this._numer, this._denom * rhs);
    }
    else {
        return new QQ(this._numer * rhs._denom, this._denom * rhs._numer);
    }
  }

  isZero(): boolean {
    return this._numer === 0;
  }

  negative(): QQ {
    return new QQ(-this._numer, this._denom);
  }

  equals(other: any): boolean {
    if (other instanceof QQ) {
        return this._numer * other._denom === this._denom * other._numer;
    }
    else {
        return false;
    }
  }

  toString(): string {
    return "" + this._numer + "/" + this._denom;
  }

  static ONE: QQ = new QQ(1, 1);
  static TWO: QQ = new QQ(2, 1);
  static MINUS_ONE: QQ = new QQ(-1, 1);
  static ZERO: QQ = new QQ(0, 1);
}
export = QQ;