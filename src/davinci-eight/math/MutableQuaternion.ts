import cartesianQuaditudeE3 = require('../math/cartesianQuaditudeE3')
import Euclidean3 = require('../math/Euclidean3')
import euclidean3Quaditude2Arg = require('../math/euclidean3Quaditude2Arg')
import MutableGeometricElement = require('../math/MutableGeometricElement')
import Matrix4 = require('../math/Matrix4')
import mustBeNumber = require('../checks/mustBeNumber')
import mustBeObject = require('../checks/mustBeObject')
import MutableVectorE3 = require('../math/MutableVectorE3')
import VectorE3 = require('../math/VectorE3')

let cos = Math.cos
let sin = Math.sin
let exp = Math.exp

var EPS = 0.000001;

class MutableQuaternion implements MutableGeometricElement<MutableQuaternion, MutableQuaternion, MutableQuaternion, VectorE3, VectorE3> {
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
    add(q: MutableQuaternion, α: number = 1): MutableQuaternion {
        mustBeObject('q', q)
        mustBeNumber('α', α)
        this.t += q.t * α
        this.x += q.x * α
        this.y += q.y * α
        this.z += q.z * α
        return this
    }
    add2(a: MutableQuaternion, b: MutableQuaternion): MutableQuaternion {
        mustBeObject('a', a)
        mustBeObject('b', b)
        this.t = a.t + b.t
        this.x = a.x + b.x
        this.y = a.y + b.y
        this.z = a.z + b.z
        return this
    }
    dual(m: VectorE3): MutableQuaternion {
        // TODO
        return this
    }
    clone(): MutableQuaternion {
        return new MutableQuaternion(this.t, new Euclidean3(0, this.x, this.y, this.z, 0, 0, 0, 0))
    }
    conL(rhs: MutableQuaternion): MutableQuaternion {
        return this.conL2(this, rhs)
    }
    conL2(a: MutableQuaternion, b: MutableQuaternion): MutableQuaternion {
        return this
    }
    conR(rhs: MutableQuaternion): MutableQuaternion {
        return this.conR2(this, rhs)
    }
    conR2(a: MutableQuaternion, b: MutableQuaternion): MutableQuaternion {
        return this
    }
    conj(): MutableQuaternion {
        this.x *= - 1
        this.y *= - 1
        this.z *= - 1
        return this;
    }
    copy(quaternion: MutableQuaternion): MutableQuaternion {
        this.x = quaternion.x;
        this.y = quaternion.y;
        this.z = quaternion.z;
        this.t = quaternion.t;
        return this;
    }
    div(q: MutableQuaternion): MutableQuaternion {
        return this.div2(this, q);
    }
    div2(a: MutableQuaternion, b: MutableQuaternion): MutableQuaternion {
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
    dot(v: MutableQuaternion): number {
        return this.x * v.x + this.y * v.y + this.z * v.z + this.t * v.t;
    }
    exp(): MutableQuaternion {
        let expT = exp(this.t)
        let m = cartesianQuaditudeE3(this.x, this.y, this.z, this.x, this.y, this.z)
        let s = m !== 0 ? sin(m) / m : 1
        this.t = expT * cos(m)
        this.x = expT * this.x * s
        this.y = expT * this.y * s
        this.z = expT * this.z * s
        return this;
    }
    inv(): MutableQuaternion {
        this.conj().normalize();
        return this;
    }
    lerp(target: MutableQuaternion, α: number): MutableQuaternion {
        this.x += (target.x - this.x) * α
        this.y += (target.y - this.y) * α
        this.z += (target.z - this.z) * α
        this.t += (target.t - this.t) * α
        return this;
    }
    lerp2(a: MutableQuaternion, b: MutableQuaternion, α: number): MutableQuaternion {
        this.copy(a).lerp(b, α)
        return this
    }
    log(): MutableQuaternion {
        return this
    }
    magnitude(): number {
        return Math.sqrt(this.quaditude());
    }
    mul(q: MutableQuaternion): MutableQuaternion {
        return this.mul2(this, q);
    }
    mul2(a: MutableQuaternion, b: MutableQuaternion): MutableQuaternion {
        let qax = a.x, qay = a.y, qaz = a.z, qaw = a.t;
        let qbx = b.x, qby = b.y, qbz = b.z, qbw = b.t;
        this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
        this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
        this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
        this.t = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
        return this;
    }
    norm(): MutableQuaternion {
        this.t = this.quaditude()
        this.x = 0
        this.y = 0
        this.z = 0
        return this
    }
    scale(α: number): MutableQuaternion {
        mustBeNumber('α', α)
        this.t *= α
        this.x *= α
        this.y *= α
        this.z *= α
        return this;
    }
    normalize(): MutableQuaternion {
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
    reflect(n: VectorE3): MutableQuaternion {
        // FIXME: What does this mean?
        throw new Error();
    }
    rotate(rotor: MutableQuaternion): MutableQuaternion {
        // FIXME: This would require creating a temporary so we fall back to components.
        return this.mul2(rotor, this);
    }
    rotor(a: VectorE3, b: VectorE3): MutableQuaternion {
        return this
    }
    rotorFromAxisAngle(axis: VectorE3, θ: number): MutableQuaternion {
        let φ = θ / 2
        let s = sin(φ)
        this.x = axis.x * s
        this.y = axis.y * s
        this.z = axis.z * s
        this.t = cos(φ)
        return this;
    }
    setFromRotationMatrix(m: Matrix4): MutableQuaternion {
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
    spinor(a: VectorE3, b: VectorE3): MutableQuaternion {
        // TODO: Could create circularity problems.
        let v1 = new MutableVectorE3();

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
    slerp(qb: MutableQuaternion, t: number): MutableQuaternion {
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
    align(rhs: MutableQuaternion): MutableQuaternion {
        return this.align2(this, rhs)
    }
    align2(a: MutableQuaternion, b: MutableQuaternion): MutableQuaternion {
        return this
    }
    sub(q: MutableQuaternion, α: number = 1) {
        this.x -= q.x * α
        this.y -= q.y * α
        this.z -= q.z * α
        this.t -= q.t * α
        return this;
    }
    sub2(a: MutableQuaternion, b: MutableQuaternion): MutableQuaternion {
        this.x = a.x - b.x
        this.y = a.y - b.y
        this.z = a.z - b.z
        this.t = a.t - b.t
        return this;
    }
    equals(quaternion: MutableQuaternion) {
        return (quaternion.x === this.x) && (quaternion.y === this.y) && (quaternion.z === this.z) && (quaternion.t === this.t);
    }
    fromArray(array: number[], offset: number = 0): MutableQuaternion {
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
    wedge(rhs: MutableQuaternion): MutableQuaternion {
        return this.wedge2(this, rhs)
    }
    wedge2(a: MutableQuaternion, b: MutableQuaternion): MutableQuaternion {
        return this
    }
    public static slerp(qa: MutableQuaternion, qb: MutableQuaternion, qm: MutableQuaternion, t: number): MutableQuaternion {
        return qm.copy(qa).slerp(qb, t);
    }
}

export = MutableQuaternion;
