var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/cartesianQuaditudeE3', '../math/VectorN', '../math/euclidean3Quaditude2Arg', '../checks/mustBeNumber', '../checks/mustBeObject', '../math/euclidean3Quaditude1Arg', '../math/wedgeXY', '../math/wedgeYZ', '../math/wedgeZX'], function (require, exports, cartesianQuaditudeE3, VectorN, euclidean3Quaditude2Arg, mustBeNumber, mustBeObject, euclidean3Quaditude1Arg, wedgeXY, wedgeYZ, wedgeZX) {
    var exp = Math.exp;
    var cos = Math.cos;
    var sin = Math.sin;
    /**
     * @class Spinor3
     * @extends VectorN<number>
     */
    var Spinor3 = (function (_super) {
        __extends(Spinor3, _super);
        /**
         * @class Spinor3
         * @constructor
         * @param data [number[] = [0, 0, 0, 1]] Corresponds to the basis e2e3, e3e1, e1e2, 1
         * @param modified [boolean = false]
         */
        function Spinor3(data, modified) {
            if (data === void 0) { data = [0, 0, 0, 1]; }
            if (modified === void 0) { modified = false; }
            _super.call(this, data, modified, 4);
        }
        Object.defineProperty(Spinor3.prototype, "yz", {
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
        Object.defineProperty(Spinor3.prototype, "zx", {
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
        Object.defineProperty(Spinor3.prototype, "xy", {
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
        Object.defineProperty(Spinor3.prototype, "w", {
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
         * @param spinor {Spinor3Coords}
         * @param α [number = 1]
         * @return {Spinor3} <code>this</code>
         * @chainable
         */
        Spinor3.prototype.add = function (spinor, α) {
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
         * @method clone
         * @return {Spinor3} A copy of <code>this</code>.
         * @chainable
         */
        Spinor3.prototype.clone = function () {
            return new Spinor3([this.yz, this.zx, this.xy, this.w]);
        };
        /**
         * <p>
         * <code>this ⟼ (w, -B)</code>
         * </p>
         * @method conj
         * @return {Spinor3} <code>this</code>
         * @chainable
         */
        Spinor3.prototype.conj = function () {
            this.yz = -this.yz;
            this.zx = -this.zx;
            this.xy = -this.xy;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ copy(spinor)</code>
         * </p>
         * @method copy
         * @param spinor {Spinor3Coords}
         * @return {Spinor3} <code>this</code>
         * @chainable
         */
        Spinor3.prototype.copy = function (spinor) {
            this.yz = spinor.yz;
            this.zx = spinor.zx;
            this.xy = spinor.xy;
            this.w = spinor.w;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a - b</code>
         * </p>
         * @method diff
         * @param a {Spinor3Coords}
         * @param b {Spinor3Coords}
         * @return {Spinor3} <code>this</code>
         * @chainable
         */
        Spinor3.prototype.diff = function (a, b) {
            this.yz = a.yz - b.yz;
            this.zx = a.zx - b.zx;
            this.xy = a.xy - b.xy;
            this.w = a.w - b.w;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this / α</code>
         * </p>
         * @method divideByScalar
         * @param α {number}
         * @return {Spinor3} <code>this</code>
         * @chainable
         */
        Spinor3.prototype.divideByScalar = function (α) {
            this.yz /= α;
            this.zx /= α;
            this.xy /= α;
            this.w /= α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ dual(this)</code>
         * </p>
         * Sets this Spinor to the value of the dual of the vector, I * v.
         * Notice that the dual of a vector is related to the spinor by the right-hand rule.
         * @method dual
         * @param vector {Cartesian3} The vector whose dual will be used to set this spinor.
         * @return {Spinor3} <code>this</code>
         * @chainable
         */
        Spinor3.prototype.dual = function (vector) {
            this.yz = vector.x;
            this.zx = vector.y;
            this.xy = vector.z;
            this.w = 0;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ e<sup>this</sup></code>
         * </p>
         * @method exp
         * @return {Spinor3} <code>this</code>
         * @chainable
         */
        Spinor3.prototype.exp = function () {
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
         * @return {Spinor3} <code>this</code>
         * @chainable
         */
        Spinor3.prototype.inv = function () {
            this.conj();
            this.divideByScalar(this.quaditude());
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this + α * (target - this)</code>
         * </p>
         * @method lerp
         * @param target {Spinor3Coords}
         * @param α {number}
         * @return {Spinor3} <code>this</code>
         * @chainable
         */
        // FIXME: Should really be slerp?
        Spinor3.prototype.lerp = function (target, α) {
            var R2 = Spinor3.copy(target);
            var R1 = this.clone();
            var R = R2.multiply(R1.inv());
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
         * @param a {Spinor3Coords}
         * @param b {Spinor3Coords}
         * @param α {number}
         * @return {Spinor3} <code>this</code>
         * @chainable
         */
        Spinor3.prototype.lerp2 = function (a, b, α) {
            this.diff(b, a).scale(α).add(a);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ log(this)</code>
         * </p>
         * @method log
         * @return {Spinor3} <code>this</code>
         * @chainable
         */
        Spinor3.prototype.log = function () {
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
        Spinor3.prototype.magnitude = function () {
            return Math.sqrt(this.quaditude());
        };
        /**
         * <p>
         * <code>this ⟼ this * rhs</code>
         * </p>
         * @method multiply
         * @param rhs {Spinor3Coords}
         * @return {Spinor3} <code>this</code>
         * @chainable
         */
        Spinor3.prototype.multiply = function (rhs) {
            return this.product(this, rhs);
        };
        /**
        * <p>
        * <code>this ⟼ sqrt(this * conj(this))</code>
        * </p>
        * @method norm
        * @return {Spinor3} <code>this</code>
        * @chainable
        */
        Spinor3.prototype.norm = function () {
            this.w = this.magnitude();
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this * α</code>
         * </p>
         * @method scale
         * @param α {number}
         * @return {Spinor3} <code>this</code>
         */
        Spinor3.prototype.scale = function (α) {
            this.yz *= α;
            this.zx *= α;
            this.xy *= α;
            this.w *= α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a * b</code>
         * </p>
         * @method product
         * @param a {Spinor3Coords}
         * @param b {Spinor3Coords}
         * @return {Spinor3} <code>this</code>
         * @chainable
         */
        Spinor3.prototype.product = function (a, b) {
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
            this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
            this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
            this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
            return this;
        };
        /**
         * @method quaditude
         * @return {number} <code>this * conj(this)</code>
         */
        Spinor3.prototype.quaditude = function () {
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
         * @return {Spinor3} <code>this</code>
         * @chainable
         */
        Spinor3.prototype.reverse = function () {
            this.yz *= -1;
            this.zx *= -1;
            this.xy *= -1;
            return this;
        };
        /**
         * Sets this Spinor to the value of its reflection in the plane orthogonal to n.
         * The geometric formula for bivector reflection is B' = n * B * n.
         * @method reflect
         * @param n {Cartesian3}
         * @return {Spinor3} <code>this</code>
         * @chainable
         */
        Spinor3.prototype.reflect = function (n) {
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
         * @param rotor {Spinor3Coords}
         * @return {Spinor3} <code>this</code>
         * @chainable
         */
        Spinor3.prototype.rotate = function (rotor) {
            console.warn("Spinor3.rotate is not implemented");
            return this;
        };
        /**
         * <p>
         * Computes a rotor, R, from two unit vectors, where
         * R = (1 + b * a) / sqrt(2 * (1 + b << a))
         * </p>
         * @method rotor
         * @param b {Cartesian3} The ending unit vector
         * @param a {Cartesian3} The starting unit vector
         * @return {Spinor3} <code>this</code> The rotor representing a rotation from a to b.
         * @chainable
         */
        Spinor3.prototype.rotor = function (b, a) {
            var bLength = Math.sqrt(euclidean3Quaditude1Arg(b));
            var aLength = Math.sqrt(euclidean3Quaditude1Arg(a));
            b = { x: b.x / bLength, y: b.y / bLength, z: b.z / bLength };
            a = { x: a.x / aLength, y: a.y / aLength, z: a.z / aLength };
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
         * @param axis {Cartesian3}
         * @param θ {number}
         * @return {Spinor3} <code>this</code>
         */
        Spinor3.prototype.rotorFromAxisAngle = function (axis, θ) {
            //this.dual(a).scale(-θ/2).exp()
            var φ = θ / 2;
            var s = sin(φ);
            this.yz = -axis.x * s;
            this.zx = -axis.y * s;
            this.xy = -axis.z * s;
            this.w = cos(φ);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this - rhs</code>
         * </p>
         * @method sub
         * @param rhs {Spinor3Coords}
         * @return {Spinor3} <code>this</code>
         * @chainable
         */
        Spinor3.prototype.sub = function (rhs) {
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a + b</code>
         * </p>
         * @method sum
         * @param a {Spinor3Coords}
         * @param b {Spinor3Coords}
         * @return {Spinor3} <code>this</code>
         * @chainable
         */
        Spinor3.prototype.sum = function (a, b) {
            this.w = a.w + b.w;
            this.yz = a.yz + b.yz;
            this.zx = a.zx + b.zx;
            this.xy = a.xy + b.xy;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a * b</code>
         * </p>
         * Sets this Spinor3 to the geometric product a * b of the vector arguments.
         * @method spinor
         * @param a {Cartesian3}
         * @param b {Cartesian3}
         * @return {Spinor3}
         */
        Spinor3.prototype.spinor = function (a, b) {
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
        Spinor3.prototype.toString = function () {
            return "Spinor3({yz: " + this.yz + ", zx: " + this.zx + ", xy: " + this.xy + ", w: " + this.w + "})";
        };
        /**
         * @method copy
         * @param spinor {Spinor3Coords}
         * @return {Spinor3} A copy of the <code>spinor</code> argument.
         * @static
         */
        Spinor3.copy = function (spinor) {
            return new Spinor3().copy(spinor);
        };
        /**
         * @method lerp
         * @param a {Spinor3Coords}
         * @param b {Spinor3Coords}
         * @param α {number}
         * @return {Spinor3} <code>a + α * (b - a)</code>
         * @static
         */
        Spinor3.lerp = function (a, b, α) {
            return Spinor3.copy(a).lerp(b, α);
        };
        return Spinor3;
    })(VectorN);
    return Spinor3;
});
