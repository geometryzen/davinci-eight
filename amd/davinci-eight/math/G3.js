var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/dotVectorE3', '../math/extG3', '../math/lcoG3', '../math/mulG3', '../checks/mustBeNumber', '../checks/mustBeObject', '../math/quadVectorE3', '../math/rcoG3', '../math/rotorFromDirections', '../math/scpG3', '../math/stringFromCoordinates', '../math/VectorN', '../math/wedgeXY', '../math/wedgeYZ', '../math/wedgeZX'], function (require, exports, dotVector, extG3, lcoG3, mulG3, mustBeNumber, mustBeObject, quadVector, rcoG3, rotorFromDirections, scpG3, stringFromCoordinates, VectorN, wedgeXY, wedgeYZ, wedgeZX) {
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
    var BASIS_LABELS = ["1", "e1", "e2", "e3", "e12", "e23", "e31", "e123"];
    /**
     * Coordinates corresponding to basis labels.
     */
    function coordinates(m) {
        return [m.α, m.x, m.y, m.z, m.xy, m.yz, m.zx, m.β];
    }
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
        Object.defineProperty(G3.prototype, "α", {
            /**
             * The scalar part of this multivector.
             * @property α
             * @type {number}
             */
            get: function () {
                return this.data[COORD_W];
            },
            set: function (α) {
                mustBeNumber('α', α);
                this.modified = this.modified || this.data[COORD_W] !== α;
                this.data[COORD_W] = α;
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
        Object.defineProperty(G3.prototype, "β", {
            /**
             * The pseudoscalar part of this multivector.
             * @property β
             * @type {number}
             */
            get: function () {
                return this.data[COORD_XYZ];
            },
            set: function (β) {
                mustBeNumber('β', β);
                this.modified = this.modified || this.data[COORD_XYZ] !== β;
                this.data[COORD_XYZ] = β;
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
            this.α += M.α * α;
            this.x += M.x * α;
            this.y += M.y * α;
            this.z += M.z * α;
            this.yz += M.yz * α;
            this.zx += M.zx * α;
            this.xy += M.xy * α;
            this.β += M.β * α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this + Iβ</code>
         * </p>
         * @method addPseudo
         * @param β {number}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.addPseudo = function (β) {
            mustBeNumber('β', β);
            this.β += β;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this + α</code>
         * </p>
         * @method addScalar
         * @param α {number}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.addScalar = function (α) {
            mustBeNumber('α', α);
            this.α += α;
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
            this.α = a.α + b.α;
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            this.z = a.z + b.z;
            this.yz = a.yz + b.yz;
            this.zx = a.zx + b.zx;
            this.xy = a.xy + b.xy;
            this.β = a.β + b.β;
            return this;
        };
        G3.prototype.adj = function () {
            throw new Error('TODO: G3.adj');
        };
        /**
         * @method arg
         * @return {number}
         */
        G3.prototype.arg = function () {
            throw new Error('TODO: G3.arg');
        };
        /**
         * @method clone
         * @return {G3} <code>copy(this)</code>
         * @chainable
         */
        G3.prototype.clone = function () {
            return G3.copy(this);
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
            return this.lco2(this, m);
        };
        /**
         * <p>
         * <code>this ⟼ a << b</code>
         * </p>
         * @method lco2
         * @param a {GeometricE3}
         * @param b {GeometricE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.lco2 = function (a, b) {
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
            return this.rco2(this, m);
        };
        /**
         * <p>
         * <code>this ⟼ a >> b</code>
         * </p>
         * @method rco2
         * @param a {GeometricE3}
         * @param b {GeometricE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.rco2 = function (a, b) {
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
            this.α = M.α;
            this.x = M.x;
            this.y = M.y;
            this.z = M.z;
            this.yz = M.yz;
            this.zx = M.zx;
            this.xy = M.xy;
            this.β = M.β;
            return this;
        };
        /**
         * Sets this multivector to the value of the scalar, <code>α</code>.
         * @method copyScalar
         * @return {G3}
         * @chainable
         */
        G3.prototype.copyScalar = function (α) {
            return this.zero().addScalar(α);
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
            this.zero();
            this.α = spinor.α;
            this.yz = spinor.yz;
            this.zx = spinor.zx;
            this.xy = spinor.xy;
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
            this.zero();
            this.x = vector.x;
            this.y = vector.y;
            this.z = vector.z;
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
         * @method divByScalar
         * @param α {number}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.divByScalar = function (α) {
            mustBeNumber('α', α);
            this.α /= α;
            this.x /= α;
            this.y /= α;
            this.z /= α;
            this.yz /= α;
            this.zx /= α;
            this.xy /= α;
            this.β /= α;
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
         * <p>
         * <code>this ⟼ dual(m) = I * m</code>
         * </p>
         * @method dual
         * @param m {GeometricE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.dual = function (m) {
            var w = -m.β;
            var x = -m.yz;
            var y = -m.zx;
            var z = -m.xy;
            var yz = m.x;
            var zx = m.y;
            var xy = m.z;
            var β = m.α;
            this.α = w;
            this.x = x;
            this.y = y;
            this.z = z;
            this.yz = yz;
            this.zx = zx;
            this.xy = xy;
            this.β = β;
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
            var w = this.α;
            var x = this.yz;
            var y = this.zx;
            var z = this.xy;
            var expW = exp(w);
            // φ is actually the absolute value of one half the rotation angle.
            // The orientation of the rotation gets carried in the bivector components.
            var φ = Math.sqrt(x * x + y * y + z * z);
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
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.inv = function () {
            // FIXME: TODO
            this.conj();
            // this.divByScalar(this.squaredNorm());
            return this;
        };
        /**
         * @method isOne
         * @return {boolean}
         */
        G3.prototype.isOne = function () {
            return this.α === 1 && this.x === 0 && this.y === 0 && this.z === 0 && this.yz === 0 && this.zx === 0 && this.xy === 0 && this.β === 0;
        };
        /**
         * @method isZero
         * @return {boolean}
         */
        G3.prototype.isZero = function () {
            return this.α === 0 && this.x === 0 && this.y === 0 && this.z === 0 && this.yz === 0 && this.zx === 0 && this.xy === 0 && this.β === 0;
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
            this.α += (target.α - this.α) * α;
            this.x += (target.x - this.x) * α;
            this.y += (target.y - this.y) * α;
            this.z += (target.z - this.z) * α;
            this.yz += (target.yz - this.yz) * α;
            this.zx += (target.zx - this.zx) * α;
            this.xy += (target.xy - this.xy) * α;
            this.β += (target.β - this.β) * α;
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
            var w = this.α;
            var x = this.yz;
            var y = this.zx;
            var z = this.xy;
            var bb = x * x + y * y + z * z;
            var R2 = Math.sqrt(bb);
            var R0 = Math.abs(w);
            var R = Math.sqrt(w * w + bb);
            this.α = Math.log(R);
            var f = Math.atan2(R2, R0) / R2;
            this.yz = x * f;
            this.zx = y * f;
            this.xy = z * f;
            return this;
        };
        G3.prototype.magnitude = function () {
            return Math.sqrt(this.squaredNorm());
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
            this.α = -this.α;
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            this.yz = this.yz;
            this.zx = -this.zx;
            this.xy = -this.xy;
            this.β = -this.β;
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
            this.α = this.magnitude();
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
            // The squaredNorm is the squared norm.
            var norm = Math.sqrt(this.squaredNorm());
            this.α = this.α / norm;
            this.x = this.x / norm;
            this.y = this.y / norm;
            this.z = this.z / norm;
            this.yz = this.yz / norm;
            this.zx = this.zx / norm;
            this.xy = this.xy / norm;
            this.β = this.β / norm;
            return this;
        };
        /**
        * <p>
        * <code>this ⟼ scp(this, rev(this)) = this | ~this</code>
        * </p>
        * @method quad
        * @return {G3} <code>this</code>
        * @chainable
        */
        G3.prototype.quad = function () {
            // FIXME: TODO
            this.α = this.squaredNorm();
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            return this;
        };
        /**
         * @method squaredNorm
         * @return {number} <code>this * conj(this)</code>
         */
        G3.prototype.squaredNorm = function () {
            // FIXME: TODO
            var w = this.α;
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
         * <code>this ⟼ rev(this)</code>
         * </p>
         * @method reverse
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.rev = function () {
            // reverse has a ++-- structure.
            this.α = this.α;
            this.x = this.x;
            this.y = this.y;
            this.z = this.z;
            this.yz = -this.yz;
            this.zx = -this.zx;
            this.xy = -this.xy;
            this.β = -this.β;
            return this;
        };
        /**
         * @method __tilde__
         * @return {G3}
         */
        G3.prototype.__tilde__ = function () {
            return G3.copy(this).rev();
        };
        /**
         * <p>
         * <code>this ⟼ R * this * rev(R)</code>
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
            var α = R.α;
            var ix = α * x - c * z + a * y;
            var iy = α * y - a * x + b * z;
            var iz = α * z - b * y + c * x;
            var iα = b * x + c * y + a * z;
            this.x = ix * α + iα * b + iy * a - iz * c;
            this.y = iy * α + iα * c + iz * b - ix * a;
            this.z = iz * α + iα * a + ix * c - iy * b;
            return this;
        };
        /**
         * <p>
         * Computes a rotor, R, from two unit vectors, where
         * R = (1 + b * a) / sqrt(2 * (1 + b << a))
         * </p>
         * @method rotorFromDirections
         * @param b {VectorE3} The ending unit vector
         * @param a {VectorE3} The starting unit vector
         * @return {G3} <code>this</code> The rotor representing a rotation from a to b.
         * @chainable
         */
        G3.prototype.rotorFromDirections = function (b, a) {
            return rotorFromDirections(a, b, quadVector, dotVector, this);
        };
        /**
         * <p>
         * <code>this = ⟼ exp(- dual(a) * θ / 2)</code>
         * </p>
         * @method rotorFromAxisAngle
         * @param axis {VectorE3}
         * @param θ {number}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.rotorFromAxisAngle = function (axis, θ) {
            // FIXME: TODO
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
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.rotorFromGeneratorAngle = function (B, θ) {
            // FIXME: TODO
            var φ = θ / 2;
            var s = sin(φ);
            this.yz = -B.yz * s;
            this.zx = -B.zx * s;
            this.xy = -B.xy * s;
            this.α = cos(φ);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ scp(this, m)</code>
         * </p>
         * @method align
         * @param m {GeometricE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.scp = function (m) {
            return this.scp2(this, m);
        };
        /**
         * <p>
         * <code>this ⟼ scp(a, b)</code>
         * </p>
         * @method scp2
         * @param a {GeometricE3}
         * @param b {GeometricE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.scp2 = function (a, b) {
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
            this.α *= α;
            this.x *= α;
            this.y *= α;
            this.z *= α;
            this.yz *= α;
            this.zx *= α;
            this.xy *= α;
            this.β *= α;
            return this;
        };
        G3.prototype.slerp = function (target, α) {
            mustBeObject('target', target);
            mustBeNumber('α', α);
            // TODO
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
            this.zero();
            this.α = dotVector(a, b);
            this.yz = wedgeYZ(ax, ay, az, bx, by, bz);
            this.zx = wedgeZX(ax, ay, az, bx, by, bz);
            this.xy = wedgeXY(ax, ay, az, bx, by, bz);
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
            this.α -= M.α * α;
            this.x -= M.x * α;
            this.y -= M.y * α;
            this.z -= M.z * α;
            this.yz -= M.yz * α;
            this.zx -= M.zx * α;
            this.xy -= M.xy * α;
            this.β -= M.β * α;
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
            this.α = a.α - b.α;
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.z = a.z - b.z;
            this.yz = a.yz - b.yz;
            this.zx = a.zx - b.zx;
            this.xy = a.xy - b.xy;
            this.β = a.β - b.β;
            return this;
        };
        /**
         * Returns a string representing the number in exponential notation.
         * @method toExponential
         * @return {string}
         */
        G3.prototype.toExponential = function () {
            var coordToString = function (coord) { return coord.toExponential(); };
            return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS);
        };
        /**
         * Returns a string representing the number in fixed-point notation.
         * @method toFixed
         * @param fractionDigits [number]
         * @return {string}
         */
        G3.prototype.toFixed = function (fractionDigits) {
            var coordToString = function (coord) { return coord.toFixed(fractionDigits); };
            return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS);
        };
        /**
         * Returns a string representation of the number.
         * @method toString
         * @return {string}
         */
        G3.prototype.toString = function () {
            var coordToString = function (coord) { return coord.toString(); };
            return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS);
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
        G3.prototype.ext = function (m) {
            return this.ext2(this, m);
        };
        /**
         * <p>
         * <code>this ⟼ a ^ b</code>
         * </p>
         * @method ext2
         * @param a {GeometricE3}
         * @param b {GeometricE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.ext2 = function (a, b) {
            return extG3(a, b, this);
        };
        /**
         * Sets this multivector to the identity element for addition, <b>0</b>.
         * @method zero
         * @return {G3}
         * @chainable
         */
        G3.prototype.zero = function () {
            this.α = 0;
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            this.β = 0;
            return this;
        };
        /**
         * @method __add__
         * @param rhs {any}
         * @return {G3}
         * @private
         */
        G3.prototype.__add__ = function (rhs) {
            if (rhs instanceof G3) {
                return G3.copy(this).add(rhs);
            }
            else if (typeof rhs === 'number') {
                return G3.copy(this).add(G3.fromScalar(rhs));
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __div__
         * @param rhs {any}
         * @return {G3}
         * @private
         */
        G3.prototype.__div__ = function (rhs) {
            if (rhs instanceof G3) {
                return G3.copy(this).div(rhs);
            }
            else if (typeof rhs === 'number') {
                return G3.copy(this).divByScalar(rhs);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rdiv__
         * @param lhs {any}
         * @return {G3}
         * @private
         */
        G3.prototype.__rdiv__ = function (lhs) {
            if (lhs instanceof G3) {
                return G3.copy(lhs).div(this);
            }
            else if (typeof lhs === 'number') {
                return G3.fromScalar(lhs).div(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __mul__
         * @param rhs {any}
         * @return {G3}
         * @private
         */
        G3.prototype.__mul__ = function (rhs) {
            if (rhs instanceof G3) {
                return G3.copy(this).mul(rhs);
            }
            else if (typeof rhs === 'number') {
                return G3.copy(this).scale(rhs);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rmul__
         * @param lhs {any}
         * @return {G3}
         * @private
         */
        G3.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof G3) {
                return G3.copy(lhs).mul(this);
            }
            else if (typeof lhs === 'number') {
                // Scalar multiplication commutes.
                return G3.copy(this).scale(lhs);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __radd__
         * @param lhs {any}
         * @return {G3}
         * @private
         */
        G3.prototype.__radd__ = function (lhs) {
            if (lhs instanceof G3) {
                return G3.copy(lhs).add(this);
            }
            else if (typeof lhs === 'number') {
                return G3.fromScalar(lhs).add(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __sub__
         * @param rhs {any}
         * @return {G3}
         * @private
         */
        G3.prototype.__sub__ = function (rhs) {
            if (rhs instanceof G3) {
                return G3.copy(this).sub(rhs);
            }
            else if (typeof rhs === 'number') {
                return G3.fromScalar(rhs).neg().add(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rsub__
         * @param lhs {any}
         * @return {G3}
         * @private
         */
        G3.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof G3) {
                return G3.copy(lhs).sub(this);
            }
            else if (typeof lhs === 'number') {
                return G3.fromScalar(lhs).sub(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __wedge__
         * @param rhs {any}
         * @return {G3}
         * @private
         */
        G3.prototype.__wedge__ = function (rhs) {
            if (rhs instanceof G3) {
                return G3.copy(this).ext(rhs);
            }
            else if (typeof rhs === 'number') {
                // The outer product with a scalar is scalar multiplication.
                return G3.copy(this).scale(rhs);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rwedge__
         * @param lhs {any}
         * @return {G3}
         * @private
         */
        G3.prototype.__rwedge__ = function (lhs) {
            if (lhs instanceof G3) {
                return G3.copy(lhs).ext(this);
            }
            else if (typeof lhs === 'number') {
                // The outer product with a scalar is scalar multiplication, and commutes.
                return G3.copy(this).scale(lhs);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __lshift__
         * @param rhs {any}
         * @return {G3}
         * @private
         */
        G3.prototype.__lshift__ = function (rhs) {
            if (rhs instanceof G3) {
                return G3.copy(this).lco(rhs);
            }
            else if (typeof rhs === 'number') {
                return G3.copy(this).lco(G3.fromScalar(rhs));
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rlshift__
         * @param other {any}
         * @return {G3}
         * @private
         */
        G3.prototype.__rlshift__ = function (lhs) {
            if (lhs instanceof G3) {
                return G3.copy(lhs).lco(this);
            }
            else if (typeof lhs === 'number') {
                return G3.fromScalar(lhs).lco(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rshift__
         * @param rhs {any}
         * @return {G3}
         * @private
         */
        G3.prototype.__rshift__ = function (rhs) {
            if (rhs instanceof G3) {
                return G3.copy(this).rco(rhs);
            }
            else if (typeof rhs === 'number') {
                return G3.copy(this).rco(G3.fromScalar(rhs));
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rrshift__
         * @param other {any}
         * @return {G3}
         * @private
         */
        G3.prototype.__rrshift__ = function (lhs) {
            if (lhs instanceof G3) {
                return G3.copy(lhs).rco(this);
            }
            else if (typeof lhs === 'number') {
                return G3.fromScalar(lhs).rco(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __vbar__
         * @param rhs {any}
         * @return {G3}
         * @private
         */
        G3.prototype.__vbar__ = function (rhs) {
            if (rhs instanceof G3) {
                return G3.copy(this).scp(rhs);
            }
            else if (typeof rhs === 'number') {
                return G3.copy(this).scp(G3.fromScalar(rhs));
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rvbar__
         * @param lhs {any}
         * @return {G3}
         * @private
         */
        G3.prototype.__rvbar__ = function (lhs) {
            if (lhs instanceof G3) {
                return G3.copy(lhs).scp(this);
            }
            else if (typeof lhs === 'number') {
                return G3.fromScalar(lhs).scp(this);
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
            copy.α = M.α;
            copy.x = M.x;
            copy.y = M.y;
            copy.z = M.z;
            copy.yz = M.yz;
            copy.zx = M.zx;
            copy.xy = M.xy;
            copy.β = M.β;
            return copy;
        };
        /**
         * @method fromScalar
         * @param α {number}
         * @return {G3}
         * @static
         * @chainable
         */
        G3.fromScalar = function (α) {
            return new G3().copyScalar(α);
        };
        /**
         * @method fromSpinor
         * @param spinor {SpinorE3}
         * @return {G3}
         * @static
         * @chainable
         */
        G3.fromSpinor = function (spinor) {
            var copy = new G3();
            copy.α = spinor.α;
            copy.yz = spinor.yz;
            copy.zx = spinor.yz;
            copy.xy = spinor.xy;
            return copy;
        };
        /**
         * @method fromVector
         * @param vector {VectorE3}
         * @return {G3}
         * @static
         * @chainable
         */
        G3.fromVector = function (vector) {
            var copy = new G3();
            copy.x = vector.x;
            copy.y = vector.y;
            copy.z = vector.z;
            return copy;
        };
        /**
        * @method lerp
        * @param A {GeometricE3}
        * @param B {GeometricE3}
        * @param α {number}
        * @return {G3} <code>A + α * (B - A)</code>
        * @static
        * @chainable
        */
        G3.lerp = function (A, B, α) {
            return G3.copy(A).lerp(B, α);
        };
        return G3;
    })(VectorN);
    return G3;
});
