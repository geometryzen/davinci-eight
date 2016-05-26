import CartesianG3 from './CartesianG3'
import ColumnVector from './ColumnVector';
import {Coords} from './Coords';
import VectorE3 from './VectorE3';
import dotVectorE3 from './dotVectorE3';
import MutableLinearElement from './MutableLinearElement';
import Matrix3 from './Matrix3';
import Matrix4 from './Matrix4';
import isDefined from '../checks/isDefined';
import isNumber from '../checks/isNumber';
import randomRange from './randomRange'
import readOnly from '../i18n/readOnly'
import SpinorE3 from './SpinorE3';
import toStringCustom from './toStringCustom';
import wedgeXY from './wedgeXY';
import wedgeYZ from './wedgeYZ';
import wedgeZX from './wedgeZX';

/**
 * @module EIGHT
 * @submodule math
 */

const sqrt = Math.sqrt

const COORD_X = 0
const COORD_Y = 1
const COORD_Z = 2
const BASIS_LABELS = ['e1', 'e2', 'e3']

/**
 * Coordinates corresponding to basis labels.
 */
function coordinates(m: VectorE3): number[] {
  return [m.x, m.y, m.z]
}

/**
 * @class Vector3
 * @extends Coords
 */
export default class Vector3 extends Coords implements CartesianG3, ColumnVector<Matrix3, Vector3>, VectorE3, MutableLinearElement<VectorE3, Vector3, SpinorE3, VectorE3, number, number> {

  /**
   * @method dot
   * @param a {VectorE3}
   * @param b {VectorE3}
   * @return {number}
   * @static
   */
  public static dot(a: VectorE3, b: VectorE3): number {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  /**
   * @class Vector3
   * @constructor
   * @param [data = [0, 0, 0]] {number[]}
   * @param modified [boolean = false]
   */
  constructor(data: number[] = [0, 0, 0], modified = false) {
    super(data, modified, 3);
  }

  /**
   * @property x
   * @type {number}
   */
  get x(): number {
    return this.coords[COORD_X];
  }
  set x(value: number) {
    this.modified = this.modified || this.x !== value;
    this.coords[COORD_X] = value;
  }

  /**
   * @property y
   * @type Number
   */
  get y(): number {
    return this.coords[COORD_Y];
  }
  set y(value: number) {
    this.modified = this.modified || this.y !== value;
    this.coords[COORD_Y] = value;
  }

  /**
   * @property z
   * @type Number
   */
  get z(): number {
    return this.coords[COORD_Z];
  }
  set z(value: number) {
    this.modified = this.modified || this.z !== value;
    this.coords[COORD_Z] = value;
  }

  /**
   * @property maskG3
   * @type number
   * @readOnly
   */
  get maskG3(): number {
    return this.isZero() ? 0x0 : 0x2
  }
  set maskG3(unused: number) {
    throw new Error(readOnly('maskG3').message)
  }

  /**
   * <p>
   * <code>this ⟼ this + vector * α</code>
   * </p>
   *
   * @method add
   * @param vector {Vector3}
   * @param [α = 1] {number}
   * @return {Vector3} <code>this</code>
   * @chainable
   */
  add(vector: VectorE3, α = 1) {
    this.x += vector.x * α
    this.y += vector.y * α
    this.z += vector.z * α
    return this
  }

  /**
   * <p>
   * <code>this ⟼ σ * this<sup>T</sup></code>
   * </p>
   *
   * @method applyMatrix
   * @param σ {Matrix3}
   * @return {Vector3} <code>this</code>
   * @chainable
   */
  applyMatrix(σ: Matrix3): Vector3 {
    const x = this.x
    const y = this.y
    const z = this.z

    const e = σ.elements

    this.x = e[0x0] * x + e[0x3] * y + e[0x6] * z
    this.y = e[0x1] * x + e[0x4] * y + e[0x7] * z
    this.z = e[0x2] * x + e[0x5] * y + e[0x8] * z

    return this
  }

  /**
   * Pre-multiplies the column vector corresponding to this vector by the matrix.
   * The result is applied to this vector.
   * Strictly speaking, this method does not make much sense because the dimensions
   * of the square matrix and column vector don't match.
   * TODO: Used by TubeSimplexGeometry.
   *
   * @method applyMatrix4
   * @param σ The 4x4 matrix that pre-multiplies this column vector.
   * @return {Vector3} <code>this</code>
   * @chainable
   */
  applyMatrix4(σ: Matrix4): Vector3 {

    var x = this.x, y = this.y, z = this.z;

    var e = σ.elements;

    this.x = e[0x0] * x + e[0x4] * y + e[0x8] * z + e[0xC];
    this.y = e[0x1] * x + e[0x5] * y + e[0x9] * z + e[0xD];
    this.z = e[0x2] * x + e[0x6] * y + e[0xA] * z + e[0xE];

    return this;
  }

  /**
   * @method approx
   * @param n {number}
   * @return {Vector3}
   * @chainable
   */
  approx(n: number): Vector3 {
    super.approx(n)
    return this
  }

  /**
   * <p>
   * <code>this ⟼ - n * this * n</code>
   * </p>
   *
   * @method reflect
   * @param n {VectorE3}
   * @return {Vector3} <code>this</code>
   * @chainable
   */
  reflect(n: VectorE3) {
    const ax = this.x;
    const ay = this.y;
    const az = this.z;
    const nx = n.x;
    const ny = n.y;
    const nz = n.z;
    const dot2 = (ax * nx + ay * ny + az * nz) * 2;
    this.x = ax - dot2 * nx;
    this.y = ay - dot2 * ny;
    this.z = az - dot2 * nz;
    return this;
  }

  /**
   * <p>
   * <code>this ⟼ R * this * rev(R)</code>
   * </p>
   *
   * @method rotate
   * @param R {SpinorE3}
   * @return {Vector3} <code>this</code>
   * @chainable
   */
  rotate(R: SpinorE3): Vector3 {
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

    this.x = ix * w + iw * b + iy * a - iz * c;
    this.y = iy * w + iw * c + iz * b - ix * a;
    this.z = iz * w + iw * a + ix * c - iy * b;

    return this;
  }

  /**
   * @method clone
   * @return {Vector3} <code>copy(this)</code>
   */
  clone() {
    return new Vector3([this.x, this.y, this.z],this.modified)
  }

  /**
   * <p>
   * <code>this ⟼ copy(source)</code>
   * </p>
   *
   * @method copy
   * @param source {VectorE3}
   * @return {Vector3} <code>this</code>
   * @chainable
   */
  copy(source: VectorE3): Vector3 {
    if (source) {
      this.x = source.x
      this.y = source.y
      this.z = source.z
      return this
    }
    else {
      throw new Error("source for copy must be a vector")
    }
  }

  /**
   * Copies the coordinate values into this <code>Vector3</code>.
   * @method copyCoordinates
   * @param coordinates {number[]}
   * @return {Vector3} <code>this</code>
   * @chainable
   */
  copyCoordinates(coordinates: number[]): Vector3 {
    // Copy using the setters so that the modified flag is updated.
    this.x = coordinates[COORD_X];
    this.y = coordinates[COORD_Y];
    this.z = coordinates[COORD_Z];
    return this
  }

  /**
   * <p>
   * <code>this ⟼ this ✕ v</code>
   * </p>
   *
   * @method cross
   * @param v {VectorE3}
   * @return {Vector3} <code>this</code>
   * @chainable
   */
  cross(v: VectorE3): Vector3 {
    return this.cross2(this, v);
  }

  /**
   * <p>
   * <code>this ⟼ a ✕ b</code>
   * </p>
   * @method cross2
   * @param a {VectorE3}
   * @param b {VectorE3}
   * @return {Vector3} <code>this</code>
   * @chainable
   */
  cross2(a: VectorE3, b: VectorE3): Vector3 {

    const ax = a.x, ay = a.y, az = a.z;
    const bx = b.x, by = b.y, bz = b.z;

    this.x = wedgeYZ(ax, ay, az, bx, by, bz);
    this.y = wedgeZX(ax, ay, az, bx, by, bz);
    this.z = wedgeXY(ax, ay, az, bx, by, bz);
    return this;
  }

  /**
   * @method distanceTo
   * @param point {VectorE3}
   * @return {number}
   */
  distanceTo(point: VectorE3): number {
    if (isDefined(point)) {
      return sqrt(this.quadranceTo(point));
    }
    else {
      return void 0
    }
  }

  /**
   * @method quadranceTo
   * @param point {VectorE3}
   * @return {number}
   */
  quadranceTo(point: VectorE3): number {
    if (isDefined(point)) {
      const dx = this.x - point.x;
      const dy = this.y - point.y;
      const dz = this.z - point.z;
      return dx * dx + dy * dy + dz * dz;
    }
    else {
      return void 0
    }
  }

  /**
   * <p>
   * <code>this ⟼ this / α</code>
   * </p>
   * @method divByScalar
   * @param α {number}
   * @return {Vector3} <code>this</code>
   * @chainable
   */
  divByScalar(α: number) {
    if (α !== 0) {
      let invScalar = 1 / α;
      this.x *= invScalar;
      this.y *= invScalar;
      this.z *= invScalar;
    }
    else {
      this.x = 0;
      this.y = 0;
      this.z = 0;
    }
    return this;
  }
  /**
   * @method dot
   * @param v {VectorE3}
   * @return {number}
   */
  dot(v: VectorE3): number {
    return Vector3.dot(this, v);
  }

  /**
   * <p>
   * <code>this ⟼ I * B</code>
   * </p>
   *
   * Sets this vector to the dual of the bivector, B.
   * If changeSign is <code>true</code>, the direction of the resulting vector is reversed.
   *
   * @method dual
   * @param B {SpinorE3}
   * @param changeSign {boolean}
   * @return {Vector3}
   * @chainable
   */
  dual(B: SpinorE3, changeSign: boolean): Vector3 {
    if (changeSign) {
      this.x = B.yz
      this.y = B.zx
      this.z = B.xy
    }
    else {
      this.x = -B.yz
      this.y = -B.zx
      this.z = -B.xy
    }
    return this
  }

  /**
   * @method equals
   * @param other {any}
   * @return {boolean}
   */
  equals(other: any): boolean {
    if (other instanceof Vector3) {
      return this.x === other.x && this.y === other.y && this.z === other.z
    }
    else {
      return false
    }
  }

  /**
   * @method isZero
   * @return {boolean}
   */
  isZero(): boolean {
    return this.x === 0 && this.y === 0 && this.z === 0
  }

  /**
   * Computes the <em>square root</em> of the <em>squared norm</em>.
   *
   * @method magnitude
   * @return {number}
   */
  magnitude(): number {
    return sqrt(this.squaredNorm());
  }

  /**
   * @method neg
   * @return {Vector3} <code>this</code>
   * @chainable
   */
  neg() {
    this.x = -this.x
    this.y = -this.y
    this.z = -this.z
    return this
  }

  /**
   * <p>
   * <code>this ⟼ this + α * (target - this)</code>
   * </p>
   *
   * @method lerp
   * @param target {VectorE3}
   * @param α {number}
   * @return {Vector3} <code>this</code>
   * @chainable
   */
  lerp(target: VectorE3, α: number) {
    this.x += (target.x - this.x) * α;
    this.y += (target.y - this.y) * α;
    this.z += (target.z - this.z) * α;
    return this;
  }

  /**
   * <p>
   * <code>this ⟼ a + α * (b - a)</code>
   * </p>
   * @method lerp2
   * @param a {VectorE3}
   * @param b {VectorE3}
   * @param α {number}
   * @return {Vector3} <code>this</code>
   * @chainable
   */
  lerp2(a: VectorE3, b: VectorE3, α: number) {
    this.copy(a).lerp(b, α)
    return this
  }

  /**
   * <p>
   * <code>this ⟼ this / norm(this)</code>
   * </p>
   *
   * @method normalize
   * @return {Vector3} <code>this</code>
   * @chainable
   */
  normalize(): Vector3 {
    const m = this.magnitude()
    if (m !== 0) {
      return this.divByScalar(m)
    }
    else {
      return this.zero()
    }
  }

  /**
   * <p>
   * <code>this ⟼ this * α</code>
   * </p>
   *
   * @method scale
   * @param α {number} 
   */
  scale(α: number): Vector3 {
    this.x *= α
    this.y *= α
    this.z *= α
    return this
  }

  /**
   * @method stress
   * @param σ {VectorE3}
   * @return Vector3
   */
  stress(σ: VectorE3) {
    this.x *= σ.x
    this.y *= σ.y
    this.z *= σ.z
    return this
  }

  /**
   * <p>
   * <code>this ⟼ this</code>, with components modified.
   * </p>
   *
   * @method set
   * @param x {number}
   * @param y {number}
   * @param z {number}
   * @return {Vector3} <code>this</code>
   * @chainable
   * @deprecated
   */
  setXYZ(x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z
    return this
  }

  /**
   * @method slerp
   * @param target {VectorE3}
   * @param α {number}
   */
  slerp(target: VectorE3, α: number) {
    return this;
  }

  /**
   * Returns the (Euclidean) inner product of this vector with itself.
   *
   * @method squaredNorm
   * @return {number} <code>this ⋅ this</code> or <code>norm(this) * norm(this)</code>
   */
  squaredNorm(): number {
    // quad = scp(v, rev(v)) = scp(v, v)
    // TODO: This is correct but could be optimized.
    return dotVectorE3(this, this)
  }

  /**
   * <p>
   * <code>this ⟼ this - v</code>
   * </p>
   *
   * @method sub
   * @param v {VectorE3}
   * @param [α = 1] {number}
   * @return {Vector3} <code>this</code>
   * @chainable
   */
  sub(v: VectorE3, α = 1): Vector3 {
    this.x -= v.x * α
    this.y -= v.y * α
    this.z -= v.z * α
    return this
  }

  /**
   * @method toExponential
   * @param [fractionDigits] {number}
   * @return {string}
   */
  toExponential(fractionDigits?: number): string {
    var coordToString = function(coord: number): string { return coord.toExponential(fractionDigits) };
    return toStringCustom(coordinates(this), void 0, coordToString, BASIS_LABELS)
  }

  /**
   * @method toFixed
   * @param [fractionDigits] {number}
   * @return {string}
   */
  toFixed(fractionDigits?: number): string {
    const coordToString = function(coord: number): string { return coord.toFixed(fractionDigits) };
    return toStringCustom(coordinates(this), void 0, coordToString, BASIS_LABELS)
  }

  /**
   * @method toPrecision
   * @param [precision] {number}
   * @return {string}
   */
  toPrecision(precision?: number): string {
    const coordToString = function(coord: number): string { return coord.toPrecision(precision) };
    return toStringCustom(coordinates(this), void 0, coordToString, BASIS_LABELS)
  }

  /**
   * @method toString
   * @param [radix] {number}
   * @return {string}
   */
  toString(radix?: number): string {
    const coordToString = function(coord: number): string { return coord.toString(radix) };
    return toStringCustom(coordinates(this), void 0, coordToString, BASIS_LABELS)
  }

  /**
   * Sets this vector to the identity element for addition, <b>0</b>.
   * @method zero
   * @return {Vector3}
   * @chainable
   */
  zero(): Vector3 {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    return this;
  }

  __add__(rhs: Vector3): Vector3 {
    if (rhs instanceof Vector3) {
      return this.clone().add(rhs, 1.0);
    }
    else {
      return void 0;
    }
  }
  __sub__(rhs: Vector3): Vector3 {
    if (rhs instanceof Vector3) {
      return this.clone().sub(rhs);
    }
    else {
      return void 0;
    }
  }

  /**
   * @method mul
   * @param rhs {number}
   * @return {Vector3}
   * @private
   */
  __mul__(rhs: number): Vector3 {
    if (isNumber(rhs)) {
      return this.clone().scale(rhs);
    }
    else {
      return void 0;
    }
  }

  /**
   * @method rmul
   * @param lhs {number | Matrix3}
   * @return {Vector3}
   * @private
   */
  __rmul__(lhs: number | Matrix3): Vector3 {
    if (typeof lhs === 'number') {
      return this.clone().scale(lhs);
    }
    else if (lhs instanceof Matrix3) {
      return this.clone().applyMatrix(lhs);
    }
    else {
      return void 0;
    }
  }

  /**
   * @method copy
   * @param vector {VectorE3}
   * @return {Vector3}
   * @static
   * @chainable
   */
  static copy(vector: VectorE3): Vector3 {
    return new Vector3([vector.x, vector.y, vector.z])
  }

  /**
   * Constructs a vector which is the dual of the supplied bivector, B.
   * The convention used is dual(m) = I * m.
   * If a sign change is desired from this convention,
   * set the <code>changeSign</code> to <code>true</code>.
   *
   * @method dual
   * @param B {SpinorE3}
   * @param changeSign {boolean}
   * @return {Vector3}
   * @chainable
   */
  static dual(B: SpinorE3, changeSign: boolean): Vector3 {
    if (changeSign) {
      return new Vector3([B.yz, B.zx, B.xy])
    }
    else {
      return new Vector3([-B.yz, -B.zx, -B.xy])
    }
  }

  /**
   * @method isInstance
   * @param x {any}
   * @return {boolean}
   * @static
   */
  static isInstance(x: any): boolean {
    return x instanceof Vector3
  }

  /**
   * @method lerp
   * @param a {VectorE3}
   * @param b {VectorE3}
   * @param α {number}
   * @return {Vector3} <code>a + α * (b - a)</code>
   * @static
   * @chainable
   */
  static lerp(a: VectorE3, b: VectorE3, α: number): Vector3 {
    return Vector3.copy(b).sub(a).scale(α).add(a)
  }

  /**
   * <p>
   * Computes a unit vector with a random direction.
   * </p>
   *
   * @method random
   * @return {Vector3}
   * @static
   * @chainable
   */
  static random(): Vector3 {
    const x = randomRange(-1, 1)
    const y = randomRange(-1, 1)
    const z = randomRange(-1, 1)
    return Vector3.vector(x, y, z).normalize()
  }

  /**
   * @method vector
   * @param x {number}
   * @param y {number}
   * @param z {number}
   * @return {Vector3}
   * @static
   * @chainable
   */
  static vector(x: number, y: number, z: number): Vector3 {
    return new Vector3([x, y, z])
  }

  /**
   * @method zero
   * @return {Vector3}
   * @static
   * @chainable
   */
  static zero(): Vector3 {
    return new Vector3([0, 0, 0])
  }
}
