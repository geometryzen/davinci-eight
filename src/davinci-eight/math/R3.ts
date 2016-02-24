import notImplemented from '../i18n/notImplemented'
import mustBeNumber from '../checks/mustBeNumber'
import mustBeObject from '../checks/mustBeObject'
import NormedLinearElement from './NormedLinearElement'
import readOnly from '../i18n/readOnly'
import SpinorE3 from './SpinorE3'
import stringFromCoordinates from './stringFromCoordinates';
import Unit from './Unit';
import VectorE3 from './VectorE3'

const BASIS_LABELS = ['e1', 'e2', 'e3']

/**
 * @module EIGHT
 * @submodule math
 */

/**
 * <p>
 * An immutable vector in Euclidean 3D space supporting an optional unit of measure.
 * </p>
 * <p>
 * This class is intended to be used for Physical Science education and research by
 * supporting linear algebra applications with units of measure.
 * </p>
 * <p>
 * This class is not intended to be used in high-performance graphics applications
 * owing to the cost of creating temporary objects and unit computation.
 * </p>
 *
 * @class R3
 */
export default class R3 implements VectorE3, NormedLinearElement<R3, R3, SpinorE3, VectorE3, Unit> {
  /**
   * @property _coords
   * @type number[]
   * @private
   */
  private _coords: number[];

  /**
   * @property _uom
   * @type {Unit}
   * @private
   */
  private _uom: Unit;

  /**
   * @property zero
   * @type R3
   * @readOnly
   * @static
   */
  public static zero = new R3(0, 0, 0, Unit.ONE)

  /**
   * @property e1
   * @type R3
   * @readOnly
   * @static
   */
  public static e1 = new R3(1, 0, 0, Unit.ONE)

  /**
   * @property e2
   * @type R3
   * @readOnly
   * @static
   */
  public static e2 = new R3(0, 1, 0, Unit.ONE)

  /**
   * @property e3
   * @type R3
   * @readOnly
   * @static
   */
  public static e3 = new R3(0, 0, 1, Unit.ONE)

  /**
   * @class R3
   * @constructor
   * @param x {number}
   * @param y {number}
   * @param z {number}
   */
  constructor(x: number, y: number, z: number, uom: Unit) {
    mustBeNumber('x', x)
    mustBeNumber('y', y)
    mustBeNumber('z', z)
    this._coords = [x, y, z]
    this._uom = mustBeObject('uom', uom)
  }

  /**
   * @property x
   * @type number
   * @readOnly
   */
  get x(): number {
    return this._coords[0]
  }
  set x(unused: number) {
    throw new Error(readOnly('x').message)
  }

  /**
   * @property y
   * @type number
   * @readOnly
   */
  get y(): number {
    return this._coords[1]
  }
  set y(unused: number) {
    throw new Error(readOnly('y').message)
  }

  /**
   * @property z
   * @type number
   * @readOnly
   */
  get z(): number {
    return this._coords[2]
  }
  set z(unused: number) {
    throw new Error(readOnly('z').message)
  }

  /**
   * @property uom
   * @type Unit
   * @readOnly
   */
  get uom(): Unit {
    return this._uom
  }
  set uom(unused: Unit) {
    throw new Error(readOnly('uom').message)
  }

  /**
   * @method add
   * @param rhs {R3}
   * @param [α = 1] {number}
   * @return {R3}
   */
  add(rhs: R3, α = 1): R3 {
    throw new Error(notImplemented('add').message)
  }

  /**
   * @method divByScalar
   * @param α {Unit}
   * @return {R3}
   */
  divByScalar(α: Unit): R3 {
    return new R3(this.x, this.y, this.z, this.uom.div(α))
  }

  /**
   * @method lerp
   * @param target {R3}
   * @param α {number}
   * @return {R3}
   */
  lerp(target: R3, α: number): R3 {
    throw new Error(notImplemented('lerp').message)
  }

  /**
   * @method magnitude
   * @return {Unit}
   */
  magnitude(): Unit {
    return this.squaredNorm().sqrt()
  }

  /**
   * @method neg
   * @return {Cartesian3}
   */
  neg(): R3 {
    return new R3(-this.x, -this.y, -this.z, this.uom)
  }

  /**
   * @method reflect
   * @param n {VectorE3}
   * @return {R3}
   */
  reflect(n: VectorE3): R3 {
    throw new Error(notImplemented('reflect').message)
  }

  /**
   * @method rotate
   * @param R {SpinorE3}
   * @return {R3}
   */
  rotate(R: SpinorE3): R3 {
    const x = this.x;
    const y = this.y;
    const z = this.z;

    const a = R.xy;
    const b = R.yz;
    const c = R.zx;
    const w = R.α;

    const ix = w * x - c * z + a * y;
    const iy = w * y - a * x + b * z;
    const iz = w * z - b * y + c * x;
    const iw = b * x + c * y + a * z;

    const ox = ix * w + iw * b + iy * a - iz * c;
    const oy = iy * w + iw * c + iz * b - ix * a;
    const oz = iz * w + iw * a + ix * c - iy * b;

    return new R3(ox, oy, oz, this.uom)
  }

  /**
   * @method scale
   * @param α {Unit}
   * @return {Unit}
   */
  scale(α: Unit): R3 {
    return new R3(this.x, this.y, this.z, this.uom.mul(α))
  }

  /**
   * @method slerp
   * @param target R3
   * @param α {number}
   * @return {R3}
   */
  slerp(target: R3, α: number): R3 {
    throw new Error(notImplemented('slerp').message)
  }

  /**
   * @method squaredNorm
   * @return {Unit}
   */
  squaredNorm(): Unit {
    const x = this.x
    const y = this.y
    const z = this.z
    return this.uom.quad().scale(x * x + y * y + z * z)
  }

  /**
   * @method sub
   * @param rhs {R3}
   * @param [α = 1] {number}
   * @return {R3}
   */
  sub(rhs: R3, α = 1): R3 {
    throw new Error(notImplemented('sub').message)
  }

  /**
   * Intentionally undocumented.
   */
  toStringCustom(coordToString: (x: number) => string, labels: (string | string[])[]): string {
    const quantityString: string = stringFromCoordinates(this._coords, coordToString, labels);
    if (this.uom) {
      const unitString = this.uom.toString().trim();
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
   * @return {string}
   */
  toExponential(): string {
    const coordToString = function(coord: number): string { return coord.toExponential() }
    return this.toStringCustom(coordToString, BASIS_LABELS)
  }

  /**
   * @method toFixed
   * @param [fractionDigits] {number}
   * @return {string}
   */
  toFixed(fractionDigits?: number): string {
    const coordToString = function(coord: number): string { return coord.toFixed(fractionDigits) }
    return this.toStringCustom(coordToString, BASIS_LABELS)
  }

  /**
   * @method toString
   * @return {string}
   */
  toString(): string {
    const coordToString = function(coord: number): string { return coord.toString() }
    return this.toStringCustom(coordToString, BASIS_LABELS)
  }

  /**
   * @method fromVector
   * @param vector {VectorE3}
   * @param uom {Unit}
   * @return {R3}
   * @static
   */
  static fromVector(vector: VectorE3, uom: Unit): R3 {
    return new R3(vector.x, vector.y, vector.z, uom)
  }

  /**
   * Creates a new R3 with the same direction as the supplied vector.
   *
   * @method direction
   * @param vector {VectorE3}
   * @return {R3}
   * @static
   */
  static direction(vector: VectorE3): R3 {
    const x = vector.x
    const y = vector.y
    const z = vector.z
    const m = Math.sqrt(x * x + y * y + z * z)
    return new R3(x / m, y / m, z / m, Unit.ONE)
  }
}
