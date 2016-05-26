import DivisionRingOperators from './DivisionRingOperators';
import mustBeInteger from '../checks/mustBeInteger';
import readOnly from '../i18n/readOnly';

const magicCode = Math.random()

/**
 * The QQ class represents a rational number, ℚ.
 *
 * The QQ implementation is that of an <em>immutable</em> (value) type.
 *
 * The numerator and denominator are reduced to their lowest form.
 *
 * Construct new instances using the static <code>valueOf</code> method.
 */
export class QQ implements DivisionRingOperators<QQ, number> {
  /**
   *
   */
  private _numer: number;
  /**
   *
   */
  private _denom: number;

  /**
   * Intentionally undocumented.
   */
  constructor(n: number, d: number, code: number) {
    if (code !== magicCode) {
      throw new Error("Use the static create method instead of the constructor")
    }
    mustBeInteger('n', n);
    mustBeInteger('d', d);
    var g: number;

    const gcd = function(a: number, b: number) {
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
   *
   * @readOnly
   */
  get numer(): number {
    return this._numer;
  }
  set numer(unused: number) {
    throw new Error(readOnly('numer').message)
  }

  /**
   *
   * @readOnly
   */
  get denom(): number {
    return this._denom;
  }
  set denom(unused: number) {
    throw new Error(readOnly('denom').message)
  }

  /**
   * @param rhs
   * @returns
   */
  add(rhs: QQ): QQ {
    return QQ.valueOf(this._numer * rhs._denom + this._denom * rhs._numer, this._denom * rhs._denom);
  }

  /**
   * @param rhs
   * @returns
   */
  sub(rhs: QQ): QQ {
    return QQ.valueOf(this._numer * rhs._denom - this._denom * rhs._numer, this._denom * rhs._denom);
  }

  /**
   * @param rhs
   * @returns
   */
  mul(rhs: QQ): QQ {
    return QQ.valueOf(this._numer * rhs._numer, this._denom * rhs._denom);
  }

  /**
   * @param rhs
   * @returns
   */
  div(rhs: QQ): QQ {
    const numer = this._numer * rhs._denom
    const denom = this._denom * rhs._numer
    if (numer === 0) {
      if (denom === 0) {
        // How do we handle undefined?
        return QQ.valueOf(numer, denom)
      }
      else {
        return QQ.ZERO
      }
    }
    else {
      if (denom === 0) {
        // How do we handle division by zero.
        return QQ.valueOf(numer, denom)
      }
      else {
        return QQ.valueOf(numer, denom)
      }
    }
  }

  /**
   * @returns
   */
  isOne(): boolean {
    return this._numer === 1 && this._denom === 1
  }

  /**
   * @returns
   */
  isZero(): boolean {
    return this._numer === 0 && this._denom === 1
  }

  /**
   * @returns
   */
  hashCode(): number {
    return 37 * this.numer + 13 * this.denom
  }

  /**
   * Computes the multiplicative inverse of this rational number.
   *
   * @returns
   */
  inv(): QQ {
    return QQ.valueOf(this._denom, this._numer);
  }

  /**
   * Computes the additive inverse of this rational number.
   *
   * @returns
   */
  neg(): QQ {
    return QQ.valueOf(-this._numer, this._denom);
  }

  /**
   * Determines whether two rational numbers are equal.
   *
   * @param other
   * @returns
   */
  equals(other: QQ): boolean {
    if (other instanceof QQ) {
      return this._numer * other._denom === this._denom * other._numer;
    }
    else {
      return false;
    }
  }

  /**
   * Computes a non-normative string representation of this rational.
   *
   * @returns
   */
  toString(): string {
    return "" + this._numer + "/" + this._denom + ""
  }

  /**
   * @param rhs
   * @returns
   */
  __add__(rhs: QQ): QQ {
    if (rhs instanceof QQ) {
      return this.add(rhs)
    }
    else {
      return void 0
    }
  }

  /**
   * @param lhs
   * @returns
   */
  __radd__(lhs: QQ): QQ {
    if (lhs instanceof QQ) {
      return lhs.add(this)
    }
    else {
      return void 0
    }
  }

  /**
   * @param rhs
   * @returns
   */
  __sub__(rhs: QQ): QQ {
    if (rhs instanceof QQ) {
      return this.sub(rhs)
    }
    else {
      return void 0
    }
  }

  /**
   * @param lhs
   * @returns
   */
  __rsub__(lhs: QQ): QQ {
    if (lhs instanceof QQ) {
      return lhs.sub(this)
    }
    else {
      return void 0
    }
  }

  /**
   * @param rhs
   * @returns
   */
  __mul__(rhs: QQ): QQ {
    if (rhs instanceof QQ) {
      return this.mul(rhs)
    }
    else {
      return void 0
    }
  }

  /**
   * @param lhs
   * @returns
   */
  __rmul__(lhs: QQ): QQ {
    if (lhs instanceof QQ) {
      return lhs.mul(this)
    }
    else {
      return void 0
    }
  }

  /**
   * @param div
   * @returns
   */
  __div__(rhs: QQ): QQ {
    if (rhs instanceof QQ) {
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
  __rdiv__(lhs: QQ): QQ {
    if (lhs instanceof QQ) {
      return lhs.div(this)
    }
    else {
      return void 0
    }
  }

  /**
   * @returns
   */
  __pos__(): QQ {
    return this
  }

  /**
   * @returns
   */
  __neg__(): QQ {
    return this.neg()
  }

  //
  // Immutable constants allow us to avoid creating
  // temporary QQ instances for the common values.
  //
  private static POS_08_01: QQ = new QQ(8, 1, magicCode)
  private static POS_07_01: QQ = new QQ(7, 1, magicCode)
  private static POS_06_01: QQ = new QQ(6, 1, magicCode)
  private static POS_05_01: QQ = new QQ(5, 1, magicCode)
  private static POS_04_01: QQ = new QQ(4, 1, magicCode)
  private static POS_03_01: QQ = new QQ(3, 1, magicCode)
  private static POS_02_01: QQ = new QQ(2, 1, magicCode)
  private static ONE: QQ = new QQ(1, 1, magicCode)
  private static POS_01_02: QQ = new QQ(1, 2, magicCode)
  private static POS_01_03: QQ = new QQ(1, 3, magicCode)
  private static POS_01_04: QQ = new QQ(1, 4, magicCode)
  private static POS_01_05: QQ = new QQ(1, 5, magicCode)
  private static ZERO: QQ = new QQ(0, 1, magicCode)
  private static NEG_01_03: QQ = new QQ(-1, 3, magicCode)
  private static NEG_01_01: QQ = new QQ(-1, 1, magicCode)
  private static NEG_02_01: QQ = new QQ(-2, 1, magicCode)
  private static NEG_03_01: QQ = new QQ(-3, 1, magicCode)

  private static POS_02_03: QQ = new QQ(2, 3, magicCode)

  /**
   * @param numer
   * @param denom
   * @returns
   */
  static valueOf(n: number, d: number): QQ {
    if (n === 0) {
      if (d !== 0) {
        return QQ.ZERO
      }
      else {
        // This is the undefined case, 0/0.
      }
    }
    else if (d === 0) {
      // Fall through
    }
    else if (n === d) {
      return QQ.ONE
    }
    else if (n === 1) {
      if (d === 2) {
        return QQ.POS_01_02
      }
      else if (d === 3) {
        return QQ.POS_01_03
      }
      else if (d === 4) {
        return QQ.POS_01_04
      }
      else if (d === 5) {
        return QQ.POS_01_05
      }
      else if (d === -3) {
        return QQ.NEG_01_03
      }
    }
    else if (n === -1) {
      if (d === 1) {
        return QQ.NEG_01_01
      }
      else if (d === 3) {
        return QQ.NEG_01_03
      }
    }
    else if (n === 2) {
      if (d === 1) {
        return QQ.POS_02_01
      }
      else if (d === 3) {
        return QQ.POS_02_03
      }
    }
    else if (n === -2) {
      if (d === 1) {
        return QQ.NEG_02_01
      }
    }
    else if (n === 3) {
      if (d === 1) {
        return QQ.POS_03_01
      }
    }
    else if (n === -3) {
      if (d === 1) {
        return QQ.NEG_03_01
      }
    }
    else if (n === 4) {
      if (d === 1) {
        return QQ.POS_04_01
      }
    }
    else if (n === 5) {
      if (d === 1) {
        return QQ.POS_05_01
      }
    }
    else if (n === 6) {
      if (d === 1) {
        return QQ.POS_06_01
      }
    }
    else if (n === 7) {
      if (d === 1) {
        return QQ.POS_07_01
      }
    }
    else if (n === 8) {
      if (d === 1) {
        return QQ.POS_08_01
      }
    }
    // console.warn(`QQ.valueOf(${n},${d}) is not cached.`)
    return new QQ(n, d, magicCode)
  }
}
