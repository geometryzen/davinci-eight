import b2 from '../geometries/b2';
import b3 from '../geometries/b3';
import extE2 from './extE2';
import gauss from './gauss';
import GeometricNumber from './GeometricNumber';
import GeometricOperators from './GeometricOperators';
import GeometricE2 from './GeometricE2';
import lcoE2 from './lcoE2';
import rcoE2 from './rcoE2';
import ImmutableMeasure from './ImmutableMeasure';
import mulE2 from './mulE2';
import notImplemented from '../i18n/notImplemented';
import notSupported from '../i18n/notSupported';
import readOnly from '../i18n/readOnly';
import scpE2 from './scpE2';
import SpinorE2 from './SpinorE2';
import stringFromCoordinates from './stringFromCoordinates';
import TrigMethods from './TrigMethods';
import {Unit} from './Unit';
import VectorE2 from './VectorE2';

/**
 * @module EIGHT
 * @submodule math
 */

const COORD_SCALAR = 0
const COORD_X = 1
const COORD_Y = 2
const COORD_PSEUDO = 3

function add00(a00: number, a01: number, a10: number, a11: number, b00: number, b01: number, b10: number, b11: number): number {
  a00 = +a00;
  a01 = +a01;
  a10 = +a10;
  a11 = +a11;
  b00 = +b00;
  b01 = +b01;
  b10 = +b10;
  b11 = +b11;
  return +(a00 + b00);
}

function add01(a00: number, a01: number, a10: number, a11: number, b00: number, b01: number, b10: number, b11: number): number {
  a00 = +a00;
  a01 = +a01;
  a10 = +a10;
  a11 = +a11;
  b00 = +b00;
  b01 = +b01;
  b10 = +b10;
  b11 = +b11;
  return +(a01 + b01);
}

function add10(a00: number, a01: number, a10: number, a11: number, b00: number, b01: number, b10: number, b11: number): number {
  a00 = +a00;
  a01 = +a01;
  a10 = +a10;
  a11 = +a11;
  b00 = +b00;
  b01 = +b01;
  b10 = +b10;
  b11 = +b11;
  return +(a10 + b10);
}

function add11(a00: number, a01: number, a10: number, a11: number, b00: number, b01: number, b10: number, b11: number): number {
  a00 = +a00;
  a01 = +a01;
  a10 = +a10;
  a11 = +a11;
  b00 = +b00;
  b01 = +b01;
  b10 = +b10;
  b11 = +b11;
  return +(a11 + b11);
}

function subE2(a0: number, a1: number, a2: number, a3: number, b0: number, b1: number, b2: number, b3: number, index: number): number {
  a0 = +a0;
  a1 = +a1;
  a2 = +a2;
  a3 = +a3;
  b0 = +b0;
  b1 = +b1;
  b2 = +b2;
  b3 = +b3;
  index = index | 0;
  var x = 0.0;
  switch (~(~index)) {
    case 0: {
      x = +(a0 - b0);
    }
      break;
    case 1: {
      x = +(a1 - b1);
    }
      break;
    case 2: {
      x = +(a2 - b2);
    }
      break;
    case 3: {
      x = +(a3 - b3);
    }
      break;
    default: {
      throw new Error("index must be in the range [0..3]");
    }
  }
  return +x;
}

/**
 * <p>
 * The <code>G2</code> class represents a multivector for a 2-dimensional vector space with a Euclidean metric.
 * </p>
 * <p>
 * The <code>G2</code> class is immutable, making it easy to reason about values.
 * </p>
 * <p>
 * The <code>G2</code> class supports units of measures.
 * </p>
 * <p>
 * The immutable nature of the <p>G2</p> makes it less suitable for high performance graphics applications.
 * </p>
 *
 * @class G2
 */
export class G2 implements ImmutableMeasure<G2>, GeometricE2, GeometricNumber<G2, G2, SpinorE2, VectorE2, G2, number, Unit>, GeometricOperators<G2, Unit>, TrigMethods<G2> {

  /**
   * The coordinate values are stored in a number array.
   * This should be convenient and efficient for tensor calculations.
   *
   * @property _coords
   * @type number[]
   * @private
   */
  private _coords: number[] = [0, 0, 0, 0]

  /**
   * @property uom
   * @type {Unit}
   */
  public uom: Unit;

  /**
   * @property _zero
   * @type G2
   * @static
   * @private
   */
  private static _zero = new G2(0, 0, 0, 0)

  /**
   * @property zero
   * @type G2
   * @static
   * @readOnly
   */
  public static get zero() {
    return G2._zero
  }
  public static set zero(unused) {
    throw new Error(readOnly('zero').message)
  }

  /**
   * @property _one
   * @type G2
   * @static
   * @private
   */
  private static _one = new G2(1, 0, 0, 0)

  /**
   * @property one
   * @type G2
   * @static
   * @readOnly
   */
  public static get one() {
    return G2._one
  }
  public static set one(unused) {
    throw new Error(readOnly('one').message)
  }

  /**
   * @property _e2
   * @type G2
   * @static
   * @private
   */
  private static _e1 = new G2(0, 1, 0, 0)

  /**
   * @property e1
   * @type G2
   * @static
   * @readOnly
   */
  public static get e1() {
    return G2._e1
  }
  public static set e1(unused) {
    throw new Error(readOnly('e1').message)
  }

  /**
   * @property _e2
   * @type G2
   * @static
   * @private
   */
  private static _e2 = new G2(0, 0, 1, 0)

  /**
   * @property e2
   * @type G2
   * @static
   * @readOnly
   */
  public static get e2() {
    return G2._e2
  }
  public static set e2(unused) {
    throw new Error(readOnly('e2').message)
  }

  /**
   * @property _I
   * @type G2
   * @static
   * @private
   */
  private static _I = new G2(0, 0, 0, 1)

  /**
   * @property I
   * @type G2
   * @static
   * @readOnly
   */
  public static get I() {
    return G2._I
  }
  public static set I(unused) {
    throw new Error(readOnly('I').message)
  }

  /**
   * @property kilogram
   * @type G2
   * @static
   */
  public static kilogram = new G2(1, 0, 0, 0, Unit.KILOGRAM)

  /**
   * @property meter
   * @type G2
   * @static
   */
  public static meter = new G2(1, 0, 0, 0, Unit.METER)

  /**
   * @property second
   * @type G2
   * @static
   */
  public static second = new G2(1, 0, 0, 0, Unit.SECOND)

  /**
   * @property coulomb
   * @type G2
   * @static
   */
  public static coulomb = new G2(1, 0, 0, 0, Unit.COULOMB)

  /**
   * @property ampere
   * @type G2
   * @static
   */
  public static ampere = new G2(1, 0, 0, 0, Unit.AMPERE)

  /**
   * @property kelvin
   * @type G2
   * @static
   */
  public static kelvin = new G2(1, 0, 0, 0, Unit.KELVIN)

  /**
   * @property mole
   * @type G2
   * @static
   */
  public static mole = new G2(1, 0, 0, 0, Unit.MOLE)

  /**
   * @property candela
   * @type G2
   * @static
   */
  public static candela = new G2(1, 0, 0, 0, Unit.CANDELA)

  /**
   * @class G2
   * @constructor
   * @param [α = 0] {number} The scalar part of the multivector.
   * @param [x = 0] {number} The vector component of the multivector in the x-direction.
   * @param [y = 0] {number} The vector component of the multivector in the y-direction.
   * @param [β = 0] {number} The pseudoscalar part of the multivector.
   * @param [uom] The optional unit of measure.
   */
  constructor(α = 0, x = 0, y = 0, β = 0, uom?: Unit) {
    this._coords[COORD_SCALAR] = α
    this._coords[COORD_X] = x
    this._coords[COORD_Y] = y
    this._coords[COORD_PSEUDO] = β
    this.uom = uom
    if (this.uom && this.uom.multiplier !== 1) {
      const multiplier: number = this.uom.multiplier;
      this._coords[COORD_SCALAR] *= multiplier;
      this._coords[COORD_X] *= multiplier;
      this._coords[COORD_Y] *= multiplier;
      this._coords[COORD_PSEUDO] *= multiplier;
      this.uom = new Unit(1, uom.dimensions, uom.labels);
    }
  }

  /**
   * The scalar part of this multivector.
   * @property α
   * @type number
   * @readOnly
   */
  get α(): number {
    return this._coords[COORD_SCALAR]
  }
  set α(unused) {
    throw new Error(readOnly('α').message)
  }

  /**
   * The scalar part of this multivector.
   * @property alpha
   * @type number
   * @readOnly
   */
  get alpha(): number {
    return this._coords[COORD_SCALAR]
  }
  set alpha(unused) {
    throw new Error(readOnly('alpha').message)
  }

  /**
   * The coordinate corresponding to the <b>e1</b> basis vector, without the unit of measure.
   *
   * @property x
   * @type number
   * @readOnly
   */
  get x(): number {
    return this._coords[COORD_X]
  }
  set x(unused) {
    throw new Error(readOnly('x').message)
  }

  /**
   * The coordinate corresponding to the <b>e2</b> basis vector, without the unit of measure.
   *
   * @property y
   * @type number
   * @readOnly
   */
  get y(): number {
    return this._coords[COORD_Y]
  }
  set y(unused) {
    throw new Error(readOnly('y').message)
  }

  /**
   * The pseudoscalar part of this multivector.
   * @property β
   * @type number
   * @readOnly
   */
  get β(): number {
    return this._coords[COORD_PSEUDO]
  }
  set β(unused) {
    throw new Error(readOnly('β').message)
  }

  /**
   * The pseudoscalar part of this multivector.
   * @property beta
   * @type number
   * @readOnly
   */
  get beta(): number {
    return this._coords[COORD_PSEUDO]
  }
  set beta(unused) {
    throw new Error(readOnly('beta').message)
  }

  /*
  private fromCartesian(α: number, x: number, y: number, β: number, uom: Unit): G2 {
    return new G2(α, x, y, β, uom)
  }
  */

  /*
  private fromPolar(α: number, r: number, θ: number, β: number, uom: Unit): G2 {
    return new G2(α, r * Math.cos(θ), r * Math.sin(θ), β, uom)
  }
  */

  /**
   * @property coords
   * @return {number[]}
   * @readOnly
   */
  get coords(): number[] {
    return [this.α, this.x, this.y, this.β];
  }

  // FIXME
  coordinate(index: number): number {
    switch (index) {
      case 0:
        return this.α;
      case 1:
        return this.x;
      case 2:
        return this.y;
      case 3:
        return this.β;
      default:
        throw new Error("index must be in the range [0..3]");
    }
  }

  // FIXME: This function forces the creation of temporary arrays.
  private static add(a: number[], b: number[]): number[] {
    const a00 = a[0];
    const a01 = a[1];
    const a10 = a[2];
    const a11 = a[3];
    const b00 = b[0];
    const b01 = b[1];
    const b10 = b[2];
    const b11 = b[3];
    const x00 = add00(a00, a01, a10, a11, b00, b01, b10, b11);
    const x01 = add01(a00, a01, a10, a11, b00, b01, b10, b11);
    const x10 = add10(a00, a01, a10, a11, b00, b01, b10, b11);
    const x11 = add11(a00, a01, a10, a11, b00, b01, b10, b11);
    return [x00, x01, x10, x11];
  }

  /**
   * @method add
   * @param rhs {G2}
   * @return {G2}
   * @chainable
   */
  add(rhs: G2): G2 {
    var xs = G2.add(this.coords, rhs.coords);
    return new G2(xs[0], xs[1], xs[2], xs[3], Unit.compatible(this.uom, rhs.uom));
  }

  /**
   * @method addPseudo
   * @param β {Unit}
   * @return {G2}
   * @chainable
   */
  addPseudo(β: Unit): G2 {
    return new G2(this.α, this.x, this.y, this.β + β.multiplier, Unit.compatible(this.uom, β))
  }

  /**
   * @method addScalar
   * @param α {Unit}
   * @return {G2}
   * @chainable
   */
  addScalar(α: Unit): G2 {
    return new G2(this.α + α.multiplier, this.x, this.y, this.β, Unit.compatible(this.uom, α))
  }

  /**
   * @method adj
   * @return {G2}
   * @chainable
   */
  adj(): G2 {
    throw new Error("TODO: adj")
  }

  __add__(other: any): G2 {
    if (other instanceof G2) {
      return this.add(other);
    }
    else if (typeof other === 'number') {
      return this.add(new G2(other, 0, 0, 0, undefined));
    }
  }

  __radd__(other: any): G2 {
    if (other instanceof G2) {
      return (<G2>other).add(this);
    }
    else if (typeof other === 'number') {
      return new G2(other, 0, 0, 0, undefined).add(this);
    }
  }

  /**
   * @method angle
   * @return {G2}
   * @chainable
   */
  angle(): G2 {
    return this.log().grade(2);
  }

  //  clone(): G2 {
  //    return this;
  //  }

  /**
   * @method conj
   * @return {G2}
   * @chainable
   */
  conj(): G2 {
    throw new Error(notImplemented('conj').message)
  }

  /**
   * @method cubicBezier
   * @param t {number}
   * @param controlBegin {GeometricE2}
   * @param controlEnd {GeometricE2}
   * @param endPoint {GeometricE2}
   * @return {G2}
   * @chainable
   */
  cubicBezier(t: number, controlBegin: GeometricE2, controlEnd: GeometricE2, endPoint: GeometricE2): G2 {
    const α = b3(t, this.α, controlBegin.α, controlEnd.α, endPoint.α)
    const x = b3(t, this.x, controlBegin.x, controlEnd.x, endPoint.x)
    const y = b3(t, this.y, controlBegin.y, controlEnd.y, endPoint.y)
    const β = b3(t, this.β, controlBegin.β, controlEnd.β, endPoint.β)
    return new G2(α, x, y, β, this.uom);
  }

  /**
   * @method direction
   * @return {G2}
   * @chainable
   */
  public direction(): G2 {
    const m: number = this.magnitudeSansUnits()
    if (m !== 1) {
      return new G2(this.α / m, this.x / m, this.y / m, this.β / m)
    }
    else {
      if (this.uom) {
        return new G2(this.α, this.x, this.y, this.β)
      }
      else {
        return this
      }
    }
  }

  /**
   * @method distanceTo
   * @param point {GeometricE2}
   * @return {number}
   */
  distanceTo(point: GeometricE2): number {
    throw new Error(notImplemented('diistanceTo').message)
  }

  /**
   * @method equals
   * @param other {any}
   * @return {boolean}
   */
  equals(point: GeometricE2): boolean {
    throw new Error(notImplemented('equals').message)
  }

  private static sub(a: number[], b: number[]): number[] {
    var a0 = a[0];
    var a1 = a[1];
    var a2 = a[2];
    var a3 = a[3];
    var b0 = b[0];
    var b1 = b[1];
    var b2 = b[2];
    var b3 = b[3];
    var x0 = subE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
    var x1 = subE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
    var x2 = subE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
    var x3 = subE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
    return [x0, x1, x2, x3];
  }

  /**
   * @method sub
   * @param rhs {G2}
   * @return {G2}
   * @chainable
   */
  sub(rhs: G2): G2 {
    var xs = G2.sub(this.coords, rhs.coords);
    return new G2(xs[0], xs[1], xs[2], xs[3], Unit.compatible(this.uom, rhs.uom));
  }

  __sub__(other: any): G2 {
    if (other instanceof G2) {
      return this.sub(other);
    }
    else if (typeof other === 'number') {
      return this.sub(new G2(other, 0, 0, 0, undefined));
    }
  }

  __rsub__(other: any): G2 {
    if (other instanceof G2) {
      return (<G2>other).sub(this);
    }
    else if (typeof other === 'number') {
      return new G2(other, 0, 0, 0, undefined).sub(this);
    }
  }

  /**
   * @method mul
   * @param rhs {G2}
   * @return {G2}
   * @chainable
   */
  mul(rhs: G2): G2 {
    const a0 = this.α
    const a1 = this.x
    const a2 = this.y
    const a3 = this.β
    const b0 = rhs.α
    const b1 = rhs.x
    const b2 = rhs.y
    const b3 = rhs.β
    // TODO: Split into four functions to avoid conditionals or inline.
    const c0 = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 0)
    const c1 = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 1)
    const c2 = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 2)
    const c3 = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 3)
    return new G2(c0, c1, c2, c3, Unit.mul(this.uom, rhs.uom))
  }

  __mul__(other: any): G2 {
    if (other instanceof G2) {
      return this.mul(other);
    }
    else if (typeof other === 'number') {
      return this.mul(new G2(other, 0, 0, 0, undefined));
    }
  }

  __rmul__(other: any): G2 {
    if (other instanceof G2) {
      var lhs: G2 = other;
      return lhs.mul(this);
    }
    else if (typeof other === 'number') {
      var w: number = other;
      return new G2(w, 0, 0, 0, undefined).mul(this);
    }
  }

  /**
   * @method scale
   * @param α {number}
   * @return {G2}
   * @chainable
   */
  scale(α: number): G2 {
    return new G2(this.α * α, this.x * α, this.y * α, this.β * α, this.uom);
  }

  /**
   * @method div
   * @param rhs {G2}
   * @return {G2}
   * @chainable
   */
  div(rhs: G2): G2 {
    return this.mul(rhs.inv())
  }

  /**
   * @method divByScalar
   * @param α {number}
   * @return {G2}
   * @chainable
   */
  divByScalar(α: number): G2 {
    return new G2(this.α / α, this.x / α, this.y / α, this.β / α, this.uom);
  }

  __div__(other: any): G2 {
    if (other instanceof G2) {
      return this.div(other);
    }
    else if (typeof other === 'number') {
      var w: number = other;
      return this.div(new G2(w, 0, 0, 0, undefined));
    }
  }

  __rdiv__(other: number | G2): G2 {
    if (other instanceof G2) {
      return other.div(this);
    }
    else if (typeof other === 'number') {
      return new G2(other, 0, 0, 0, undefined).div(this);
    }
  }

  /**
   * @method scp
   * @param rhs {G2}
   * @return {G2}
   * @chainable
   */
  scp(rhs: G2): G2 {

    const a0 = this.α
    const a1 = this.x
    const a2 = this.y
    const a3 = this.β

    const b0 = rhs.α
    const b1 = rhs.x
    const b2 = rhs.y
    const b3 = rhs.β

    const c0 = scpE2(a0, a1, a2, a3, b0, b1, b2, b3, 0)
    return new G2(c0, 0, 0, 0, Unit.mul(this.uom, rhs.uom))
  }

  private static ext(a: number[], b: number[]): number[] {
    const a0: number = a[0];
    const a1: number = a[1];
    const a2: number = a[2];
    const a3: number = a[3];
    const b0: number = b[0];
    const b1: number = b[1];
    const b2: number = b[2];
    const b3: number = b[3];
    const x0: number = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
    const x1: number = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
    const x2: number = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
    const x3: number = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
    return [x0, x1, x2, x3];
  }

  /**
   * @method ext
   * @param rhs {G2}
   * @return {G2}
   * @chainable
   */
  ext(rhs: G2): G2 {
    var xs = G2.ext(this.coords, rhs.coords);
    return new G2(xs[0], xs[1], xs[2], xs[3], Unit.mul(this.uom, rhs.uom));
  }

  __wedge__(other: any): G2 {
    if (other instanceof G2) {
      var rhs: G2 = other;
      return this.ext(rhs);
    }
    else if (typeof other === 'number') {
      var w: number = other;
      return this.ext(new G2(w, 0, 0, 0, undefined));
    }
  }

  __rwedge__(other: any): G2 {
    if (other instanceof G2) {
      var lhs: G2 = other;
      return lhs.ext(this);
    }
    else if (typeof other === 'number') {
      var w: number = other;
      return new G2(w, 0, 0, 0, undefined).ext(this);
    }
  }

  private static lshift(a: number[], b: number[]): number[] {
    var a0 = a[0];
    var a1 = a[1];
    var a2 = a[2];
    var a3 = a[3];
    var b0 = b[0];
    var b1 = b[1];
    var b2 = b[2];
    var b3 = b[3];
    var x0 = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
    var x1 = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
    var x2 = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
    var x3 = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
    return [x0, x1, x2, x3];
  }

  /**
   * @method lerp
   * @param target {G2}
   * @param α {number}
   * @return {G2}
   * @chainable
   */
  lerp(target: G2, α: number): G2 {
    throw new Error(notImplemented('lerp').message)
  }

  /**
   * @method lco
   * @param lhs {G2}
   * @return {G2}
   * @chainable
   */
  lco(rhs: G2): G2 {
    var xs = G2.lshift(this.coords, rhs.coords);
    return new G2(xs[0], xs[1], xs[2], xs[3], Unit.mul(this.uom, rhs.uom));
  }

  __lshift__(other: any): G2 {
    if (other instanceof G2) {
      var rhs: G2 = other;
      return this.lco(rhs);
    }
    else if (typeof other === 'number') {
      var w: number = other;
      return this.lco(new G2(w, 0, 0, 0, undefined));
    }
  }

  __rlshift__(other: any): G2 {
    if (other instanceof G2) {
      var lhs: G2 = other;
      return lhs.lco(this);
    }
    else if (typeof other === 'number') {
      var w: number = other;
      return new G2(w, 0, 0, 0, undefined).lco(this);
    }
  }

  private static rshift(a: number[], b: number[]): number[] {
    var a0 = a[0];
    var a1 = a[1];
    var a2 = a[2];
    var a3 = a[3];
    var b0 = b[0];
    var b1 = b[1];
    var b2 = b[2];
    var b3 = b[3];
    var x0 = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
    var x1 = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
    var x2 = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
    var x3 = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
    return [x0, x1, x2, x3];
  }

  /**
   * @method rco
   * @param rhs {G2}
   * @return {G2}
   * @chainable
   */
  rco(rhs: G2): G2 {
    var xs = G2.rshift(this.coords, rhs.coords);
    return new G2(xs[0], xs[1], xs[2], xs[3], Unit.mul(this.uom, rhs.uom));
  }

  __rshift__(other: any): G2 {
    if (other instanceof G2) {
      return this.rco(other);
    }
    else if (typeof other === 'number') {
      return this.rco(new G2(other, 0, 0, 0, undefined));
    }
  }

  __rrshift__(other: any): G2 {
    if (other instanceof G2) {
      return (<G2>other).rco(this);
    }
    else if (typeof other === 'number') {
      return new G2(other, 0, 0, 0, undefined).rco(this);
    }
  }

  __vbar__(other: any): G2 {
    if (other instanceof G2) {
      return this.scp(other);
    }
    else if (typeof other === 'number') {
      return this.scp(new G2(other, 0, 0, 0, undefined));
    }
  }

  __rvbar__(other: any): G2 {
    if (other instanceof G2) {
      return (<G2>other).scp(this);
    }
    else if (typeof other === 'number') {
      return new G2(other, 0, 0, 0, undefined).scp(this);
    }
  }

  /**
   * @method pow
   * @param exponent {G2}
   * @return {G2}
   * @chainable
   */
  pow(exponent: G2): G2 {
    throw new Error(notImplemented('pow').message)
  }

  __bang__(): G2 {
    return this.inv()
  }

  __pos__(): G2 {
    return this
  }

  /**
   * @method neg
   * @return {G2}
   * @chainable
   */
  neg(): G2 {
    return new G2(-this.α, -this.x, -this.y, -this.β, this.uom)
  }

  __neg__(): G2 {
    return this.neg()
  }

  /**
   * ~ (tilde) produces reversion.
   */
  __tilde__(): G2 {
    return this.rev()
  }

  /**
   * @method grade
   * @param grade {number}
   * @return {G2}
   * @chainable
   */
  grade(grade: number): G2 {
    switch (grade) {
      case 0:
        return new G2(this.α, 0, 0, 0, this.uom);
      case 1:
        return new G2(0, this.x, this.y, 0, this.uom);
      case 2:
        return new G2(0, 0, 0, this.β, this.uom);
      default:
        return new G2(0, 0, 0, 0, this.uom);
    }
  }

  /**
   * @method cos
   * @return {G2}
   * @chainable
   */
  cos(): G2 {
    throw new Error(notImplemented('cos').message)
  }

  /**
   * @method cosh
   * @return {G2}
   * @chainable
   */
  cosh(): G2 {
    throw new Error(notImplemented('cosh').message)
  }

  /**
   * @method exp
   * @return {G2}
   * @chainable
   */
  exp(): G2 {
    Unit.assertDimensionless(this.uom)
    if (this.isSpinor()) {
      const expα = Math.exp(this.α)
      const cosβ = Math.cos(this.β)
      const sinβ = Math.sin(this.β)
      return new G2(expα * cosβ, 0, 0, expα * sinβ)
    }
    else {
      throw new Error(notImplemented(`exp(${this.toString()})`).message)
    }
  }

  /**
   * Computes the <em>inverse</em> of this multivector, if it exists.
   *
   * @method inv
   * @return {G2}
   * @chainable
   */
  inv(): G2 {

    const α = this.α
    const x = this.x
    const y = this.y
    const β = this.β

    const A = [
      [α, x, y, -β],
      [x, α, β, -y],
      [y, -β, α, x],
      [β, -y, x, α]
    ]
    const b = [1, 0, 0, 0]

    const X = gauss(A, b)
    const uom = this.uom ? this.uom.inv() : void 0
    return new G2(X[0], X[1], X[2], X[3], uom);
  }

  /**
   * Determines whether this multivector has grade(1) components.
   *
   * @method isSpinor
   * @return {boolean}
   */
  isSpinor(): boolean {
    return this.x === 0 && this.y === 0
  }

  /**
   * @method log
   * @return {G2}
   * @chainable
   */
  log(): G2 {
    throw new Error(notImplemented('log').message)
  }

  /**
   * Computes the <em>square root</em> of the <em>squared norm</em>.
   *
   * @method magnitude
   * @return {G2}
   * @chainable
   */
  magnitude(): G2 {
    return this.norm()
  }

  /**
   * Intentionally undocumented.
   */
  magnitudeSansUnits(): number {
    return Math.sqrt(this.squaredNormSansUnits())
  }

  /**
   * @method norm
   * @return {G2}
   * @chainable
   */
  norm(): G2 {
    return new G2(this.magnitudeSansUnits(), 0, 0, 0, this.uom);
  }

  /**
   * @method quad
   * @return {G2}
   * @chainable
   */
  quad(): G2 {
    return new G2(this.squaredNormSansUnits(), 0, 0, 0, Unit.mul(this.uom, this.uom));
  }

  /**
   * @method quadraticBezier
   * @param t {number}
   * @param controlPoint {GeometricE2}
   * @param endPoint {GeometricE2}
   * @return {G2}
   * @chainable
   */
  quadraticBezier(t: number, controlPoint: GeometricE2, endPoint: GeometricE2): G2 {
    const α = b2(t, this.α, controlPoint.α, endPoint.α)
    const x = b2(t, this.x, controlPoint.x, endPoint.x)
    const y = b2(t, this.y, controlPoint.y, endPoint.y)
    const β = b2(t, this.β, controlPoint.β, endPoint.β)
    return new G2(α, x, y, β, this.uom);
  }

  /**
   * @method squaredNorm
   * @return {G2}
   * @chainable
   */
  public squaredNorm(): G2 {
    return this.quad()
  }

  /**
   * Intentionally undocumented.
   */
  public squaredNormSansUnits(): number {
    const α = this.α
    const x = this.x
    const y = this.y
    const β = this.β
    return α * α + x * x + y * y + β * β
  }


  /**
   * @method stress
   * @param σ {VectorE2}
   * @return {G2}
   * @chainable
   */
  stress(σ: VectorE2): G2 {
    throw new Error(notSupported('stress').message)
  }


  /**
   * Computes the <em>reflection</em> of this multivector in the plane with normal <code>n</code>.
   *
   *
   * @method reflect
   * @param n {VectorE2}
   * @return {G2}
   * @chainable
   */
  reflect(n: VectorE2): G2 {
    // TODO: Optimize to minimize object creation and increase performance.
    const m = G2.fromVectorE2(n)
    return m.mul(this).mul(m).scale(-1)
  }

  /**
   * @method rev
   * @return {G2}
   * @chainable
   */
  rev(): G2 {
    return new G2(this.α, this.x, this.y, -this.β, this.uom)
  }

  /**
   * @method rotate
   * @param spinor {SpinorE2}
   * @return {G2}
   * @chainable
   */
  rotate(spinor: SpinorE2): G2 {
    const x = this.x
    const y = this.y
    const α = spinor.α
    const β = spinor.β
    const α2 = α * α
    const β2 = β * β
    const p = α2 - β2
    const q = 2 * α * β
    const s = α2 + β2
    return new G2(s * this.α, p * x + q * y, p * y - q * x, s * this.β, this.uom)
  }

  /**
   * @method sin
   * @return {G2}
   * @chainable
   */
  sin(): G2 {
    throw new Error(notImplemented('sin').message)
  }

  /**
   * @method sinh
   * @return {G2}
   * @chainable
   */
  sinh(): G2 {
    throw new Error(notImplemented('sinh').message)
  }

  /**
   * @method slerp
   * @param target {G2}
   * @param α {number}
   * @return {G2}
   * @chainable
   */
  slerp(target: G2, α: number): G2 {
    throw new Error(notImplemented('slerp').message)
  }

  /**
   * @method tan
   * @return {G2}
   * @chainable
   */
  tan(): G2 {
    return this.sin().div(this.cos())
  }

  /**
   * @method isOne
   * @return {boolean}
   */
  isOne(): boolean { return this.α === 1 && this.x === 0 && this.y === 0 && this.β === 0 }
  isNaN(): boolean { return isNaN(this.α) || isNaN(this.x) || isNaN(this.y) || isNaN(this.β) }
  /**
   * @method isZero
   * @return {boolean}
   */
  isZero(): boolean { return this.α === 0 && this.x === 0 && this.y === 0 && this.β === 0 }

  private toStringCustom(
    coordToString: (x: number) => string,
    labels: string[]): string {
    var quantityString: string = stringFromCoordinates(this.coords, coordToString, labels);
    if (this.uom) {
      var unitString = this.uom.toString().trim();
      if (unitString) {
        return quantityString + ' ' + unitString;
      }
      else {
        return quantityString;
      }
    }
    else {
      return quantityString;
    }
  }

  /**
   * @method toExponential
   * @param [fractionDigits] {number}
   * @return {string}
   */
  public toExponential(fractionDigits?: number): string {
    const coordToString = function(coord: number): string { return coord.toExponential(fractionDigits) };
    return this.toStringCustom(coordToString, ["1", "e1", "e2", "e12"]);
  }

  /**
   * @method toFixed
   * @param [fractionDigits] {number}
   * @return {string}
   */
  public toFixed(fractionDigits?: number): string {
    const coordToString = function(coord: number): string { return coord.toFixed(fractionDigits) };
    return this.toStringCustom(coordToString, ["1", "e1", "e2", "e12"]);
  }

  /**
   * @method toPrecision
   * @param [precision] {number}
   * @return {string}
   */
  public toPrecision(precision?: number): string {
    const coordToString = function(coord: number): string { return coord.toPrecision(precision) };
    return this.toStringCustom(coordToString, ["1", "e1", "e2", "e12"]);
  }

  /**
   * @method toString
   * @param [radix] {number}
   * @return {string}
   */
  public toString(radix?: number): string {
    const coordToString = function(coord: number): string { return coord.toString(radix) };
    return this.toStringCustom(coordToString, ["1", "e1", "e2", "e12"]);
  }

  toStringIJK(): string {
    var coordToString = function(coord: number): string { return coord.toString() };
    return this.toStringCustom(coordToString, ["1", "i", "j", "I"]);
  }

  /*
  private toStringLATEX(): string {
    var coordToString = function(coord: number): string { return coord.toString() };
    return this.toStringCustom(coordToString, ["1", "e_{1}", "e_{2}", "e_{12}"]);
  }
  */

  /**
   * @method copy
   * @param M {GeometricE2}
   * @return {G2}
   * @chainable
   * @static
   */
  static copy(m: GeometricE2): G2 {
    if (m instanceof G2) {
      return m
    }
    else {
      return new G2(m.α, m.x, m.y, m.β, void 0)
    }
  }

  /**
   * @method fromVectorE2
   * @param vector {VectorE2}
   * @return {G2}
   * @chainable
   * @static
   */
  static fromVectorE2(vector: VectorE2): G2 {
    if (vector) {
      if (vector instanceof G2) {
        return new G2(0, vector.x, vector.y, 0, vector.uom)
      }
      else {
        return new G2(0, vector.x, vector.y, 0, void 0)
      }
    }
    else {
      return void 0
    }
  }

  /**
   * @method vector
   * @param x {number}
   * @param y {number}
   * @param [uom] {Unit}
   * @return {G2}
   * @chainable
   * @static
   */
  static vector(x: number, y: number, uom?: Unit): G2 {
    return new G2(0, x, y, 0, uom)
  }
}
