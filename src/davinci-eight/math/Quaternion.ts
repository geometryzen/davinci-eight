import dotVectorCartesianE3 from '../math/dotVectorCartesianE3';
import G3 from '../math/G3';
import dotVector from '../math/dotVectorE3';
import MutableGeometricElement from '../math/MutableGeometricElement';
import Matrix4 from '../math/Matrix4';
import mustBeInteger from '../checks/mustBeInteger';
import mustBeNumber from '../checks/mustBeNumber';
import mustBeObject from '../checks/mustBeObject';
import notImplemented from '../i18n/notImplemented';
import Vector3 from '../math/Vector3';
import TrigMethods from '../math/TrigMethods';
import VectorE3 from '../math/VectorE3';

/**
 * @module EIGHT
 * @submodule math
 */

const cos = Math.cos
const sin = Math.sin
const exp = Math.exp

const EPS = 0.000001;

// This class is for reference only and will remain undocumented and internal.
// Notice that it is mutable, betraying a usage with animation loops.
// But there we want to use the Spinor3 spinor, or the full multivector, Geometric3.
// For comparison QQ and CC are immutable.
export default class Quaternion implements MutableGeometricElement<Quaternion, Quaternion, Quaternion, VectorE3, number, number, number>, TrigMethods<Quaternion> {
  private x: number;
  private y: number;
  private z: number;
  public t: number;
  constructor(t = 1, v: VectorE3 = G3.zero) {
    this.t = mustBeNumber('t', t)
    mustBeObject('v', v)
    this.x = mustBeNumber('v.x', v.x)
    this.y = mustBeNumber('v.y', v.y)
    this.z = mustBeNumber('v.z', v.z)
  }
  get v(): VectorE3 {
    return new G3(0, this.x, this.y, this.z, 0, 0, 0, 0)
  }

  add(q: Quaternion, α = 1): Quaternion {
    mustBeObject('q', q)
    mustBeNumber('α', α)
    this.t += q.t * α
    this.x += q.x * α
    this.y += q.y * α
    this.z += q.z * α
    return this
  }

  /**
   * Intentionally undocumented.
   */
  addPseudo(β: number): Quaternion {
    mustBeNumber('β', β)
    return this
  }

  addScalar(α: number): Quaternion {
    mustBeNumber('α', α)
    this.t += α
    return this
  }

  add2(a: Quaternion, b: Quaternion): Quaternion {
    mustBeObject('a', a)
    mustBeObject('b', b)
    this.t = a.t + b.t
    this.x = a.x + b.x
    this.y = a.y + b.y
    this.z = a.z + b.z
    return this
  }

  adj(): Quaternion {
    throw new Error('TODO: Quaternion.adj')
  }

  angle(): Quaternion {
    return this.log().grade(2);
  }

  approx(n: number): Quaternion {
    return this
  }

  dual(vector: VectorE3): Quaternion {
    // TODO
    return this
  }

  clone(): Quaternion {
    return new Quaternion(this.t, new G3(0, this.x, this.y, this.z, 0, 0, 0, 0))
  }

  lco(rhs: Quaternion): Quaternion {
    return this.lco2(this, rhs)
  }

  lco2(a: Quaternion, b: Quaternion): Quaternion {
    return this
  }

  rco(rhs: Quaternion): Quaternion {
    return this.rco2(this, rhs)
  }

  rco2(a: Quaternion, b: Quaternion): Quaternion {
    return this
  }

  conj(): Quaternion {
    this.x *= -1
    this.y *= -1
    this.z *= -1
    return this;
  }

  get coords(): number[] {
    return []
  }

  copy(quaternion: Quaternion): Quaternion {
    this.x = quaternion.x;
    this.y = quaternion.y;
    this.z = quaternion.z;
    this.t = quaternion.t;
    return this;
  }
  copyScalar(α: number): Quaternion {
    return this.zero().addScalar(α)
  }
  copySpinor(spinor: Quaternion) {
    this.x = spinor.x
    this.y = spinor.y
    this.z = spinor.z
    this.t = spinor.t
    return this
  }
  copyVector(vector: VectorE3) {
    return this.zero()
  }
  cos(): Quaternion {
    return this;
  }
  cosh(): Quaternion {
    return this;
  }
  div(q: Quaternion): Quaternion {
    return this.div2(this, q);
  }
  div2(a: Quaternion, b: Quaternion): Quaternion {
    let qax = a.x, qay = a.y, qaz = a.z, qaw = a.t;
    let qbx = b.x, qby = b.y, qbz = b.z, qbw = b.t;
    this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
    this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
    this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
    this.t = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
    return this;
  }
  divByScalar(scalar: number) {
    return this;
  }
  dot(v: Quaternion): number {
    return this.x * v.x + this.y * v.y + this.z * v.z + this.t * v.t;
  }
  exp(): Quaternion {
    let expT = exp(this.t)
    let m = dotVectorCartesianE3(this.x, this.y, this.z, this.x, this.y, this.z)
    let s = m !== 0 ? sin(m) / m : 1
    this.t = expT * cos(m)
    this.x = expT * this.x * s
    this.y = expT * this.y * s
    this.z = expT * this.z * s
    return this;
  }
  inv(): Quaternion {
    return this.conj().normalize()
  }
  isOne(): boolean {
    return this.t === 1 && this.x === 0 && this.y === 0 && this.z === 0
  }
  isZero(): boolean {
    return this.t === 0 && this.x === 0 && this.y === 0 && this.z === 0
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
    return Math.sqrt(this.squaredNormSansUnits());
  }

  magnitudeSansUnits(): number {
    return Math.sqrt(this.squaredNormSansUnits());
  }

  mul(q: Quaternion): Quaternion {
    return this.mul2(this, q);
  }
  mul2(a: Quaternion, b: Quaternion): Quaternion {
    let qax = a.x, qay = a.y, qaz = a.z, qaw = a.t;
    let qbx = b.x, qby = b.y, qbz = b.z, qbw = b.t;
    this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
    this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
    this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
    this.t = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
    return this;
  }
  norm(): Quaternion {
    this.t = this.squaredNormSansUnits()
    this.x = 0
    this.y = 0
    this.z = 0
    return this
  }
  scale(α: number): Quaternion {
    mustBeNumber('α', α)
    this.t *= α
    this.x *= α
    this.y *= α
    this.z *= α
    return this;
  }
  sin(): Quaternion {
    return this;
  }
  sinh(): Quaternion {
    return this;
  }
  neg(): Quaternion {
    this.t = -this.t
    this.x = -this.x
    this.y = -this.y
    this.z = -this.z
    return this;
  }
  normalize(): Quaternion {
    const m = this.magnitudeSansUnits();
    this.x = this.x / m
    this.y = this.y / m
    this.z = this.z / m
    this.t = this.t / m
    return this;
  }

  one(): Quaternion {
    this.t = 1
    this.x = 0
    this.y = 0
    this.z = 0
    return this
  }

  quad(): Quaternion {
    this.t = this.squaredNormSansUnits()
    this.x = 0
    this.y = 0
    this.z = 0
    return this
  }

  squaredNorm(): number {
    return this.squaredNormSansUnits()
  }

  squaredNormSansUnits(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.t * this.t;
  }

  stress(σ: VectorE3): Quaternion {
    throw new Error(notImplemented('stress').message);
  }
  reflect(n: VectorE3): Quaternion {
    throw new Error("TODO: Quaternion.reflect");
  }
  rev(): Quaternion {
    this.x *= -1
    this.y *= -1
    this.z *= -1
    return this
  }
  rotate(rotor: Quaternion): Quaternion {
    // FIXME: This would require creating a temporary so we fall back to components.
    return this.mul2(rotor, this);
  }
  rotorFromDirections(a: VectorE3, b: VectorE3): Quaternion {
    throw new Error(notImplemented('rotorFromDirections').message);
  }
  rotorFromGeneratorAngle(B: Quaternion, θ: number): Quaternion {
    let φ = θ / 2
    let s = sin(φ)
    this.x = B.x * s
    this.y = B.y * s
    this.z = B.z * s
    this.t = cos(φ)
    return this;
  }
  setFromRotationMatrix(m: Matrix4): Quaternion {
    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
    // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
    var te = m.elements,

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

  versor(a: VectorE3, b: VectorE3): Quaternion {
    // TODO: Could create circularity problems.
    let v1 = new Vector3();

    var r: number = dotVector(a, b) + 1;

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

    var cosHHalfTheta = w * qb.t + x * qb.x + y * qb.y + z * qb.z;

    if (cosHHalfTheta < 0) {

      this.t = - qb.t;
      this.x = - qb.x;
      this.y = - qb.y;
      this.z = - qb.z;

      cosHHalfTheta = - cosHHalfTheta;

    }
    else {
      this.copy(qb);
    }
    if (cosHHalfTheta >= 1.0) {
      this.t = w;
      this.x = x;
      this.y = y;
      this.z = z;
      return this;
    }
    var halfTheta = Math.acos(cosHHalfTheta);
    var sinHHalfTheta = Math.sqrt(1.0 - cosHHalfTheta * cosHHalfTheta);
    if (Math.abs(sinHHalfTheta) < 0.001) {
      this.t = 0.5 * (w + this.t);
      this.x = 0.5 * (x + this.x);
      this.y = 0.5 * (y + this.y);
      this.z = 0.5 * (z + this.z);
      return this;
    }
    var ratioA = Math.sin((1 - t) * halfTheta) / sinHHalfTheta,
      ratioB = Math.sin(t * halfTheta) / sinHHalfTheta;
    this.t = (w * ratioA + this.t * ratioB);
    this.x = (x * ratioA + this.x * ratioB);
    this.y = (y * ratioA + this.y * ratioB);
    this.z = (z * ratioA + this.z * ratioB);
    return this;
  }
  scp(rhs: Quaternion): Quaternion {
    return this.scp2(this, rhs)
  }
  scp2(a: Quaternion, b: Quaternion): Quaternion {
    return this
  }
  sub(q: Quaternion, α = 1) {
    this.x -= q.x * α
    this.y -= q.y * α
    this.z -= q.z * α
    this.t -= q.t * α
    return this;
  }
  sub2(a: Quaternion, b: Quaternion): Quaternion {
    this.x = a.x - b.x
    this.y = a.y - b.y
    this.z = a.z - b.z
    this.t = a.t - b.t
    return this;
  }

  tan(): Quaternion {
    return this.sin().div(this.cos())
  }

  grade(grade: number): Quaternion {
    mustBeInteger('grade', grade)
    switch (grade) {
      case 0: {
        this.x = 0;
        this.y = 0;
        this.z = 0;
      }
        break;
      case 2: {
        this.t = 0;
      }
        break;
      default: {
        this.t = 0;
        this.x = 0;
        this.y = 0;
        this.z = 0;
      }
    }
    return this;
  }

  toExponential(): string {
    // FIXME
    return "TODO Quaternion.toExponential";
  }
  toFixed(fractionDigits?: number): string {
    // FIXME
    return "TODO Quaternion.toFixed";
  }
  toPrecision(precision?: number): string {
    // FIXME
    return "TODO Quaternion.toPrecision";
  }
  toString(radix?: number): string {
    // FIXME
    return "TODO Quaternion.toString";
  }
  equals(quaternion: Quaternion) {
    return (quaternion.x === this.x) && (quaternion.y === this.y) && (quaternion.z === this.z) && (quaternion.t === this.t);
  }
  fromArray(array: number[], offset = 0): Quaternion {
    this.x = array[offset];
    this.y = array[offset + 1];
    this.z = array[offset + 2];
    this.t = array[offset + 3];
    return this;
  }
  toArray(array: number[] = [], offset = 0): number[] {
    array[offset] = this.x;
    array[offset + 1] = this.y;
    array[offset + 2] = this.z;
    array[offset + 3] = this.t;
    return array;
  }
  ext(rhs: Quaternion): Quaternion {
    return this.ext2(this, rhs)
  }
  ext2(a: Quaternion, b: Quaternion): Quaternion {
    return this
  }

  zero(): Quaternion {
    this.t = 0
    this.x = 0
    this.y = 0
    this.z = 0
    return this
  }

  public static slerp(qa: Quaternion, qb: Quaternion, qm: Quaternion, t: number): Quaternion {
    return qm.copy(qa).slerp(qb, t);
  }
}
