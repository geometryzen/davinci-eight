import cartesianQuaditudeE3 = require('../math/cartesianQuaditudeE3')
import Euclidean3 = require('../math/Euclidean3')
import euclidean3Quaditude2Arg = require('../math/euclidean3Quaditude2Arg')
import MutableGeometricElement3D = require('../math/MutableGeometricElement3D')
import Matrix4 = require('../math/Matrix4')
import mustBeNumber = require('../checks/mustBeNumber')
import mustBeObject = require('../checks/mustBeObject')
import R3 = require('../math/R3')
import TrigMethods = require('../math/TrigMethods')
import VectorE3 = require('../math/VectorE3')

let cos = Math.cos
let sin = Math.sin
let exp = Math.exp

var EPS = 0.000001;

class HH implements MutableGeometricElement3D<HH, HH, HH, VectorE3, VectorE3>, TrigMethods<HH> {
    private x: number;
    private y: number;
    private z: number;
    public t: number;
    constructor(t: number = 1, v: VectorE3 = Euclidean3.zero) {
        this.t = mustBeNumber('t', t)
        mustBeObject('v', v)
        this.x = mustBeNumber('v.x', v.x)
        this.y = mustBeNumber('v.y', v.y)
        this.z = mustBeNumber('v.z', v.z)
    }
    get v(): VectorE3 {
        return new Euclidean3(0, this.x, this.y, this.z, 0, 0, 0, 0)
    }
    add(q: HH, α: number = 1): HH {
        mustBeObject('q', q)
        mustBeNumber('α', α)
        this.t += q.t * α
        this.x += q.x * α
        this.y += q.y * α
        this.z += q.z * α
        return this
    }
    add2(a: HH, b: HH): HH {
        mustBeObject('a', a)
        mustBeObject('b', b)
        this.t = a.t + b.t
        this.x = a.x + b.x
        this.y = a.y + b.y
        this.z = a.z + b.z
        return this
    }

    /**
     * @method arg
     * @return {number}
     */
    arg(): number {
        throw new Error('TODO: HH.arg')
    }

    dual(vector: VectorE3): HH {
        // TODO
        return this
    }
    clone(): HH {
        return new HH(this.t, new Euclidean3(0, this.x, this.y, this.z, 0, 0, 0, 0))
    }
    lco(rhs: HH): HH {
        return this.conL2(this, rhs)
    }
    conL2(a: HH, b: HH): HH {
        return this
    }
    rco(rhs: HH): HH {
        return this.conR2(this, rhs)
    }
    conR2(a: HH, b: HH): HH {
        return this
    }
    conj(): HH {
        this.x *= -1
        this.y *= -1
        this.z *= -1
        return this;
    }
    copy(quaternion: HH): HH {
        this.x = quaternion.x;
        this.y = quaternion.y;
        this.z = quaternion.z;
        this.t = quaternion.t;
        return this;
    }
    copySpinor(spinor: HH) {
        this.x = spinor.x
        this.y = spinor.y
        this.z = spinor.z
        this.t = spinor.t
        return this
    }
    copyVector(vector: VectorE3) {
        this.x = 0
        this.y = 0
        this.z = 0
        this.t = 0
        return this
    }
    cos(): HH {
        return this;
    }
    cosh(): HH {
        return this;
    }
    div(q: HH): HH {
        return this.div2(this, q);
    }
    div2(a: HH, b: HH): HH {
        let qax = a.x, qay = a.y, qaz = a.z, qaw = a.t;
        let qbx = b.x, qby = b.y, qbz = b.z, qbw = b.t;
        this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
        this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
        this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
        this.t = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
        return this;
    }
    divideByScalar(scalar: number) {
        return this;
    }
    dot(v: HH): number {
        return this.x * v.x + this.y * v.y + this.z * v.z + this.t * v.t;
    }
    exp(): HH {
        let expT = exp(this.t)
        let m = cartesianQuaditudeE3(this.x, this.y, this.z, this.x, this.y, this.z)
        let s = m !== 0 ? sin(m) / m : 1
        this.t = expT * cos(m)
        this.x = expT * this.x * s
        this.y = expT * this.y * s
        this.z = expT * this.z * s
        return this;
    }
    inv(): HH {
        this.conj().normalize();
        return this;
    }
    lerp(target: HH, α: number): HH {
        this.x += (target.x - this.x) * α
        this.y += (target.y - this.y) * α
        this.z += (target.z - this.z) * α
        this.t += (target.t - this.t) * α
        return this;
    }
    lerp2(a: HH, b: HH, α: number): HH {
        this.copy(a).lerp(b, α)
        return this
    }
    log(): HH {
        return this
    }
    magnitude(): number {
        return Math.sqrt(this.quaditude());
    }
    mul(q: HH): HH {
        return this.mul2(this, q);
    }
    mul2(a: HH, b: HH): HH {
        let qax = a.x, qay = a.y, qaz = a.z, qaw = a.t;
        let qbx = b.x, qby = b.y, qbz = b.z, qbw = b.t;
        this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
        this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
        this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
        this.t = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
        return this;
    }
    norm(): HH {
        this.t = this.quaditude()
        this.x = 0
        this.y = 0
        this.z = 0
        return this
    }
    scale(α: number): HH {
        mustBeNumber('α', α)
        this.t *= α
        this.x *= α
        this.y *= α
        this.z *= α
        return this;
    }
    sin(): HH {
        return this;
    }
    sinh(): HH {
        return this;
    }
    neg(): HH {
        this.t = -this.t
        this.x = -this.x
        this.y = -this.y
        this.z = -this.z
        return this;
    }
    normalize(): HH {
        let modulus = this.magnitude()
        this.x = this.x / modulus
        this.y = this.y / modulus
        this.z = this.z / modulus
        this.t = this.t / modulus
        return this
    }
    quaditude(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z + this.t * this.t;
    }
    reflect(n: VectorE3): HH {
        // FIXME: What does this mean?
        throw new Error();
    }
    reverse(): HH {
        this.x *= -1
        this.y *= -1
        this.z *= -1
        return this
    }
    rotate(rotor: HH): HH {
        // FIXME: This would require creating a temporary so we fall back to components.
        return this.mul2(rotor, this);
    }
    rotor(a: VectorE3, b: VectorE3): HH {
        return this
    }
    rotorFromAxisAngle(axis: VectorE3, θ: number): HH {
        let φ = θ / 2
        let s = sin(φ)
        this.x = axis.x * s
        this.y = axis.y * s
        this.z = axis.z * s
        this.t = cos(φ)
        return this;
    }
    rotorFromGeneratorAngle(B: HH, θ: number): HH {
        let φ = θ / 2
        let s = sin(φ)
        this.x = B.x * s
        this.y = B.y * s
        this.z = B.z * s
        this.t = cos(φ)
        return this;
    }
    setFromRotationMatrix(m: Matrix4): HH {
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
    spinor(a: VectorE3, b: VectorE3): HH {
        // TODO: Could create circularity problems.
        let v1 = new R3();

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
    slerp(qb: HH, t: number): HH {
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
    align(rhs: HH): HH {
        return this.align2(this, rhs)
    }
    align2(a: HH, b: HH): HH {
        return this
    }
    sub(q: HH, α: number = 1) {
        this.x -= q.x * α
        this.y -= q.y * α
        this.z -= q.z * α
        this.t -= q.t * α
        return this;
    }
    sub2(a: HH, b: HH): HH {
        this.x = a.x - b.x
        this.y = a.y - b.y
        this.z = a.z - b.z
        this.t = a.t - b.t
        return this;
    }
    equals(quaternion: HH) {
        return (quaternion.x === this.x) && (quaternion.y === this.y) && (quaternion.z === this.z) && (quaternion.t === this.t);
    }
    fromArray(array: number[], offset: number = 0): HH {
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
    wedge(rhs: HH): HH {
        return this.wedge2(this, rhs)
    }
    wedge2(a: HH, b: HH): HH {
        return this
    }
    public static slerp(qa: HH, qb: HH, qm: HH, t: number): HH {
        return qm.copy(qa).slerp(qb, t);
    }
}

export = HH;
