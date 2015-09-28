import mustBeInteger = require('../checks/mustBeInteger')

/**
 * @class Rational
 */
class Rational {
  /**
   * @property _numer
   * @type {number}
   * @private
   */
  private _numer: number;
  /**
   * @property _denom
   * @type {number}
   * @private
   */
  private _denom: number;

  /**
   * The Rational class represents a rational number.
   *
   * @class Rational
   * @constructor
   * @param {number} n The numerator, an integer.
   * @param {number} d The denominator, an integer.
   */
  constructor(n: number, d: number) {
    mustBeInteger('n', n);
    mustBeInteger('d', d);
    var g: number;

    var gcd = function(a: number, b: number) {
      mustBeInteger('a', a);
      mustBeInteger('b', b);
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
  /**
   * @property numer
   * @type {number}
   * @readOnly
   */
  get numer(): number {
    return this._numer;
  }
  /**
   * @property denom
   * @type {number}
   * @readOnly
   */
  get denom(): number {
    return this._denom;
  }

  add(rhs: Rational): Rational {
    return new Rational(this._numer * rhs._denom + this._denom * rhs._numer, this._denom * rhs._denom);
  }

  sub(rhs: Rational): Rational {
    return new Rational(this._numer * rhs._denom - this._denom * rhs._numer, this._denom * rhs._denom);
  }

  mul(rhs: Rational): Rational {
    return new Rational(this._numer * rhs._numer, this._denom * rhs._denom);
  }

  // TODO: div testing
  div(rhs: any): Rational {
    if (typeof rhs === 'number') {
        return new Rational(this._numer, this._denom * rhs);
    }
    else {
        return new Rational(this._numer * rhs._denom, this._denom * rhs._numer);
    }
  }

  isZero(): boolean {
    return this._numer === 0;
  }

  negative(): Rational {
    return new Rational(-this._numer, this._denom);
  }

  equals(other: any): boolean {
    if (other instanceof Rational) {
        return this._numer * other._denom === this._denom * other._numer;
    }
    else {
        return false;
    }
  }

  toString(): string {
    return "" + this._numer + "/" + this._denom;
  }

  static ONE: Rational = new Rational(1, 1);
  static TWO: Rational = new Rational(2, 1);
  static MINUS_ONE: Rational = new Rational(-1, 1);
  static ZERO: Rational = new Rational(0, 1);
}
export = Rational;