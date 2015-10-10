var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/VectorN', '../math/dotVector3', '../checks/mustBeNumber', '../math/quaditude3', '../math/wedgeXY', '../math/wedgeYZ', '../math/wedgeZX'], function (require, exports, VectorN, dotVector3, mustBeNumber, quaditude3, wedgeXY, wedgeYZ, wedgeZX) {
    /**
     * @class Spinor3
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
         * @method add
         * @param rhs {Spinor3Coords}
         * @return {Spinor3}
         */
        Spinor3.prototype.add = function (rhs) {
            return this;
        };
        /**
         * @method clone
         * @return {Spinor3}
         */
        Spinor3.prototype.clone = function () {
            return new Spinor3([this.yz, this.zx, this.xy, this.w]);
        };
        /**
         * @method conjugate
         * @return {Spinor3}
         */
        Spinor3.prototype.conjugate = function () {
            this.yz *= -1;
            this.zx *= -1;
            this.xy *= -1;
            return this;
        };
        /**
         * @method copy
         * @param spinor {Spinor3Coords}
         * @return {Spinor3}
         */
        Spinor3.prototype.copy = function (spinor) {
            this.yz = spinor.yz;
            this.zx = spinor.zx;
            this.xy = spinor.xy;
            this.w = spinor.w;
            return this;
        };
        /**
         * @method difference
         * @param a {Spinor3Coords}
         * @param b {Spinor3Coords}
         * @return {Spinor3}
         */
        Spinor3.prototype.difference = function (a, b) {
            return this;
        };
        Spinor3.prototype.divideScalar = function (scalar) {
            this.yz /= scalar;
            this.zx /= scalar;
            this.xy /= scalar;
            this.w /= scalar;
            return this;
        };
        Spinor3.prototype.exp = function () {
            var w = this.w;
            var x = this.yz;
            var y = this.zx;
            var z = this.xy;
            var expW = Math.exp(w);
            var B = Math.sqrt(x * x + y * y + z * z);
            var s = expW * (B !== 0 ? Math.sin(B) / B : 1);
            this.w = expW * Math.cos(B);
            this.yz = x * s;
            this.zx = y * s;
            this.xy = z * s;
            return this;
        };
        Spinor3.prototype.inverse = function () {
            this.conjugate();
            this.divideScalar(this.quaditude());
            return this;
        };
        Spinor3.prototype.lerp = function (target, alpha) {
            var R2 = Spinor3.copy(target);
            var R1 = this.clone();
            var R = R2.multiply(R1.inverse());
            R.log();
            R.scale(alpha);
            R.exp();
            this.copy(R);
            return this;
        };
        /**
         * @method log
         * @return {Spinor3}
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
         * @method multiply
         * @param rhs {Spinor3Coords}
         * @return {Spinor3}
         */
        Spinor3.prototype.multiply = function (rhs) {
            return this.product(this, rhs);
        };
        /**
         * @method scale
         * @param scalar {number}
         * @return {Spinor3}
         */
        Spinor3.prototype.scale = function (scalar) {
            this.yz *= scalar;
            this.zx *= scalar;
            this.xy *= scalar;
            this.w *= scalar;
            return this;
        };
        Spinor3.prototype.product = function (a, b) {
            var a0 = a.w;
            var a1 = a.yz;
            var a2 = a.zx;
            var a3 = a.xy;
            var b0 = b.w;
            var b1 = b.yz;
            var b2 = b.zx;
            var b3 = b.xy;
            this.w = a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3;
            this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
            this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
            this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
            return this;
        };
        Spinor3.prototype.quaditude = function () {
            var w = this.w;
            var yz = this.yz;
            var zx = this.zx;
            var xy = this.xy;
            return w * w + yz * yz + zx * zx + xy * xy;
        };
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
         * @return {Spinor3}
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
        Spinor3.prototype.rotate = function (rotor) {
            return this;
        };
        /**
         * Computes a rotor, R, from two unit vectors, where
         * R = (1 + b * a) / sqrt(2 * (1 + b << a))
         * @method rotor
         * @param b {Cartesian3} The ending unit vector
         * @param a {Cartesian3} The starting unit vector
         * @return {Spinor3} The rotor representing a rotation from a to b.
         */
        Spinor3.prototype.rotor = function (b, a) {
            var bLength = Math.sqrt(quaditude3(b));
            var aLength = Math.sqrt(quaditude3(a));
            b = { x: b.x / bLength, y: b.y / bLength, z: b.z / bLength };
            a = { x: a.x / aLength, y: a.y / aLength, z: a.z / aLength };
            this.spinor(b, a);
            this.w += 1;
            var denom = Math.sqrt(2 * (1 + dotVector3(b, a)));
            this.divideScalar(denom);
            return this;
        };
        Spinor3.prototype.sub = function (rhs) {
            return this;
        };
        Spinor3.prototype.sum = function (a, b) {
            return this;
        };
        /**
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
            this.w = dotVector3(a, b);
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
        Spinor3.copy = function (spinor) {
            return new Spinor3().copy(spinor);
        };
        Spinor3.lerp = function (a, b, alpha) {
            return Spinor3.copy(a).lerp(b, alpha);
        };
        return Spinor3;
    })(VectorN);
    return Spinor3;
});
