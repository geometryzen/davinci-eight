import { mustBeInteger } from '../checks/mustBeInteger';
import { mustBeNumber } from '../checks/mustBeNumber';
import { mustBeObject } from '../checks/mustBeObject';
import { lock, LockableMixin as Lockable, TargetLockedError } from '../core/Lockable';
import { readOnly } from '../i18n/readOnly';
import { applyMixins } from '../utils/applyMixins';
import { approx } from './approx';
import { dotVectorCartesianE3 } from './dotVectorCartesianE3';
import { mulSpinorE3alpha } from './mulSpinorE3alpha';
import { mulSpinorE3XY } from './mulSpinorE3XY';
import { mulSpinorE3YZ } from './mulSpinorE3YZ';
import { mulSpinorE3ZX } from './mulSpinorE3ZX';
import { quadSpinorE3 as quadSpinor } from './quadSpinorE3';
import { randomRange } from './randomRange';
import { rotorFromDirectionsE3 as rotorFromDirections } from './rotorFromDirectionsE3';
import { toStringCustom } from './toStringCustom';
import { wedgeXY } from './wedgeXY';
import { wedgeYZ } from './wedgeYZ';
import { wedgeZX } from './wedgeZX';
// Constants for the coordinate indices into the coords array.
/**
 * @hidden
 */
var COORD_YZ = 0;
/**
 * @hidden
 */
var COORD_ZX = 1;
/**
 * @hidden
 */
var COORD_XY = 2;
/**
 * @hidden
 */
var COORD_SCALAR = 3;
/**
 * @hidden
 */
var BASIS_LABELS = ['e23', 'e31', 'e12', '1'];
/**
 * Coordinates corresponding to basis labels.
 * @hidden
 */
function coordinates(m) {
    return [m.yz, m.zx, m.xy, m.a];
}
/**
 * @hidden
 */
var exp = Math.exp;
/**
 * @hidden
 */
var cos = Math.cos;
/**
 * @hidden
 */
var sin = Math.sin;
/**
 * @hidden
 */
var sqrt = Math.sqrt;
/**
 * @hidden
 */
var magicCode = Math.random();
/**
 * A Geometric Number representing the even sub-algebra of G3.
 */
var Spinor3 = /** @class */ (function () {
    /**
     * Initializes the spinor from the specified coordinates.
     * The spinor is not locked.
     * The spinor is not modified.
     * @param coords [yz, zx, xy, a]
     * @param code
     */
    function Spinor3(coords, code) {
        if (code !== magicCode) {
            throw new Error("Use the static creation methods instead of the constructor");
        }
        this.coords_ = coords;
        this.modified_ = false;
    }
    Object.defineProperty(Spinor3.prototype, "modified", {
        get: function () {
            return this.modified_;
        },
        set: function (modified) {
            if (this.isLocked()) {
                throw new TargetLockedError('set modified');
            }
            this.modified_ = modified;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Spinor3.prototype, "yz", {
        /**
         * The coordinate corresponding to the <b>e</b><sub>23</sub> basis bivector.
         */
        get: function () {
            return this.coords_[COORD_YZ];
        },
        set: function (yz) {
            if (this.isLocked()) {
                throw new TargetLockedError('set yz');
            }
            mustBeNumber('yz', yz);
            var coords = this.coords_;
            this.modified_ = this.modified_ || coords[COORD_YZ] !== yz;
            coords[COORD_YZ] = yz;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Spinor3.prototype, "zx", {
        /**
         * The coordinate corresponding to the <b>e</b><sub>31</sub> basis bivector.
         */
        get: function () {
            return this.coords_[COORD_ZX];
        },
        set: function (zx) {
            if (this.isLocked()) {
                throw new TargetLockedError('zx');
            }
            mustBeNumber('zx', zx);
            var coords = this.coords_;
            this.modified_ = this.modified_ || coords[COORD_ZX] !== zx;
            coords[COORD_ZX] = zx;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Spinor3.prototype, "xy", {
        /**
         * The coordinate corresponding to the <b>e</b><sub>12</sub> basis bivector.
         */
        get: function () {
            return this.coords_[COORD_XY];
        },
        set: function (xy) {
            if (this.isLocked()) {
                throw new TargetLockedError('xy');
            }
            mustBeNumber('xy', xy);
            var coords = this.coords_;
            this.modified_ = this.modified_ || coords[COORD_XY] !== xy;
            coords[COORD_XY] = xy;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Spinor3.prototype, "a", {
        /**
         * The coordinate corresponding to the <b>1</b> basis scalar.
         */
        get: function () {
            return this.coords_[COORD_SCALAR];
        },
        set: function (α) {
            if (this.isLocked()) {
                throw new TargetLockedError('a');
            }
            mustBeNumber('α', α);
            var coords = this.coords_;
            this.modified_ = this.modified_ || coords[COORD_SCALAR] !== α;
            coords[COORD_SCALAR] = α;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Spinor3.prototype, "length", {
        get: function () {
            return 4;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Spinor3.prototype, "maskG3", {
        /**
         *
         */
        get: function () {
            var coords = this.coords_;
            var α = coords[COORD_SCALAR];
            var yz = coords[COORD_YZ];
            var zx = coords[COORD_ZX];
            var xy = coords[COORD_XY];
            var m = 0x0;
            if (α !== 0) {
                m += 0x1;
            }
            if (yz !== 0 || zx !== 0 || xy !== 0) {
                m += 0x4;
            }
            return m;
        },
        set: function (unused) {
            throw new Error(readOnly('maskG3').message);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * <p>
     * <code>this ⟼ this + α * spinor</code>
     * </p>
     * @param spinor
     * @param α
     * @returns this + α * spinor
     */
    Spinor3.prototype.add = function (spinor, α) {
        if (α === void 0) { α = 1; }
        mustBeObject('spinor', spinor);
        mustBeNumber('α', α);
        this.yz += spinor.yz * α;
        this.zx += spinor.zx * α;
        this.xy += spinor.xy * α;
        this.a += spinor.a * α;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ a + b</code>
     * </p>
     *
     * @param a
     * @param b
     * @returns a + b
     */
    Spinor3.prototype.add2 = function (a, b) {
        this.a = a.a + b.a;
        this.yz = a.yz + b.yz;
        this.zx = a.zx + b.zx;
        this.xy = a.xy + b.xy;
        return this;
    };
    /**
     * Intentionally undocumented.
     * @return this + I * β
     */
    Spinor3.prototype.addPseudo = function (β) {
        mustBeNumber('β', β);
        return this;
    };
    /**
     * this ⟼ this + α
     *
     * @param α
     * @returns this + α
     */
    Spinor3.prototype.addScalar = function (α) {
        mustBeNumber('α', α);
        this.a += α;
        return this;
    };
    /**
     * arg(A) = grade(log(A), 2)
     *
     * @returns arg(this)
     */
    Spinor3.prototype.arg = function () {
        if (this.isLocked()) {
            return lock(this.clone().arg());
        }
        else {
            return this.log().grade(2);
        }
    };
    /**
     *
     */
    Spinor3.prototype.approx = function (n) {
        approx(this.coords_, n);
        return this;
    };
    /**
     * Returns an unlocked (mutable) copy of `this`.
     */
    Spinor3.prototype.clone = function () {
        return Spinor3.spinor(this.yz, this.zx, this.xy, this.a);
    };
    /**
     * The Clifford conjugate.
     * The multiplier for the grade x is (-1) raised to the power x * (x + 1) / 2
     * The pattern of grades is +--++--+
     *
     * @returns conj(this)
     */
    Spinor3.prototype.conj = function () {
        this.yz = -this.yz;
        this.zx = -this.zx;
        this.xy = -this.xy;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ copy(source)</code>
     * </p>
     *
     * @method copy
     * @param source {SpinorE3}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    Spinor3.prototype.copy = function (source) {
        if (source) {
            this.yz = source.yz;
            this.zx = source.zx;
            this.xy = source.xy;
            this.a = source.a;
            return this;
        }
        else {
            throw new Error("source for copy must be a spinor");
        }
    };
    Spinor3.prototype.copyCoordinates = function (coordinates) {
        // Copy using the setters so that the modified flag is updated.
        this.yz = coordinates[COORD_YZ];
        this.zx = coordinates[COORD_ZX];
        this.xy = coordinates[COORD_XY];
        this.a = coordinates[COORD_SCALAR];
        return this;
    };
    /**
     * Sets this spinor to the value of the scalar, <code>α</code>.
     *
     * @method copyScalar
     * @param α {number} The scalar to be copied.
     * @return {Spinor3}
     * @chainable
     */
    Spinor3.prototype.copyScalar = function (α) {
        return this.zero().addScalar(α);
    };
    /**
     * Intentionally undocumented.
     */
    Spinor3.prototype.copySpinor = function (s) {
        return this.copy(s);
    };
    /**
     * Intentionally undocumented.
     */
    Spinor3.prototype.copyVector = function (vector) {
        return this.zero();
    };
    /**
     * <p>
     * <code>this ⟼ this / s</code>
     * </p>
     *
     * @method div
     * @param s {SpinorE3}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    Spinor3.prototype.div = function (s) {
        return this.div2(this, s);
    };
    /**
     * <p>
     * <code>this ⟼ a / b</code>
     * </p>
     *
     * @method div2
     * @param a {SpinorE3}
     * @param b {SpinorE3}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    Spinor3.prototype.div2 = function (a, b) {
        var a0 = a.a;
        var a1 = a.yz;
        var a2 = a.zx;
        var a3 = a.xy;
        var b0 = b.a;
        var b1 = b.yz;
        var b2 = b.zx;
        var b3 = b.xy;
        // Compare this to the product for Quaternions
        // How does this compare to Geometric3
        // It would be interesting to DRY this out.
        this.a = a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3;
        this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
        this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
        this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ this / α</code>
     * </p>
     *
     * @method divByScalar
     * @param α {number}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    Spinor3.prototype.divByScalar = function (α) {
        this.yz /= α;
        this.zx /= α;
        this.xy /= α;
        this.a /= α;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ dual(v) = I * v</code>
     * </p>
     *
     * @method dual
     * @param v {VectorE3} The vector whose dual will be used to set this spinor.
     * @param changeSign {boolean}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    Spinor3.prototype.dual = function (v, changeSign) {
        this.a = 0;
        this.yz = v.x;
        this.zx = v.y;
        this.xy = v.z;
        if (changeSign) {
            this.neg();
        }
        return this;
    };
    Spinor3.prototype.equals = function (other) {
        if (other instanceof Spinor3) {
            var that = other;
            return this.yz === that.yz && this.zx === that.zx && this.xy === that.xy && this.a === that.a;
        }
        else {
            return false;
        }
    };
    /**
     * <code>this ⟼ e<sup>this</sup></code>
     *
     * @returns exp(this)
     */
    Spinor3.prototype.exp = function () {
        var w = this.a;
        var x = this.yz;
        var y = this.zx;
        var z = this.xy;
        var expW = exp(w);
        // φ is actually the absolute value of one half the rotation angle.
        // The orientation of the rotation gets carried in the bivector components.
        // FIXME: DRY
        var φ = sqrt(x * x + y * y + z * z);
        var s = expW * (φ !== 0 ? sin(φ) / φ : 1);
        this.a = expW * cos(φ);
        this.yz = x * s;
        this.zx = y * s;
        this.xy = z * s;
        return this;
    };
    Spinor3.prototype.getComponent = function (index) {
        return this.coords_[index];
    };
    /**
     * <p>
     * <code>this ⟼ conj(this) / quad(this)</code>
     * </p>
     *
     * @method inv
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    Spinor3.prototype.inv = function () {
        this.conj();
        this.divByScalar(this.squaredNormSansUnits());
        return this;
    };
    /**
     * @method isOne
     * @return {boolean}
     */
    Spinor3.prototype.isOne = function () {
        return this.a === 1 && this.xy === 0 && this.yz === 0 && this.zx === 0;
    };
    /**
     * @method isZero
     * @return {boolean}
     */
    Spinor3.prototype.isZero = function () {
        return this.a === 0 && this.xy === 0 && this.yz === 0 && this.zx === 0;
    };
    /**
     * @method lco
     * @param rhs {Spinor3}
     * @return {Spinor3}
     * @chainable
     */
    Spinor3.prototype.lco = function (rhs) {
        return this.lco2(this, rhs);
    };
    /**
     *
     */
    Spinor3.prototype.lco2 = function (a, b) {
        // FIXME: How to leverage? Maybe break up? Don't want performance hit.
        // scpG3(a, b, this)
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ this + α * (target - this)</code>
     * </p>
     *
     * @method lerp
     * @param target {SpinorE3}
     * @param α {number}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    Spinor3.prototype.lerp = function (target, α) {
        var Vector2 = Spinor3.copy(target);
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
     *
     * @method lerp2
     * @param a {SpinorE3}
     * @param b {SpinorE3}
     * @param α {number}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    Spinor3.prototype.lerp2 = function (a, b, α) {
        this.sub2(b, a).scale(α).add(a);
        return this;
    };
    /**
     * this ⟼ log(this)
     */
    Spinor3.prototype.log = function () {
        // FIXME: Wrong
        var w = this.a;
        var x = this.yz;
        var y = this.zx;
        var z = this.xy;
        // FIXME: DRY
        var bb = x * x + y * y + z * z;
        var Vector2 = sqrt(bb);
        var R0 = Math.abs(w);
        var R = sqrt(w * w + bb);
        this.a = Math.log(R);
        var θ = Math.atan2(Vector2, R0) / Vector2;
        // The angle, θ, produced by atan2 will be in the range [-π, +π]
        this.yz = x * θ;
        this.zx = y * θ;
        this.xy = z * θ;
        return this;
    };
    /**
     * <p>
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     * </p>
     * <p>
     * This method does not change this multivector.
     * </p>
     *
     * @method magnitude
     * @return {number}
     */
    Spinor3.prototype.magnitude = function () {
        return sqrt(this.squaredNormSansUnits());
    };
    /**
     * Intentionally undocumented.
     */
    Spinor3.prototype.magnitudeSansUnits = function () {
        return sqrt(this.squaredNormSansUnits());
    };
    /**
     * <p>
     * <code>this ⟼ this * rhs</code>
     * </p>
     *
     * @method mul
     * @param rhs {SpinorE3}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    Spinor3.prototype.mul = function (rhs) {
        var α = mulSpinorE3alpha(this, rhs);
        var yz = mulSpinorE3YZ(this, rhs);
        var zx = mulSpinorE3ZX(this, rhs);
        var xy = mulSpinorE3XY(this, rhs);
        this.a = α;
        this.yz = yz;
        this.zx = zx;
        this.xy = xy;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     *
     * @method mul2
     * @param a {SpinorE3}
     * @param b {SpinorE3}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    Spinor3.prototype.mul2 = function (a, b) {
        var α = mulSpinorE3alpha(a, b);
        var yz = mulSpinorE3YZ(a, b);
        var zx = mulSpinorE3ZX(a, b);
        var xy = mulSpinorE3XY(a, b);
        this.a = α;
        this.yz = yz;
        this.zx = zx;
        this.xy = xy;
        return this;
    };
    /**
     * @method neg
     *
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    Spinor3.prototype.neg = function () {
        this.a = -this.a;
        this.yz = -this.yz;
        this.zx = -this.zx;
        this.xy = -this.xy;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ sqrt(this * conj(this))</code>
     * </p>
     *
     * @method norm
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    Spinor3.prototype.norm = function () {
        var norm = this.magnitudeSansUnits();
        return this.zero().addScalar(norm);
    };
    /**
     * <p>
     * <code>this ⟼ this / magnitude(this)</code>
     * </p>
     *
     * @method normalize
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    Spinor3.prototype.normalize = function () {
        var m = this.magnitude();
        this.yz = this.yz / m;
        this.zx = this.zx / m;
        this.xy = this.xy / m;
        this.a = this.a / m;
        return this;
    };
    /**
     * Sets this spinor to the identity element for multiplication, <b>1</b>.
     *
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    Spinor3.prototype.one = function () {
        this.a = 1;
        this.yz = 0;
        this.zx = 0;
        this.xy = 0;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ this * conj(this)</code>
     * </p>
     *
     * @method quad
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    Spinor3.prototype.quad = function () {
        var squaredNorm = this.squaredNormSansUnits();
        return this.zero().addScalar(squaredNorm);
    };
    /**
     * <p>
     * This method does not change this multivector.
     * </p>
     *
     * @method squaredNorm
     * @return {number}
     */
    Spinor3.prototype.squaredNorm = function () {
        return quadSpinor(this);
    };
    /**
     * Intentionally undocumented.
     */
    Spinor3.prototype.squaredNormSansUnits = function () {
        return quadSpinor(this);
    };
    /**
     * @method stress
     * @param σ {VectorE3}
     * @return {Spinor3}
     * @chainable
     */
    Spinor3.prototype.stress = function (σ) {
        // There is no change to the scalar coordinate, α.
        this.yz = this.yz * σ.y * σ.z;
        this.zx = this.zx * σ.z * σ.x;
        this.xy = this.xy * σ.x * σ.y;
        return this;
    };
    Spinor3.prototype.rco = function (rhs) {
        return this.rco2(this, rhs);
    };
    Spinor3.prototype.rco2 = function (a, b) {
        // FIXME: How to leverage? Maybe break up? Don't want performance hit.
        // scpG3(a, b, this)
        return this;
    };
    /**
     * <p>
     * <code>this = (w, B) ⟼ (w, -B)</code>
     * </p>
     *
     * @method rev
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    Spinor3.prototype.rev = function () {
        this.yz *= -1;
        this.zx *= -1;
        this.xy *= -1;
        return this;
    };
    /**
     * Sets this Spinor to the value of its reflection in the plane orthogonal to n.
     * The geometric formula for bivector reflection is B' = n * B * n.
     *
     * @method reflect
     * @param n {VectorE3}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    Spinor3.prototype.reflect = function (n) {
        var w = this.a;
        var yz = this.yz;
        var zx = this.zx;
        var xy = this.xy;
        var nx = n.x;
        var ny = n.y;
        var nz = n.z;
        var nn = nx * nx + ny * ny + nz * nz;
        var nB = nx * yz + ny * zx + nz * xy;
        this.a = nn * w;
        this.xy = 2 * nz * nB - nn * xy;
        this.yz = 2 * nx * nB - nn * yz;
        this.zx = 2 * ny * nB - nn * zx;
        return this;
    };
    /**
     * <p>
     * <code>this = ⟼ R * this * rev(R)</code>
     * </p>
     *
     * @method rotate
     * @param R {SpinorE3}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    Spinor3.prototype.rotate = function (R) {
        // R * this * rev(R) = R * rev(R * rev(this));
        this.rev();
        this.mul2(R, this);
        this.rev();
        this.mul2(R, this);
        return this;
    };
    /**
     * <p>
     * Computes a rotor, R, from two vectors, where
     * R = (abs(b) * abs(a) + b * a) / sqrt(2 * (quad(b) * quad(a) + abs(b) * abs(a) * b << a))
     * </p>
     *
     * @method rotorFromDirections
     * @param a {VectorE3} The <em>from</em> vector.
     * @param b {VectorE3} The <em>to</em> vector.
     * @return {Spinor3} <code>this</code> The rotor representing a rotation from a to b.
     * @chainable
     */
    Spinor3.prototype.rotorFromDirections = function (a, b) {
        return this.rotorFromVectorToVector(a, b, void 0);
    };
    /**
     * <p>
     * <code>this = ⟼ exp(- B * θ / 2)</code>
     * </p>
     *
     * @param B The unit bivector that generates the rotation.
     * @param θ The rotation angle in radians.
     */
    Spinor3.prototype.rotorFromGeneratorAngle = function (B, θ) {
        var φ = θ / 2;
        var s = sin(φ);
        this.yz = -B.yz * s;
        this.zx = -B.zx * s;
        this.xy = -B.xy * s;
        this.a = cos(φ);
        return this;
    };
    Spinor3.prototype.rotorFromVectorToVector = function (a, b, B) {
        rotorFromDirections(a, b, B, this);
        return this;
    };
    Spinor3.prototype.scp = function (rhs) {
        return this.scp2(this, rhs);
    };
    Spinor3.prototype.scp2 = function (a, b) {
        // FIXME: How to leverage? Maybe break up? Don't want performance hit.
        // scpG3(a, b, this)
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ this * α</code>
     * </p>
     *
     * @method scale
     * @param α {number}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    Spinor3.prototype.scale = function (α) {
        mustBeNumber('α', α);
        this.yz *= α;
        this.zx *= α;
        this.xy *= α;
        this.a *= α;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ this - s * α</code>
     * </p>
     *
     * @method sub
     * @param s {SpinorE3}
     * @param [α = 1] {number}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    Spinor3.prototype.sub = function (s, α) {
        if (α === void 0) { α = 1; }
        mustBeObject('s', s);
        mustBeNumber('α', α);
        this.yz -= s.yz * α;
        this.zx -= s.zx * α;
        this.xy -= s.xy * α;
        this.a -= s.a * α;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ a - b</code>
     * </p>
     *
     * @method sub2
     * @param a {SpinorE3}
     * @param b {SpinorE3}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    Spinor3.prototype.sub2 = function (a, b) {
        this.yz = a.yz - b.yz;
        this.zx = a.zx - b.zx;
        this.xy = a.xy - b.xy;
        this.a = a.a - b.a;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     *
     * Sets this Spinor3 to the geometric product, a * b, of the vector arguments.
     *
     * @param a
     * @param b
     */
    Spinor3.prototype.versor = function (a, b) {
        var ax = a.x;
        var ay = a.y;
        var az = a.z;
        var bx = b.x;
        var by = b.y;
        var bz = b.z;
        this.a = dotVectorCartesianE3(ax, ay, az, bx, by, bz);
        this.yz = wedgeYZ(ax, ay, az, bx, by, bz);
        this.zx = wedgeZX(ax, ay, az, bx, by, bz);
        this.xy = wedgeXY(ax, ay, az, bx, by, bz);
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ a ^ b</code>
     * </p>
     *
     * Sets this Spinor3 to the exterior product, a ^ b, of the vector arguments.
     *
     * @method wedge
     * @param a {VectorE3}
     * @param b {VectorE3}
     * @return {Spinor3}
     * @chainable
     */
    Spinor3.prototype.wedge = function (a, b) {
        var ax = a.x;
        var ay = a.y;
        var az = a.z;
        var bx = b.x;
        var by = b.y;
        var bz = b.z;
        this.a = 0;
        this.yz = wedgeYZ(ax, ay, az, bx, by, bz);
        this.zx = wedgeZX(ax, ay, az, bx, by, bz);
        this.xy = wedgeXY(ax, ay, az, bx, by, bz);
        return this;
    };
    /**
     * @method grade
     * @param grade {number}
     * @return {Spinor3}
     * @chainable
     */
    Spinor3.prototype.grade = function (grade) {
        mustBeInteger('grade', grade);
        switch (grade) {
            case 0: {
                this.yz = 0;
                this.zx = 0;
                this.xy = 0;
                break;
            }
            case 2: {
                this.a = 0;
                break;
            }
            default: {
                this.a = 0;
                this.yz = 0;
                this.zx = 0;
                this.xy = 0;
            }
        }
        return this;
    };
    /**
     *
     */
    Spinor3.prototype.toArray = function () {
        return coordinates(this);
    };
    /**
     * @method toExponential
     * @param [fractionDigits] {number}
     * @return {string}
     */
    Spinor3.prototype.toExponential = function (fractionDigits) {
        var coordToString = function (coord) { return coord.toExponential(fractionDigits); };
        return toStringCustom(coordinates(this), coordToString, BASIS_LABELS);
    };
    /**
     * @method toFixed
     * @param [fractionDigits] {number}
     * @return {string}
     */
    Spinor3.prototype.toFixed = function (fractionDigits) {
        var coordToString = function (coord) { return coord.toFixed(fractionDigits); };
        return toStringCustom(coordinates(this), coordToString, BASIS_LABELS);
    };
    /**
     * @method toPrecision
     * @param [position] {number}
     * @return {string}
     */
    Spinor3.prototype.toPrecision = function (position) {
        var coordToString = function (coord) { return coord.toPrecision(position); };
        return toStringCustom(coordinates(this), coordToString, BASIS_LABELS);
    };
    /**
     * @method toString
     * @param [radix] {number}
     * @return {string} A non-normative string representation of the target.
     */
    Spinor3.prototype.toString = function (radix) {
        var coordToString = function (coord) { return coord.toString(radix); };
        return toStringCustom(coordinates(this), coordToString, BASIS_LABELS);
    };
    Spinor3.prototype.ext = function (rhs) {
        return this.ext2(this, rhs);
    };
    Spinor3.prototype.ext2 = function (a, b) {
        // FIXME: How to leverage? Maybe break up? Don't want performance hit.
        // scpG3(a, b, this)
        return this;
    };
    /**
     * Sets this spinor to the identity element for addition, <b>0</b>.
     *
     * @return {Spinor3} <code>this</code>
     */
    Spinor3.prototype.zero = function () {
        this.a = 0;
        this.yz = 0;
        this.zx = 0;
        this.xy = 0;
        return this;
    };
    /**
     * @param spinor The spinor to be copied.
     * @returns A copy of the spinor argument.
     */
    Spinor3.copy = function (spinor) {
        var s = Spinor3.zero.clone().copy(spinor);
        s.modified_ = false;
        return s;
    };
    /**
     * Computes I * v, the dual of v.
     *
     * @param v
     * @param changeSign
     * @returns I * v
     */
    Spinor3.dual = function (v, changeSign) {
        return Spinor3.zero.clone().dual(v, changeSign);
    };
    Spinor3.fromBivector = function (B) {
        return new Spinor3([B.yz, B.zx, B.xy, 0], magicCode);
    };
    /**
     *
     */
    Spinor3.isOne = function (spinor) {
        return spinor.a === 1 && spinor.yz === 0 && spinor.zx === 0 && spinor.xy === 0;
    };
    /**
     * @param a
     * @param b
     * @param α
     * @returns a + α * (b - a)
     */
    Spinor3.lerp = function (a, b, α) {
        return Spinor3.copy(a).lerp(b, α);
    };
    /**
     * <p>
     * Computes a unit spinor with a random direction.
     * </p>
     */
    Spinor3.random = function () {
        var yz = randomRange(-1, 1);
        var zx = randomRange(-1, 1);
        var xy = randomRange(-1, 1);
        var α = randomRange(-1, 1);
        return Spinor3.spinor(yz, zx, xy, α).normalize();
    };
    /**
     * Computes the rotor that rotates vector <code>a</code> to vector <code>b</code>.
     *
     * @param a The <em>from</em> vector.
     * @param b The <em>to</em> vector.
     */
    Spinor3.rotorFromDirections = function (a, b) {
        return Spinor3.zero.clone().rotorFromDirections(a, b);
    };
    /**
     * Constructs a new Spinor3 from coordinates.
     * The returned spinor is not locked.
     * The returned spinor is not modified.
     * @param yz The coordinate corresponding to the e2e3 basis bivector.
     * @param zx The coordinate corresponding to the e3e1 basis bivector.
     * @param xy The coordinate corresponding to the e1e2 basis bivector.
     * @param a The coordinate corresponding to the 1 basis scalar.
     */
    Spinor3.spinor = function (yz, zx, xy, a) {
        return new Spinor3([yz, zx, xy, a], magicCode);
    };
    /**
     * @param a
     * @param b
     */
    Spinor3.wedge = function (a, b) {
        var ax = a.x;
        var ay = a.y;
        var az = a.z;
        var bx = b.x;
        var by = b.y;
        var bz = b.z;
        var yz = wedgeYZ(ax, ay, az, bx, by, bz);
        var zx = wedgeZX(ax, ay, az, bx, by, bz);
        var xy = wedgeXY(ax, ay, az, bx, by, bz);
        return Spinor3.spinor(yz, zx, xy, 0);
    };
    /**
     * A spinor with the value of 1.
     * The spinor is not modified (initially).
     * The spinor is not locked (initially).
     * @deprecated This value may become locked in future. User Spinor3.spinor(0, 0, 0, 1) instead.
     */
    Spinor3.one = Spinor3.spinor(0, 0, 0, 1);
    /**
     * A spinor with the value of 0.
     * The spinor is not modified (initially).
     * The spinor is not locked (initially).
     * @deprecated This value may become locked in future. User Spinor3.spinor(0, 0, 0, 0) instead.
     */
    Spinor3.zero = Spinor3.spinor(0, 0, 0, 0);
    return Spinor3;
}());
export { Spinor3 };
applyMixins(Spinor3, [Lockable]);
Spinor3.one.lock();
Spinor3.zero.lock();
