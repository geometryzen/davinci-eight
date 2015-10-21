import Cartesian3 = require('../math/Cartesian3')
import cartesianQuaditudeE3 = require('../math/cartesianQuaditudeE3')
import euclidean3Quaditude2Arg = require('../math/euclidean3Quaditude2Arg')
import GeometricElement = require('../math/GeometricElement')
import Matrix4 = require('../math/Matrix4')
import mustBeNumber = require('../checks/mustBeNumber')
import mustBeObject = require('../checks/mustBeObject')
import Vector3 = require('../math/Vector3')

let cos = Math.cos
let sin = Math.sin
let exp = Math.exp

var EPS = 0.000001;
/**
 * @class Quaternion
 */
class Quaternion implements GeometricElement<Quaternion, Quaternion, Quaternion, Cartesian3, Cartesian3> {
  private x: number;
  private y: number;
  private z: number;
  /**
   * The scalar part of the Quaternion.
   * @property t
   * @type {number}
   */
  public t: number;
  /**
   * 
   * @class Quaternion
   * @constructor
   * @param t [number = 1]
   * @param v [Cartesian3 = {x: 0, y: 0, z: 0}]
   */
  constructor(t: number = 1, v: Cartesian3 = { x: 0, y: 0, z: 0 }) {
    this.t = mustBeNumber('t', t)
    mustBeObject('v', v)
    this.x = mustBeNumber('v.x', v.x)
    this.y = mustBeNumber('v.y', v.y)
    this.z = mustBeNumber('v.z', v.z)
  }
  get v(): Cartesian3 {
    return { x: this.x, y: this.y, z: this.z }
  }
  /**
   * <p>
   * <code>this ⟼ this + q * α</code>
   * </p>
   * @method add
   * @param q {Quaternion}
   * @param α [number = 1]
   * @return {Quaternion} <code>this</code>
   * @chainable
   */
  add(q: Quaternion, α: number = 1): Quaternion {
    mustBeObject('q', q)
    mustBeNumber('α', α)
    this.t += q.t * α
    this.x += q.x * α
    this.y += q.y * α
    this.z += q.z * α
    return this;
  }
  dual(m: Cartesian3): Quaternion {
    // TODO
    return this
  }
  /**
   * <p>
   * <code>this ⟼ a + b = (α, A) + (β, B) = (α + β, A + B)</code>
   * </p>
   * @method sum
   * @param a {Quaternion}
   * @param b {Quaternion}
   * @return {Quaternion} <code>this</code>
   * @chainable
   */
  sum(a: Quaternion, b: Quaternion): Quaternion {
    mustBeObject('a', a)
    mustBeObject('b', b)
    this.t = a.t + b.t
    this.x = a.x + b.x
    this.y = a.y + b.y
    this.z = a.z + b.z
    return this;
  }
  /**
   * @method clone
   * @return {Quaternion} <code>copy(target)</code>
   */
  clone(): Quaternion {
    return new Quaternion(this.t, { x: this.x, y: this.y, z: this.z })
  }
  /**
   * <p>
   * <code>this = (t, -v)</code>
   * </p>
   * @method conj
   * @return {Quaternion} <code>this</code>
   * @chainable
   */
  conj(): Quaternion {
    this.x *= - 1
    this.y *= - 1
    this.z *= - 1
    return this;
  }
  copy(quaternion: Quaternion): Quaternion {
    this.x = quaternion.x;
    this.y = quaternion.y;
    this.z = quaternion.z;
    this.t = quaternion.t;
    return this;
  }
  divideByScalar(scalar: number) {
    return this;
  }
  dot(v: Quaternion): number {
    return this.x * v.x + this.y * v.y + this.z * v.z + this.t * v.t;
  }
  /**
   * <p>
   * <code>this ⟼ exp(t) * (cos(|v|), sin(|v|) * v / |v|)</code>
   * </p>
   * @method exp
   * @return {Quaternion}
   */
  exp(): Quaternion {
    let expT = exp(this.t)
    let m = cartesianQuaditudeE3(this.x, this.y, this.z, this.x, this.y, this.z)
    let s = m !== 0 ? sin(m) / m : 1
    this.t = expT * cos(m)
    this.x = expT * this.x * s
    this.y = expT * this.y * s
    this.z = expT * this.z * s
    return this;
  }
  /**
   * @method inv
   * @return {Quaternion} <code>this</code>
   * @chainable
   */
  inv(): Quaternion {
    this.conj().normalize();
    return this;
  }
  lerp(target: Quaternion, α: number): Quaternion {
    this.x += (target.x - this.x) * α
    this.y += (target.y - this.y) * α
    this.z += (target.z - this.z) * α
    this.t += (target.t - this.t) * α
    return this;
  }
  lerp2(a: Quaternion, b: Quaternion, α: number): Quaternion {
    this.copy(a).lerp(b, α)
    return this
  }
  log(): Quaternion {
    return this
  }
  magnitude(): number {
    return Math.sqrt(this.quaditude());
  }
  multiply(q: Quaternion): Quaternion {
    return this.product(this, q);
  }
  /**
   * <p>
   * <code>this ⟼ sqrt(this * conj(this))</code>
   * </p>
   * @method norm
   * @return {Quaternion} <code>this</code>
   * @chainable
   */
  norm(): Quaternion {
    this.t = this.magnitude()
    this.x = 0
    this.y = 0
    this.z = 0
    return this
  }
  /**
   * <p>
   * <code>this ⟼ (a, <b>B</b>)(c, <b>D</b>)</code>
   * </p>
   * @method product
   * @param a {Quaternion}
   * @param b {Quaternion}
   * @return {Quaternion} <code>this</code>
   * @chainable
   */
  product(a: Quaternion, b: Quaternion): Quaternion {
    let qax = a.x, qay = a.y, qaz = a.z, qaw = a.t;
    let qbx = b.x, qby = b.y, qbz = b.z, qbw = b.t;
    this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
    this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
    this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
    this.t = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
    return this;
  }
  /**
   * <p>
   * <code>this ⟼ this * α</code>
   * </p>
   * @method scale
   * @param α {number}
   * @return {Quaternion} <code>this</code>
   * @chainable
   */
  scale(α: number): Quaternion {
    mustBeNumber('α', α)
    this.t *= α
    this.x *= α
    this.y *= α
    this.z *= α
    return this;
  }
  normalize(): Quaternion {
    let l = this.magnitude();
    if (l === 0) {
      this.x = 0;
      this.y = 0;
      this.z = 0;
      this.t = 1;
    }
    else {
      l = 1 / l;
      this.x = this.x * l;
      this.y = this.y * l;
      this.z = this.z * l;
      this.t = this.t * l;
    }
    return this;
  }
  quaditude(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.t * this.t;
  }
  reflect(n: Cartesian3): Quaternion {
    // FIXME: What does this mean?
    throw new Error();
  }
  rotate(rotor: Quaternion): Quaternion {
    // TODO: This would require creating a temporary so we fall back to components.
    return this.product(rotor, this);
  }
  rotor(a: Cartesian3, b: Cartesian3): Quaternion {
    return this
  }
  /**
   * <p>
   * <code>this = ⟼ exp(- dual(a) * θ / 2)</code>
   * </p>
   * @method rotorFromAxisAngle
   * @param axis {Cartesian3}
   * @param θ {number}
   * @return {Quaternion} <code>this</code>
   * @chainable
   */
  rotorFromAxisAngle(axis: Cartesian3, θ: number): Quaternion {
    //this.dual(a).scale(-θ/2).exp()?
    let φ = θ / 2
    let s = sin(φ)
    this.x = axis.x * s
    this.y = axis.y * s
    this.z = axis.z * s
    this.t = cos(φ)
    return this;
  }
  setFromRotationMatrix(m: Matrix4): Quaternion {
    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
    // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
    var te = m.data,

      m11 = te[0], m12 = te[4], m13 = te[8],
      m21 = te[1], m22 = te[5], m23 = te[9],
      m31 = te[2], m32 = te[6], m33 = te[10],

      trace = m11 + m22 + m33,
      s: number;

    if (trace > 0) {
      s = 0.5 / Math.sqrt(trace + 1.0);
      this.t = 0.25 / s;
      this.x = (m32 - m23) * s;
      this.y = (m13 - m31) * s;
      this.z = (m21 - m12) * s;
    }
    else if (m11 > m22 && m11 > m33) {
      s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);
      this.t = (m32 - m23) / s;
      this.x = 0.25 * s;
      this.y = (m12 + m21) / s;
      this.z = (m13 + m31) / s;
    }
    else if (m22 > m33) {
      s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);
      this.t = (m13 - m31) / s;
      this.x = (m12 + m21) / s;
      this.y = 0.25 * s;
      this.z = (m23 + m32) / s;
    }
    else {
      s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);
      this.t = (m21 - m12) / s;
      this.x = (m13 + m31) / s;
      this.y = (m23 + m32) / s;
      this.z = 0.25 * s;
    }
    return this;
  }
  spinor(a: Cartesian3, b: Cartesian3): Quaternion {
    // TODO: Could create circularity problems.
    let v1 = new Vector3();

    var r: number = euclidean3Quaditude2Arg(a, b) + 1;

    if (r < EPS) {
      r = 0;
      if (Math.abs(a.x) > Math.abs(a.z)) {
        v1.setXYZ(-a.y, a.x, 0);
      }
      else {
        v1.setXYZ(0, -a.z, a.y);
      }
    }
    else {
      v1.cross2(a, b);
    }
    this.x = v1.x;
    this.y = v1.y;
    this.z = v1.z;
    this.t = r;
    this.normalize();
    return this;
  }
  slerp(qb: Quaternion, t: number): Quaternion {
    if (t === 0) return this;
    if (t === 1) return this.copy(qb);
    var x = this.x, y = this.y, z = this.z, w = this.t;

    // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

    var cosHalfTheta = w * qb.t + x * qb.x + y * qb.y + z * qb.z;

    if (cosHalfTheta < 0) {

      this.t = - qb.t;
      this.x = - qb.x;
      this.y = - qb.y;
      this.z = - qb.z;

      cosHalfTheta = - cosHalfTheta;

    }
    else {
      this.copy(qb);
    }
    if (cosHalfTheta >= 1.0) {
      this.t = w;
      this.x = x;
      this.y = y;
      this.z = z;
      return this;
    }
    var halfTheta = Math.acos(cosHalfTheta);
    var sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);
    if (Math.abs(sinHalfTheta) < 0.001) {
      this.t = 0.5 * (w + this.t);
      this.x = 0.5 * (x + this.x);
      this.y = 0.5 * (y + this.y);
      this.z = 0.5 * (z + this.z);
      return this;
    }
    var ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta,
      ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
    this.t = (w * ratioA + this.t * ratioB);
    this.x = (x * ratioA + this.x * ratioB);
    this.y = (y * ratioA + this.y * ratioB);
    this.z = (z * ratioA + this.z * ratioB);
    return this;
  }
  sub(rhs: Quaternion) {
    return this;
  }
  diff(a: Quaternion, b: Quaternion): Quaternion {
    throw new Error("TODO: Quaternion.diff()")
    return this;
  }
  equals(quaternion: Quaternion) {
    return (quaternion.x === this.x) && (quaternion.y === this.y) && (quaternion.z === this.z) && (quaternion.t === this.t);
  }
  fromArray(array: number[], offset: number = 0): Quaternion {
    this.x = array[offset];
    this.y = array[offset + 1];
    this.z = array[offset + 2];
    this.t = array[offset + 3];
    return this;
  }
  toArray(array: number[] = [], offset: number = 0): number[] {
    array[offset] = this.x;
    array[offset + 1] = this.y;
    array[offset + 2] = this.z;
    array[offset + 3] = this.t;
    return array;
  }
  public static slerp(qa: Quaternion, qb: Quaternion, qm: Quaternion, t: number): Quaternion {
    return qm.copy(qa).slerp(qb, t);
  }
}

export = Quaternion;
