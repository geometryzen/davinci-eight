import DivisionRingOperators from '../math/DivisionRingOperators';
import {Dimensions} from '../math/Dimensions';
import LinearNumber from '../math/LinearNumber';
import notImplemented from '../i18n/notImplemented';
import notSupported from '../i18n/notSupported';
import {QQ} from '../math/QQ';

// const NAMES_SI = ['kilogram', 'meter', 'second', 'coulomb', 'kelvin', 'mole', 'candela'];
const SYMBOLS_SI = ['kg', 'm', 's', 'C', 'K', 'mol', 'cd'];

const patterns =
  [
    [-1, 1, -3, 1, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1],  // F/m
    [-1, 1, -2, 1, 1, 1, 2, 1, 0, 1, 0, 1, 0, 1],  // S
    [-1, 1, -2, 1, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1],  // F
    [-1, 1, +0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],  // C/kg
    [+0, 1, -3, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],  // C/m ** 3
    [+0, 1, 2, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],  // J/kg
    [+0, 1, 0, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],  // Hz
    [+0, 1, 0, 1, -1, 1, 1, 1, 0, 1, 0, 1, 0, 1],  // A
    [0, 1, 1, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],   // m/s ** 2
    [0, 1, 1, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],   // m/s
    [1, 1, 1, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],   // kg·m/s
    [1, 1, -1, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],  // Pa
    [1, 1, -1, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],  // Pa·s
    [1, 1, 0, 1, -3, 1, 0, 1, 0, 1, 0, 1, 0, 1],   // W/m ** 2
    [1, 1, 0, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],   // N/m
    [1, 1, 0, 1, -1, 1, -1, 1, 0, 1, 0, 1, 0, 1],  // T
    [1, 1, 1, 1, -3, 1, 0, 1, -1, 1, 0, 1, 0, 1],  // W/(m·K)
    [1, 1, 1, 1, -2, 1, -1, 1, 0, 1, 0, 1, 0, 1],  // V/m
    [1, 1, 1, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],   // N
    [1, 1, 1, 1, 0, 1, -2, 1, 0, 1, 0, 1, 0, 1],   // H/m
    [1, 1, 2, 1, -2, 1, 0, 1, -1, 1, 0, 1, 0, 1],  // J/K
    [0, 1, 2, 1, -2, 1, 0, 1, -1, 1, 0, 1, 0, 1],  // J/(kg·K)
    [1, 1, 2, 1, -2, 1, 0, 1, -1, 1, -1, 1, 0, 1], // J/(mol·K)
    [1, 1, 2, 1, -2, 1, 0, 1, 0, 1, -1, 1, 0, 1],  // J/(mol)
    [1, 1, 2, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],   // J
    [1, 1, 2, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],   // J·s
    [1, 1, 2, 1, -3, 1, 0, 1, 0, 1, 0, 1, 0, 1],   // W
    [1, 1, 2, 1, -2, 1, -1, 1, 0, 1, 0, 1, 0, 1],  // V
    [1, 1, 2, 1, -1, 1, -2, 1, 0, 1, 0, 1, 0, 1],  // Ω
    [1, 1, 2, 1, 0, 1, -2, 1, 0, 1, 0, 1, 0, 1],   // H
    [1, 1, 2, 1, -1, 1, -1, 1, 0, 1, 0, 1, 0, 1]   // Wb
  ];

const decodes =
  [
    ["F/m"],
    ["S"],
    ["F"],
    ["C/kg"],
    ["C/m ** 3"],
    ["J/kg"],
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

const dumbString = function(multiplier: number, formatted: string, dimensions: Dimensions, labels: string[]) {
  const stringify = function(rational: QQ, label: string): string {
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

  const operatorStr = multiplier === 1 || dimensions.isOne() ? "" : " ";
  const scaleString = multiplier === 1 ? "" : formatted;
  const unitsString = [stringify(dimensions.M, labels[0]), stringify(dimensions.L, labels[1]), stringify(dimensions.T, labels[2]), stringify(dimensions.Q, labels[3]), stringify(dimensions.temperature, labels[4]), stringify(dimensions.amount, labels[5]), stringify(dimensions.intensity, labels[6])].filter(function(x) {
    return typeof x === 'string';
  }).join(" ");
  return "" + scaleString + operatorStr + unitsString;
};

const unitString = function(multiplier: number, formatted: string, dimensions: Dimensions, labels: string[]): string {
  const M = dimensions.M;
  const L = dimensions.L;
  const T = dimensions.T;
  const Q = dimensions.Q;
  const temperature = dimensions.temperature;
  const amount = dimensions.amount;
  const intensity = dimensions.intensity;
  for (let i = 0, len = patterns.length; i < len; i++) {
    const pattern = patterns[i];
    if (M.numer === pattern[0] && M.denom === pattern[1] &&
      L.numer === pattern[2] && L.denom === pattern[3] &&
      T.numer === pattern[4] && T.denom === pattern[5] &&
      Q.numer === pattern[6] && Q.denom === pattern[7] &&
      temperature.numer === pattern[8] && temperature.denom === pattern[9] &&
      amount.numer === pattern[10] && amount.denom === pattern[11] &&
      intensity.numer === pattern[12] && intensity.denom === pattern[13]) {
      if (multiplier !== 1) {
        return multiplier + " * " + decodes[i][0];
      }
      else {
        return decodes[i][0];
      }
    }
  }
  return dumbString(multiplier, formatted, dimensions, labels);
};

function add(lhs: Unit, rhs: Unit): Unit {
  return new Unit(lhs.multiplier + rhs.multiplier, lhs.dimensions.compatible(rhs.dimensions), lhs.labels);
}

function sub(lhs: Unit, rhs: Unit): Unit {
  return new Unit(lhs.multiplier - rhs.multiplier, lhs.dimensions.compatible(rhs.dimensions), lhs.labels);
}

function mul(lhs: Unit, rhs: Unit): Unit {
  return new Unit(lhs.multiplier * rhs.multiplier, lhs.dimensions.mul(rhs.dimensions), lhs.labels);
}

function scale(α: number, unit: Unit): Unit {
  return new Unit(α * unit.multiplier, unit.dimensions, unit.labels);
}

function div(lhs: Unit, rhs: Unit): Unit {
  return new Unit(lhs.multiplier / rhs.multiplier, lhs.dimensions.div(rhs.dimensions), lhs.labels);
}

/**
 * <p>
 * The Unit class represents the units for a measure.
 * </p>
 */
export class Unit implements DivisionRingOperators<Unit, Unit>, LinearNumber<Unit, Unit, Unit, Unit, number, number> {

  /**
   *
   */
  public static ONE = new Unit(1.0, Dimensions.ONE, SYMBOLS_SI);

  /**
   *
   */
  public static KILOGRAM = new Unit(1.0, Dimensions.MASS, SYMBOLS_SI);

  /**
   *
   */
  public static METER = new Unit(1.0, Dimensions.LENGTH, SYMBOLS_SI);

  /**
   *
   */
  public static SECOND = new Unit(1.0, Dimensions.TIME, SYMBOLS_SI);

  /**
   *
   */
  public static COULOMB = new Unit(1.0, Dimensions.CHARGE, SYMBOLS_SI);

  /**
   *
   */
  public static AMPERE = new Unit(1.0, Dimensions.CURRENT, SYMBOLS_SI);

  /**
   *
   */
  public static KELVIN = new Unit(1.0, Dimensions.TEMPERATURE, SYMBOLS_SI);

  /**
   *
   */
  public static MOLE = new Unit(1.0, Dimensions.AMOUNT, SYMBOLS_SI);

  /**
   *
   */
  public static CANDELA = new Unit(1.0, Dimensions.INTENSITY, SYMBOLS_SI);

  /**
   * @param multiplier
   * @param dimensions
   * @param labels The label strings to use for each dimension.
   */
  constructor(public multiplier: number, public dimensions: Dimensions, public labels: string[]) {
    if (labels.length !== 7) {
      throw new Error("Expecting 7 elements in the labels array.");
    }
    this.multiplier = multiplier;
    this.dimensions = dimensions;
    this.labels = labels;
  }

  /**
   * @param rhs
   * @returns
   */
  compatible(rhs: Unit): Unit {
    if (rhs instanceof Unit) {
      this.dimensions.compatible(rhs.dimensions);
      return this;
    }
    else {
      throw new Error("Illegal Argument for Unit.compatible: " + rhs);
    }
  }

  /**
   * @param rhs
   * @returns
   */
  add(rhs: Unit): Unit {
    return add(this, rhs);
  }

  /**
   * @param rhs
   * @returns
   */
  __add__(rhs: Unit) {
    if (rhs instanceof Unit) {
      return add(this, rhs);
    }
    else {
      return;
    }
  }

  /**
   * @param lhs
   * @returns
   */
  __radd__(lhs: Unit) {
    if (lhs instanceof Unit) {
      return add(lhs, this);
    }
    else {
      return;
    }
  }


  /**
   * @param rhs
   * @returns
   */
  sub(rhs: Unit): Unit {
    return sub(this, rhs);
  }

  /**
   * @param rhs
   * @returns
   */
  __sub__(rhs: Unit) {
    if (rhs instanceof Unit) {
      return sub(this, rhs);
    }
    else {
      return;
    }
  }

  /**
   * @param lhs
   * @returns
   */
  __rsub__(lhs: Unit) {
    if (lhs instanceof Unit) {
      return sub(lhs, this);
    }
    else {
      return;
    }
  }


  /**
   * @param rhs
   * @returns
   */
  mul(rhs: Unit): Unit {
    return mul(this, rhs);
  }

  /**
   * @param rhs
   * @returns
   */
  __mul__(rhs: number | Unit) {
    if (rhs instanceof Unit) {
      return mul(this, rhs);
    }
    else if (typeof rhs === 'number') {
      return scale(rhs, this);
    }
    else {
      return;
    }
  }

  /**
   * @param lhs
   * @returns
   */
  __rmul__(lhs: number | Unit) {
    if (lhs instanceof Unit) {
      return mul(lhs, this);
    }
    else if (typeof lhs === 'number') {
      return scale(lhs, this);
    }
    else {
      return;
    }
  }

  /**
   * @param rhs
   * @returns
   */
  div(rhs: Unit): Unit {
    return div(this, rhs);
  }

  /**
   * @param α
   * @returns
   */
  divByScalar(α: number): Unit {
    return new Unit(this.multiplier / α, this.dimensions, this.labels);
  }

  __div__(other: number | Unit) {
    if (other instanceof Unit) {
      return div(this, other);
    }
    else if (typeof other === 'number') {
      return new Unit(this.multiplier / other, this.dimensions, this.labels);
    }
    else {
      return;
    }
  }

  __rdiv__(other: number | Unit) {
    if (other instanceof Unit) {
      return div(other, this);
    }
    else if (typeof other === 'number') {
      return new Unit(other / this.multiplier, this.dimensions.inv(), this.labels);
    }
    else {
      return;
    }
  }

  /**
   * Intentionaly undocumented.
   */
  pattern(): string {
    const ns: number[] = []
    ns.push(this.dimensions.M.numer)
    ns.push(this.dimensions.M.denom)
    ns.push(this.dimensions.L.numer)
    ns.push(this.dimensions.L.denom)
    ns.push(this.dimensions.T.numer)
    ns.push(this.dimensions.T.denom)
    ns.push(this.dimensions.Q.numer)
    ns.push(this.dimensions.Q.denom)
    ns.push(this.dimensions.temperature.numer)
    ns.push(this.dimensions.temperature.denom)
    ns.push(this.dimensions.amount.numer)
    ns.push(this.dimensions.amount.denom)
    ns.push(this.dimensions.intensity.numer)
    ns.push(this.dimensions.intensity.denom)
    return JSON.stringify(ns)
  }

  /**
   * @param exponent
   * @returns
   */
  pow(exponent: QQ): Unit {
    return new Unit(Math.pow(this.multiplier, exponent.numer / exponent.denom), this.dimensions.pow(exponent), this.labels);
  }

  /**
   * @returns
   */
  inv(): Unit {
    return new Unit(1 / this.multiplier, this.dimensions.inv(), this.labels);
  }

  /**
   * @returns
   */
  neg(): Unit {
    return new Unit(-this.multiplier, this.dimensions, this.labels);
  }

  /**
   * @returns
   */
  isOne(): boolean {
    return this.dimensions.isOne() && (this.multiplier === 1)
  }

  /**
   * @returns
   */
  isZero(): boolean {
    return this.dimensions.isZero() || (this.multiplier === 0)
  }

  /**
   * @method lerp
   * @param target
   * @param α
   * @returns
   */
  lerp(target: Unit, α: number): Unit {
    throw new Error(notImplemented('lerp').message)
  }

  /**
   * @returns
   */
  norm(): Unit {
    return new Unit(Math.abs(this.multiplier), this.dimensions, this.labels);
  }

  /**
   * @returns
   */
  quad(): Unit {
    return new Unit(this.multiplier * this.multiplier, this.dimensions.mul(this.dimensions), this.labels);
  }

  /**
   * @param n
   * @returns
   */
  reflect(n: Unit): Unit {
    return this;
  }

  /**
   * @param rotor
   * @returns
   */
  rotate(rotor: Unit): Unit {
    return this;
  }

  /**
   * @param α
   * @returns
   */
  scale(α: number): Unit {
    return new Unit(this.multiplier * α, this.dimensions, this.labels);
  }

  /**
   * @param target
   * @param α
   * @returns
   */
  slerp(target: Unit, α: number): Unit {
    throw new Error(notImplemented('slerp').message)
  }

  /**
   * @returns
   */
  sqrt(): Unit {
    return new Unit(Math.sqrt(this.multiplier), this.dimensions.sqrt(), this.labels)
  }

  /**
   * @param σ
   * @returns
   */
  stress(σ: Unit): Unit {
    throw new Error(notSupported('stress').message)
  }

  /**
   * @returns
   */
  toExponential(fractionDigits?: number): string {
    return unitString(this.multiplier, this.multiplier.toExponential(fractionDigits), this.dimensions, this.labels);
  }

  /**
   * @param fractionDigits
   */
  toFixed(fractionDigits?: number): string {
    return unitString(this.multiplier, this.multiplier.toFixed(fractionDigits), this.dimensions, this.labels);
  }

  /**
   * @param precision
   * @returns
   */
  toPrecision(precision?: number): string {
    return unitString(this.multiplier, this.multiplier.toPrecision(precision), this.dimensions, this.labels);
  }

  /**
   * @param radix
   * @returns
   */
  toString(radix?: number): string {
    return unitString(this.multiplier, this.multiplier.toString(radix), this.dimensions, this.labels);
  }

  /**
   * @returns
   */
  __pos__(): Unit {
    return this
  }

  /**
   * @returns
   */
  __neg__(): Unit {
    return this.neg()
  }

  /**
   * @param uom
   * @returns
   */
  static isOne(uom: Unit): boolean {
    if (uom === void 0) {
      return true;
    }
    else if (uom instanceof Unit) {
      return uom.isOne();
    }
    else {
      throw new Error("isOne argument must be a Unit or undefined.");
    }
  }

  /**
   * @param uom
   * @returns
   */
  static assertDimensionless(uom: Unit): void {
    if (!Unit.isOne(uom)) {
      throw new Error("uom must be dimensionless.");
    }
  }

  /**
   * @param lhs
   * @param rhs
   * @returns
   */
  static compatible(lhs: Unit, rhs: Unit): Unit {
    if (lhs) {
      if (rhs) {
        return lhs.compatible(rhs);
      }
      else {
        if (lhs.isOne()) {
          return void 0;
        }
        else {
          throw new Error(lhs + " is incompatible with 1");
        }
      }
    }
    else {
      if (rhs) {
        if (rhs.isOne()) {
          return void 0;
        }
        else {
          throw new Error("1 is incompatible with " + rhs);
        }
      }
      else {
        return void 0;
      }
    }
  }

  /**
   * @param lhs
   * @param rhs
   * @returns
   */
  static mul(lhs: Unit, rhs: Unit): Unit {
    if (lhs) {
      if (rhs) {
        return lhs.mul(rhs);
      }
      else if (Unit.isOne(rhs)) {
        return lhs;
      }
      else {
        return void 0;
      }
    }
    else if (Unit.isOne(lhs)) {
      return rhs;
    }
    else {
      return void 0;
    }
  }

  /**
   * @param lhs
   * @param rhs
   * @returns
   */
  static div(lhs: Unit, rhs: Unit): Unit {
    if (lhs) {
      if (rhs) {
        return lhs.div(rhs);
      }
      else {
        return lhs;
      }
    }
    else {
      if (rhs) {
        return rhs.inv();
      }
      else {
        return void 0;
      }
    }
  }

  /**
   * @param uom
   * @returns
   */
  static sqrt(uom: Unit): Unit {
    if (typeof uom !== 'undefined') {
      if (!uom.isOne()) {
        return new Unit(Math.sqrt(uom.multiplier), uom.dimensions.sqrt(), uom.labels);
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
