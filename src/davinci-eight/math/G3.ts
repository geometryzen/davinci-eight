import addE3 from './addE3';
import b2 from '../geometries/b2';
import b3 from '../geometries/b3';
import extG3 from './extG3';
import GeometricE3 from './GeometricE3';
import lcoG3 from './lcoG3';
import GeometricOperators from './GeometricOperators';
import ImmutableMeasure from './ImmutableMeasure';
import mulG3 from './mulG3';
import gauss from './gauss';
import GeometricNumber from './GeometricNumber';
import notImplemented from '../i18n/notImplemented';
import notSupported from '../i18n/notSupported';
import quadSpinorE3 from './quadSpinorE3'
import rcoG3 from './rcoG3';
import readOnly from '../i18n/readOnly';
import scpG3 from './scpG3';
import SpinorE3 from './SpinorE3';
import squaredNormG3 from './squaredNormG3';
import stringFromCoordinates from './stringFromCoordinates';
import subE3 from './subE3';
import TrigMethods from './TrigMethods';
import Unit from './Unit';
import VectorE3 from './VectorE3';
import BASIS_LABELS_G3_GEOMETRIC from './BASIS_LABELS_G3_GEOMETRIC';
import BASIS_LABELS_G3_HAMILTON from './BASIS_LABELS_G3_HAMILTON';
import BASIS_LABELS_G3_STANDARD from './BASIS_LABELS_G3_STANDARD';
import BASIS_LABELS_G3_STANDARD_HTML from './BASIS_LABELS_G3_STANDARD_HTML';

/**
 * @module EIGHT
 * @submodule math
 */

const COORD_SCALAR = 0
const COORD_X = 1
const COORD_Y = 2
const COORD_Z = 3
const COORD_XY = 4
const COORD_YZ = 5
const COORD_ZX = 6
const COORD_PSEUDO = 7

function compute(
  f: (x0: number, x1: number, x2: number, x3: number, x4: number, x5: number, x6: number, x7: number, y0: number, y1: number, y2: number, y3: number, y4: number, y5: number, y6: number, y7: number, index: number) => number,
  a: number[],
  b: number[],
  coord: (m: number[], index: number) => number,
  pack: (x0: number, x1: number, x2: number, x3: number, x4: number, x5: number, x6: number, x7: number, uom: Unit) => G3,
  uom: Unit): G3 {
  var a0 = coord(a, 0);
  var a1 = coord(a, 1);
  var a2 = coord(a, 2);
  var a3 = coord(a, 3);
  var a4 = coord(a, 4);
  var a5 = coord(a, 5);
  var a6 = coord(a, 6);
  var a7 = coord(a, 7);
  var b0 = coord(b, 0);
  var b1 = coord(b, 1);
  var b2 = coord(b, 2);
  var b3 = coord(b, 3);
  var b4 = coord(b, 4);
  var b5 = coord(b, 5);
  var b6 = coord(b, 6);
  var b7 = coord(b, 7);
  var x0 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
  var x1 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
  var x2 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
  var x3 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
  var x4 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
  var x5 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
  var x6 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
  var x7 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
  return pack(x0, x1, x2, x3, x4, x5, x6, x7, uom);
}

/**
 * <p>
 * The <code>G3</code> class represents a multivector for a 3-dimensional vector space with a Euclidean metric.
 * </p>
 * <p>
 * The <code>G3</code> class is immutable, making it easy to reason about values.
 * </p>
 * <p>
 * The <code>G3</code> class supports units of measures.
 * </p>
 * <p>
 * The immutable nature of the <p>G3</p> makes it less suitable for high performance graphics applications.
 * </p>
 *
 * @class G3
 */
export default class G3 implements ImmutableMeasure<G3>, GeometricE3, GeometricNumber<G3, G3, SpinorE3, VectorE3, G3, number, Unit>, GeometricOperators<G3, Unit>, TrigMethods<G3> {
  static get BASIS_LABELS_GEOMETRIC(): string[][] { return BASIS_LABELS_G3_GEOMETRIC };
  static get BASIS_LABELS_HAMILTON(): string[][] { return BASIS_LABELS_G3_HAMILTON };
  static get BASIS_LABELS_STANDARD(): string[][] { return BASIS_LABELS_G3_STANDARD };
  static get BASIS_LABELS_STANDARD_HTML(): string[][] { return BASIS_LABELS_G3_STANDARD_HTML };

  /**
   * @property BASIS_LABELS
   * @type {string[][]}
   */
  static BASIS_LABELS: string[][] = BASIS_LABELS_G3_STANDARD

  /**
   * @property zero
   * @type {G3}
   * @static
   */
  public static zero = new G3(0, 0, 0, 0, 0, 0, 0, 0);

  /**
   * @property one
   * @type {G3}
   * @static
   */
  public static one = new G3(1, 0, 0, 0, 0, 0, 0, 0);

  /**
   * @property e1
   * @type {G3}
   * @static
   */
  public static e1 = new G3(0, 1, 0, 0, 0, 0, 0, 0);

  /**
   * @property e2
   * @type {G3}
   * @static
   */
  public static e2 = new G3(0, 0, 1, 0, 0, 0, 0, 0);

  /**
   * @property e3
   * @type {G3}
   * @static
   */
  public static e3 = new G3(0, 0, 0, 1, 0, 0, 0, 0);

  /**
   * @property kilogram
   * @type {G3}
   * @static
   */
  public static kilogram = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit.KILOGRAM);

  /**
   * @property meter
   * @type {G3}
   * @static
   */
  public static meter = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit.METER);

  /**
   * @property second
   * @type {G3}
   * @static
   */
  public static second = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit.SECOND);

  /**
   * @property coulomb
   * @type {G3}
   * @static
   */
  public static coulomb = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit.COULOMB);

  /**
   * @property ampere
   * @type {G3}
   * @static
   */
  public static ampere = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit.AMPERE);

  /**
   * @property kelvin
   * @type {G3}
   * @static
   */
  public static kelvin = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit.KELVIN);

  /**
   * @property mole
   * @type {G3}
   * @static
   */
  public static mole = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit.MOLE);

  /**
   * @property candela
   * @type {G3}
   * @static
   */
  public static candela = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit.CANDELA);

  /**
   * The coordinate values are stored in a number array.
   * This should be convenient and efficient for tensor calculations.
   *
   * @property _coords
   * @type number[]
   * @private
   */
  private _coords: number[] = [0, 0, 0, 0, 0, 0, 0, 0]

  /**
   * The optional unit of measure.
   * @property uom
   * @type Unit
   */
  // FIXME: This needs to be private and readOnly
  public uom: Unit;
  /**
   * @class G3
   * @constructor
   * @param {number} α The scalar part of the multivector.
   * @param {number} x The vector component of the multivector in the x-direction.
   * @param {number} y The vector component of the multivector in the y-direction.
   * @param {number} z The vector component of the multivector in the z-direction.
   * @param {number} xy The bivector component of the multivector in the xy-plane.
   * @param {number} yz The bivector component of the multivector in the yz-plane.
   * @param {number} zx The bivector component of the multivector in the zx-plane.
   * @param {number} β The pseudoscalar part of the multivector.
   * @param [uom] The optional unit of measure.
   */
  constructor(α: number, x: number, y: number, z: number, xy: number, yz: number, zx: number, β: number, uom?: Unit) {
    this._coords[COORD_SCALAR] = α
    this._coords[COORD_X] = x
    this._coords[COORD_Y] = y
    this._coords[COORD_Z] = z
    this._coords[COORD_XY] = xy
    this._coords[COORD_YZ] = yz
    this._coords[COORD_ZX] = zx
    this._coords[COORD_PSEUDO] = β
    this.uom = uom
    if (this.uom && this.uom.multiplier !== 1) {
      const multiplier: number = this.uom.multiplier;
      this._coords[COORD_SCALAR] *= multiplier;
      this._coords[COORD_X] *= multiplier;
      this._coords[COORD_Y] *= multiplier;
      this._coords[COORD_Z] *= multiplier;
      this._coords[COORD_XY] *= multiplier;
      this._coords[COORD_YZ] *= multiplier;
      this._coords[COORD_ZX] *= multiplier;
      this._coords[COORD_PSEUDO] *= multiplier;
      this.uom = new Unit(1, uom.dimensions, uom.labels);
    }
  }

  /**
   * The scalar part of this multivector.
   * @property α
   * @return {number}
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
   * @return {number}
   */
  get alpha(): number {
    return this._coords[COORD_SCALAR]
  }
  set alpha(unused) {
    throw new Error(readOnly('alpha').message)
  }

  /**
   * The Cartesian coordinate corresponding to the <b>e<sub>1</sub></b> basis vector.
   *
   * @property x
   * @type number
   */
  get x(): number {
    return this._coords[COORD_X]
  }
  set x(unused: number) {
    throw new Error(readOnly('x').message)
  }

  /**
   * The Cartesian coordinate corresponding to the <b>e<sub>2</sub></b> basis vector.
   *
   * @property y
   * @type number
   */
  get y(): number {
    return this._coords[COORD_Y]
  }
  set y(unused: number) {
    throw new Error(readOnly('y').message)
  }

  /**
   * The Cartesian coordinate corresponding to the <b>e<sub>3</sub></b> basis vector.
   *
   * @property z
   * @type number
   */
  get z(): number {
    return this._coords[COORD_Z]
  }
  set z(unused: number) {
    throw new Error(readOnly('z').message)
  }

  /**
   * The coordinate corresponding to the <b>e<sub>1</sub>e<sub>2</sub></b> basis bivector.
   *
   * @property xy
   * @type number
   */
  get xy(): number {
    return this._coords[COORD_XY]
  }
  set xy(unused: number) {
    throw new Error(readOnly('xy').message)
  }

  /**
   * The coordinate corresponding to the <b>e<sub>2</sub>e<sub>3</sub></b> basis bivector.
   *
   * @property yz
   * @type number
   */
  get yz(): number {
    return this._coords[COORD_YZ]
  }
  set yz(unused: number) {
    throw new Error(readOnly('yz').message)
  }

  /**
   * The coordinate corresponding to the <b>e<sub>3</sub>e<sub>1</sub></b> basis bivector.
   *
   * @property zx
   * @type number
   */
  get zx(): number {
    return this._coords[COORD_ZX]
  }
  set zx(unused: number) {
    throw new Error(readOnly('zx').message)
  }

  /**
   * The coordinate corresponding to the <b>e<sub>1</sub>e<sub>2</sub>e<sub>3</sub></b> basis trivector.
   * The pseudoscalar coordinate of this multivector.
   *
   * @property β
   * @return {number}
   */
  get β(): number {
    return this._coords[COORD_PSEUDO]
  }
  set β(unused) {
    throw new Error(readOnly('β').message)
  }

  /**
   * The coordinate corresponding to the <b>e<sub>1</sub>e<sub>2</sub>e<sub>3</sub></b> basis trivector.
   * The pseudoscalar coordinate of this multivector.
   *
   * @property beta
   * @return {number}
   */
  get beta(): number {
    return this._coords[COORD_PSEUDO]
  }
  set beta(unused: number) {
    throw new Error(readOnly('beta').message)
  }

  /**
   * @method fromCartesian
   * @param α {number}
   * @param x {number}
   * @param y {number}
   * @param z {number}
   * @param xy {number}
   * @param yz {number}
   * @param zx {number}
   * @param β {number}
   * @param uom [Unit]
   * @return {G3}
   * @chainable
   * @static
   */
  static fromCartesian(α: number, x: number, y: number, z: number, xy: number, yz: number, zx: number, β: number, uom: Unit): G3 {
    return new G3(α, x, y, z, xy, yz, zx, β, uom)
  }

  /**
   * @property coords
   * @type {number[]}
   */
  get coords(): number[] {
    return [this.α, this.x, this.y, this.z, this.xy, this.yz, this.zx, this.β];
  }

  /**
   * @method coordinate
   * @param index {number}
   * @return {number}
   */
  coordinate(index: number): number {
    switch (index) {
      case 0:
        return this.α;
      case 1:
        return this.x;
      case 2:
        return this.y;
      case 3:
        return this.z;
      case 4:
        return this.xy;
      case 5:
        return this.yz;
      case 6:
        return this.zx;
      case 7:
        return this.β;
      default:
        throw new Error("index must be in the range [0..7]");
    }
  }

  /**
   * Computes the sum of this G3 and another considered to be the rhs of the binary addition, `+`, operator.
   * This method does not change this G3.
   * @method add
   * @param rhs {G3}
   * @return {G3} This G3 plus rhs.
   * @chainable
   */
  add(rhs: G3): G3 {
    const coord = function(x: number[], n: number): number {
      return x[n];
    };
    const pack = function(w: number, x: number, y: number, z: number, xy: number, yz: number, zx: number, xyz: number, uom: Unit): G3 {
      return G3.fromCartesian(w, x, y, z, xy, yz, zx, xyz, uom);
    };
    return compute(addE3, this.coords, rhs.coords, coord, pack, Unit.compatible(this.uom, rhs.uom));
  }

  /**
   * Computes <code>this + Iβ</code>
   *
   * @method addPseudo
   * @param β {Unit}
   * @return {G3}
   * @chainable
   */
  addPseudo(β: Unit): G3 {
    return new G3(this.α, this.x, this.y, this.z, this.xy, this.yz, this.zx, this.β + β.multiplier, Unit.compatible(this.uom, β))
  }

  /**
   * Computes <code>this + α</code>
   * @method addScalar
   * @param α {Unit}
   * @return {G3}
   * @chainable
   */
  addScalar(α: Unit): G3 {
    return new G3(this.α + α.multiplier, this.x, this.y, this.z, this.xy, this.yz, this.zx, this.β, Unit.compatible(this.uom, α))
  }

  /**
   * @method __add__
   * @param rhs {Unit | G3}
   * @return {G3}
   * @private
   */
  __add__(rhs: Unit | G3): G3 {
    if (rhs instanceof G3) {
      return this.add(rhs);
    }
    else if (rhs instanceof Unit) {
      return this.addScalar(rhs);
    }
  }

  /**
   * @method __radd__
   * @param lhs {Unit | G3}
   * @return {G3}
   * @private
   */
  __radd__(lhs: Unit | G3): G3 {
    if (lhs instanceof G3) {
      return lhs.add(this)
    }
    else if (lhs instanceof Unit) {
      return this.addScalar(lhs)
    }
  }

  /**
   * @method adj
   * @return {G3}
   * @chainable
   * @beta
   */
  adj(): G3 {
    throw new Error(notImplemented('adj').message)
  }

  /**
   * @method angle
   * @return {G3} grade(log(M), 2)
   * @chainable
   */
  angle(): G3 {
    return this.log().grade(2);
  }

  /**
   * Computes the <e>Clifford conjugate</em> of this multivector.
   * The grade multiplier is -1<sup>x(x+1)/2</sup>
   * @method conj
   * @return {G3}
   * @chainable
   */
  conj(): G3 {
    return new G3(this.α, -this.x, -this.y, -this.z, -this.xy, -this.yz, -this.zx, +this.β, this.uom);
  }

  /**
   * @method cubicBezier
   * @param t {number}
   * @param controlBegin {GeometricE3}
   * @param controlEnd {GeometricE3}
   * @param endPoint {GeometricE3}
   * @return {G3}
   * @chainable
   */
  cubicBezier(t: number, controlBegin: GeometricE3, controlEnd: GeometricE3, endPoint: GeometricE3) {
    let x = b3(t, this.x, controlBegin.x, controlEnd.x, endPoint.x);
    let y = b3(t, this.y, controlBegin.y, controlEnd.y, endPoint.y);
    let z = b3(t, this.z, controlBegin.z, controlEnd.z, endPoint.z);
    return new G3(0, x, y, z, 0, 0, 0, 0, this.uom);
  }

  /**
   * @method direction
   * @return {G3}
   * @chainable
   */
  direction(): G3 {
    return this.div(this.norm());
  }

  /**
   * @method sub
   * @param rhs {G3}
   * @return {G3}
   * @chainable
   */
  sub(rhs: G3): G3 {
    var coord = function(x: number[], n: number): number {
      return x[n];
    };
    var pack = function(w: number, x: number, y: number, z: number, xy: number, yz: number, zx: number, xyz: number, uom: Unit): G3 {
      return G3.fromCartesian(w, x, y, z, xy, yz, zx, xyz, uom);
    };
    return compute(subE3, this.coords, rhs.coords, coord, pack, Unit.compatible(this.uom, rhs.uom));
  }

  /**
   * @method __sub__
   * @param rhs {Unit | G3}
   * @return {G3}
   * @private
   */
  __sub__(rhs: Unit | G3): G3 {
    if (rhs instanceof G3) {
      return this.sub(rhs);
    }
    else if (rhs instanceof Unit) {
      return this.addScalar(rhs.neg());
    }
  }


  /**
   * @method __rsub__
   * @param lhs {Unit | G3}
   * @return {G3}
   * @private
   */
  __rsub__(lhs: Unit | G3): G3 {
    if (lhs instanceof G3) {
      return lhs.sub(this)
    }
    else if (lhs instanceof Unit) {
      return this.neg().addScalar(lhs)
    }
  }

  /**
   * @method mul
   * @param rhs {G3}
   * @return {G3}
   * @chainable
   */
  mul(rhs: G3): G3 {
    const out = new G3(0, 0, 0, 0, 0, 0, 0, 0, Unit.mul(this.uom, rhs.uom))
    mulG3(this, rhs, out._coords)
    return out
  }

  /**
   * @method __mul__
   * @param rhs {any}
   * @return {G3}
   * @private
   */
  __mul__(rhs: any): any {
    if (rhs instanceof G3) {
      return this.mul(rhs);
    }
    else if (typeof rhs === 'number') {
      return this.scale(rhs);
    }
  }

  /**
   * @method __rmul__
   * @param lhs {any}
   * @return {G3}
   * @private
   */
  __rmul__(lhs: any): any {
    if (lhs instanceof G3) {
      return lhs.mul(this);
    }
    else if (typeof lhs === 'number') {
      return this.scale(lhs);
    }
  }

  /**
   * @method scale
   * @param α {number}
   * @return {G3}
   * @chainable
   */
  scale(α: number): G3 {
    return new G3(this.α * α, this.x * α, this.y * α, this.z * α, this.xy * α, this.yz * α, this.zx * α, this.β * α, this.uom);
  }

  /**
   * @method div
   * @param rhs {G3}
   * @return {G3}
   * @chainable
   */
  div(rhs: G3): G3 {
    return this.mul(rhs.inv())
  }

  /**
   * @method divByScalar
   * @param α {number}
   * @return {G3}
   * @chainable
   */
  divByScalar(α: number): G3 {
    return new G3(this.α / α, this.x / α, this.y / α, this.z / α, this.xy / α, this.yz / α, this.zx / α, this.β / α, this.uom);
  }

  /**
   * @method __div__
   * @param rhs {any}
   * @return {G3}
   * @chainable
   * @private
   */
  __div__(rhs: any): G3 {
    if (rhs instanceof G3) {
      return this.div(rhs);
    }
    else if (typeof rhs === 'number') {
      return this.divByScalar(rhs);
    }
  }

  /**
   * @method __rdiv__
   * @param lhs {any}
   * @return {G3}
   * @private
   */
  __rdiv__(lhs: any): G3 {
    if (lhs instanceof G3) {
      return lhs.div(this);
    }
    else if (typeof lhs === 'number') {
      return new G3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).div(this);
    }
  }

  /**
   * @method dual
   * @return {G3}
   * @chainable
   * @beta
   */
  dual(): G3 {
    throw new Error(notImplemented('dual').message)
  }

  /**
   * @method scp
   * @param rhs {G3}
   * @return {G3}
   * @chainable
   */
  scp(rhs: G3): G3 {
    var out = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit.mul(this.uom, rhs.uom));
    scpG3(this, rhs, G3.mutator(out));
    return out;
  }

  /**
   * @method ext
   * @param rhs {G3}
   * @return {G3}
   * @chainable
   */
  ext(rhs: G3): G3 {
    const out = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit.mul(this.uom, rhs.uom));
    extG3(this, rhs, G3.mutator(out));
    return out;
  }

  /**
   * @method __vbar__
   * @param rhs {any}
   * @return {G3}
   * @chainable
   * @private
   */
  __vbar__(rhs: any): G3 {
    if (rhs instanceof G3) {
      return this.scp(rhs);
    }
    else if (typeof rhs === 'number') {
      return this.scp(new G3(rhs, 0, 0, 0, 0, 0, 0, 0, void 0));
    }
  }

  /**
   * @method __rvbar__
   * @param lhs {any}
   * @return {G3}
   * @chainable
   * @private
   */
  __rvbar__(lhs: any): G3 {
    if (lhs instanceof G3) {
      return lhs.scp(this)
    }
    else if (typeof lhs === 'number') {
      return new G3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).scp(this);
    }
  }

  /**
   * @method __wedge__
   * @param rhs {any}
   * @return {G3}
   * @chainable
   * @private
   */
  __wedge__(rhs: any): G3 {
    if (rhs instanceof G3) {
      return this.ext(rhs);
    }
    else if (typeof rhs === 'number') {
      return this.scale(rhs)
    }
  }

  /**
   * @method __rwedge__
   * @param lhs {any}
   * @return {G3}
   * @chainable
   * @private
   */
  __rwedge__(lhs: any): G3 {
    if (lhs instanceof G3) {
      return lhs.ext(this)
    }
    else if (typeof lhs === 'number') {
      return this.scale(lhs)
    }
  }

  /**
   * @method lco
   * @param rhs {G3}
   * @return {G3}
   * @chainable
   */
  lco(rhs: G3): G3 {
    const out = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit.mul(this.uom, rhs.uom))
    lcoG3(this, rhs, G3.mutator(out))
    return out
  }

  /**
   * @method __lshift__
   * @param rhs {any}
   * @return {G3}
   * @chainable
   * @private
   */
  __lshift__(rhs: any): G3 {
    if (rhs instanceof G3) {
      return this.lco(rhs)
    }
    else if (typeof rhs === 'number') {
      return this.lco(new G3(rhs, 0, 0, 0, 0, 0, 0, 0, void 0));
    }
  }

  /**
   * @method __rlshift__
   * @param lhs {any}
   * @return {G3}
   * @chainable
   * @private
   */
  __rlshift__(lhs: any): G3 {
    if (lhs instanceof G3) {
      return lhs.lco(this)
    }
    else if (typeof lhs === 'number') {
      return new G3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).lco(this);
    }
  }

  /**
   * @method rco
   * @param rhs {G3}
   * @return {G3}
   * @chainable
   */
  rco(rhs: G3): G3 {
    const out = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit.mul(this.uom, rhs.uom))
    rcoG3(this, rhs, G3.mutator(out))
    return out
  }

  /**
   * @method __rshift__
   * @param rhs {any}
   * @return {G3}
   * @chainable
   * @private
   */
  __rshift__(rhs: any): G3 {
    if (rhs instanceof G3) {
      return this.rco(rhs)
    }
    else if (typeof rhs === 'number') {
      return this.rco(new G3(rhs, 0, 0, 0, 0, 0, 0, 0, void 0));
    }
  }

  /**
   * @method __rrshift__
   * @param lhs {any}
   * @return {G3}
   * @chainable
   * @private
   */
  __rrshift__(lhs: any): G3 {
    if (lhs instanceof G3) {
      return lhs.rco(this)
    }
    else if (typeof lhs === 'number') {
      return new G3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).rco(this);
    }
  }

  /**
   * @method pow
   * @param exponent {G3}
   * @return {G3}
   * @chainable
   * @beta
   */
  pow(exponent: G3): G3 {
    throw new Error('pow');
  }

  /**
   * @method __bang__
   * @return {G3}
   * @chainable
   * @private
   */
  __bang__(): G3 {
    return this.inv()
  }

  /**
   * Unary plus(+).
   * @method __pos__
   * @return {G3}
   * @chainable
   * @private
   */
  __pos__(): G3 {
    return this;
  }

  /**
   * @method neg
   * @return {G3} <code>-1 * this</code>
   * @chainable
   */
  neg(): G3 {
    return new G3(-this.α, -this.x, -this.y, -this.z, -this.xy, -this.yz, -this.zx, -this.β, this.uom);
  }

  /**
   * Unary minus (-).
   * @method __neg__
   * @return {G3}
   * @chainable
   * @private
   */
  __neg__(): G3 {
    return this.neg()
  }

  /**
   * @method rev
   * @return {G3}
   * @chainable
   */
  rev(): G3 {
    return new G3(this.α, this.x, this.y, this.z, -this.xy, -this.yz, -this.zx, -this.β, this.uom);
  }

  /**
   * ~ (tilde) produces reversion.
   * @method __tilde__
   * @return {G3}
   * @chainable
   * @private
   */
  __tilde__(): G3 {
    return this.rev();
  }

  /**
   * @method grade
   * @param grade {number}
   * @return {G3}
   * @chainable
   */
  grade(grade: number): G3 {
    switch (grade) {
      case 0:
        return G3.fromCartesian(this.α, 0, 0, 0, 0, 0, 0, 0, this.uom);
      case 1:
        return G3.fromCartesian(0, this.x, this.y, this.z, 0, 0, 0, 0, this.uom);
      case 2:
        return G3.fromCartesian(0, 0, 0, 0, this.xy, this.yz, this.zx, 0, this.uom);
      case 3:
        return G3.fromCartesian(0, 0, 0, 0, 0, 0, 0, this.β, this.uom);
      default:
        return G3.fromCartesian(0, 0, 0, 0, 0, 0, 0, 0, this.uom);
    }
  }

  /**
   * Intentionally undocumented
   */
  /*
  dot(vector: G3): number {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
  }
  */

  /**
   * @method cross
   * @param vector {G3}
   * @return {G3}
   * @chainable
   */
  cross(vector: G3): G3 {
    var x: number;
    var x1: number;
    var x2: number;
    var y: number;
    var y1: number;
    var y2: number;
    var z: number;
    var z1: number;
    var z2: number;

    x1 = this.x;
    y1 = this.y;
    z1 = this.z;
    x2 = vector.x;
    y2 = vector.y;
    z2 = vector.z;
    x = y1 * z2 - z1 * y2;
    y = z1 * x2 - x1 * z2;
    z = x1 * y2 - y1 * x2;
    return new G3(0, x, y, z, 0, 0, 0, 0, Unit.mul(this.uom, vector.uom));
  }

  /**
   * @method isOne
   * @return {boolean}
   */
  isOne(): boolean {
    return (this.α === 1) && (this.x === 0) && (this.y === 0) && (this.z === 0) && (this.yz === 0) && (this.zx === 0) && (this.xy === 0) && (this.β === 0);
  }

  /**
   * @method isZero
   * @return {boolean}
   */
  isZero(): boolean {
    return (this.α === 0) && (this.x === 0) && (this.y === 0) && (this.z === 0) && (this.yz === 0) && (this.zx === 0) && (this.xy === 0) && (this.β === 0);
  }

  /**
   * @method lerp
   * @param target {G3}
   * @param α {number}
   * @return {G3}
   * @chainable
   */
  lerp(target: G3, α: number): G3 {
    throw new Error(notImplemented('lerp').message)
  }

  /**
   * @method cos
   * @return {G3}
   * @chainable
   */
  cos(): G3 {
    // TODO: Generalize to full multivector.
    Unit.assertDimensionless(this.uom)
    const cosW = Math.cos(this.α)
    return new G3(cosW, 0, 0, 0, 0, 0, 0, 0)
  }

  /**
   * @method cosh
   * @return {G3}
   * @chainable
   */
  cosh(): G3 {
    throw new Error(notImplemented('cosh').message)
  }

  /**
   * @method distanceTo
   * @param point {G3}
   * @return {number}
   */
  distanceTo(point: G3): number {
    // TODO: Should this be generalized to all coordinates?
    const dx = this.x - point.x;
    const dy = this.y - point.y;
    const dz = this.z - point.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * @method equals
   * @param other {G3}
   * @return {boolean}
   */
  equals(other: G3): boolean {
    if (this.α === other.α && this.x === other.x && this.y === other.y && this.z === other.z && this.xy === other.xy && this.yz === other.yz && this.zx === other.zx && this.β === other.β) {
      if (this.uom) {
        if (other.uom) {
          // TODO: We need equals on
          return true
        }
        else {
          return false
        }
      }
      else {
        if (other.uom) {
          return false
        }
        else {
          return true
        }
      }
    }
    else {
      return false
    }
  }

  /**
   * @method exp
   * @return {G3}
   * @chainable
   */
  exp(): G3 {
    Unit.assertDimensionless(this.uom);
    const bivector = this.grade(2);
    const a = bivector.norm();
    if (!a.isZero()) {
      const c = a.cos();
      const s = a.sin();
      const B = bivector.direction();
      return c.add(B.mul(s));
    }
    else {
      return new G3(1, 0, 0, 0, 0, 0, 0, 0, this.uom);
    }
  }

  /**
   * Computes the <em>inverse</em> of this multivector, if it exists.
   * @method inv
   * @return {G3}
   * @chainable
   */
  inv(): G3 {

    const α = this.α
    const x = this.x
    const y = this.y
    const z = this.z
    const xy = this.xy
    const yz = this.yz
    const zx = this.zx
    const β = this.β

    const A = [
      [α, x, y, z, -xy, -yz, -zx, -β],
      [x, α, xy, -zx, -y, -β, z, -yz],
      [y, -xy, α, yz, x, -z, -β, -zx],
      [z, zx, -yz, α, -β, y, -x, -xy],
      [xy, -y, x, β, α, zx, -yz, z],
      [yz, β, -z, y, -zx, α, xy, x],
      [zx, z, β, -x, yz, -xy, α, y],
      [β, yz, zx, xy, z, x, y, α]
    ]

    const b = [1, 0, 0, 0, 0, 0, 0, 0]

    const X = gauss(A, b)

    const uom = this.uom ? this.uom.inv() : void 0
    return new G3(X[0], X[1], X[2], X[3], X[4], X[5], X[6], X[7], uom);
  }

  /**
   * @method log
   * @return {G3}
   * @chainable
   */
  log(): G3 {
    throw new Error(notImplemented('log').message)
  }

  /**
   * Computes the <em>square root</em> of the <em>squared norm</em>.
   * @method magnitude
   * @return {G3}
   * @chainable
   */
  magnitude(): G3 {
    return this.norm();
  }

  /**
   * Intentionally undocumented.
   */
  magnitudeSansUnits(): number {
    return Math.sqrt(this.squaredNormSansUnits())
  }

  /**
   * Computes the magnitude of this G3. The magnitude is the square root of the quadrance.
   * @method norm
   * @return {G3}
   * @chainable
   */
  norm(): G3 {
    return new G3(this.magnitudeSansUnits(), 0, 0, 0, 0, 0, 0, 0, this.uom)
  }

  /**
   * Computes the quadrance of this G3. The quadrance is the square of the magnitude.
   * @method quad
   * @return {G3}
   * @chainable
   */
  quad(): G3 {
    return this.squaredNorm();
  }

  /**
   * @method quadraticBezier
   * @param t {number}
   * @param controlPoint {GeometricE3}
   * @param endPoint {GeometricE3}
   * @return {G3}
   * @chainable
   */
  quadraticBezier(t: number, controlPoint: GeometricE3, endPoint: GeometricE3): G3 {
    const x = b2(t, this.x, controlPoint.x, endPoint.x);
    const y = b2(t, this.y, controlPoint.y, endPoint.y);
    const z = b2(t, this.z, controlPoint.z, endPoint.z);
    return new G3(0, x, y, z, 0, 0, 0, 0, this.uom);
  }

  /**
   * @method squaredNorm
   * @return {G3}
   * @chainable
   */
  squaredNorm(): G3 {
    return new G3(this.squaredNormSansUnits(), 0, 0, 0, 0, 0, 0, 0, Unit.mul(this.uom, this.uom));
  }

  /**
   * Intentionally undocumented
   */
  squaredNormSansUnits(): number {
    return squaredNormG3(this);
  }

  /**
   * @method stress
   * @param σ {VectorE3}
   * @return {G3}
   * @chainable
   */
  stress(σ: VectorE3): G3 {
    throw new Error(notSupported('stress').message)
  }

  /**
   * Computes the <em>reflection</em> of this multivector in the plane with normal <code>n</code>.
   * @method reflect
   * @param n {VectorE3}
   * @return {G3}
   * @chainable
   */
  reflect(n: VectorE3): G3 {
    // TODO: Optimize to minimize object creation and increase performance.
    let m = G3.fromVector(n)
    return m.mul(this).mul(m).scale(-1)
  }

  /**
   * @method rotate
   * @param R {SpinorE3}
   * @return {G3}
   * @chainable
   */
  rotate(R: SpinorE3): G3 {
    // FIXME: This only rotates the vector components.
    // The units may be suspect to if rotate is not clearly defined.
    const x = this.x;
    const y = this.y;
    const z = this.z;

    const a = R.xy;
    const b = R.yz;
    const c = R.zx;
    const α = R.α;
    const quadR = quadSpinorE3(R)

    const ix = α * x - c * z + a * y;
    const iy = α * y - a * x + b * z;
    const iz = α * z - b * y + c * x;
    const iα = b * x + c * y + a * z;

    const αOut = quadR * this.α
    const xOut = ix * α + iα * b + iy * a - iz * c;
    const yOut = iy * α + iα * c + iz * b - ix * a;
    const zOut = iz * α + iα * a + ix * c - iy * b;
    const βOut = quadR * this.β

    return G3.fromCartesian(αOut, xOut, yOut, zOut, 0, 0, 0, βOut, this.uom)
  }

  /**
   * @method sin
   * @return {G3}
   * @chainable
   */
  sin(): G3 {
    // TODO: Generalize to full multivector.
    Unit.assertDimensionless(this.uom);
    const sinW = Math.sin(this.α);
    return new G3(sinW, 0, 0, 0, 0, 0, 0, 0, void 0);
  }

  /**
   * @method sinh
   * @return {G3}
   * @chainable
   */
  sinh(): G3 {
    throw new Error(notImplemented('sinh').message)
  }

  /**
   * @method slerp
   * @param target {G3}
   * @param α {number}
   * @return {G3}
   * @chainable
   */
  slerp(target: G3, α: number): G3 {
    throw new Error(notImplemented('slerp').message)
  }

  /**
   * @method sqrt
   * @return {G3}
   * @chainable
   */
  sqrt() {
    return new G3(Math.sqrt(this.α), 0, 0, 0, 0, 0, 0, 0, Unit.sqrt(this.uom));
  }

  /**
   * @method tan
   * @return {G3}
   * @chainable
   */
  tan(): G3 {
    return this.sin().div(this.cos())
  }

  /**
   * Intentionally undocumented.
   */
  toStringCustom(coordToString: (x: number) => string, labels: (string | string[])[]): string {
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
  toExponential(fractionDigits?: number): string {
    const coordToString = function(coord: number): string { return coord.toExponential(fractionDigits) };
    return this.toStringCustom(coordToString, G3.BASIS_LABELS);
  }

  /**
   * @method toFixed
   * @param [fractionDigits] {number}
   * @return {string}
   */
  toFixed(fractionDigits?: number): string {
    const coordToString = function(coord: number): string { return coord.toFixed(fractionDigits) };
    return this.toStringCustom(coordToString, G3.BASIS_LABELS);
  }

  /**
   * @method toPrecision
   * @param [precision] {number}
   * @return {string}
   */
  toPrecision(precision?: number): string {
    const coordToString = function(coord: number): string { return coord.toPrecision(precision) };
    return this.toStringCustom(coordToString, G3.BASIS_LABELS);
  }

  /**
   * @method toString
   * @param [radix] {number}
   * @return {string}
   */
  toString(radix?: number): string {
    const coordToString = function(coord: number): string { return coord.toString(radix) };
    return this.toStringCustom(coordToString, G3.BASIS_LABELS);
  }

  /**
   * Provides access to the internals of G3 in order to use `product` functions.
   */
  private static mutator(M: G3): GeometricE3 {
    const that: GeometricE3 = {
      set α(α: number) {
        M._coords[COORD_SCALAR] = α
      },
      set x(x: number) {
        M._coords[COORD_X] = x
      },
      set y(y: number) {
        M._coords[COORD_Y] = y
      },
      set z(z: number) {
        M._coords[COORD_Z] = z
      },
      set yz(yz: number) {
        M._coords[COORD_YZ] = yz
      },
      set zx(zx: number) {
        M._coords[COORD_ZX] = zx
      },
      set xy(xy: number) {
        M._coords[COORD_XY] = xy
      },
      set β(β: number) {
        M._coords[COORD_PSEUDO] = β
      }
    }
    return that
  }

  /**
   * @method copy
   * @param m {GeometricE3}
   * @param [uom] {Unit}
   * @return {G3}
   * @chainable
   * @static
   */
  static copy(m: GeometricE3, uom?: Unit): G3 {
    return new G3(m.α, m.x, m.y, m.z, m.xy, m.yz, m.zx, m.β, uom)
  }

  /**
   * @method direction
   * @param vector {VectorE3}
   * @return {G3}
   * @chainable
   * @static
   */
  static direction(vector: VectorE3): G3 {
    if (vector) {
      return new G3(0, vector.x, vector.y, vector.z, 0, 0, 0, 0).direction()
    }
    else {
      return void 0
    }
  }

  /**
   * @method fromSpinor
   * @param spinor {SpinorE3}
   * @return {G3}
   * @chainable
   * @static
   */
  static fromSpinor(spinor: SpinorE3): G3 {
    if (spinor) {
      // FIXME: SpinorE3 should support uom, even though it might be 1
      return new G3(spinor.α, 0, 0, 0, spinor.xy, spinor.yz, spinor.zx, 0, void 0)
    }
    else {
      return void 0
    }
  }

  /**
   * @method fromVector
   * @param vector {VectorE3}
   * @param [uom] {Unit}
   * @return {G3}
   * @chainable
   * @static
   */
  static fromVector(vector: VectorE3, uom?: Unit): G3 {
    if (vector) {
      return new G3(0, vector.x, vector.y, vector.z, 0, 0, 0, 0, uom)
    }
    else {
      return void 0
    }
  }

  /**
   * @method random
   * @param [uom] Unit
   * @return {G3}
   * @chainable
   * @static
   */
  static random(uom?: Unit): G3 {
    return new G3(Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), uom)
  }

  /**
   * @method scalar
   * @param α {number}
   * @param [uom] {Unit}
   * @return {G3}
   * @chainable
   * @static
   */
  static scalar(α: number, uom?: Unit): G3 {
    return new G3(α, 0, 0, 0, 0, 0, 0, 0, uom)
  }

  /**
   * @method vector
   * @param x {number}
   * @param y {number}
   * @param z {number}
   * @param [uom] {Unit}
   * @return {G3}
   * @chainable
   * @static
   */
  static vector(x: number, y: number, z: number, uom?: Unit): G3 {
    return new G3(0, x, y, z, 0, 0, 0, 0, uom)
  }
}
