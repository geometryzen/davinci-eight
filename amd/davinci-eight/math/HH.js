define(["require", "exports", '../math/dotVectorCartesianE3', '../math/G3', '../math/dotVectorE3', '../checks/mustBeInteger', '../checks/mustBeNumber', '../checks/mustBeObject', '../math/quadVectorE3', '../math/R3m', '../math/rotorFromDirections'], function (require, exports, dotVectorCartesianE3_1, G3_1, dotVectorE3_1, mustBeInteger_1, mustBeNumber_1, mustBeObject_1, quadVectorE3_1, R3m_1, rotorFromDirections_1) {
    var cos = Math.cos;
    var sin = Math.sin;
    var exp = Math.exp;
    var EPS = 0.000001;
    var HH = (function () {
        function HH(t, v) {
            if (t === void 0) { t = 1; }
            if (v === void 0) { v = G3_1.default.zero; }
            this.t = mustBeNumber_1.default('t', t);
            mustBeObject_1.default('v', v);
            this.x = mustBeNumber_1.default('v.x', v.x);
            this.y = mustBeNumber_1.default('v.y', v.y);
            this.z = mustBeNumber_1.default('v.z', v.z);
        }
        Object.defineProperty(HH.prototype, "v", {
            get: function () {
                return new G3_1.default(0, this.x, this.y, this.z, 0, 0, 0, 0);
            },
            enumerable: true,
            configurable: true
        });
        HH.prototype.add = function (q, α) {
            if (α === void 0) { α = 1; }
            mustBeObject_1.default('q', q);
            mustBeNumber_1.default('α', α);
            this.t += q.t * α;
            this.x += q.x * α;
            this.y += q.y * α;
            this.z += q.z * α;
            return this;
        };
        HH.prototype.addPseudo = function (β) {
            mustBeNumber_1.default('β', β);
            return this;
        };
        HH.prototype.addScalar = function (α) {
            mustBeNumber_1.default('α', α);
            this.t += α;
            return this;
        };
        HH.prototype.add2 = function (a, b) {
            mustBeObject_1.default('a', a);
            mustBeObject_1.default('b', b);
            this.t = a.t + b.t;
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            this.z = a.z + b.z;
            return this;
        };
        HH.prototype.adj = function () {
            throw new Error('TODO: HH.adj');
        };
        HH.prototype.angle = function () {
            return this.log().grade(2);
        };
        HH.prototype.dual = function (vector) {
            return this;
        };
        HH.prototype.clone = function () {
            return new HH(this.t, new G3_1.default(0, this.x, this.y, this.z, 0, 0, 0, 0));
        };
        HH.prototype.lco = function (rhs) {
            return this.lco2(this, rhs);
        };
        HH.prototype.lco2 = function (a, b) {
            return this;
        };
        HH.prototype.rco = function (rhs) {
            return this.rco2(this, rhs);
        };
        HH.prototype.rco2 = function (a, b) {
            return this;
        };
        HH.prototype.conj = function () {
            this.x *= -1;
            this.y *= -1;
            this.z *= -1;
            return this;
        };
        Object.defineProperty(HH.prototype, "coords", {
            get: function () {
                return [];
            },
            enumerable: true,
            configurable: true
        });
        HH.prototype.copy = function (quaternion) {
            this.x = quaternion.x;
            this.y = quaternion.y;
            this.z = quaternion.z;
            this.t = quaternion.t;
            return this;
        };
        HH.prototype.copyScalar = function (α) {
            return this.zero().addScalar(α);
        };
        HH.prototype.copySpinor = function (spinor) {
            this.x = spinor.x;
            this.y = spinor.y;
            this.z = spinor.z;
            this.t = spinor.t;
            return this;
        };
        HH.prototype.copyVector = function (vector) {
            return this.zero();
        };
        HH.prototype.cos = function () {
            return this;
        };
        HH.prototype.cosh = function () {
            return this;
        };
        HH.prototype.div = function (q) {
            return this.div2(this, q);
        };
        HH.prototype.div2 = function (a, b) {
            var qax = a.x, qay = a.y, qaz = a.z, qaw = a.t;
            var qbx = b.x, qby = b.y, qbz = b.z, qbw = b.t;
            this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
            this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
            this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
            this.t = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
            return this;
        };
        HH.prototype.divByScalar = function (scalar) {
            return this;
        };
        HH.prototype.dot = function (v) {
            return this.x * v.x + this.y * v.y + this.z * v.z + this.t * v.t;
        };
        HH.prototype.exp = function () {
            var expT = exp(this.t);
            var m = dotVectorCartesianE3_1.default(this.x, this.y, this.z, this.x, this.y, this.z);
            var s = m !== 0 ? sin(m) / m : 1;
            this.t = expT * cos(m);
            this.x = expT * this.x * s;
            this.y = expT * this.y * s;
            this.z = expT * this.z * s;
            return this;
        };
        HH.prototype.inv = function () {
            this.conj().direction();
            return this;
        };
        HH.prototype.lerp = function (target, α) {
            this.x += (target.x - this.x) * α;
            this.y += (target.y - this.y) * α;
            this.z += (target.z - this.z) * α;
            this.t += (target.t - this.t) * α;
            return this;
        };
        HH.prototype.lerp2 = function (a, b, α) {
            this.copy(a).lerp(b, α);
            return this;
        };
        HH.prototype.log = function () {
            return this;
        };
        HH.prototype.magnitude = function () {
            return this.norm();
        };
        HH.prototype.magnitudeSansUnits = function () {
            return Math.sqrt(this.squaredNormSansUnits());
        };
        HH.prototype.mul = function (q) {
            return this.mul2(this, q);
        };
        HH.prototype.mul2 = function (a, b) {
            var qax = a.x, qay = a.y, qaz = a.z, qaw = a.t;
            var qbx = b.x, qby = b.y, qbz = b.z, qbw = b.t;
            this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
            this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
            this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
            this.t = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
            return this;
        };
        HH.prototype.norm = function () {
            this.t = this.squaredNormSansUnits();
            this.x = 0;
            this.y = 0;
            this.z = 0;
            return this;
        };
        HH.prototype.scale = function (α) {
            mustBeNumber_1.default('α', α);
            this.t *= α;
            this.x *= α;
            this.y *= α;
            this.z *= α;
            return this;
        };
        HH.prototype.sin = function () {
            return this;
        };
        HH.prototype.sinh = function () {
            return this;
        };
        HH.prototype.neg = function () {
            this.t = -this.t;
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            return this;
        };
        HH.prototype.direction = function () {
            var modulus = this.magnitudeSansUnits();
            this.x = this.x / modulus;
            this.y = this.y / modulus;
            this.z = this.z / modulus;
            this.t = this.t / modulus;
            return this;
        };
        HH.prototype.one = function () {
            this.t = 1;
            this.x = 0;
            this.y = 0;
            this.z = 0;
            return this;
        };
        HH.prototype.quad = function () {
            return this.squaredNorm();
        };
        HH.prototype.squaredNorm = function () {
            this.t = this.squaredNormSansUnits();
            this.x = 0;
            this.y = 0;
            this.z = 0;
            return this;
        };
        HH.prototype.squaredNormSansUnits = function () {
            return this.x * this.x + this.y * this.y + this.z * this.z + this.t * this.t;
        };
        HH.prototype.reflect = function (n) {
            throw new Error("TODO: HH.reflect");
        };
        HH.prototype.rev = function () {
            this.x *= -1;
            this.y *= -1;
            this.z *= -1;
            return this;
        };
        HH.prototype.rotate = function (rotor) {
            return this.mul2(rotor, this);
        };
        HH.prototype.rotorFromDirections = function (a, b) {
            return rotorFromDirections_1.default(a, b, quadVectorE3_1.default, dotVectorE3_1.default, this);
        };
        HH.prototype.rotorFromAxisAngle = function (axis, θ) {
            var φ = θ / 2;
            var s = sin(φ);
            this.x = axis.x * s;
            this.y = axis.y * s;
            this.z = axis.z * s;
            this.t = cos(φ);
            return this;
        };
        HH.prototype.rotorFromGeneratorAngle = function (B, θ) {
            var φ = θ / 2;
            var s = sin(φ);
            this.x = B.x * s;
            this.y = B.y * s;
            this.z = B.z * s;
            this.t = cos(φ);
            return this;
        };
        HH.prototype.setFromRotationMatrix = function (m) {
            var te = m.elements, m11 = te[0], m12 = te[4], m13 = te[8], m21 = te[1], m22 = te[5], m23 = te[9], m31 = te[2], m32 = te[6], m33 = te[10], trace = m11 + m22 + m33, s;
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
        };
        HH.prototype.spinor = function (a, b) {
            var v1 = new R3m_1.default();
            var r = dotVectorE3_1.default(a, b) + 1;
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
            this.direction();
            return this;
        };
        HH.prototype.slerp = function (qb, t) {
            if (t === 0)
                return this;
            if (t === 1)
                return this.copy(qb);
            var x = this.x, y = this.y, z = this.z, w = this.t;
            var cosHHalfTheta = w * qb.t + x * qb.x + y * qb.y + z * qb.z;
            if (cosHHalfTheta < 0) {
                this.t = -qb.t;
                this.x = -qb.x;
                this.y = -qb.y;
                this.z = -qb.z;
                cosHHalfTheta = -cosHHalfTheta;
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
            var ratioA = Math.sin((1 - t) * halfTheta) / sinHHalfTheta, ratioB = Math.sin(t * halfTheta) / sinHHalfTheta;
            this.t = (w * ratioA + this.t * ratioB);
            this.x = (x * ratioA + this.x * ratioB);
            this.y = (y * ratioA + this.y * ratioB);
            this.z = (z * ratioA + this.z * ratioB);
            return this;
        };
        HH.prototype.scp = function (rhs) {
            return this.scp2(this, rhs);
        };
        HH.prototype.scp2 = function (a, b) {
            return this;
        };
        HH.prototype.sub = function (q, α) {
            if (α === void 0) { α = 1; }
            this.x -= q.x * α;
            this.y -= q.y * α;
            this.z -= q.z * α;
            this.t -= q.t * α;
            return this;
        };
        HH.prototype.sub2 = function (a, b) {
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.z = a.z - b.z;
            this.t = a.t - b.t;
            return this;
        };
        HH.prototype.tan = function () {
            return this.sin().div(this.cos());
        };
        HH.prototype.grade = function (grade) {
            mustBeInteger_1.default('grade', grade);
            switch (grade) {
                case 0:
                    {
                        this.x = 0;
                        this.y = 0;
                        this.z = 0;
                    }
                    break;
                case 2:
                    {
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
        };
        HH.prototype.toExponential = function () {
            return "TODO HH.toExponential";
        };
        HH.prototype.toFixed = function (digits) {
            return "TODO HH.toFixed";
        };
        HH.prototype.equals = function (quaternion) {
            return (quaternion.x === this.x) && (quaternion.y === this.y) && (quaternion.z === this.z) && (quaternion.t === this.t);
        };
        HH.prototype.fromArray = function (array, offset) {
            if (offset === void 0) { offset = 0; }
            this.x = array[offset];
            this.y = array[offset + 1];
            this.z = array[offset + 2];
            this.t = array[offset + 3];
            return this;
        };
        HH.prototype.toArray = function (array, offset) {
            if (array === void 0) { array = []; }
            if (offset === void 0) { offset = 0; }
            array[offset] = this.x;
            array[offset + 1] = this.y;
            array[offset + 2] = this.z;
            array[offset + 3] = this.t;
            return array;
        };
        HH.prototype.ext = function (rhs) {
            return this.ext2(this, rhs);
        };
        HH.prototype.ext2 = function (a, b) {
            return this;
        };
        HH.prototype.zero = function () {
            this.t = 0;
            this.x = 0;
            this.y = 0;
            this.z = 0;
            return this;
        };
        HH.slerp = function (qa, qb, qm, t) {
            return qm.copy(qa).slerp(qb, t);
        };
        return HH;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = HH;
});
