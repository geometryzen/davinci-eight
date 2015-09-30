import Cartesian3 = require('../math/Cartesian3');
import expectArg = require('../checks/expectArg');
import LinearElement = require('../math/LinearElement');
import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import isNumber = require('../checks/isNumber');
import Spinor3Coords = require('../math/Spinor3Coords');
import VectorN = require('../math/VectorN');
import wedgeXY = require('../math/wedgeXY');
import wedgeYZ = require('../math/wedgeYZ');
import wedgeZX = require('../math/wedgeZX');

/**
 * @class Vector3
 */
class Vector3 extends VectorN<number> implements Cartesian3, LinearElement<Cartesian3, Vector3, Spinor3Coords, Cartesian3> {
  public static e1 = new Vector3([1, 0, 0]);
  public static e2 = new Vector3([0, 1, 0]);
  public static e3 = new Vector3([0, 0, 1]);
  public static dot(a: Cartesian3, b: Cartesian3): number {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }
  /**
   * @class Vector3
   * @constructor
   * @param data {number[]} Default is [0, 0, 0].
   * @param modified {boolean} Default is false;
   */
  constructor(data: number[] = [0, 0, 0], modified = false) {
    super(data, modified, 3);
  }
  /**
   * @property x
   * @type Number
   */
  get x(): number {
    return this.data[0];
  }
  set x(value: number) {
    this.modified = this.modified || this.x !== value;
    this.data[0] = value;
  }
  /**
   * @property y
   * @type Number
   */
  get y(): number {
    return this.data[1];
  }
  set y(value: number) {
    this.modified = this.modified || this.y !== value;
    this.data[1] = value;
  }
  /**
   * @property z
   * @type Number
   */
  get z(): number {
    return this.data[2];
  }
  set z(value: number) {
    this.modified = this.modified || this.z !== value;
    this.data[2] = value;
  }
  /**
   * Performs in-place addition of vectors.
   *
   * @method add
   * @param v {Vector3} The vector to add to this vector.
   */
  add(v: Cartesian3): Vector3 {
    return this.sum(this, v);
  }
  sum(a: Cartesian3, b: Cartesian3): Vector3 {
    this.x = a.x + b.x;
    this.y = a.y + b.y;
    this.z = a.z + b.z;
    return this;
  }
  applyMatrix3(m: Matrix3): Vector3 {
    let x = this.x;
    let y = this.y;
    let z = this.z;

    let e = m.data;

    this.x = e[0x0] * x + e[0x3] * y + e[0x6] * z;
    this.y = e[0x1] * x + e[0x4] * y + e[0x7] * z;
    this.z = e[0x2] * x + e[0x5] * y + e[0x8] * z;

    return this;
  }
  /**
   * Pre-multiplies the column vector corresponding to this vector by the matrix.
   * The result is applied to this vector.
   * Strictly speaking, this method does not make much sense because the dimensions
   * of the square matrix and column vector don't match.
   * TODO: Used by TubeGeometry.
   * @method applyMatrix
   * @param m The 4x4 matrix that pre-multiplies this column vector.
   */
  applyMatrix4(m: Matrix4): Vector3 {

    var x = this.x, y = this.y, z = this.z;

    var e = m.data;

    this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ]  * z + e[ 12 ];
    this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ]  * z + e[ 13 ];
    this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ];

    return this;
  }
  /**
   * @method reflect
   * @param n {Cartesian3}
   * @return {Vector3}
   */
  reflect(n: Cartesian3): Vector3 {
    let ax = this.x;
    let ay = this.y;
    let az = this.z;
    let nx = n.x;
    let ny = n.y;
    let nz = n.z;
    let dot2 = (ax * nx + ay * ny + az * nz) * 2;
    this.x = ax - dot2 * nx;
    this.y = ay - dot2 * ny;
    this.z = az - dot2 * nz;
    return this
  }
  rotate(spinor: Spinor3Coords): Vector3 {
    let x = this.x;
    let y = this.y;
    let z = this.z;

    let a = spinor.xy;
    let b = spinor.yz;
    let c = spinor.zx;
    let w = spinor.w;

    let ix = w * x - c * z + a * y;
    let iy = w * y - a * x + b * z;
    let iz = w * z - b * y + c * x;
    let iw = b * x + c * y + a * z;

    this.x = ix * w + iw * b + iy * a - iz * c;
    this.y = iy * w + iw * c + iz * b - ix * a;
    this.z = iz * w + iw * a + ix * c - iy * b;

    return this;
  }
  clone() {
    return new Vector3([this.x, this.y, this.z]);
  }
  copy(v: Cartesian3) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }
  cross(v: Cartesian3): Vector3 {
    return this.crossVectors(this, v);
  }
  crossVectors(a: Cartesian3, b: Cartesian3): Vector3 {

    let ax = a.x, ay = a.y, az = a.z;
    let bx = b.x, by = b.y, bz = b.z;

    let x = wedgeYZ(ax, ay, az, bx, by, bz);
    let y = wedgeZX(ax, ay, az, bx, by, bz);
    let z = wedgeXY(ax, ay, az, bx, by, bz);

    this.set(x, y, z);

    return this;
  }
  distanceTo(position: Cartesian3): number {
    return Math.sqrt(this.quadranceTo(position));
  }
  quadranceTo(position: Cartesian3): number {
    var dx = this.x - position.x;
    var dy = this.y - position.y;
    var dz = this.z - position.z;
    return dx * dx + dy * dy + dz * dz;
  }
  divideScalar(scalar: number): Vector3 {
    if (scalar !== 0) {
      let invScalar = 1 / scalar;
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
  dot(v: Cartesian3): number {
    return Vector3.dot(this, v);
  }
  magnitude(): number {
    return Math.sqrt(this.quaditude());
  }
  quaditude(): number {
    let x = this.x;
    let y = this.y;
    let z = this.z;
    return x * x + y * y + z * z;
  }
  lerp(target: Cartesian3, alpha: number): Vector3 {
    this.x += ( target.x - this.x ) * alpha;
    this.y += ( target.y - this.y ) * alpha;
    this.z += ( target.z - this.z ) * alpha;
    return this;
  }
  normalize(): Vector3 {
    return this.divideScalar(this.magnitude());
  }
  multiply(v: Cartesian3): Vector3 {
    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;
    return this;
  }
  scale(scalar: number): Vector3 {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
  }
  set(x: number, y: number, z: number): Vector3 {
    this.x = expectArg('x', x).toBeNumber().value;
    this.y = expectArg('y', y).toBeNumber().value;
    this.z = expectArg('z', z).toBeNumber().value;
    return this;
  }
  setMagnitude(magnitude: number): Vector3 {
    let m = this.magnitude();
    if (m !== 0) {
      if (magnitude !== m) {
        return this.scale(magnitude / m);
      }
      else {
        return this;  // No change
      }
    }
    else {
      // Former magnitude was zero, i.e. a null vector.
      throw new Error("Attempting to set the magnitude of a null vector.");
    }
  }
  setX(x: number): Vector3 {
    this.x = x;
    return this;
  }
  setY(y: number): Vector3 {
    this.y = y;
    return this;
  }
  setZ(z: number): Vector3 {
    this.z = z;
    return this;
  }
  sub(v: Cartesian3): Vector3 {
    return this.difference(this, v);
  }
  difference(a: Cartesian3, b: Cartesian3): Vector3 {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    this.z = a.z - b.z;
    return this;
  }
  /**
   * @method toString
   * @return {string} A non-normative string representation of the target.
   */
  toString(): string {
    return "Vector3({x: " + this.x + ", y: " + this.y + ", z: " + this.z + "})"
  }
  /**
   * Returns the result of `this` + `rhs` without modifying `this`.
   * @method __add__
   * @param rhs {Vector3}
   * @return {Vector3}
   */
  __add__(rhs: Vector3): Vector3 {
    if (rhs instanceof Vector3) {
      return this.clone().add(rhs);
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
  __mul__(rhs: number): Vector3 {
    if (isNumber(rhs)) {
      return this.clone().scale(rhs);
    }
    else {
      return void 0;
    }
  }
  /**
   * @method copy
   * Copy constructor.
   */
  static copy(vector: Cartesian3): Vector3 {
    return new Vector3([vector.x, vector.y, vector.z]);
  }
  static lerp(a: Cartesian3, b: Cartesian3, alpha: number): Vector3 {
    return Vector3.copy(b).sub(a).scale(alpha).add(a)
  }
}

export = Vector3;
