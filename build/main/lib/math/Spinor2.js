"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var applyMixins_1 = require("../utils/applyMixins");
var approx_1 = require("./approx");
var dotVectorCartesianE2_1 = require("../math/dotVectorCartesianE2");
var Lockable_1 = require("../core/Lockable");
var mustBeInteger_1 = require("../checks/mustBeInteger");
var mustBeNumber_1 = require("../checks/mustBeNumber");
var mustBeObject_1 = require("../checks/mustBeObject");
var notSupported_1 = require("../i18n/notSupported");
var quadSpinorE2_1 = require("../math/quadSpinorE2");
var rotorFromDirectionsE2_1 = require("../math/rotorFromDirectionsE2");
var wedgeXY_1 = require("../math/wedgeXY");
// Symbolic constants for the coordinate indices into the coords array.
var COORD_SCALAR = 1;
var COORD_PSEUDO = 0;
/**
 * Coordinates corresponding to basis labels.
 */
function coordinates(m) {
    return [m.b, m.a];
}
function one() {
    var coords = [0, 0];
    coords[COORD_SCALAR] = 1;
    coords[COORD_PSEUDO] = 0;
    return coords;
}
var abs = Math.abs;
var atan2 = Math.atan2;
var log = Math.log;
var cos = Math.cos;
var sin = Math.sin;
var sqrt = Math.sqrt;
/**
 *
 */
var Spinor2 = (function () {
    /**
     *
     */
    function Spinor2(coords, modified) {
        if (coords === void 0) { coords = one(); }
        if (modified === void 0) { modified = false; }
        this.coords_ = coords;
        this.modified_ = modified;
    }
    Object.defineProperty(Spinor2.prototype, "length", {
        get: function () {
            return 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Spinor2.prototype, "modified", {
        get: function () {
            return this.modified_;
        },
        set: function (modified) {
            if (this.isLocked()) {
                throw new Lockable_1.TargetLockedError('set modified');
            }
            this.modified_ = modified;
        },
        enumerable: true,
        configurable: true
    });
    Spinor2.prototype.getComponent = function (i) {
        return this.coords_[i];
    };
    Object.defineProperty(Spinor2.prototype, "xy", {
        /**
         * The bivector part of this spinor as a number.
         */
        get: function () {
            return this.coords_[COORD_PSEUDO];
        },
        set: function (xy) {
            if (this.isLocked()) {
                throw new Lockable_1.TargetLockedError('xy');
            }
            mustBeNumber_1.mustBeNumber('xy', xy);
            var coords = this.coords_;
            this.modified_ = this.modified_ || coords[COORD_PSEUDO] !== xy;
            coords[COORD_PSEUDO] = xy;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Spinor2.prototype, "a", {
        /**
         * The scalar part of this spinor as a number.
         */
        get: function () {
            return this.coords_[COORD_SCALAR];
        },
        set: function (α) {
            if (this.isLocked()) {
                throw new Lockable_1.TargetLockedError('a');
            }
            mustBeNumber_1.mustBeNumber('α', α);
            var coords = this.coords_;
            this.modified_ = this.modified_ || coords[COORD_SCALAR] !== α;
            coords[COORD_SCALAR] = α;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Spinor2.prototype, "b", {
        /**
         * The pseudoscalar part of this spinor as a number.
         */
        get: function () {
            return this.coords_[COORD_PSEUDO];
        },
        set: function (b) {
            if (this.isLocked()) {
                throw new Lockable_1.TargetLockedError('b');
            }
            mustBeNumber_1.mustBeNumber('b', b);
            var coords = this.coords_;
            this.modified_ = this.modified_ || coords[COORD_PSEUDO] !== b;
            coords[COORD_PSEUDO] = b;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     * <code>this ⟼ this + α * spinor</code>
     *
     * @param spinor
     * @param α
     * @return this
     */
    Spinor2.prototype.add = function (spinor, α) {
        if (α === void 0) { α = 1; }
        mustBeObject_1.mustBeObject('spinor', spinor);
        mustBeNumber_1.mustBeNumber('α', α);
        this.xy += spinor.b * α;
        this.a += spinor.a * α;
        return this;
    };
    /**
     *
     * this ⟼ a + b
     *
     * @param a
     * @param b
     * @return this
     */
    Spinor2.prototype.add2 = function (a, b) {
        this.a = a.a + b.a;
        this.xy = a.b + b.b;
        return this;
    };
    /**
     * Intentionally undocumented.
     */
    Spinor2.prototype.addPseudo = function (β) {
        mustBeNumber_1.mustBeNumber('β', β);
        return this;
    };
    /**
     * this ⟼ this + α
     *
     * @param α
     * @return this
     */
    Spinor2.prototype.addScalar = function (α) {
        mustBeNumber_1.mustBeNumber('α', α);
        this.a += α;
        return this;
    };
    /**
     * arg(A) = grade(log(A), 2)
     */
    Spinor2.prototype.arg = function () {
        return this.log().grade(2);
    };
    /**
     *
     */
    Spinor2.prototype.approx = function (n) {
        approx_1.approx(this.coords_, n);
        return this;
    };
    /**
     * @return A copy of this
     */
    Spinor2.prototype.clone = function () {
        var spinor = Spinor2.copy(this);
        spinor.modified_ = this.modified_;
        return spinor;
    };
    /**
     * The Clifford conjugate.
     * The multiplier for the grade x is (-1) raised to the power x * (x + 1) / 2
     * The pattern of grades is +--++--+
     *
     * @returns conj(this)
     */
    Spinor2.prototype.conj = function () {
        this.xy = -this.xy;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ copy(spinor)</code>
     * </p>
     * @method copy
     * @param spinor {SpinorE2}
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    Spinor2.prototype.copy = function (spinor) {
        mustBeObject_1.mustBeObject('spinor', spinor);
        this.xy = mustBeNumber_1.mustBeNumber('spinor.b', spinor.b);
        this.a = mustBeNumber_1.mustBeNumber('spinor.a', spinor.a);
        return this;
    };
    /**
     * Sets this spinor to the value of the scalar, <code>α</code>.
     * @method copyScalar
     * @param α {number} The scalar to be copied.
     * @return {Spinor2}
     * @chainable
     */
    Spinor2.prototype.copyScalar = function (α) {
        return this.zero().addScalar(α);
    };
    /**
     * Intentionally undocumented.
     */
    Spinor2.prototype.copySpinor = function (spinor) {
        return this.copy(spinor);
    };
    /**
     * Intentionally undocumented.
     */
    Spinor2.prototype.copyVector = function (vector) {
        // The spinor has no vector components.
        return this.zero();
    };
    Spinor2.prototype.cos = function () {
        throw new Error("Spinor2.cos");
    };
    Spinor2.prototype.cosh = function () {
        throw new Error("Spinor2.cosh");
    };
    /**
     * <p>
     * <code>this ⟼ this / s</code>
     * </p>
     * @method div
     * @param s {SpinorE2}
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    Spinor2.prototype.div = function (s) {
        return this.div2(this, s);
    };
    /**
     * <p>
     * <code>this ⟼ a / b</code>
     * </p>
     * @method div2
     * @param a {SpinorE2}
     * @param b {SpinorE2}
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    Spinor2.prototype.div2 = function (a, b) {
        var a0 = a.a;
        var a1 = a.b;
        var b0 = b.a;
        var b1 = b.b;
        var quadB = quadSpinorE2_1.quadSpinorE2(b);
        this.a = (a0 * b0 + a1 * b1) / quadB;
        this.xy = (a1 * b0 - a0 * b1) / quadB;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ this / α</code>
     * </p>
     * @method divByScalar
     * @param α {number}
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    Spinor2.prototype.divByScalar = function (α) {
        this.xy /= α;
        this.a /= α;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ e<sup>this</sup></code>
     * </p>
     *
     * @method exp
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    Spinor2.prototype.exp = function () {
        var α = this.a;
        var β = this.b;
        var expA = Math.exp(α);
        // φ is actually the absolute value of one half the rotation angle.
        // The orientation of the rotation gets carried in the bivector components.
        // FIXME: DRY
        var φ = sqrt(β * β);
        var s = expA * (φ !== 0 ? sin(φ) / φ : 1);
        this.a = expA * cos(φ);
        this.b = β * s;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ conj(this) / quad(this)</code>
     * </p>
     * @method inv
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    Spinor2.prototype.inv = function () {
        this.conj();
        this.divByScalar(this.quaditude());
        return this;
    };
    /**
     * @method isOne
     * @return {boolean}
     */
    Spinor2.prototype.isOne = function () {
        return this.a === 1 && this.b === 0;
    };
    /**
     * @method isZero
     * @return {boolean}
     */
    Spinor2.prototype.isZero = function () {
        return this.a === 0 && this.b === 0;
    };
    Spinor2.prototype.lco = function (rhs) {
        return this.lco2(this, rhs);
    };
    Spinor2.prototype.lco2 = function (a, b) {
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
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    Spinor2.prototype.lerp = function (target, α) {
        var Vector2 = Spinor2.copy(target);
        var Vector1 = this.clone();
        var R = Vector2.mul(Vector1.inv());
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
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    Spinor2.prototype.lerp2 = function (a, b, α) {
        this.sub2(b, a).scale(α).add(a);
        return this;
    };
    /**
     * this ⟼ log(this)
     *
     * @returns log(this)
     */
    Spinor2.prototype.log = function () {
        if (this.isLocked()) {
            return Lockable_1.lock(this.clone().log());
        }
        else {
            // FIXME: This is wrong see Geometric2.
            var w = this.a;
            var z = this.xy;
            // FIXME: DRY
            var bb = z * z;
            var Vector2 = sqrt(bb);
            var R0 = abs(w);
            var R = sqrt(w * w + bb);
            this.a = log(R);
            var f = atan2(Vector2, R0) / Vector2;
            this.xy = z * f;
            return this;
        }
    };
    /**
     * <p>
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     * </p>
     * <p>
     * This method does not change this spinor.
     * </p>
     *
     * @method magnitude
     * @return {number}
     */
    Spinor2.prototype.magnitude = function () {
        return sqrt(this.quaditude());
    };
    /**
     * <p>
     * <code>this ⟼ this * s</code>
     * </p>
     * @method mul
     * @param s {SpinorE2}
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    Spinor2.prototype.mul = function (s) {
        return this.mul2(this, s);
    };
    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     * @method mul2
     * @param a {SpinorE2}
     * @param b {SpinorE2}
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    Spinor2.prototype.mul2 = function (a, b) {
        var a0 = a.a;
        var a1 = a.b;
        var b0 = b.a;
        var b1 = b.b;
        this.a = a0 * b0 - a1 * b1;
        this.xy = a0 * b1 + a1 * b0;
        return this;
    };
    /**
     * @method neg
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    Spinor2.prototype.neg = function () {
        this.a = -this.a;
        this.xy = -this.xy;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ sqrt(this * conj(this))</code>
     * </p>
     * @method norm
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    Spinor2.prototype.norm = function () {
        var norm = this.magnitude();
        return this.zero().addScalar(norm);
    };
    /**
     * <p>
     * <code>this ⟼ this / magnitude(this)</code>
     * </p>
     * @method normalize
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    Spinor2.prototype.normalize = function () {
        var modulus = this.magnitude();
        this.xy = this.xy / modulus;
        this.a = this.a / modulus;
        return this;
    };
    /**
     * Sets this spinor to the identity element for multiplication, <b>1</b>.
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    Spinor2.prototype.one = function () {
        this.a = 1;
        this.xy = 0;
        return this;
    };
    Spinor2.prototype.pow = function () {
        throw new Error("Spinor2.pow");
    };
    /**
     * @returns The square of the magnitude.
     */
    Spinor2.prototype.quaditude = function () {
        return quadSpinorE2_1.quadSpinorE2(this);
    };
    Spinor2.prototype.sin = function () {
        throw new Error("Spinor2.sin");
    };
    Spinor2.prototype.sinh = function () {
        throw new Error("Spinor2.sinh");
    };
    /**
     * <p>
     * <code>this ⟼ this * conj(this)</code>
     * </p>
     * @method quad
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    Spinor2.prototype.squaredNorm = function () {
        var squaredNorm = this.quaditude();
        return this.zero().addScalar(squaredNorm);
    };
    Spinor2.prototype.rco = function (rhs) {
        return this.rco2(this, rhs);
    };
    Spinor2.prototype.rco2 = function (a, b) {
        // FIXME: How to leverage? Maybe break up? Don't want performance hit.
        // scpG2(a, b, this)
        return this;
    };
    /**
     * <p>
     * <code>this = (w, B) ⟼ (w, -B)</code>
     * </p>
     * @method reverse
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    Spinor2.prototype.rev = function () {
        this.xy *= -1;
        return this;
    };
    /**
     * Sets this Spinor to the value of its reflection in the plane orthogonal to n.
     * The geometric formula for bivector reflection is B' = n * B * n.
     */
    Spinor2.prototype.reflect = function (n) {
        var w = this.a;
        var β = this.xy;
        var nx = n.x;
        var ny = n.y;
        var nn = nx * nx + ny * ny;
        this.a = nn * w;
        this.xy = -nn * β;
        return this;
    };
    /**
     * <p>
     * <code>this = ⟼ rotor * this * rev(rotor)</code>
     * </p>
     * @method rotate
     * @param rotor {SpinorE2}
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    Spinor2.prototype.rotate = function (rotor) {
        console.warn("Spinor2.rotate is not implemented");
        return this;
    };
    /**
     * <p>
     * Sets this multivector to a rotation from vector <code>a</code> to vector <code>b</code>.
     * </p>
     * @method rotorFromDirections
     * @param a {VectorE2} The <em>from</em> vector.
     * @param b {VectorE2} The <em>to</em> vector.
     * @return {Spinor2} <code>this</code> The rotor representing a rotation from a to b.
     * @chainable
     */
    Spinor2.prototype.rotorFromDirections = function (a, b) {
        rotorFromDirectionsE2_1.rotorFromDirectionsE2(a, b, this);
        return this;
    };
    /**
     *
     * <code>this = ⟼ exp(- B * θ / 2)</code>
     *
     * @param B
     * @param θ
     * @returns <code>this</code>
     */
    Spinor2.prototype.rotorFromGeneratorAngle = function (B, θ) {
        var φ = θ / 2;
        var s = sin(φ);
        this.xy = -B.b * s;
        this.a = cos(φ);
        return this;
    };
    Spinor2.prototype.rotorFromVectorToVector = function (a, b) {
        rotorFromDirectionsE2_1.rotorFromDirectionsE2(a, b, this);
        return this;
    };
    Spinor2.prototype.scp = function (rhs) {
        return this.scp2(this, rhs);
    };
    Spinor2.prototype.scp2 = function (a, b) {
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
     * @return {Spinor2} <code>this</code>
     */
    Spinor2.prototype.scale = function (α) {
        mustBeNumber_1.mustBeNumber('α', α);
        this.xy *= α;
        this.a *= α;
        return this;
    };
    Spinor2.prototype.stress = function (σ) {
        throw new Error(notSupported_1.notSupported('stress').message);
    };
    /**
     * <p>
     * <code>this ⟼ this - s * α</code>
     * </p>
     * @method sub
     * @param s {SpinorE2}
     * @param [α = 1] {number}
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    Spinor2.prototype.sub = function (s, α) {
        if (α === void 0) { α = 1; }
        mustBeObject_1.mustBeObject('s', s);
        mustBeNumber_1.mustBeNumber('α', α);
        this.xy -= s.b * α;
        this.a -= s.a * α;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ a - b</code>
     * </p>
     * @method sub2
     * @param a {SpinorE2}
     * @param b {SpinorE2}
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    Spinor2.prototype.sub2 = function (a, b) {
        this.xy = a.b - b.b;
        this.a = a.a - b.a;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     * Sets this Spinor2 to the geometric product a * b of the vector arguments.
     *
     * @method versor
     * @param a {VectorE2}
     * @param b {VectorE2}
     * @return {Spinor2}
     */
    Spinor2.prototype.versor = function (a, b) {
        var ax = a.x;
        var ay = a.y;
        var bx = b.x;
        var by = b.y;
        this.a = dotVectorCartesianE2_1.dotVectorCartesianE2(ax, ay, bx, by);
        // TODO: Optimize because we aren't using z.
        this.xy = wedgeXY_1.wedgeXY(ax, ay, 0, bx, by, 0);
        return this;
    };
    Spinor2.prototype.grade = function (i) {
        if (this.isLocked()) {
            return Lockable_1.lock(this.clone().grade(i));
        }
        mustBeInteger_1.mustBeInteger('i', i);
        switch (i) {
            case 0: {
                this.xy = 0;
                break;
            }
            case 2: {
                this.a = 0;
                break;
            }
            default: {
                this.a = 0;
                this.xy = 0;
            }
        }
        return this;
    };
    /**
     *
     */
    Spinor2.prototype.toArray = function () {
        return coordinates(this);
    };
    Spinor2.prototype.toExponential = function (fractionDigits) {
        // FIXME: Do like others.
        return this.toString();
    };
    Spinor2.prototype.toFixed = function (fractionDigits) {
        // FIXME: Do like others.
        return this.toString();
    };
    Spinor2.prototype.toPrecision = function (precision) {
        // FIXME: Do like others.
        return this.toString();
    };
    /**
     * @method toString
     * @return {string} A non-normative string representation of the target.
     */
    Spinor2.prototype.toString = function (radix) {
        return "Spinor2({β: " + this.xy + ", w: " + this.a + "})";
    };
    Spinor2.prototype.ext = function (rhs) {
        return this.ext2(this, rhs);
    };
    Spinor2.prototype.ext2 = function (a, b) {
        // FIXME: How to leverage? Maybe break up? Don't want performance hit.
        // scpG2(a, b, this)
        return this;
    };
    /**
     * Sets this spinor to the identity element for addition, 0
     */
    Spinor2.prototype.zero = function () {
        this.a = 0;
        this.xy = 0;
        return this;
    };
    Spinor2.copy = function (spinor) {
        return new Spinor2().copy(spinor);
    };
    Spinor2.fromBivector = function (B) {
        return new Spinor2().zero().addPseudo(B.b);
    };
    /**
     * a + α * (b - a)
     */
    Spinor2.lerp = function (a, b, α) {
        return Spinor2.copy(a).lerp(b, α);
    };
    /**
     *
     */
    Spinor2.one = function () {
        return Spinor2.zero().addScalar(1);
    };
    /**
     * Computes the rotor that rotates vector a to vector b.
     */
    Spinor2.rotorFromDirections = function (a, b) {
        return new Spinor2().rotorFromDirections(a, b);
    };
    /**
     *
     */
    Spinor2.zero = function () {
        return new Spinor2([0, 0], false);
    };
    return Spinor2;
}());
exports.Spinor2 = Spinor2;
applyMixins_1.applyMixins(Spinor2, [Lockable_1.LockableMixin]);
