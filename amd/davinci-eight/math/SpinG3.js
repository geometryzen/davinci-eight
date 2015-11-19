var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/dotVectorCartesianE3', '../math/dotVectorE3', '../checks/mustBeInteger', '../checks/mustBeNumber', '../checks/mustBeObject', '../math/quadSpinorE3', '../math/quadVectorE3', '../math/rotorFromDirections', '../math/VectorN', '../math/wedgeXY', '../math/wedgeYZ', '../math/wedgeZX'], function (require, exports, dotVectorCartesianE3, dotVector, mustBeInteger, mustBeNumber, mustBeObject, quadSpinor, quadVector, rotorFromDirections, VectorN, wedgeXY, wedgeYZ, wedgeZX) {
    // GraphicsProgramSymbols constants for the coordinate indices into the coords array.
    var COORD_YZ = 0;
    var COORD_ZX = 1;
    var COORD_XY = 2;
    var COORD_SCALAR = 3;
    function one() {
        var coords = [0, 0, 0, 0];
        coords[COORD_SCALAR] = 1;
        return coords;
    }
    var exp = Math.exp;
    var cos = Math.cos;
    var sin = Math.sin;
    var sqrt = Math.sqrt;
    /**
     * @class SpinG3
     * @extends VectorN<number>
     */
    var SpinG3 = (function (_super) {
        __extends(SpinG3, _super);
        /**
         * Constructs a <code>SpinG3</code> from a <code>number[]</code>.
         * For a <em>geometric</em> implementation, use the static methods.
         * @class SpinG3
         * @constructor
         */
        function SpinG3(coordinates, modified) {
            if (coordinates === void 0) { coordinates = one(); }
            if (modified === void 0) { modified = false; }
            _super.call(this, coordinates, modified, 4);
        }
        Object.defineProperty(SpinG3.prototype, "yz", {
            /**
             * @property yz
             * @type Number
             */
            get: function () {
                return this.coords[COORD_YZ];
            },
            set: function (yz) {
                mustBeNumber('yz', yz);
                this.modified = this.modified || this.yz !== yz;
                this.coords[COORD_YZ] = yz;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SpinG3.prototype, "zx", {
            /**
             * @property zx
             * @type Number
             */
            get: function () {
                return this.coords[COORD_ZX];
            },
            set: function (zx) {
                mustBeNumber('zx', zx);
                this.modified = this.modified || this.zx !== zx;
                this.coords[COORD_ZX] = zx;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SpinG3.prototype, "xy", {
            /**
             * @property xy
             * @type Number
             */
            get: function () {
                return this.coords[COORD_XY];
            },
            set: function (xy) {
                mustBeNumber('xy', xy);
                this.modified = this.modified || this.xy !== xy;
                this.coords[COORD_XY] = xy;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SpinG3.prototype, "α", {
            /**
             * @property α
             * @type Number
             */
            get: function () {
                return this.coords[COORD_SCALAR];
            },
            set: function (α) {
                mustBeNumber('α', α);
                this.modified = this.modified || this.α !== α;
                this.coords[COORD_SCALAR] = α;
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
         * @param [α = 1] {number}
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.add = function (spinor, α) {
            if (α === void 0) { α = 1; }
            mustBeObject('spinor', spinor);
            mustBeNumber('α', α);
            this.yz += spinor.yz * α;
            this.zx += spinor.zx * α;
            this.xy += spinor.xy * α;
            this.α += spinor.α * α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a + b</code>
         * </p>
         * @method add2
         * @param a {SpinorE3}
         * @param b {SpinorE3}
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.add2 = function (a, b) {
            this.α = a.α + b.α;
            this.yz = a.yz + b.yz;
            this.zx = a.zx + b.zx;
            this.xy = a.xy + b.xy;
            return this;
        };
        /**
         * Intentionally undocumented.
         */
        SpinG3.prototype.addPseudo = function (β) {
            mustBeNumber('β', β);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this + α</code>
         * </p>
         * @method addScalar
         * @param α {number}
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.addScalar = function (α) {
            mustBeNumber('α', α);
            this.α += α;
            return this;
        };
        /**
         * @method adj
         * @return {number}
         * @beta
         */
        SpinG3.prototype.adj = function () {
            throw new Error('TODO: SpinG3.adj');
        };
        /**
         * @method angle
         * @return {SpinG3}
         */
        SpinG3.prototype.angle = function () {
            return this.log().grade(2);
        };
        /**
         * @method clone
         * @return {SpinG3} A copy of <code>this</code>.
         * @chainable
         */
        SpinG3.prototype.clone = function () {
            return SpinG3.copy(this);
        };
        /**
         * <p>
         * <code>this ⟼ (w, -B)</code>
         * </p>
         * @method conj
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.conj = function () {
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
         * @param spinor {SpinorE3}
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.copy = function (spinor) {
            mustBeObject('spinor', spinor);
            this.yz = mustBeNumber('spinor.yz', spinor.yz);
            this.zx = mustBeNumber('spinor.zx', spinor.zx);
            this.xy = mustBeNumber('spinor.xy', spinor.xy);
            this.α = mustBeNumber('spinor.α', spinor.α);
            return this;
        };
        /**
         * Sets this spinor to the value of the scalar, <code>α</code>.
         * @method copyScalar
         * @param α {number} The scalar to be copied.
         * @return {SpinG3}
         * @chainable
         */
        SpinG3.prototype.copyScalar = function (α) {
            return this.zero().addScalar(α);
        };
        /**
         * Intentionally undocumented.
         */
        SpinG3.prototype.copySpinor = function (s) {
            return this.copy(s);
        };
        /**
         * Intentionally undocumented.
         */
        SpinG3.prototype.copyVector = function (vector) {
            return this.zero();
        };
        /**
         * <p>
         * <code>this ⟼ this / s</code>
         * </p>
         * @method div
         * @param s {SpinorE3}
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.div = function (s) {
            return this.div2(this, s);
        };
        /**
         * <p>
         * <code>this ⟼ a / b</code>
         * </p>
         * @method div2
         * @param a {SpinorE3}
         * @param b {SpinorE3}
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.div2 = function (a, b) {
            var a0 = a.α;
            var a1 = a.yz;
            var a2 = a.zx;
            var a3 = a.xy;
            var b0 = b.α;
            var b1 = b.yz;
            var b2 = b.zx;
            var b3 = b.xy;
            // Compare this to the product for Quaternions
            // How does this compare to G3
            // It would be interesting to DRY this out.
            this.α = a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3;
            // this.α = a0 * b0 - dotVectorCartesianE3(a1, a2, a3, b1, b2, b3)
            this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
            this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
            this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this / α</code>
         * </p>
         * @method divByScalar
         * @param α {number}
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.divByScalar = function (α) {
            this.yz /= α;
            this.zx /= α;
            this.xy /= α;
            this.α /= α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ dual(v) = I * v</code>
         * </p>
         * @method dual
         * @param v {VectorE3} The vector whose dual will be used to set this spinor.
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.dual = function (v) {
            mustBeObject('v', v);
            this.α = 0;
            this.yz = mustBeNumber('v.x', v.x);
            this.zx = mustBeNumber('v.y', v.y);
            this.xy = mustBeNumber('v.z', v.z);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ e<sup>this</sup></code>
         * </p>
         * @method exp
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.exp = function () {
            var w = this.α;
            var x = this.yz;
            var y = this.zx;
            var z = this.xy;
            var expW = exp(w);
            // φ is actually the absolute value of one half the rotation angle.
            // The orientation of the rotation gets carried in the bivector components.
            // FIXME: DRY
            var φ = sqrt(x * x + y * y + z * z);
            var s = expW * (φ !== 0 ? sin(φ) / φ : 1);
            this.α = expW * cos(φ);
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
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.inv = function () {
            this.conj();
            this.divByScalar(this.squaredNorm());
            return this;
        };
        SpinG3.prototype.lco = function (rhs) {
            return this.lco2(this, rhs);
        };
        SpinG3.prototype.lco2 = function (a, b) {
            // FIXME: How to leverage? Maybe break up? Don't want performance hit.
            // scpG3(a, b, this)
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this + α * (target - this)</code>
         * </p>
         * @method lerp
         * @param target {SpinorE3}
         * @param α {number}
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        // FIXME: Should really be slerp?
        SpinG3.prototype.lerp = function (target, α) {
            var R2 = SpinG3.copy(target);
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
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.lerp2 = function (a, b, α) {
            this.sub2(b, a).scale(α).add(a);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ log(this)</code>
         * </p>
         * @method log
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.log = function () {
            // FIXME: Wrong
            var w = this.α;
            var x = this.yz;
            var y = this.zx;
            var z = this.xy;
            // FIXME: DRY
            var bb = x * x + y * y + z * z;
            var R2 = sqrt(bb);
            var R0 = Math.abs(w);
            var R = sqrt(w * w + bb);
            this.α = Math.log(R);
            var θ = Math.atan2(R2, R0) / R2;
            // The angle, θ, produced by atan2 will be in the range [-π, +π]
            this.yz = x * θ;
            this.zx = y * θ;
            this.xy = z * θ;
            return this;
        };
        /**
         * Computes the <em>square root</em> of the <em>squared norm</em>.
         * @method magnitude
         * @return {number}
         */
        SpinG3.prototype.magnitude = function () {
            return sqrt(this.squaredNorm());
        };
        /**
         * <p>
         * <code>this ⟼ this * s</code>
         * </p>
         * @method mul
         * @param s {SpinorE3}
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.mul = function (s) {
            return this.mul2(this, s);
        };
        /**
         * <p>
         * <code>this ⟼ a * b</code>
         * </p>
         * @method mul2
         * @param a {SpinorE3}
         * @param b {SpinorE3}
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.mul2 = function (a, b) {
            var a0 = a.α;
            var a1 = a.yz;
            var a2 = a.zx;
            var a3 = a.xy;
            var b0 = b.α;
            var b1 = b.yz;
            var b2 = b.zx;
            var b3 = b.xy;
            // Compare this to the product for Quaternions
            // It would be interesting to DRY this out.
            this.α = a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3;
            // this.α = a0 * b0 - dotVectorCartesianE3(a1, a2, a3, b1, b2, b3)
            this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
            this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
            this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
            return this;
        };
        /**
         * @method neg
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.neg = function () {
            this.α = -this.α;
            this.yz = -this.yz;
            this.zx = -this.zx;
            this.xy = -this.xy;
            return this;
        };
        /**
        * <p>
        * <code>this ⟼ sqrt(this * conj(this))</code>
        * </p>
        * @method norm
        * @return {SpinG3} <code>this</code>
        * @chainable
        */
        SpinG3.prototype.norm = function () {
            var norm = this.magnitude();
            return this.zero().addScalar(norm);
        };
        /**
         * <p>
         * <code>this ⟼ this / magnitude(this)</code>
         * </p>
         * @method direction
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.direction = function () {
            var modulus = this.magnitude();
            this.yz = this.yz / modulus;
            this.zx = this.zx / modulus;
            this.xy = this.xy / modulus;
            this.α = this.α / modulus;
            return this;
        };
        /**
         * Sets this spinor to the identity element for multiplication, <b>1</b>.
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.one = function () {
            this.α = 1;
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            return this;
        };
        /**
        * <p>
        * <code>this ⟼ this * conj(this)</code>
        * </p>
        * @method quad
        * @return {SpinG3} <code>this</code>
        * @chainable
        */
        SpinG3.prototype.quad = function () {
            var squaredNorm = this.squaredNorm();
            return this.zero().addScalar(squaredNorm);
        };
        /**
         * @method squaredNorm
         * @return {number} <code>this * conj(this)</code>
         */
        SpinG3.prototype.squaredNorm = function () {
            return quadSpinor(this);
        };
        SpinG3.prototype.rco = function (rhs) {
            return this.rco2(this, rhs);
        };
        SpinG3.prototype.rco2 = function (a, b) {
            // FIXME: How to leverage? Maybe break up? Don't want performance hit.
            // scpG3(a, b, this)
            return this;
        };
        /**
         * <p>
         * <code>this = (w, B) ⟼ (w, -B)</code>
         * </p>
         * @method reverse
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.rev = function () {
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
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.reflect = function (n) {
            var w = this.α;
            var yz = this.yz;
            var zx = this.zx;
            var xy = this.xy;
            var nx = n.x;
            var ny = n.y;
            var nz = n.z;
            var nn = nx * nx + ny * ny + nz * nz;
            var nB = nx * yz + ny * zx + nz * xy;
            this.α = nn * w;
            this.xy = 2 * nz * nB - nn * xy;
            this.yz = 2 * nx * nB - nn * yz;
            this.zx = 2 * ny * nB - nn * zx;
            return this;
        };
        /**
         * <p>
         * <code>this = ⟼ rotor * this * rev(rotor)</code>
         * </p>
         * @method rotate
         * @param rotor {SpinorE3}
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.rotate = function (rotor) {
            console.warn("SpinG3.rotate is not implemented");
            return this;
        };
        /**
         * <p>
         * Computes a rotor, R, from two vectors, where
         * R = (abs(b) * abs(a) + b * a) / sqrt(2 * (quad(b) * quad(a) + abs(b) * abs(a) * b << a))
         * </p>
         * @method rotor
         * @param a {VectorE3} The <em>from</em> vector.
         * @param b {VectorE3} The <em>to</em> vector.
         * @return {SpinG3} <code>this</code> The rotor representing a rotation from a to b.
         * @chainable
         */
        SpinG3.prototype.rotorFromDirections = function (a, b) {
            return rotorFromDirections(a, b, quadVector, dotVector, this);
        };
        /**
         * <p>
         * <code>this = ⟼ exp(- dual(a) * θ / 2)</code>
         * </p>
         * @method rotorFromAxisAngle
         * @param axis {VectorE3}
         * @param θ {number}
         * @return {SpinG3} <code>this</code>
         */
        SpinG3.prototype.rotorFromAxisAngle = function (axis, θ) {
            var φ = θ / 2;
            var s = sin(φ);
            this.yz = -axis.x * s;
            this.zx = -axis.y * s;
            this.xy = -axis.z * s;
            this.α = cos(φ);
            return this;
        };
        /**
         * <p>
         * <code>this = ⟼ exp(- B * θ / 2)</code>
         * </p>
         * @method rotorFromGeneratorAngle
         * @param B {SpinorE3}
         * @param θ {number}
         * @return {SpinG3} <code>this</code>
         */
        SpinG3.prototype.rotorFromGeneratorAngle = function (B, θ) {
            var φ = θ / 2;
            var s = sin(φ);
            this.yz = -B.yz * s;
            this.zx = -B.zx * s;
            this.xy = -B.xy * s;
            this.α = cos(φ);
            return this;
        };
        SpinG3.prototype.scp = function (rhs) {
            return this.scp2(this, rhs);
        };
        SpinG3.prototype.scp2 = function (a, b) {
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
         * @return {SpinG3} <code>this</code>
         */
        SpinG3.prototype.scale = function (α) {
            mustBeNumber('α', α);
            this.yz *= α;
            this.zx *= α;
            this.xy *= α;
            this.α *= α;
            return this;
        };
        SpinG3.prototype.slerp = function (target, α) {
            var R2 = SpinG3.copy(target);
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
         * <code>this ⟼ this - s * α</code>
         * </p>
         * @method sub
         * @param s {SpinorE3}
         * @param [α = 1] {number}
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.sub = function (s, α) {
            if (α === void 0) { α = 1; }
            mustBeObject('s', s);
            mustBeNumber('α', α);
            this.yz -= s.yz * α;
            this.zx -= s.zx * α;
            this.xy -= s.xy * α;
            this.α -= s.α * α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a - b</code>
         * </p>
         * @method sub2
         * @param a {SpinorE3}
         * @param b {SpinorE3}
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.sub2 = function (a, b) {
            this.yz = a.yz - b.yz;
            this.zx = a.zx - b.zx;
            this.xy = a.xy - b.xy;
            this.α = a.α - b.α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a * b</code>
         * </p>
         * Sets this SpinG3 to the geometric product a * b of the vector arguments.
         * @method spinor
         * @param a {VectorE3}
         * @param b {VectorE3}
         * @return {SpinG3}
         */
        SpinG3.prototype.spinor = function (a, b) {
            var ax = a.x;
            var ay = a.y;
            var az = a.z;
            var bx = b.x;
            var by = b.y;
            var bz = b.z;
            this.α = dotVectorCartesianE3(ax, ay, az, bx, by, bz);
            this.yz = wedgeYZ(ax, ay, az, bx, by, bz);
            this.zx = wedgeZX(ax, ay, az, bx, by, bz);
            this.xy = wedgeXY(ax, ay, az, bx, by, bz);
            return this;
        };
        SpinG3.prototype.grade = function (grade) {
            mustBeInteger('grade', grade);
            switch (grade) {
                case 0:
                    {
                        this.yz = 0;
                        this.zx = 0;
                        this.xy = 0;
                    }
                    break;
                case 2:
                    {
                        this.α = 0;
                    }
                    break;
                default: {
                    this.α = 0;
                    this.yz = 0;
                    this.zx = 0;
                    this.xy = 0;
                }
            }
            return this;
        };
        SpinG3.prototype.toExponential = function () {
            // FIXME: Do like others.
            return this.toString();
        };
        SpinG3.prototype.toFixed = function (digits) {
            // FIXME: Do like others.
            return this.toString();
        };
        /**
         * @method toString
         * @return {string} A non-normative string representation of the target.
         */
        SpinG3.prototype.toString = function () {
            return "SpinG3({yz: " + this.yz + ", zx: " + this.zx + ", xy: " + this.xy + ", w: " + this.α + "})";
        };
        SpinG3.prototype.ext = function (rhs) {
            return this.ext2(this, rhs);
        };
        SpinG3.prototype.ext2 = function (a, b) {
            // FIXME: How to leverage? Maybe break up? Don't want performance hit.
            // scpG3(a, b, this)
            return this;
        };
        /**
         * Sets this spinor to the identity element for addition, <b>0</b>.
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.zero = function () {
            this.α = 0;
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            return this;
        };
        /**
         * @method copy
         * @param spinor {SpinorE3}
         * @return {SpinG3} A copy of the <code>spinor</code> argument.
         * @static
         */
        SpinG3.copy = function (spinor) {
            return new SpinG3().copy(spinor);
        };
        /**
         * Computes I * <code>v</code>, the dual of <code>v</code>.
         * @method dual
         * @param v {VectorE3}
         * @return {SpinG3}
         */
        SpinG3.dual = function (v) {
            return new SpinG3().dual(v);
        };
        /**
         * @method lerp
         * @param a {SpinorE3}
         * @param b {SpinorE3}
         * @param α {number}
         * @return {SpinG3} <code>a + α * (b - a)</code>
         * @static
         */
        SpinG3.lerp = function (a, b, α) {
            return SpinG3.copy(a).lerp(b, α);
        };
        /**
         * Computes the rotor that rotates vector <code>a</code> to vector <code>b</code>.
         * @method rotorFromDirections
         * @param a {VectorE3} The <em>from</em> vector.
         * @param b {VectorE3} The <em>to</em> vector.
         * @return {SpinG3}
         * @static
         */
        SpinG3.rotorFromDirections = function (a, b) {
            return new SpinG3().rotorFromDirections(a, b);
        };
        return SpinG3;
    })(VectorN);
    return SpinG3;
});
