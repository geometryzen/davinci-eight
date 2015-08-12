// Be careful not to create circularity.
// Only use Matrix4 in type positions.
// Otherwise, create standalone functions.
import Cartesian3 = require('../math/Cartesian3');
import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import Spinor3 = require('../math/Spinor3');
import expectArg = require('../checks/expectArg');
import UniformVariable = require('../uniforms/UniformVariable');
import Mutable = require('../math/Mutable');

/**
 * @class Vector3
 */
class Vector3 implements Cartesian3, Mutable<number[]> {
  private $data: number[];
  private $callback: () => number[];
  public modified: boolean;
  public static e1 = new Vector3([1, 0, 0]);
  public static e2 = new Vector3([0, 1, 0]);
  public static e3 = new Vector3([0, 0, 1]);
  /**
   * @class Vector3
   * @constructor
   * @param data {number[]}
   */
  constructor(data: number[] = [0, 0, 0]) {
    this.data = data;
    this.modified = false;
  }
  get data() {
    if (this.$data) {
      return this.$data;
    }
    else if (this.$callback) {
      var data = this.$callback();
      expectArg('callback()', data).toSatisfy(data.length === 3, "callback() length must be 3");
      return this.$callback();
    }
    else {
      throw new Error("Vector3 is undefined.");
    }
  }
  set data(data: number[]) {
    expectArg('data', data).toSatisfy(data.length === 3, "data length must be 3");
    this.$data = data;
    this.$callback = void 0;
  }
  get callback() {
    return this.$callback;
  }
  set callback(reactTo: () => number[]) {
    this.$callback = reactTo;
    this.$data = void 0;
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
    return this.addVectors(this, v);
  }
  addVectors(a: Cartesian3, b: Cartesian3): Vector3 {
    this.x = a.x + b.x;
    this.y = a.y + b.y;
    this.z = a.z + b.z;
    return this;
  }
  applyMatrix3(m: Matrix3 ) {
    let x = this.x;
    let y = this.y;
    let z = this.z;

    let e = m.elements;

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

    var e = m.elements;

    this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ]  * z + e[ 12 ];
    this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ]  * z + e[ 13 ];
    this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ];

    return this;
  }
  applyQuaternion(q: {x: number, y: number, z: number, w: number}): Vector3 {
    let x = this.x;
    let y = this.y;
    let z = this.z;

    let qx = q.x;
    let qy = q.y;
    let qz = q.z;
    let qw = q.w;

    // calculate quat * vector

    let ix =  qw * x + qy * z - qz * y;
    let iy =  qw * y + qz * x - qx * z;
    let iz =  qw * z + qx * y - qy * x;
    let iw = - qx * x - qy * y - qz * z;

    // calculate (quat * vector) * inverse quat

    this.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
    this.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
    this.z = iz * qw + iw * - qz + ix * - qy - iy * - qx;

    return this;
  }
  applySpinor(spinor: Spinor3): Vector3 {
    let x = this.x;
    let y = this.y;
    let z = this.z;

    let qx = spinor.yz;
    let qy = spinor.zx;
    let qz = spinor.xy;
    let qw = spinor.w;

    // calculate quat * vector

    let ix =  qw * x + qy * z - qz * y;
    let iy =  qw * y + qz * x - qx * z;
    let iz =  qw * z + qx * y - qy * x;
    let iw = - qx * x - qy * y - qz * z;

    // calculate (quat * vector) * inverse quat

    this.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
    this.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
    this.z = iz * qw + iw * - qz + ix * - qy - iy * - qx;

    return this;
  }
  clone(): Vector3 {
    return new Vector3([this.x, this.y, this.z]);
  }
  copy(v: Cartesian3): Vector3 {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }
  cross(v: Cartesian3): Vector3 {
    return this.crossVectors(this, v);
  }
  crossVectors(a: Cartesian3, b: Cartesian3): Vector3 {
    var ax = a.x, ay = a.y, az = a.z;
    var bx = b.x, by = b.y, bz = b.z;

    this.x = ay * bz - az * by;
    this.y = az * bx - ax * bz;
    this.z = ax * by - ay * bx;

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
    return this.x * v.x + this.y * v.y + this.z * v.z;
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
  lerp(v: Cartesian3, alpha: number): Vector3 {
    this.x += ( v.x - this.x ) * alpha;
    this.y += ( v.y - this.y ) * alpha;
    this.z += ( v.z - this.z ) * alpha;
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
  multiplyScalar(scalar: number): Vector3 {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
  }
  set(x: number, y: number, z: number): Vector3 {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }
  setMagnitude(magnitude: number): Vector3 {
    let m = this.magnitude();
    if (m !== 0) {
      if (magnitude !== m) {
        return this.multiplyScalar(magnitude / m);
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
    return this.subVectors(this, v);
  }
  subVectors(a: Cartesian3, b: Cartesian3): Vector3 {
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
   * @method copy
   * Copy constructor.
   */
  static copy(vector: Cartesian3): Vector3 {
    return new Vector3([vector.x, vector.y, vector.z]);
  }
}

export = Vector3;
