var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/cartesianQuaditudeE3', '../math/euclidean3Quaditude2Arg', '../checks/mustBeNumber', '../checks/mustBeObject', '../math/VectorN', '../math/wedgeXY', '../math/wedgeYZ', '../math/wedgeZX'], function (require, exports, cartesianQuaditudeE3, euclidean3Quaditude2Arg, mustBeNumber, mustBeObject, VectorN, wedgeXY, wedgeYZ, wedgeZX) {
    var exp = Math.exp;
    var cos = Math.cos;
    var sin = Math.sin;
    /**
     * @class MutableSpinorE3
     * @extends VectorN<number>
     */
    var MutableSpinorE3 = (function (_super) {
        __extends(MutableSpinorE3, _super);
        /**
         * @class MutableSpinorE3
         * @constructor
         * @param data [number[] = [0, 0, 0, 1]] Corresponds to the basis e2e3, e3e1, e1e2, 1
         * @param modified [boolean = false]
         */
        function MutableSpinorE3(data, modified) {
            if (data === void 0) { data = [0, 0, 0, 1]; }
            if (modified === void 0) { modified = false; }
            _super.call(this, data, modified, 4);
        }
        Object.defineProperty(MutableSpinorE3.prototype, "yz", {
            /**
             * @property yz
             * @type Number
             */
            get: function () {
                return this.data[0];
            },
            set: function (yz) {
                mustBeNumber('yz', yz);
                this.modified = this.modified || this.yz !== yz;
                this.data[0] = yz;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MutableSpinorE3.prototype, "zx", {
            /**
             * @property zx
             * @type Number
             */
            get: function () {
                return this.data[1];
            },
            set: function (zx) {
                mustBeNumber('zx', zx);
                this.modified = this.modified || this.zx !== zx;
                this.data[1] = zx;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MutableSpinorE3.prototype, "xy", {
            /**
             * @property xy
             * @type Number
             */
            get: function () {
                return this.data[2];
            },
            set: function (xy) {
                mustBeNumber('xy', xy);
                this.modified = this.modified || this.xy !== xy;
                this.data[2] = xy;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MutableSpinorE3.prototype, "w", {
            /**
             * @property w
             * @type Number
             */
            get: function () {
                return this.data[3];
            },
            set: function (w) {
                mustBeNumber('w', w);
                this.modified = this.modified || this.w !== w;
                this.data[3] = w;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * <p>
         * <code>this ⟼ this + α * spinor</code>
         * </p>
         * @method add
         * @param spinor {SpinorE3}
         * @param α [number = 1]
         * @return {MutableSpinorE3} <code>this</code>
         * @chainable
         */
        MutableSpinorE3.prototype.add = function (spinor, α) {
            if (α === void 0) { α = 1; }
            mustBeObject('spinor', spinor);
            mustBeNumber('α', α);
            this.yz += spinor.yz * α;
            this.zx += spinor.zx * α;
            this.xy += spinor.xy * α;
            this.w += spinor.w * α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a + b</code>
         * </p>
         * @method add2
         * @param a {SpinorE3}
         * @param b {SpinorE3}
         * @return {MutableSpinorE3} <code>this</code>
         * @chainable
         */
        MutableSpinorE3.prototype.add2 = function (a, b) {
            this.w = a.w + b.w;
            this.yz = a.yz + b.yz;
            this.zx = a.zx + b.zx;
            this.xy = a.xy + b.xy;
            return this;
        };
        /**
         * @method clone
         * @return {MutableSpinorE3} A copy of <code>this</code>.
         * @chainable
         */
        MutableSpinorE3.prototype.clone = function () {
            return new MutableSpinorE3([this.yz, this.zx, this.xy, this.w]);
        };
        /**
         * <p>
         * <code>this ⟼ (w, -B)</code>
         * </p>
         * @method conj
         * @return {MutableSpinorE3} <code>this</code>
         * @chainable
         */
        MutableSpinorE3.prototype.conj = function () {
            this.yz = -this.yz;
            this.zx = -this.zx;
            this.xy = -this.xy;
            return this;
        };
        MutableSpinorE3.prototype.conL = function (rhs) {
            return this.conL2(this, rhs);
        };
        MutableSpinorE3.prototype.conL2 = function (a, b) {
            // FIXME: How to leverage? Maybe break up? Don't want performance hit.
            // scpG3(a, b, this)
            return this;
        };
        MutableSpinorE3.prototype.conR = function (rhs) {
            return this.conR2(this, rhs);
        };
        MutableSpinorE3.prototype.conR2 = function (a, b) {
            // FIXME: How to leverage? Maybe break up? Don't want performance hit.
            // scpG3(a, b, this)
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ copy(spinor)</code>
         * </p>
         * @method copy
         * @param spinor {SpinorE3}
         * @return {MutableSpinorE3} <code>this</code>
         * @chainable
         */
        MutableSpinorE3.prototype.copy = function (spinor) {
            mustBeObject('spinor', spinor);
            this.yz = mustBeNumber('spinor.yz', spinor.yz);
            this.zx = mustBeNumber('spinor.zx', spinor.zx);
            this.xy = mustBeNumber('spinor.xy', spinor.xy);
            this.w = mustBeNumber('spinor.w', spinor.w);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this / s</code>
         * </p>
         * @method div
         * @param s {SpinorE3}
         * @return {MutableSpinorE3} <code>this</code>
         * @chainable
         */
        MutableSpinorE3.prototype.div = function (s) {
            return this.div2(this, s);
        };
        /**
         * <p>
         * <code>this ⟼ a / b</code>
         * </p>
         * @method div2
         * @param a {SpinorE3}
         * @param b {SpinorE3}
         * @return {MutableSpinorE3} <code>this</code>
         * @chainable
         */
        MutableSpinorE3.prototype.div2 = function (a, b) {
            var a0 = a.w;
            var a1 = a.yz;
            var a2 = a.zx;
            var a3 = a.xy;
            var b0 = b.w;
            var b1 = b.yz;
            var b2 = b.zx;
            var b3 = b.xy;
            // Compare this to the product for Quaternions
            // How does this compare to G3
            // It would be interesting to DRY this out.
            this.w = a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3;
            // this.w = a0 * b0 - cartesianQuaditudeE3(a1, a2, a3, b1, b2, b3)
            this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
            this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
            this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this / α</code>
         * </p>
         * @method divideByScalar
         * @param α {number}
         * @return {MutableSpinorE3} <code>this</code>
         * @chainable
         */
        MutableSpinorE3.prototype.divideByScalar = function (α) {
            this.yz /= α;
            this.zx /= α;
            this.xy /= α;
            this.w /= α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ dual(v) = I * v</code>
         * </p>
         * Notice that the dual of a vector is related to the spinor by the right-hand rule.
         * @method dual
         * @param v {VectorE3} The vector whose dual will be used to set this spinor.
         * @return {MutableSpinorE3} <code>this</code>
         * @chainable
         */
        MutableSpinorE3.prototype.dual = function (v) {
            mustBeObject('v', v);
            this.yz = mustBeNumber('v.x', v.x);
            this.zx = mustBeNumber('v.y', v.y);
            this.xy = mustBeNumber('v.z', v.z);
            this.w = 0;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ e<sup>this</sup></code>
         * </p>
         * @method exp
         * @return {MutableSpinorE3} <code>this</code>
         * @chainable
         */
        MutableSpinorE3.prototype.exp = function () {
            var w = this.w;
            var x = this.yz;
            var y = this.zx;
            var z = this.xy;
            var expW = exp(w);
            // φ is actually the absolute value of one half the rotation angle.
            // The orientation of the rotation gets carried in the bivector components.
            var φ = Math.sqrt(x * x + y * y + z * z);
            var s = expW * (φ !== 0 ? sin(φ) / φ : 1);
            this.w = expW * cos(φ);
            this.yz = x * s;
            this.zx = y * s;
            this.xy = z * s;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ conj(this) / quad(this)</code>
         * </p>
         * @method inv
         * @return {MutableSpinorE3} <code>this</code>
         * @chainable
         */
        MutableSpinorE3.prototype.inv = function () {
            this.conj();
            this.divideByScalar(this.quaditude());
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this + α * (target - this)</code>
         * </p>
         * @method lerp
         * @param target {SpinorE3}
         * @param α {number}
         * @return {MutableSpinorE3} <code>this</code>
         * @chainable
         */
        // FIXME: Should really be slerp?
        MutableSpinorE3.prototype.lerp = function (target, α) {
            var R2 = MutableSpinorE3.copy(target);
            var R1 = this.clone();
            var R = R2.mul(R1.inv());
            R.log();
            R.scale(α);
            R.exp();
            this.copy(R);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a + α * (b - a)</code>
         * <p>
         * @method lerp2
         * @param a {SpinorE3}
         * @param b {SpinorE3}
         * @param α {number}
         * @return {MutableSpinorE3} <code>this</code>
         * @chainable
         */
        MutableSpinorE3.prototype.lerp2 = function (a, b, α) {
            this.sub2(b, a).scale(α).add(a);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ log(this)</code>
         * </p>
         * @method log
         * @return {MutableSpinorE3} <code>this</code>
         * @chainable
         */
        MutableSpinorE3.prototype.log = function () {
            var w = this.w;
            var x = this.yz;
            var y = this.zx;
            var z = this.xy;
            var bb = x * x + y * y + z * z;
            var R2 = Math.sqrt(bb);
            var R0 = Math.abs(w);
            var R = Math.sqrt(w * w + bb);
            this.w = Math.log(R);
            var f = Math.atan2(R2, R0) / R2;
            this.yz = x * f;
            this.zx = y * f;
            this.xy = z * f;
            return this;
        };
        MutableSpinorE3.prototype.magnitude = function () {
            return Math.sqrt(this.quaditude());
        };
        /**
         * <p>
         * <code>this ⟼ this * s</code>
         * </p>
         * @method mul
         * @param s {SpinorE3}
         * @return {MutableSpinorE3} <code>this</code>
         * @chainable
         */
        MutableSpinorE3.prototype.mul = function (s) {
            return this.mul2(this, s);
        };
        /**
         * <p>
         * <code>this ⟼ a * b</code>
         * </p>
         * @method mul2
         * @param a {SpinorE3}
         * @param b {SpinorE3}
         * @return {MutableSpinorE3} <code>this</code>
         * @chainable
         */
        MutableSpinorE3.prototype.mul2 = function (a, b) {
            var a0 = a.w;
            var a1 = a.yz;
            var a2 = a.zx;
            var a3 = a.xy;
            var b0 = b.w;
            var b1 = b.yz;
            var b2 = b.zx;
            var b3 = b.xy;
            // Compare this to the product for Quaternions
            // It would be interesting to DRY this out.
            this.w = a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3;
            // this.w = a0 * b0 - cartesianQuaditudeE3(a1, a2, a3, b1, b2, b3)
            this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
            this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
            this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
            return this;
        };
        /**
        * <p>
        * <code>this ⟼ sqrt(this * conj(this))</code>
        * </p>
        * @method norm
        * @return {MutableSpinorE3} <code>this</code>
        * @chainable
        */
        MutableSpinorE3.prototype.norm = function () {
            this.w = this.magnitude();
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this / magnitude(this)</code>
         * </p>
         * @method normalize
         * @return {MutableSpinorE3} <code>this</code>
         * @chainable
         */
        MutableSpinorE3.prototype.normalize = function () {
            var modulus = this.magnitude();
            this.yz = this.yz / modulus;
            this.zx = this.zx / modulus;
            this.xy = this.xy / modulus;
            this.w = this.w / modulus;
            return this;
        };
        /**
         * @method quaditude
         * @return {number} <code>this * conj(this)</code>
         */
        MutableSpinorE3.prototype.quaditude = function () {
            var w = this.w;
            var yz = this.yz;
            var zx = this.zx;
            var xy = this.xy;
            return w * w + yz * yz + zx * zx + xy * xy;
        };
        /**
         * <p>
         * <code>this = (w, B) ⟼ (w, -B)</code>
         * </p>
         * @method reverse
         * @return {MutableSpinorE3} <code>this</code>
         * @chainable
         */
        MutableSpinorE3.prototype.reverse = function () {
            this.yz *= -1;
            this.zx *= -1;
            this.xy *= -1;
            return this;
        };
        /**
         * Sets this Spinor to the value of its reflection in the plane orthogonal to n.
         * The geometric formula for bivector reflection is B' = n * B * n.
         * @method reflect
         * @param n {VectorE3}
         * @return {MutableSpinorE3} <code>this</code>
         * @chainable
         */
        MutableSpinorE3.prototype.reflect = function (n) {
            var w = this.w;
            var yz = this.yz;
            var zx = this.zx;
            var xy = this.xy;
            var nx = n.x;
            var ny = n.y;
            var nz = n.z;
            var nn = nx * nx + ny * ny + nz * nz;
            var nB = nx * yz + ny * zx + nz * xy;
            this.w = nn * w;
            this.xy = 2 * nz * nB - nn * xy;
            this.yz = 2 * nx * nB - nn * yz;
            this.zx = 2 * ny * nB - nn * zx;
            return this;
        };
        /**
         * <p>
         * <code>this = ⟼ rotor * this * reverse(rotor)</code>
         * </p>
         * @method rotate
         * @param rotor {SpinorE3}
         * @return {MutableSpinorE3} <code>this</code>
         * @chainable
         */
        MutableSpinorE3.prototype.rotate = function (rotor) {
            console.warn("MutableSpinorE3.rotate is not implemented");
            return this;
        };
        /**
         * <p>
         * Computes a rotor, R, from two unit vectors, where
         * R = (1 + b * a) / sqrt(2 * (1 + b << a))
         * </p>
         * @method rotor
         * @param b {VectorE3} The ending unit vector
         * @param a {VectorE3} The starting unit vector
         * @return {MutableSpinorE3} <code>this</code> The rotor representing a rotation from a to b.
         * @chainable
         */
        MutableSpinorE3.prototype.rotor = function (b, a) {
            this.spinor(b, a);
            this.w += 1;
            var denom = Math.sqrt(2 * (1 + euclidean3Quaditude2Arg(b, a)));
            this.divideByScalar(denom);
            return this;
        };
        /**
         * <p>
         * <code>this = ⟼ exp(- dual(a) * θ / 2)</code>
         * </p>
         * @method rotorFromAxisAngle
         * @param axis {VectorE3}
         * @param θ {number}
         * @return {MutableSpinorE3} <code>this</code>
         */
        MutableSpinorE3.prototype.rotorFromAxisAngle = function (axis, θ) {
            var φ = θ / 2;
            var s = sin(φ);
            this.yz = -axis.x * s;
            this.zx = -axis.y * s;
            this.xy = -axis.z * s;
            this.w = cos(φ);
            return this;
        };
        MutableSpinorE3.prototype.align = function (rhs) {
            return this.align2(this, rhs);
        };
        MutableSpinorE3.prototype.align2 = function (a, b) {
            // FIXME: How to leverage? Maybe break up? Don't want performance hit.
            // scpG3(a, b, this)
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this * α</code>
         * </p>
         * @method scale
         * @param α {number}
         * @return {MutableSpinorE3} <code>this</code>
         */
        MutableSpinorE3.prototype.scale = function (α) {
            mustBeNumber('α', α);
            this.yz *= α;
            this.zx *= α;
            this.xy *= α;
            this.w *= α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this - s * α</code>
         * </p>
         * @method sub
         * @param s {SpinorE3}
         * @param α [number = 1]
         * @return {MutableSpinorE3} <code>this</code>
         * @chainable
         */
        MutableSpinorE3.prototype.sub = function (s, α) {
            if (α === void 0) { α = 1; }
            mustBeObject('s', s);
            mustBeNumber('α', α);
            this.yz -= s.yz * α;
            this.zx -= s.zx * α;
            this.xy -= s.xy * α;
            this.w -= s.w * α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a - b</code>
         * </p>
         * @method sub2
         * @param a {SpinorE3}
         * @param b {SpinorE3}
         * @return {MutableSpinorE3} <code>this</code>
         * @chainable
         */
        MutableSpinorE3.prototype.sub2 = function (a, b) {
            this.yz = a.yz - b.yz;
            this.zx = a.zx - b.zx;
            this.xy = a.xy - b.xy;
            this.w = a.w - b.w;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a * b</code>
         * </p>
         * Sets this MutableSpinorE3 to the geometric product a * b of the vector arguments.
         * @method spinor
         * @param a {VectorE3}
         * @param b {VectorE3}
         * @return {MutableSpinorE3}
         */
        MutableSpinorE3.prototype.spinor = function (a, b) {
            var ax = a.x;
            var ay = a.y;
            var az = a.z;
            var bx = b.x;
            var by = b.y;
            var bz = b.z;
            this.w = cartesianQuaditudeE3(ax, ay, az, bx, by, bz);
            this.yz = wedgeYZ(ax, ay, az, bx, by, bz);
            this.zx = wedgeZX(ax, ay, az, bx, by, bz);
            this.xy = wedgeXY(ax, ay, az, bx, by, bz);
            return this;
        };
        /**
         * @method toString
         * @return {string} A non-normative string representation of the target.
         */
        MutableSpinorE3.prototype.toString = function () {
            return "MutableSpinorE3({yz: " + this.yz + ", zx: " + this.zx + ", xy: " + this.xy + ", w: " + this.w + "})";
        };
        MutableSpinorE3.prototype.wedge = function (rhs) {
            return this.wedge2(this, rhs);
        };
        MutableSpinorE3.prototype.wedge2 = function (a, b) {
            // FIXME: How to leverage? Maybe break up? Don't want performance hit.
            // scpG3(a, b, this)
            return this;
        };
        /**
         * @method copy
         * @param spinor {SpinorE3}
         * @return {MutableSpinorE3} A copy of the <code>spinor</code> argument.
         * @static
         */
        MutableSpinorE3.copy = function (spinor) {
            return new MutableSpinorE3().copy(spinor);
        };
        /**
         * @method lerp
         * @param a {SpinorE3}
         * @param b {SpinorE3}
         * @param α {number}
         * @return {MutableSpinorE3} <code>a + α * (b - a)</code>
         * @static
         */
        MutableSpinorE3.lerp = function (a, b, α) {
            return MutableSpinorE3.copy(a).lerp(b, α);
        };
        return MutableSpinorE3;
    })(VectorN);
    return MutableSpinorE3;
});
