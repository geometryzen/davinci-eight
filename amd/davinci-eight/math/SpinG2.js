var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/dotVectorCartesianE2', '../math/dotVectorE2', '../checks/isDefined', '../checks/mustBeInteger', '../checks/mustBeNumber', '../checks/mustBeObject', '../math/quadSpinorE2', '../math/quadVectorE2', '../math/rotorFromDirections', '../math/VectorN', '../math/wedgeXY'], function (require, exports, dotVectorCartesian, dotVector, isDefined, mustBeInteger, mustBeNumber, mustBeObject, quadSpinor, quadVector, rotorFromDirections, VectorN, wedgeXY) {
    // Symbolic constants for the coordinate indices into the coords array.
    var COORD_XY = 0;
    var COORD_ALPHA = 1;
    function one() {
        var coords = [0, 0];
        coords[COORD_ALPHA] = 1;
        coords[COORD_XY] = 0;
        return coords;
    }
    var PI = Math.PI;
    var abs = Math.abs;
    var atan2 = Math.atan2;
    var exp = Math.exp;
    var log = Math.log;
    var cos = Math.cos;
    var sin = Math.sin;
    var sqrt = Math.sqrt;
    /**
     * @class SpinG2
     * @extends VectorN<number>
     */
    var SpinG2 = (function (_super) {
        __extends(SpinG2, _super);
        /**
         * Constructs a <code>SpinG2</code> from a <code>number[]</code>.
         * For a <em>geometric</em> implementation, use the static methods.
         * @class SpinG2
         * @constructor
         */
        function SpinG2(coordinates, modified) {
            if (coordinates === void 0) { coordinates = one(); }
            if (modified === void 0) { modified = false; }
            _super.call(this, coordinates, modified, 2);
        }
        Object.defineProperty(SpinG2.prototype, "xy", {
            /**
             * The bivector part of this spinor as a number.
             * @property xy
             * @type {number}
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
        Object.defineProperty(SpinG2.prototype, "α", {
            /**
             * The scalar part of this spinor as a number.
             * @property α
             * @type {number}
             */
            get: function () {
                return this.coords[COORD_ALPHA];
            },
            set: function (α) {
                mustBeNumber('α', α);
                this.modified = this.modified || this.α !== α;
                this.coords[COORD_ALPHA] = α;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * <p>
         * <code>this ⟼ this + α * spinor</code>
         * </p>
         * @method add
         * @param spinor {SpinorE2}
         * @param α [number = 1]
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.add = function (spinor, α) {
            if (α === void 0) { α = 1; }
            mustBeObject('spinor', spinor);
            mustBeNumber('α', α);
            this.xy += spinor.xy * α;
            this.α += spinor.α * α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a + b</code>
         * </p>
         * @method add2
         * @param a {SpinorE2}
         * @param b {SpinorE2}
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.add2 = function (a, b) {
            this.α = a.α + b.α;
            this.xy = a.xy + b.xy;
            return this;
        };
        /**
         * Intentionally undocumented.
         */
        SpinG2.prototype.addPseudo = function (β) {
            mustBeNumber('β', β);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this + α</code>
         * </p>
         * @method addScalar
         * @param α {number}
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.addScalar = function (α) {
            mustBeNumber('α', α);
            this.α += α;
            return this;
        };
        /**
         * @method adj
         * @return {number}
         * @beta
         */
        SpinG2.prototype.adj = function () {
            throw new Error('TODO: SpinG2.adj');
        };
        /**
         * @method angle
         * @return {SpinG2}
         */
        SpinG2.prototype.angle = function () {
            return this.log().grade(2);
        };
        /**
         * @method clone
         * @return {SpinG2} A copy of <code>this</code>.
         * @chainable
         */
        SpinG2.prototype.clone = function () {
            return SpinG2.copy(this);
        };
        /**
         * <p>
         * <code>this ⟼ (w, -B)</code>
         * </p>
         * @method conj
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.conj = function () {
            this.xy = -this.xy;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ copy(spinor)</code>
         * </p>
         * @method copy
         * @param spinor {SpinorE2}
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.copy = function (spinor) {
            mustBeObject('spinor', spinor);
            this.xy = mustBeNumber('spinor.xy', spinor.xy);
            this.α = mustBeNumber('spinor.α', spinor.α);
            return this;
        };
        /**
         * Sets this spinor to the value of the scalar, <code>α</code>.
         * @method copyScalar
         * @param α {number} The scalar to be copied.
         * @return {SpinG2}
         * @chainable
         */
        SpinG2.prototype.copyScalar = function (α) {
            return this.zero().addScalar(α);
        };
        /**
         * Intentionally undocumented.
         */
        SpinG2.prototype.copySpinor = function (spinor) {
            return this.copy(spinor);
        };
        /**
         * Intentionally undocumented.
         */
        SpinG2.prototype.copyVector = function (vector) {
            // The spinor has no vector components.
            return this.zero();
        };
        /**
         * <p>
         * <code>this ⟼ this / s</code>
         * </p>
         * @method div
         * @param s {SpinorE2}
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.div = function (s) {
            return this.div2(this, s);
        };
        /**
         * <p>
         * <code>this ⟼ a / b</code>
         * </p>
         * @method div2
         * @param a {SpinorE2}
         * @param b {SpinorE2}
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.div2 = function (a, b) {
            var a0 = a.α;
            var a1 = a.xy;
            var b0 = b.α;
            var b1 = b.xy;
            var quadB = quadSpinor(b);
            this.α = (a0 * b0 + a1 * b1) / quadB;
            this.xy = (a1 * b0 - a0 * b1) / quadB;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this / α</code>
         * </p>
         * @method divByScalar
         * @param α {number}
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.divByScalar = function (α) {
            this.xy /= α;
            this.α /= α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ e<sup>this</sup></code>
         * </p>
         * @method exp
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.exp = function () {
            var w = this.α;
            var z = this.xy;
            var expW = exp(w);
            // φ is actually the absolute value of one half the rotation angle.
            // The orientation of the rotation gets carried in the bivector components.
            // FIXME: DRY
            var φ = sqrt(z * z);
            var s = expW * (φ !== 0 ? sin(φ) / φ : 1);
            this.α = expW * cos(φ);
            this.xy = z * s;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ conj(this) / quad(this)</code>
         * </p>
         * @method inv
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.inv = function () {
            this.conj();
            this.divByScalar(this.squaredNorm());
            return this;
        };
        SpinG2.prototype.lco = function (rhs) {
            return this.lco2(this, rhs);
        };
        SpinG2.prototype.lco2 = function (a, b) {
            // FIXME: How to leverage? Maybe break up? Don't want performance hit.
            // scpG2(a, b, this)
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this + α * (target - this)</code>
         * </p>
         * @method lerp
         * @param target {SpinorE2}
         * @param α {number}
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        // FIXME: Should really be slerp?
        SpinG2.prototype.lerp = function (target, α) {
            var R2 = SpinG2.copy(target);
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
         * @param a {SpinorE2}
         * @param b {SpinorE2}
         * @param α {number}
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.lerp2 = function (a, b, α) {
            this.sub2(b, a).scale(α).add(a);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ log(this)</code>
         * </p>
         * @method log
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.log = function () {
            // FIXME: This is wrong see G2.
            var w = this.α;
            var z = this.xy;
            // FIXME: DRY
            var bb = z * z;
            var R2 = sqrt(bb);
            var R0 = abs(w);
            var R = sqrt(w * w + bb);
            this.α = log(R);
            var f = atan2(R2, R0) / R2;
            this.xy = z * f;
            return this;
        };
        /**
         * Computes the <em>square root</em> of the <em>squared norm</em>.
         * @method magnitude
         * @return {number}
         */
        SpinG2.prototype.magnitude = function () {
            return sqrt(this.squaredNorm());
        };
        /**
         * <p>
         * <code>this ⟼ this * s</code>
         * </p>
         * @method mul
         * @param s {SpinorE2}
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.mul = function (s) {
            return this.mul2(this, s);
        };
        /**
         * <p>
         * <code>this ⟼ a * b</code>
         * </p>
         * @method mul2
         * @param a {SpinorE2}
         * @param b {SpinorE2}
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.mul2 = function (a, b) {
            var a0 = a.α;
            var a1 = a.xy;
            var b0 = b.α;
            var b1 = b.xy;
            this.α = a0 * b0 - a1 * b1;
            this.xy = a0 * b1 + a1 * b0;
            return this;
        };
        /**
         * @method neg
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.neg = function () {
            this.α = -this.α;
            this.xy = -this.xy;
            return this;
        };
        /**
        * <p>
        * <code>this ⟼ sqrt(this * conj(this))</code>
        * </p>
        * @method norm
        * @return {SpinG2} <code>this</code>
        * @chainable
        */
        SpinG2.prototype.norm = function () {
            var norm = this.magnitude();
            return this.zero().addScalar(norm);
        };
        /**
         * <p>
         * <code>this ⟼ this / magnitude(this)</code>
         * </p>
         * @method normalize
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.normalize = function () {
            var modulus = this.magnitude();
            this.xy = this.xy / modulus;
            this.α = this.α / modulus;
            return this;
        };
        /**
         * Sets this spinor to the identity element for multiplication, <b>1</b>.
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.one = function () {
            this.α = 1;
            this.xy = 0;
            return this;
        };
        /**
        * <p>
        * <code>this ⟼ this * conj(this)</code>
        * </p>
        * @method quad
        * @return {SpinG2} <code>this</code>
        * @chainable
        */
        SpinG2.prototype.quad = function () {
            var squaredNorm = this.squaredNorm();
            return this.zero().addScalar(squaredNorm);
        };
        /**
         * @method squaredNorm
         * @return {number} <code>this * conj(this)</code>
         */
        SpinG2.prototype.squaredNorm = function () {
            return quadSpinor(this);
        };
        SpinG2.prototype.rco = function (rhs) {
            return this.rco2(this, rhs);
        };
        SpinG2.prototype.rco2 = function (a, b) {
            // FIXME: How to leverage? Maybe break up? Don't want performance hit.
            // scpG2(a, b, this)
            return this;
        };
        /**
         * <p>
         * <code>this = (w, B) ⟼ (w, -B)</code>
         * </p>
         * @method reverse
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.rev = function () {
            this.xy *= -1;
            return this;
        };
        /**
         * Sets this Spinor to the value of its reflection in the plane orthogonal to n.
         * The geometric formula for bivector reflection is B' = n * B * n.
         * @method reflect
         * @param n {VectorE2}
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.reflect = function (n) {
            var w = this.α;
            var β = this.xy;
            var nx = n.x;
            var ny = n.y;
            var nn = nx * nx + ny * ny;
            this.α = nn * w;
            this.xy = -nn * β;
            return this;
        };
        /**
         * <p>
         * <code>this = ⟼ rotor * this * rev(rotor)</code>
         * </p>
         * @method rotate
         * @param rotor {SpinorE2}
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.rotate = function (rotor) {
            console.warn("SpinG2.rotate is not implemented");
            return this;
        };
        /**
         * <p>
         * Sets this multivector to a rotation from vector <code>a</code> to vector <code>b</code>.
         * </p>
         * @method rotorFromDirections
         * @param a {VectorE2} The <em>from</em> vector.
         * @param b {VectorE2} The <em>to</em> vector.
         * @return {SpinG2} <code>this</code> The rotor representing a rotation from a to b.
         * @chainable
         */
        SpinG2.prototype.rotorFromDirections = function (a, b) {
            if (isDefined(rotorFromDirections(a, b, quadVector, dotVector, this))) {
                return this;
            }
            else {
            }
        };
        /**
         * <p>
         * <code>this = ⟼ exp(- B * θ / 2)</code>
         * </p>
         * @method rotorFromGeneratorAngle
         * @param B {SpinorE2}
         * @param θ {number}
         * @return {SpinG2} <code>this</code>
         */
        SpinG2.prototype.rotorFromGeneratorAngle = function (B, θ) {
            var φ = θ / 2;
            var s = sin(φ);
            this.xy = -B.xy * s;
            this.α = cos(φ);
            return this;
        };
        SpinG2.prototype.scp = function (rhs) {
            return this.scp2(this, rhs);
        };
        SpinG2.prototype.scp2 = function (a, b) {
            // FIXME: How to leverage? Maybe break up? Don't want performance hit.
            // scpG2(a, b, this)
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this * α</code>
         * </p>
         * @method scale
         * @param α {number}
         * @return {SpinG2} <code>this</code>
         */
        SpinG2.prototype.scale = function (α) {
            mustBeNumber('α', α);
            this.xy *= α;
            this.α *= α;
            return this;
        };
        SpinG2.prototype.slerp = function (target, α) {
            var R2 = SpinG2.copy(target);
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
         * @param s {SpinorE2}
         * @param α [number = 1]
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.sub = function (s, α) {
            if (α === void 0) { α = 1; }
            mustBeObject('s', s);
            mustBeNumber('α', α);
            this.xy -= s.xy * α;
            this.α -= s.α * α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a - b</code>
         * </p>
         * @method sub2
         * @param a {SpinorE2}
         * @param b {SpinorE2}
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.sub2 = function (a, b) {
            this.xy = a.xy - b.xy;
            this.α = a.α - b.α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a * b</code>
         * </p>
         * Sets this SpinG2 to the geometric product a * b of the vector arguments.
         * @method spinor
         * @param a {VectorE2}
         * @param b {VectorE2}
         * @return {SpinG2}
         */
        SpinG2.prototype.spinor = function (a, b) {
            var ax = a.x;
            var ay = a.y;
            var bx = b.x;
            var by = b.y;
            this.α = dotVectorCartesian(ax, ay, bx, by);
            // TODO: This is a bit wasteful.
            this.xy = wedgeXY(ax, ay, 0, bx, by, 0);
            return this;
        };
        SpinG2.prototype.grade = function (grade) {
            mustBeInteger('grade', grade);
            switch (grade) {
                case 0:
                    {
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
                    this.xy = 0;
                }
            }
            return this;
        };
        SpinG2.prototype.toExponential = function () {
            // FIXME: Do like others.
            return this.toString();
        };
        SpinG2.prototype.toFixed = function (digits) {
            // FIXME: Do like others.
            return this.toString();
        };
        /**
         * @method toString
         * @return {string} A non-normative string representation of the target.
         */
        SpinG2.prototype.toString = function () {
            return "SpinG2({β: " + this.xy + ", w: " + this.α + "})";
        };
        SpinG2.prototype.ext = function (rhs) {
            return this.ext2(this, rhs);
        };
        SpinG2.prototype.ext2 = function (a, b) {
            // FIXME: How to leverage? Maybe break up? Don't want performance hit.
            // scpG2(a, b, this)
            return this;
        };
        /**
         * Sets this spinor to the identity element for addition, <b>0</b>.
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.zero = function () {
            this.α = 0;
            this.xy = 0;
            return this;
        };
        /**
         * @method copy
         * @param spinor {SpinorE2}
         * @return {SpinG2} A copy of the <code>spinor</code> argument.
         * @static
         */
        SpinG2.copy = function (spinor) {
            return new SpinG2().copy(spinor);
        };
        /**
         * @method lerp
         * @param a {SpinorE2}
         * @param b {SpinorE2}
         * @param α {number}
         * @return {SpinG2} <code>a + α * (b - a)</code>
         * @static
         */
        SpinG2.lerp = function (a, b, α) {
            return SpinG2.copy(a).lerp(b, α);
        };
        /**
         * Computes the rotor that rotates vector <code>a</code> to vector <code>b</code>.
         * @method rotorFromDirections
         * @param a {VectorE2} The <em>from</em> vector.
         * @param b {VectorE2} The <em>to</em> vector.
         * @return {SpinG2}
         * @static
         */
        SpinG2.rotorFromDirections = function (a, b) {
            return new SpinG2().rotorFromDirections(a, b);
        };
        return SpinG2;
    })(VectorN);
    return SpinG2;
});
