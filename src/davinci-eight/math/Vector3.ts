// Be careful not to create circularity.
// Only use Matrix4 in type positions.
// Otherwise, create standalone functions.
import Matrix4 = require('../math/Matrix4');

class Vector3 {
  public x: number;
  public y: number;
  public z: number;
  constructor(x?: number, y?: number, z?: number) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }
  add(v: Vector3): Vector3 {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }
  applyMatrix4(m: Matrix4) {

    // input: THREE.Matrix4 affine matrix

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
  copy(v: Vector3): Vector3 {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }
  cross(v: Vector3): Vector3 {
    return this.crossVectors(this, v);
  }
  crossVectors(a: Vector3, b: Vector3): Vector3 {
    var ax = a.x, ay = a.y, az = a.z;
    var bx = b.x, by = b.y, bz = b.z;

    this.x = ay * bz - az * by;
    this.y = az * bx - ax * bz;
    this.z = ax * by - ay * bx;

    return this;
  }
  distance(v: Vector3): number {
    return Math.sqrt(this.quadrance(v));
  }
  quadrance(v: Vector3): number {
    var dx = this.x - v.x;
    var dy = this.y - v.y;
    var dz = this.z - v.z;
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
  dot(v: Vector3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }
  length(): number {
    let x = this.x;
    let y = this.y;
    let z = this.z;
    return Math.sqrt(x * x + y * y + z * z);
  }
  lerp(v: Vector3, alpha: number): Vector3 {
    this.x += ( v.x - this.x ) * alpha;
    this.y += ( v.y - this.y ) * alpha;
    this.z += ( v.z - this.z ) * alpha;
    return this;

  }
  normalize(): Vector3 {
    return this.divideScalar(this.length());
  }
  multiply(v: Vector3): Vector3 {
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
  sub(v: Vector3): Vector3 {
    return this.subVectors(this, v);
  }
  subVectors(a: Vector3, b: Vector3): Vector3 {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    this.z = a.z - b.z;
    return this;
  }
  clone() {
    return new Vector3(this.x, this.y, this.z);
  }
}

export = Vector3;
