var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/cartesianQuaditudeE3', '../math/euclidean3Quaditude2Arg', '../math/extG3', '../checks/isNumber', '../math/lcoG3', '../math/mulG3', '../checks/mustBeNumber', '../checks/mustBeObject', '../math/rcoG3', '../math/scpG3', '../math/VectorN', '../math/wedgeXY', '../math/wedgeYZ', '../math/wedgeZX'], function (require, exports, cartesianQuaditudeE3, euclidean3Quaditude2Arg, extG3, isNumber, lcoG3, mulG3, mustBeNumber, mustBeObject, rcoG3, scpG3, VectorN, wedgeXY, wedgeYZ, wedgeZX) {
    // Symbolic constants for the coordinate indices into the data array.
    var COORD_W = 0;
    var COORD_X = 1;
    var COORD_Y = 2;
    var COORD_Z = 3;
    var COORD_XY = 4;
    var COORD_YZ = 5;
    var COORD_ZX = 6;
    var COORD_XYZ = 7;
    var exp = Math.exp;
    var cos = Math.cos;
    var sin = Math.sin;
    /**
     * @class G3
     * @extends GeometricE3
     * @beta
     */
    var G3 = (function (_super) {
        __extends(G3, _super);
        /**
         * Constructs a <code>G3</code>.
         * The multivector is initialized to zero.
         * @class G3
         * @beta
         * @constructor
         */
        function G3() {
            _super.call(this, [0, 0, 0, 0, 0, 0, 0, 0], false, 8);
        }
        Object.defineProperty(G3.prototype, "w", {
            /**
             * The coordinate corresponding to the unit standard basis scalar.
             * @property w
             * @type {number}
             */
            get: function () {
                return this.data[COORD_W];
            },
            set: function (w) {
                mustBeNumber('w', w);
                this.modified = this.modified || this.data[COORD_W] !== w;
                this.data[COORD_W] = w;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "x", {
            /**
             * The coordinate corresponding to the <b>e</b><sub>1</sub> standard basis vector.
             * @property x
             * @type {number}
             */
            get: function () {
                return this.data[COORD_X];
            },
            set: function (x) {
                mustBeNumber('x', x);
                this.modified = this.modified || this.data[COORD_X] !== x;
                this.data[COORD_X] = x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "y", {
            /**
             * The coordinate corresponding to the <b>e</b><sub>2</sub> standard basis vector.
             * @property y
             * @type {number}
             */
            get: function () {
                return this.data[COORD_Y];
            },
            set: function (y) {
                mustBeNumber('y', y);
                this.modified = this.modified || this.data[COORD_Y] !== y;
                this.data[COORD_Y] = y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "z", {
            /**
             * The coordinate corresponding to the <b>e</b><sub>3</sub> standard basis vector.
             * @property z
             * @type {number}
             */
            get: function () {
                return this.data[COORD_Z];
            },
            set: function (z) {
                mustBeNumber('z', z);
                this.modified = this.modified || this.data[COORD_Z] !== z;
                this.data[COORD_Z] = z;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "yz", {
            /**
             * The coordinate corresponding to the <b>e</b><sub>2</sub><b>e</b><sub>3</sub> standard basis bivector.
             * @property yz
             * @type {number}
             */
            get: function () {
                return this.data[COORD_YZ];
            },
            set: function (yz) {
                mustBeNumber('yz', yz);
                this.modified = this.modified || this.data[COORD_YZ] !== yz;
                this.data[COORD_YZ] = yz;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "zx", {
            /**
             * The coordinate corresponding to the <b>e</b><sub>3</sub><b>e</b><sub>1</sub> standard basis bivector.
             * @property zx
             * @type {number}
             */
            get: function () {
                return this.data[COORD_ZX];
            },
            set: function (zx) {
                mustBeNumber('zx', zx);
                this.modified = this.modified || this.data[COORD_ZX] !== zx;
                this.data[COORD_ZX] = zx;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "xy", {
            /**
             * The coordinate corresponding to the <b>e</b><sub>1</sub><b>e</b><sub>2</sub> standard basis bivector.
             * @property xy
             * @type {number}
             */
            get: function () {
                return this.data[COORD_XY];
            },
            set: function (xy) {
                mustBeNumber('xy', xy);
                this.modified = this.modified || this.data[COORD_XY] !== xy;
                this.data[COORD_XY] = xy;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "xyz", {
            /**
             * The coordinate corresponding to the I<sub>3</sub> <code>=</code> <b>e</b><sub>1</sub><b>e</b><sub>2</sub><b>e</b><sub>2</sub> standard basis pseudoscalar.
             * @property xyz
             * @type {number}
             */
            get: function () {
                return this.data[COORD_XYZ];
            },
            set: function (xyz) {
                mustBeNumber('xyz', xyz);
                this.modified = this.modified || this.data[COORD_XYZ] !== xyz;
                this.data[COORD_XYZ] = xyz;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * <p>
         * <code>this ⟼ this + M * α</code>
         * </p>
         * @method add
         * @param M {GeometricE3}
         * @param α [number = 1]
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.add = function (M, α) {
            if (α === void 0) { α = 1; }
            mustBeObject('M', M);
            mustBeNumber('α', α);
            this.w += M.w * α;
            this.x += M.x * α;
            this.y += M.y * α;
            this.z += M.z * α;
            this.yz += M.yz * α;
            this.zx += M.zx * α;
            this.xy += M.xy * α;
            this.xyz += M.xyz * α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this + v * α</code>
         * </p>
         * @method addVector
         * @param v {VectorE3}
         * @param α [number = 1]
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.addVector = function (v, α) {
            if (α === void 0) { α = 1; }
            mustBeObject('v', v);
            mustBeNumber('α', α);
            this.x += v.x * α;
            this.y += v.y * α;
            this.z += v.z * α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a + b</code>
         * </p>
         * @method add2
         * @param a {GeometricE3}
         * @param b {GeometricE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.add2 = function (a, b) {
            mustBeObject('a', a);
            mustBeObject('b', b);
            this.w = a.w + b.w;
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            this.z = a.z + b.z;
            this.yz = a.yz + b.yz;
            this.zx = a.zx + b.zx;
            this.xy = a.xy + b.xy;
            this.xyz = a.xyz + b.xyz;
            return this;
        };
        /**
         * @method clone
         * @return {G3} <code>copy(this)</code>
         */
        G3.prototype.clone = function () {
            var m = new G3();
            m.copy(this);
            return m;
        };
        /**
         * <p>
         * <code>this ⟼ conjugate(this)</code>
         * </p>
         * @method conj
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.conj = function () {
            // FIXME: This is only the bivector part.
            // Also need to think about various involutions.
            this.yz = -this.yz;
            this.zx = -this.zx;
            this.xy = -this.xy;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this << m</code>
         * </p>
         * @method lco
         * @param m {GeometricE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.lco = function (m) {
            return this.conL2(this, m);
        };
        /**
         * <p>
         * <code>this ⟼ a << b</code>
         * </p>
         * @method conL2
         * @param a {GeometricE3}
         * @param b {GeometricE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.conL2 = function (a, b) {
            return lcoG3(a, b, this);
        };
        /**
         * <p>
         * <code>this ⟼ this >> m</code>
         * </p>
         * @method rco
         * @param m {GeometricE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.rco = function (m) {
            return this.conR2(this, m);
        };
        /**
         * <p>
         * <code>this ⟼ a >> b</code>
         * </p>
         * @method conR2
         * @param a {GeometricE3}
         * @param b {GeometricE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.conR2 = function (a, b) {
            return rcoG3(a, b, this);
        };
        /**
         * <p>
         * <code>this ⟼ copy(v)</code>
         * </p>
         * @method copy
         * @param M {VectorE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.copy = function (M) {
            mustBeObject('M', M);
            this.w = M.w;
            this.x = M.x;
            this.y = M.y;
            this.z = M.z;
            this.yz = M.yz;
            this.zx = M.zx;
            this.xy = M.xy;
            this.xyz = M.xyz;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ copy(spinor)</code>
         * </p>
         * @method copySpinor
         * @param spinor {SpinorE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.copySpinor = function (spinor) {
            mustBeObject('spinor', spinor);
            this.w = spinor.w;
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.yz = spinor.yz;
            this.zx = spinor.zx;
            this.xy = spinor.xy;
            this.xyz = 0;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ copyVector(vector)</code>
         * </p>
         * @method copyVector
         * @param vector {VectorE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.copyVector = function (vector) {
            mustBeObject('vector', vector);
            this.w = 0;
            this.x = vector.x;
            this.y = vector.y;
            this.z = vector.z;
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            this.xyz = 0;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this / m</code>
         * </p>
         * @method div
         * @param m {GeometricE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.div = function (m) {
            return this.div2(this, m);
        };
        /**
         * <p>
         * <code>this ⟼ this / α</code>
         * </p>
         * @method divideByScalar
         * @param α {number}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.divideByScalar = function (α) {
            mustBeNumber('α', α);
            this.w /= α;
            this.x /= α;
            this.y /= α;
            this.z /= α;
            this.yz /= α;
            this.zx /= α;
            this.xy /= α;
            this.xyz /= α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a / b</code>
         * </p>
         * @method div2
         * @param a {GeometricE3}
         * @param b {GeometricE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.div2 = function (a, b) {
            // FIXME: Generalize
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
         * <code>this ⟼ dual(m) = I * m</code>
         * </p>
         * Notice that the dual of a vector is related to the spinor by the right-hand rule.
         * @method dual
         * @param m {GeometricE3} The vector whose dual will be used to set this spinor.
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.dual = function (m) {
            // FIXME: TODO
            mustBeObject('m', m);
            this.yz = mustBeNumber('m.x', m.x);
            this.zx = mustBeNumber('m.y', m.y);
            this.xy = mustBeNumber('m.z', m.z);
            this.w = 0;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ e<sup>this</sup></code>
         * </p>
         * @method exp
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.exp = function () {
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
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.inv = function () {
            // FIXME: TODO
            this.conj();
            // this.divideByScalar(this.quaditude());
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this + α * (target - this)</code>
         * </p>
         * @method lerp
         * @param target {GeometricE3}
         * @param α {number}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.lerp = function (target, α) {
            mustBeObject('target', target);
            mustBeNumber('α', α);
            this.w += (target.w - this.w) * α;
            this.x += (target.x - this.x) * α;
            this.y += (target.y - this.y) * α;
            this.z += (target.z - this.z) * α;
            this.yz += (target.yz - this.yz) * α;
            this.zx += (target.zx - this.zx) * α;
            this.xy += (target.xy - this.xy) * α;
            this.xyz += (target.xyz - this.xyz) * α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a + α * (b - a)</code>
         * </p>
         * @method lerp2
         * @param a {GeometricE3}
         * @param b {GeometricE3}
         * @param α {number}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.lerp2 = function (a, b, α) {
            mustBeObject('a', a);
            mustBeObject('b', b);
            mustBeNumber('α', α);
            this.copy(a).lerp(b, α);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ log(this)</code>
         * </p>
         * @method log
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.log = function () {
            // FIXME: TODO
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
        G3.prototype.magnitude = function () {
            return Math.sqrt(this.quaditude());
        };
        /**
         * <p>
         * <code>this ⟼ this * s</code>
         * </p>
         * @method mul
         * @param m {GeometricE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.mul = function (m) {
            return this.mul2(this, m);
        };
        /**
         * <p>
         * <code>this ⟼ a * b</code>
         * </p>
         * @method mul2
         * @param a {GeometricE3}
         * @param b {GeometricE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.mul2 = function (a, b) {
            return mulG3(a, b, this);
        };
        /**
         * <p>
         * <code>this ⟼ -1 * this</code>
         * </p>
         * @method neg
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.neg = function () {
            this.w = -this.w;
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            this.yz = this.yz;
            this.zx = -this.zx;
            this.xy = -this.xy;
            this.xyz = -this.xyz;
            return this;
        };
        /**
        * <p>
        * <code>this ⟼ sqrt(this * conj(this))</code>
        * </p>
        * @method norm
        * @return {G3} <code>this</code>
        * @chainable
        */
        G3.prototype.norm = function () {
            // FIXME: TODO
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
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.normalize = function () {
            // FIXME: TODO
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
        G3.prototype.quaditude = function () {
            var w = this.w;
            var yz = this.yz;
            var zx = this.zx;
            var xy = this.xy;
            return w * w + yz * yz + zx * zx + xy * xy;
        };
        /**
         * <p>
         * <code>this ⟼ - n * this * n</code>
         * </p>
         * @method reflect
         * @param n {VectorE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.reflect = function (n) {
            // FIXME: This inly reflects the vector components.
            mustBeObject('n', n);
            var x = this.x;
            var y = this.y;
            var z = this.z;
            var nx = n.x;
            var ny = n.y;
            var nz = n.z;
            var dot2 = (x * nx + y * ny + z * nz) * 2;
            this.x = x - dot2 * nx;
            this.y = y - dot2 * ny;
            this.z = z - dot2 * nz;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ reverse(this)</code>
         * </p>
         * @method reverse
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.reverse = function () {
            // reverse has a ++-- structure.
            this.w = this.w;
            this.x = this.x;
            this.y = this.y;
            this.z = this.z;
            this.yz = -this.yz;
            this.zx = -this.zx;
            this.xy = -this.xy;
            this.xyz = -this.xyz;
            return this;
        };
        /**
         * @method __tilde__
         * @return {G3}
         */
        G3.prototype.__tilde__ = function () {
            return G3.copy(this).reverse();
        };
        /**
         * <p>
         * <code>this ⟼ R * this * reverse(R)</code>
         * </p>
         * @method rotate
         * @param R {SpinorE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.rotate = function (R) {
            mustBeObject('R', R);
            // FIXME: This only rotates the vector components.
            var x = this.x;
            var y = this.y;
            var z = this.z;
            var a = R.xy;
            var b = R.yz;
            var c = R.zx;
            var w = R.w;
            var ix = w * x - c * z + a * y;
            var iy = w * y - a * x + b * z;
            var iz = w * z - b * y + c * x;
            var iw = b * x + c * y + a * z;
            this.x = ix * w + iw * b + iy * a - iz * c;
            this.y = iy * w + iw * c + iz * b - ix * a;
            this.z = iz * w + iw * a + ix * c - iy * b;
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
         * @return {G3} <code>this</code> The rotor representing a rotation from a to b.
         * @chainable
         */
        G3.prototype.rotor = function (b, a) {
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
         * @return {G3} <code>this</code>
         */
        G3.prototype.rotorFromAxisAngle = function (axis, θ) {
            // FIXME: TODO
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
         * <code>this ⟼ align(this, m)</code>
         * </p>
         * @method align
         * @param m {GeometricE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.align = function (m) {
            return this.align2(this, m);
        };
        /**
         * <p>
         * <code>this ⟼ align(a, b)</code>
         * </p>
         * @method align2
         * @param a {GeometricE3}
         * @param b {GeometricE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.align2 = function (a, b) {
            return scpG3(a, b, this);
        };
        /**
         * <p>
         * <code>this ⟼ this * α</code>
         * </p>
         * @method scale
         * @param α {number}
         */
        G3.prototype.scale = function (α) {
            mustBeNumber('α', α);
            this.w *= α;
            this.x *= α;
            this.y *= α;
            this.z *= α;
            this.yz *= α;
            this.zx *= α;
            this.xy *= α;
            this.xyz *= α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a * b</code>
         * </p>
         * Sets this G3 to the geometric product a * b of the vector arguments.
         * @method spinor
         * @param a {VectorE3}
         * @param b {VectorE3}
         * @return {G3} <code>this</code>
         */
        G3.prototype.spinor = function (a, b) {
            var ax = a.x;
            var ay = a.y;
            var az = a.z;
            var bx = b.x;
            var by = b.y;
            var bz = b.z;
            this.w = cartesianQuaditudeE3(ax, ay, az, bx, by, bz);
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.yz = wedgeYZ(ax, ay, az, bx, by, bz);
            this.zx = wedgeZX(ax, ay, az, bx, by, bz);
            this.xy = wedgeXY(ax, ay, az, bx, by, bz);
            this.xyz = 0;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this - M * α</code>
         * </p>
         * @method sub
         * @param M {GeometricE3}
         * @param α [number = 1]
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.sub = function (M, α) {
            if (α === void 0) { α = 1; }
            mustBeObject('M', M);
            mustBeNumber('α', α);
            this.w -= M.w * α;
            this.x -= M.x * α;
            this.y -= M.y * α;
            this.z -= M.z * α;
            this.yz -= M.yz * α;
            this.zx -= M.zx * α;
            this.xy -= M.xy * α;
            this.xyz -= M.xyz * α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a - b</code>
         * </p>
         * @method sub2
         * @param a {GeometricE3}
         * @param b {GeometricE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.sub2 = function (a, b) {
            mustBeObject('a', a);
            mustBeObject('b', b);
            this.w = a.w - b.w;
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.z = a.z - b.z;
            this.yz = a.yz - b.yz;
            this.zx = a.zx - b.zx;
            this.xy = a.xy - b.xy;
            this.xyz = a.xyz - b.xyz;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this ^ m</code>
         * </p>
         * @method wedge
         * @param m {GeometricE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.wedge = function (m) {
            return this.wedge2(this, m);
        };
        /**
         * <p>
         * <code>this ⟼ a ^ b</code>
         * </p>
         * @method wedge2
         * @param a {GeometricE3}
         * @param b {GeometricE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.wedge2 = function (a, b) {
            return extG3(a, b, this);
        };
        /**
         * @method __add__
         * @param other {any}
         * @return {G3}
         * @private
         */
        G3.prototype.__add__ = function (other) {
            if (other instanceof G3) {
                var rhs = other;
                return G3.copy(this).add(rhs);
            }
            else if (isNumber(other)) {
                var m = G3.copy(this);
                m.w += other;
                return m;
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __div__
         * @param other {any}
         * @return {G3}
         * @private
         */
        G3.prototype.__div__ = function (other) {
            if (other instanceof G3) {
                return G3.copy(this).div(other);
            }
            else if (isNumber(other)) {
                return G3.copy(this).divideByScalar(other);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __mul__
         * @param other {any}
         * @return {G3}
         * @private
         */
        G3.prototype.__mul__ = function (other) {
            if (other instanceof G3) {
                return G3.copy(this).mul(other);
            }
            else if (isNumber(other)) {
                return G3.copy(this).scale(other);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __radd__
         * @param other {any}
         * @return {G3}
         * @private
         */
        G3.prototype.__radd__ = function (other) {
            if (other instanceof G3) {
                var rhs = other;
                return G3.copy(other).add(this);
            }
            else if (isNumber(other)) {
                var m = G3.copy(this); /*.pos()*/
                m.w += other;
                return m;
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __sub__
         * @param other {any}
         * @return {G3}
         * @private
         */
        G3.prototype.__sub__ = function (other) {
            if (other instanceof G3) {
                var rhs = other;
                return G3.copy(this).sub(rhs);
            }
            else if (isNumber(other)) {
                var m = G3.copy(this);
                m.w -= other;
                return m;
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rsub__
         * @param other {any}
         * @return {G3}
         * @private
         */
        G3.prototype.__rsub__ = function (other) {
            if (other instanceof G3) {
                var rhs = other;
                return G3.copy(other).sub(this);
            }
            else if (isNumber(other)) {
                var m = G3.copy(this).neg();
                m.w += other;
                return m;
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __pos__
         * @return {G3}
         * @private
         * @chainable
         */
        G3.prototype.__pos__ = function () {
            return G3.copy(this); /*.pos()*/
        };
        /**
         * @method __neg__
         * @return {G3}
         * @private
         * @chainable
         */
        G3.prototype.__neg__ = function () {
            return G3.copy(this).neg();
        };
        /**
         * @method copy
         * @param M {GeometricE3}
         * @return {G3}
         * @static
         */
        G3.copy = function (M) {
            var copy = new G3();
            copy.w = M.w;
            copy.x = M.x;
            copy.y = M.y;
            copy.z = M.z;
            copy.yz = M.yz;
            copy.zx = M.zx;
            copy.xy = M.xy;
            copy.xyz = M.xyz;
            return copy;
        };
        /**
         * @method fromSpinor
         * @param spinor {SpinorE3}
         * @return {G3}
         * @static
         */
        G3.fromSpinor = function (spinor) {
            var copy = new G3();
            copy.w = spinor.w;
            copy.x = 0;
            copy.y = 0;
            copy.z = 0;
            copy.yz = spinor.yz;
            copy.zx = spinor.yz;
            copy.xy = spinor.xy;
            copy.xyz = 0;
            return copy;
        };
        /**
         * @method fromVector
         * @param vector {VectorE3}
         * @return {G3}
         * @static
         */
        G3.fromVector = function (vector) {
            var copy = new G3();
            copy.w = 0;
            copy.x = vector.x;
            copy.y = vector.y;
            copy.z = vector.z;
            copy.yz = 0;
            copy.zx = 0;
            copy.xy = 0;
            copy.xyz = 0;
            return copy;
        };
        /**
        * @method lerp
        * @param A {GeometricE3}
        * @param B {GeometricE3}
        * @param α {number}
        * @return {G3} <code>A + α * (B - A)</code>
        * @static
        */
        G3.lerp = function (A, B, α) {
            return G3.copy(A).lerp(B, α);
            // return G3.copy(B).sub(A).scale(α).add(A)
        };
        return G3;
    })(VectorN);
    return G3;
});
