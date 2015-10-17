import Cartesian3 = require('../math/Cartesian3');
import GeometricElement = require('../math/GeometricElement');
import Matrix4 = require('../math/Matrix4');
import Vector3 = require('../math/Vector3');

var EPS = 0.000001;
/**
 * Quaternion is retained for reference only.
 * Quaternion should not be exposed.
 */
class Quaternion implements GeometricElement<Quaternion, Quaternion, Quaternion, Cartesian3, Cartesian3> {
  private _x: number;
  private _y: number;
  private _z: number;
  private _w: number;
  public onChangeCallback: () => void = function() {};
  constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 1) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._w = w;
  }
  get x(): number {
    return this._x;
  }
  set x(value: number) {
    this._x = value;
    this.onChangeCallback();
  }
  get y(): number {
    return this._y;
  }
  set y(value: number) {
    this._y = value;
    this.onChangeCallback();
  }
  get z(): number {
    return this._z;
  }
  set z(value: number) {
    this._z = value;
    this.onChangeCallback();
  }
  get w(): number {
    return this._w;
  }
  set w(value: number) {
    this._w = value;
    this.onChangeCallback();
  }
  add(element: Quaternion) {
    return this;
  }
  sum(a: Quaternion, b: Quaternion) {
    return this;
  }
  set(x: number, y: number, z: number, w: number) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._w = w;
    this.onChangeCallback();
    return this;
  }
  clone(): Quaternion {
    return new Quaternion(this._x, this._y, this._z, this._w);
  }
  conjugate(): Quaternion {
    this._x *= - 1;
    this._y *= - 1;
    this._z *= - 1;
    this.onChangeCallback();
    return this;
  }
  copy(quaternion: Quaternion): Quaternion {
    this._x = quaternion.x;
    this._y = quaternion.y;
    this._z = quaternion.z;
    this._w = quaternion.w;
    this.onChangeCallback();
    return this;
  }
  divideScalar(scalar: number) {
    return this;
  }
  dot(v: Quaternion): number {
    return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;
  }
  exp() {
    return this;
  }
  inverse(): Quaternion {
    this.conjugate().normalize();
    return this;
  }
  lerp(target: Quaternion, alpha: number): Quaternion {
    this.x += ( target.x - this.x ) * alpha;
    this.y += ( target.y - this.y ) * alpha;
    this.z += ( target.z - this.z ) * alpha;
    this.w += ( target.w - this.w ) * alpha;
    return this;
  }
  magnitude(): number {
    return Math.sqrt(this.quaditude());
  }
  multiply(q: Quaternion): Quaternion {
    return this.product(this, q);
  }
  product(a: Quaternion, b: Quaternion): Quaternion {
    // from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm
    let qax = a._x, qay = a._y, qaz = a._z, qaw = a._w;
    let qbx = b._x, qby = b._y, qbz = b._z, qbw = b._w;
    this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
    this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
    this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
    this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
    this.onChangeCallback();
    return this;
  }
  scale(scalar: number) {
    return this;
  }
  normalize(): Quaternion {
    let l = this.magnitude();
    if (l === 0) {
      this._x = 0;
      this._y = 0;
      this._z = 0;
      this._w = 1;
    }
    else {
      l = 1 / l;
      this._x = this._x * l;
      this._y = this._y * l;
      this._z = this._z * l;
      this._w = this._w * l;
    }
    this.onChangeCallback();
    return this;
  }
  onChange(callback: () => void): Quaternion {
    this.onChangeCallback = callback;
    return this;
  }
  quaditude(): number {
    return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
  }
  reflect(n: Cartesian3): Quaternion {
    // FIXME: What does this mean?
    throw new Error();
  }
  rotate(rotor: Quaternion): Quaternion {
    // TODO: This would require creating a temporary so we fall back to components.
    return this.product(rotor, this);
  }
  setFromAxisAngle(axis: Cartesian3, angle: number): Quaternion {
    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm
    // assumes axis is normalized
    var halfAngle = angle / 2, s = Math.sin( halfAngle );
    this._x = axis.x * s;
    this._y = axis.y * s;
    this._z = axis.z * s;
    this._w = Math.cos( halfAngle );
    this.onChangeCallback();
    return this;
  }
  setFromRotationMatrix(m: Matrix4): Quaternion {
    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
    // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
    var te = m.data,

      m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
      m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
      m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ],

      trace = m11 + m22 + m33,
      s: number;

    if ( trace > 0 ) {
      s = 0.5 / Math.sqrt( trace + 1.0 );
      this._w = 0.25 / s;
      this._x = ( m32 - m23 ) * s;
      this._y = ( m13 - m31 ) * s;
      this._z = ( m21 - m12 ) * s;
    }
    else if ( m11 > m22 && m11 > m33 ) {
      s = 2.0 * Math.sqrt( 1.0 + m11 - m22 - m33 );
      this._w = ( m32 - m23 ) / s;
      this._x = 0.25 * s;
      this._y = ( m12 + m21 ) / s;
      this._z = ( m13 + m31 ) / s;
    }
    else if ( m22 > m33 ) {
      s = 2.0 * Math.sqrt( 1.0 + m22 - m11 - m33 );
      this._w = ( m13 - m31 ) / s;
      this._x = ( m12 + m21 ) / s;
      this._y = 0.25 * s;
      this._z = ( m23 + m32 ) / s;
    }
    else {
      s = 2.0 * Math.sqrt( 1.0 + m33 - m11 - m22 );
      this._w = ( m21 - m12 ) / s;
      this._x = ( m13 + m31 ) / s;
      this._y = ( m23 + m32 ) / s;
      this._z = 0.25 * s;
    }
    this.onChangeCallback();
    return this;
  }
  setFromUnitVectors(vFrom: Vector3, vTo: Vector3 ) {
    // TODO: Could create circularity problems.
    let v1 = new Vector3();

    var r: number = vFrom.dot( vTo ) + 1;

    if ( r < EPS ) {
      r = 0;
      if ( Math.abs( vFrom.x ) > Math.abs( vFrom.z ) ) {
        v1.set(-vFrom.y, vFrom.x, 0);
      }
      else {
        v1.set(0, -vFrom.z, vFrom.y);
      }
    }
    else {
      v1.crossVectors(vFrom, vTo);
    }
    this._x = v1.x;
    this._y = v1.y;
    this._z = v1.z;
    this._w = r;
    this.normalize();
    return this;
  }
  slerp(qb: Quaternion, t: number): Quaternion {
    if (t === 0) return this;
    if (t === 1) return this.copy(qb);
    var x = this._x, y = this._y, z = this._z, w = this._w;

    // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

    var cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;

    if ( cosHalfTheta < 0 ) {

      this._w = - qb._w;
      this._x = - qb._x;
      this._y = - qb._y;
      this._z = - qb._z;

      cosHalfTheta = - cosHalfTheta;

    }
    else {
      this.copy( qb );
    }
    if ( cosHalfTheta >= 1.0 ) {
      this._w = w;
      this._x = x;
      this._y = y;
      this._z = z;
      return this;
    }
    var halfTheta = Math.acos( cosHalfTheta );
    var sinHalfTheta = Math.sqrt( 1.0 - cosHalfTheta * cosHalfTheta );
    if ( Math.abs( sinHalfTheta ) < 0.001 ) {
      this._w = 0.5 * ( w + this._w );
      this._x = 0.5 * ( x + this._x );
      this._y = 0.5 * ( y + this._y );
      this._z = 0.5 * ( z + this._z );
      return this;
    }
    var ratioA = Math.sin( ( 1 - t ) * halfTheta ) / sinHalfTheta,
    ratioB = Math.sin( t * halfTheta ) / sinHalfTheta;
    this._w = ( w * ratioA + this._w * ratioB );
    this._x = ( x * ratioA + this._x * ratioB );
    this._y = ( y * ratioA + this._y * ratioB );
    this._z = ( z * ratioA + this._z * ratioB );
    this.onChangeCallback();
    return this;
  }
  sub(rhs: Quaternion) {
    return this;
  }
  difference(a: Quaternion, b: Quaternion) {
    return this;
  }
  equals(quaternion: Quaternion) {
    return (quaternion._x === this._x) && (quaternion._y === this._y) && ( quaternion._z === this._z ) && ( quaternion._w === this._w );
  }
  fromArray(array: number[], offset: number = 0): Quaternion {
    this._x = array[ offset ];
    this._y = array[ offset + 1 ];
    this._z = array[ offset + 2 ];
    this._w = array[ offset + 3 ];
    this.onChangeCallback();
    return this;
  }
  toArray(array: number[] = [], offset: number = 0): number[] {
    array[ offset ] = this._x;
    array[ offset + 1 ] = this._y;
    array[ offset + 2 ] = this._z;
    array[ offset + 3 ] = this._w;
    return array;
  }
  public static slerp(qa: Quaternion, qb: Quaternion, qm: Quaternion, t: number): Quaternion {
    return qm.copy(qa).slerp(qb, t);
  }
}

export = Quaternion;
