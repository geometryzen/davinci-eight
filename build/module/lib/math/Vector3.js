import { applyMixins } from '../utils/applyMixins';
import { approx } from './approx';
import { dotVectorE3 } from './dotVectorE3';
import { lock, LockableMixin as Lockable, TargetLockedError } from '../core/Lockable';
import { Matrix3 } from './Matrix3';
import { isDefined } from '../checks/isDefined';
import { isNumber } from '../checks/isNumber';
import { randomRange } from './randomRange';
import { readOnly } from '../i18n/readOnly';
import { toStringCustom } from './toStringCustom';
import { wedgeXY } from './wedgeXY';
import { wedgeYZ } from './wedgeYZ';
import { wedgeZX } from './wedgeZX';
var sqrt = Math.sqrt;
var COORD_X = 0;
var COORD_Y = 1;
var COORD_Z = 2;
var BASIS_LABELS = ['e1', 'e2', 'e3'];
/**
 * Coordinates corresponding to basis labels.
 */
function coordinates(m) {
    return [m.x, m.y, m.z];
}
/**
 *
 */
var Vector3 = (function () {
    /**
     * @param coords
     * @param modified
     */
    function Vector3(coords, modified) {
        if (coords === void 0) { coords = [0, 0, 0]; }
        if (modified === void 0) { modified = false; }
        this.coords_ = coords;
        this.modified_ = modified;
    }
    /**
     * @param a
     * @param b
     */
    Vector3.dot = function (a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    };
    Object.defineProperty(Vector3.prototype, "length", {
        get: function () {
            return 3;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector3.prototype, "modified", {
        get: function () {
            return this.modified_;
        },
        set: function (modified) {
            if (this.isLocked()) {
                throw new TargetLockedError('set modified');
            }
            this.modified_ = modified;
        },
        enumerable: true,
        configurable: true
    });
    Vector3.prototype.getComponent = function (i) {
        return this.coords_[i];
    };
    Object.defineProperty(Vector3.prototype, "x", {
        /**
         * The coordinate corresponding to the e1 basis vector.
         */
        get: function () {
            return this.coords_[COORD_X];
        },
        set: function (value) {
            if (this.isLocked()) {
                throw new TargetLockedError('set x');
            }
            var coords = this.coords_;
            this.modified_ = this.modified_ || coords[COORD_X] !== value;
            coords[COORD_X] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector3.prototype, "y", {
        /**
         * The coordinate corresponding to the e2 basis vector.
         */
        get: function () {
            return this.coords_[COORD_Y];
        },
        set: function (value) {
            if (this.isLocked()) {
                throw new TargetLockedError('set y');
            }
            var coords = this.coords_;
            this.modified_ = this.modified_ || coords[COORD_Y] !== value;
            coords[COORD_Y] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector3.prototype, "z", {
        /**
         * The coordinate corresponding to the e3 basis vector.
         */
        get: function () {
            return this.coords_[COORD_Z];
        },
        set: function (value) {
            if (this.isLocked()) {
                throw new TargetLockedError('set z');
            }
            var coords = this.coords_;
            this.modified_ = this.modified_ || coords[COORD_Z] !== value;
            coords[COORD_Z] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector3.prototype, "maskG3", {
        /**
         *
         */
        get: function () {
            return this.isZero() ? 0x0 : 0x2;
        },
        set: function (unused) {
            throw new Error(readOnly('maskG3').message);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * <p>
     * <code>this ⟼ this + vector * α</code>
     * </p>
     *
     * @method add
     * @param vector {Vector3}
     * @param [α = 1] {number}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    Vector3.prototype.add = function (vector, α) {
        if (α === void 0) { α = 1; }
        this.x += vector.x * α;
        this.y += vector.y * α;
        this.z += vector.z * α;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ σ * this<sup>T</sup></code>
     * </p>
     *
     * @param σ
     */
    Vector3.prototype.applyMatrix = function (σ) {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var e = σ.elements;
        this.x = e[0x0] * x + e[0x3] * y + e[0x6] * z;
        this.y = e[0x1] * x + e[0x4] * y + e[0x7] * z;
        this.z = e[0x2] * x + e[0x5] * y + e[0x8] * z;
        return this;
    };
    /**
     * Pre-multiplies the column vector corresponding to this vector by the matrix.
     * The result is applied to this vector.
     * Strictly speaking, this method does not make much sense because the dimensions
     * of the square matrix and column vector don't match.
     * TODO: Used by TubeSimplexGeometry.
     *
     * @method applyMatrix4
     * @param σ The 4x4 matrix that pre-multiplies this column vector.
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    Vector3.prototype.applyMatrix4 = function (σ) {
        var x = this.x, y = this.y, z = this.z;
        var e = σ.elements;
        this.x = e[0x0] * x + e[0x4] * y + e[0x8] * z + e[0xC];
        this.y = e[0x1] * x + e[0x5] * y + e[0x9] * z + e[0xD];
        this.z = e[0x2] * x + e[0x6] * y + e[0xA] * z + e[0xE];
        return this;
    };
    /**
     *
     */
    Vector3.prototype.approx = function (n) {
        approx(this.coords_, n);
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ - n * this * n</code>
     * </p>
     *
     * @method reflect
     * @param n {VectorE3}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    Vector3.prototype.reflect = function (n) {
        var ax = this.x;
        var ay = this.y;
        var az = this.z;
        var nx = n.x;
        var ny = n.y;
        var nz = n.z;
        var dot2 = (ax * nx + ay * ny + az * nz) * 2;
        this.x = ax - dot2 * nx;
        this.y = ay - dot2 * ny;
        this.z = az - dot2 * nz;
        return this;
    };
    /**
     * @param R
     * @returns R * this * reverse(R)
     */
    Vector3.prototype.rotate = function (R) {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var a = R.xy;
        var b = R.yz;
        var c = R.zx;
        var w = R.a;
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
     * @method clone
     * @return {Vector3} <code>copy(this)</code>
     */
    Vector3.prototype.clone = function () {
        return new Vector3([this.x, this.y, this.z], this.modified_);
    };
    /**
     * this ⟼ copy(source)
     *
     * @returns copy(this)
     */
    Vector3.prototype.copy = function (source) {
        if (source) {
            this.x = source.x;
            this.y = source.y;
            this.z = source.z;
            return this;
        }
        else {
            throw new Error("source for copy must be a vector");
        }
    };
    /**
     * Copies the coordinate values into this <code>Vector3</code>.
     *
     * @param coordinates {number[]}
     * @returns
     */
    Vector3.prototype.copyCoordinates = function (coordinates) {
        // Copy using the setters so that the modified flag is updated.
        this.x = coordinates[COORD_X];
        this.y = coordinates[COORD_Y];
        this.z = coordinates[COORD_Z];
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ this ✕ v</code>
     * </p>
     *
     * @method cross
     * @param v {VectorE3}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    Vector3.prototype.cross = function (v) {
        return this.cross2(this, v);
    };
    /**
     * <code>this ⟼ a ✕ b</code>
     *
     * @param a
     * @param b
     * @returns a x b
     */
    Vector3.prototype.cross2 = function (a, b) {
        var ax = a.x, ay = a.y, az = a.z;
        var bx = b.x, by = b.y, bz = b.z;
        this.x = wedgeYZ(ax, ay, az, bx, by, bz);
        this.y = wedgeZX(ax, ay, az, bx, by, bz);
        this.z = wedgeXY(ax, ay, az, bx, by, bz);
        return this;
    };
    /**
     * @method distanceTo
     * @param point {VectorE3}
     * @return {number}
     */
    Vector3.prototype.distanceTo = function (point) {
        if (isDefined(point)) {
            return sqrt(this.quadranceTo(point));
        }
        else {
            return void 0;
        }
    };
    /**
     * @method quadranceTo
     * @param point {VectorE3}
     * @return {number}
     */
    Vector3.prototype.quadranceTo = function (point) {
        if (isDefined(point)) {
            var dx = this.x - point.x;
            var dy = this.y - point.y;
            var dz = this.z - point.z;
            return dx * dx + dy * dy + dz * dz;
        }
        else {
            return void 0;
        }
    };
    /**
     * <p>
     * <code>this ⟼ this / α</code>
     * </p>
     * @method divByScalar
     * @param α {number}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    Vector3.prototype.divByScalar = function (α) {
        if (α !== 0) {
            var invScalar = 1 / α;
            this.x *= invScalar;
            this.y *= invScalar;
            this.z *= invScalar;
        }
        else {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        }
        return this;
    };
    /**
     * @method dot
     * @param v {VectorE3}
     * @return {number}
     */
    Vector3.prototype.dot = function (v) {
        return Vector3.dot(this, v);
    };
    /**
     * <p>
     * <code>this ⟼ I * B</code>
     * </p>
     *
     * Sets this vector to the dual of the bivector, B.
     * If changeSign is <code>true</code>, the direction of the resulting vector is reversed.
     *
     * @method dual
     * @param B {SpinorE3}
     * @param changeSign {boolean}
     * @return {Vector3}
     * @chainable
     */
    Vector3.prototype.dual = function (B, changeSign) {
        if (changeSign) {
            this.x = B.yz;
            this.y = B.zx;
            this.z = B.xy;
        }
        else {
            this.x = -B.yz;
            this.y = -B.zx;
            this.z = -B.xy;
        }
        return this;
    };
    /**
     * @method equals
     * @param other {any}
     * @return {boolean}
     */
    Vector3.prototype.equals = function (other) {
        if (other instanceof Vector3) {
            return this.x === other.x && this.y === other.y && this.z === other.z;
        }
        else {
            return false;
        }
    };
    /**
     * @method isZero
     * @return {boolean}
     */
    Vector3.prototype.isZero = function () {
        return this.x === 0 && this.y === 0 && this.z === 0;
    };
    /**
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     *
     * @method magnitude
     * @return {number}
     */
    Vector3.prototype.magnitude = function () {
        return sqrt(this.squaredNorm());
    };
    /**
     * @method neg
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    Vector3.prototype.neg = function () {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ this + α * (target - this)</code>
     * </p>
     *
     * @method lerp
     * @param target {VectorE3}
     * @param α {number}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    Vector3.prototype.lerp = function (target, α) {
        this.x += (target.x - this.x) * α;
        this.y += (target.y - this.y) * α;
        this.z += (target.z - this.z) * α;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ a + α * (b - a)</code>
     * </p>
     * @method lerp2
     * @param a {VectorE3}
     * @param b {VectorE3}
     * @param α {number}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    Vector3.prototype.lerp2 = function (a, b, α) {
        this.copy(a).lerp(b, α);
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ this / norm(this)</code>
     * </p>
     *
     * @method normalize
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    Vector3.prototype.normalize = function () {
        var m = this.magnitude();
        if (m !== 0) {
            return this.divByScalar(m);
        }
        else {
            return this.zero();
        }
    };
    /**
     * <p>
     * <code>this ⟼ this * α</code>
     * </p>
     *
     * @method scale
     * @param α {number}
     */
    Vector3.prototype.scale = function (α) {
        this.x *= α;
        this.y *= α;
        this.z *= α;
        return this;
    };
    /**
     * @method stress
     * @param σ {VectorE3}
     * @return Vector3
     */
    Vector3.prototype.stress = function (σ) {
        this.x *= σ.x;
        this.y *= σ.y;
        this.z *= σ.z;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ this</code>, with components modified.
     * </p>
     *
     * @method set
     * @param x {number}
     * @param y {number}
     * @param z {number}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    Vector3.prototype.setXYZ = function (x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    };
    /**
     * Returns the (Euclidean) inner product of this vector with itself.
     *
     * @method squaredNorm
     * @return {number} <code>this ⋅ this</code> or <code>norm(this) * norm(this)</code>
     */
    Vector3.prototype.squaredNorm = function () {
        // quad = scp(v, rev(v)) = scp(v, v)
        // TODO: This is correct but could be optimized.
        return dotVectorE3(this, this);
    };
    /**
     * <p>
     * <code>this ⟼ this - v</code>
     * </p>
     *
     * @method sub
     * @param v {VectorE3}
     * @param [α = 1] {number}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    Vector3.prototype.sub = function (v, α) {
        if (α === void 0) { α = 1; }
        this.x -= v.x * α;
        this.y -= v.y * α;
        this.z -= v.z * α;
        return this;
    };
    Vector3.prototype.sub2 = function (a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        return this;
    };
    /**
     *
     */
    Vector3.prototype.toArray = function () {
        return coordinates(this);
    };
    /**
     * @param fractionDigits
     * @returns
     */
    Vector3.prototype.toExponential = function (fractionDigits) {
        var coordToString = function (coord) { return coord.toExponential(fractionDigits); };
        return toStringCustom(coordinates(this), coordToString, BASIS_LABELS);
    };
    /**
     * @param fractionDigits
     * @returns
     */
    Vector3.prototype.toFixed = function (fractionDigits) {
        var coordToString = function (coord) { return coord.toFixed(fractionDigits); };
        return toStringCustom(coordinates(this), coordToString, BASIS_LABELS);
    };
    /**
     * @param precision
     * @returns
     */
    Vector3.prototype.toPrecision = function (precision) {
        var coordToString = function (coord) { return coord.toPrecision(precision); };
        return toStringCustom(coordinates(this), coordToString, BASIS_LABELS);
    };
    /**
     * @param radix
     * @returns
     */
    Vector3.prototype.toString = function (radix) {
        var coordToString = function (coord) { return coord.toString(radix); };
        return toStringCustom(coordinates(this), coordToString, BASIS_LABELS);
    };
    /**
     * Sets this vector to the identity element for addition, <b>0</b>.
     */
    Vector3.prototype.zero = function () {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        return this;
    };
    Vector3.prototype.__add__ = function (rhs) {
        if (rhs instanceof Vector3) {
            return lock(this.clone().add(rhs, 1.0));
        }
        else {
            return void 0;
        }
    };
    Vector3.prototype.__radd__ = function (lhs) {
        if (lhs instanceof Vector3) {
            return lock(lhs.clone().add(this, 1.0));
        }
        else {
            return void 0;
        }
    };
    Vector3.prototype.__sub__ = function (rhs) {
        if (rhs instanceof Vector3) {
            return lock(this.clone().sub(rhs));
        }
        else {
            return void 0;
        }
    };
    Vector3.prototype.__rsub__ = function (lhs) {
        if (lhs instanceof Vector3) {
            return lock(lhs.clone().sub(this, 1.0));
        }
        else {
            return void 0;
        }
    };
    Vector3.prototype.__mul__ = function (rhs) {
        if (isNumber(rhs)) {
            return lock(this.clone().scale(rhs));
        }
        else {
            return void 0;
        }
    };
    Vector3.prototype.__rmul__ = function (lhs) {
        if (typeof lhs === 'number') {
            return lock(this.clone().scale(lhs));
        }
        else if (lhs instanceof Matrix3) {
            return lock(this.clone().applyMatrix(lhs));
        }
        else {
            return void 0;
        }
    };
    Vector3.prototype.__div__ = function (rhs) {
        if (isNumber(rhs)) {
            return lock(this.clone().divByScalar(rhs));
        }
        else {
            return void 0;
        }
    };
    Vector3.prototype.__rdiv__ = function (lhs) {
        return void 0;
    };
    Vector3.prototype.__pos__ = function () {
        return lock(Vector3.copy(this));
    };
    Vector3.prototype.__neg__ = function () {
        return lock(Vector3.copy(this).neg());
    };
    /**
     * @method copy
     * @param vector {VectorE3}
     * @return {Vector3}
     * @static
     * @chainable
     */
    Vector3.copy = function (vector) {
        return new Vector3([vector.x, vector.y, vector.z]);
    };
    /**
     * Constructs a vector which is the dual of the supplied bivector, B.
     * The convention used is dual(m) = I * m.
     * If a sign change is desired from this convention, set changeSign to true.
     */
    Vector3.dual = function (B, changeSign) {
        if (changeSign === void 0) { changeSign = false; }
        if (changeSign) {
            return new Vector3([B.yz, B.zx, B.xy]);
        }
        else {
            return new Vector3([-B.yz, -B.zx, -B.xy]);
        }
    };
    Vector3.e1 = function () {
        return new Vector3([1, 0, 0]);
    };
    Vector3.e2 = function () {
        return new Vector3([0, 1, 0]);
    };
    Vector3.e3 = function () {
        return new Vector3([0, 0, 1]);
    };
    /**
     *
     */
    Vector3.isInstance = function (x) {
        return x instanceof Vector3;
    };
    /**
     * @method lerp
     * @param a {VectorE3}
     * @param b {VectorE3}
     * @param α {number}
     * @return {Vector3} <code>a + α * (b - a)</code>
     * @static
     * @chainable
     */
    Vector3.lerp = function (a, b, α) {
        return Vector3.copy(b).sub(a).scale(α).add(a);
    };
    /**
     * <p>
     * Computes a unit vector with a random direction.
     * </p>
     *
     * @method random
     * @return {Vector3}
     * @static
     * @chainable
     */
    Vector3.random = function () {
        var x = randomRange(-1, 1);
        var y = randomRange(-1, 1);
        var z = randomRange(-1, 1);
        return Vector3.vector(x, y, z).normalize();
    };
    /**
     * @method vector
     * @param x {number}
     * @param y {number}
     * @param z {number}
     * @return {Vector3}
     * @static
     * @chainable
     */
    Vector3.vector = function (x, y, z) {
        return new Vector3([x, y, z]);
    };
    /**
     * @method zero
     * @return {Vector3}
     * @static
     * @chainable
     */
    Vector3.zero = function () {
        return new Vector3([0, 0, 0]);
    };
    return Vector3;
}());
export { Vector3 };
applyMixins(Vector3, [Lockable]);
