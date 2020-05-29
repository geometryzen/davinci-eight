"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector2 = void 0;
var applyMixins_1 = require("../utils/applyMixins");
var approx_1 = require("./approx");
var b2_1 = require("../geometries/b2");
var b3_1 = require("../geometries/b3");
var Lockable_1 = require("../core/Lockable");
var notImplemented_1 = require("../i18n/notImplemented");
var randomRange_1 = require("./randomRange");
var stringFromCoordinates_1 = require("../math/stringFromCoordinates");
var sqrt = Math.sqrt;
var COORD_X = 0;
var COORD_Y = 1;
/**
 * Coordinates corresponding to basis labels.
 */
function coordinates(m) {
    return [m.x, m.y];
}
/**
 *
 */
var Vector2 = /** @class */ (function () {
    /**
     * @param coords The x coordinate and y coordinate.
     * @param modified
     */
    function Vector2(coords, modified) {
        if (coords === void 0) { coords = [0, 0]; }
        if (modified === void 0) { modified = false; }
        this.coords_ = coords;
        this.modified_ = modified;
    }
    Object.defineProperty(Vector2.prototype, "length", {
        get: function () {
            return 2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2.prototype, "modified", {
        get: function () {
            return this.modified_;
        },
        set: function (modified) {
            if (this.isLocked()) {
                throw new Lockable_1.TargetLockedError('set modified');
            }
            this.modified_ = modified;
        },
        enumerable: false,
        configurable: true
    });
    Vector2.prototype.getComponent = function (i) {
        return this.coords_[i];
    };
    Object.defineProperty(Vector2.prototype, "x", {
        /**
         *
         */
        get: function () {
            return this.coords_[COORD_X];
        },
        set: function (value) {
            if (this.isLocked()) {
                throw new Lockable_1.TargetLockedError('set x');
            }
            var coords = this.coords_;
            this.modified_ = this.modified_ || coords[COORD_X] !== value;
            coords[COORD_X] = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2.prototype, "y", {
        /**
         *
         */
        get: function () {
            return this.coords_[COORD_Y];
        },
        set: function (value) {
            if (this.isLocked()) {
                throw new Lockable_1.TargetLockedError('set y');
            }
            var coords = this.coords_;
            this.modified_ = this.modified_ || coords[COORD_Y] !== value;
            coords[COORD_Y] = value;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @param v
     * @param α
     * @returns
     */
    Vector2.prototype.add = function (v, α) {
        if (α === void 0) { α = 1; }
        this.x += v.x * α;
        this.y += v.y * α;
        return this;
    };
    /**
     * @param a
     * @param b
     * @returns
     */
    Vector2.prototype.add2 = function (a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ σ * this<sup>T</sup></code>
     * </p>
     *
     * @method applyMatrix
     * @param σ {Matrix2}
     * @return {Vector2} <code>this</code>
     * @chainable
     */
    Vector2.prototype.applyMatrix = function (σ) {
        var x = this.x;
        var y = this.y;
        var e = σ.elements;
        this.x = e[0x0] * x + e[0x2] * y;
        this.y = e[0x1] * x + e[0x3] * y;
        return this;
    };
    /**
     * @method approx
     * @param n {number}
     * @return {Vector2}
     * @chainable
     */
    Vector2.prototype.approx = function (n) {
        approx_1.approx(this.coords_, n);
        return this;
    };
    /**
     * @method clone
     * @return {Vector2}
     * @chainable
     */
    Vector2.prototype.clone = function () {
        return new Vector2([this.x, this.y]);
    };
    /**
     * @method copy
     * @param v {VectorE2}
     * @return {Vector2}
     * @chainable
     */
    Vector2.prototype.copy = function (v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    };
    /**
     * @method cubicBezier
     * @param t {number}
     * @param controlBegin {VectorE2}
     * @param endPoint {VectorE2}
     * @return {Vector2}
     * @chainable
     */
    Vector2.prototype.cubicBezier = function (t, controlBegin, controlEnd, endPoint) {
        var x = b3_1.b3(t, this.x, controlBegin.x, controlEnd.x, endPoint.x);
        var y = b3_1.b3(t, this.y, controlBegin.y, controlEnd.y, endPoint.y);
        this.x = x;
        this.y = y;
        return this;
    };
    /**
     * @method distanceTo
     * @param point {VectorE2}
     * @return {number}
     */
    Vector2.prototype.distanceTo = function (position) {
        return sqrt(this.quadranceTo(position));
    };
    /**
     * @method sub
     * @param v {VectorE2}
     * @return {Vector2}
     * @chainable
     */
    Vector2.prototype.sub = function (v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    };
    /*
    subScalar(s: number) {
        this.x -= s;
        this.y -= s;
        return this;
    }
    */
    /**
     * @method sub2
     * @param a {VectorE2}
     * @param b {VectorE2}
     * @return {Vector2}
     * @chainable
     */
    Vector2.prototype.sub2 = function (a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        return this;
    };
    /**
     * @method scale
     * @param α {number}
     * @return {Vector2}
     * @chainable
     */
    Vector2.prototype.scale = function (α) {
        this.x *= α;
        this.y *= α;
        return this;
    };
    /**
     * @method divByScalar
     * @param α {number}
     * @return {Vector2}
     * @chainable
     */
    Vector2.prototype.divByScalar = function (α) {
        this.x /= α;
        this.y /= α;
        return this;
    };
    Vector2.prototype.min = function (v) {
        if (this.x > v.x) {
            this.x = v.x;
        }
        if (this.y > v.y) {
            this.y = v.y;
        }
        return this;
    };
    Vector2.prototype.max = function (v) {
        if (this.x < v.x) {
            this.x = v.x;
        }
        if (this.y < v.y) {
            this.y = v.y;
        }
        return this;
    };
    Vector2.prototype.floor = function () {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
    };
    Vector2.prototype.ceil = function () {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
    };
    Vector2.prototype.round = function () {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
    };
    Vector2.prototype.roundToZero = function () {
        this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
        this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y);
        return this;
    };
    /**
     * @method neg
     * @return {Vector2} <code>this</code>
     * @chainable
     */
    Vector2.prototype.neg = function () {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    };
    Vector2.prototype.dot = function (v) {
        return this.x * v.x + this.y * v.y;
    };
    /**
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     *
     * @method magnitude
     * @return {number}
     */
    Vector2.prototype.magnitude = function () {
        return sqrt(this.squaredNorm());
    };
    Vector2.prototype.normalize = function () {
        return this.divByScalar(this.magnitude());
    };
    Vector2.prototype.squaredNorm = function () {
        return this.x * this.x + this.y * this.y;
    };
    Vector2.prototype.quadranceTo = function (position) {
        var dx = this.x - position.x;
        var dy = this.y - position.y;
        return dx * dx + dy * dy;
    };
    /**
     * @method quadraticBezier
     * @param t {number}
     * @param controlPoint {VectorE2}
     * @param endPoint {VectorE2}
     * @return {Vector2}
     */
    Vector2.prototype.quadraticBezier = function (t, controlPoint, endPoint) {
        var x = b2_1.b2(t, this.x, controlPoint.x, endPoint.x);
        var y = b2_1.b2(t, this.y, controlPoint.y, endPoint.y);
        this.x = x;
        this.y = y;
        return this;
    };
    Vector2.prototype.reflect = function (n) {
        throw new Error(notImplemented_1.notImplemented('reflect').message);
    };
    /**
     * @method rotate
     * @param spinor {SpinorE2}
     * @return {Vector2}
     * @chainable
     */
    Vector2.prototype.rotate = function (spinor) {
        var x = this.x;
        var y = this.y;
        var α = spinor.a;
        var β = spinor.b;
        var p = α * α - β * β;
        var q = 2 * α * β;
        this.x = p * x + q * y;
        this.y = p * y - q * x;
        return this;
    };
    /**
     * this ⟼ this + (v - this) * α
     *
     * @method lerp
     * @param v {VectorE2}
     * @param α {number}
     * @return {Vector2}
     * @chainable
     */
    Vector2.prototype.lerp = function (v, α) {
        this.x += (v.x - this.x) * α;
        this.y += (v.y - this.y) * α;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ a + α * (b - a)</code>
     * </p>
     *
     * @method lerp2
     * @param a {VectorE2}
     * @param b {VectorE2}
     * @param α {number}
     * @return {Vector2} <code>this</code>
     * @chainable
     */
    Vector2.prototype.lerp2 = function (a, b, α) {
        this.copy(a).lerp(b, α);
        return this;
    };
    Vector2.prototype.equals = function (v) {
        return ((v.x === this.x) && (v.y === this.y));
    };
    /**
     * @method stress
     * @param σ {VectorE2}
     * @return {Vector2}
     */
    Vector2.prototype.stress = function (σ) {
        this.x *= σ.x;
        this.y *= σ.y;
        return this;
    };
    /**
     *
     */
    Vector2.prototype.toArray = function () {
        return coordinates(this);
    };
    /**
     * @method toExponential
     * @param [fractionDigits] {number}
     * @return {string}
     */
    Vector2.prototype.toExponential = function (fractionDigits) {
        var coordToString = function (coord) { return coord.toExponential(fractionDigits); };
        return stringFromCoordinates_1.stringFromCoordinates(this.coords_, coordToString, ['e1', 'e2']);
    };
    /**
     * @method toFixed
     * @param [fractionDigits] {number}
     * @return {string}
     */
    Vector2.prototype.toFixed = function (fractionDigits) {
        var coordToString = function (coord) { return coord.toFixed(fractionDigits); };
        return stringFromCoordinates_1.stringFromCoordinates(this.coords_, coordToString, ['e1', 'e2']);
    };
    /**
     * @method toPrecision
     * @param [precision] {number}
     * @return {string}
     */
    Vector2.prototype.toPrecision = function (precision) {
        var coordToString = function (coord) { return coord.toPrecision(precision); };
        return stringFromCoordinates_1.stringFromCoordinates(this.coords_, coordToString, ['e1', 'e2']);
    };
    /**
     * @method toString
     * @param [radix] {number}
     * @return {string}
     */
    Vector2.prototype.toString = function (radix) {
        var coordToString = function (coord) { return coord.toString(radix); };
        return stringFromCoordinates_1.stringFromCoordinates(this.coords_, coordToString, ['e1', 'e2']);
    };
    Vector2.prototype.fromArray = function (array, offset) {
        if (offset === void 0) { offset = 0; }
        this.x = array[offset];
        this.y = array[offset + 1];
        return this;
    };
    Vector2.prototype.fromAttribute = function (attribute, index, offset) {
        if (offset === void 0) { offset = 0; }
        index = index * attribute.itemSize + offset;
        this.x = attribute.array[index];
        this.y = attribute.array[index + 1];
        return this;
    };
    /**
     * Sets this vector to the identity element for addition, <b>0</b>.
     */
    Vector2.prototype.zero = function () {
        this.x = 0;
        this.y = 0;
        return this;
    };
    Vector2.prototype.__neg__ = function () {
        return Lockable_1.lock(this.clone().neg());
    };
    /**
     * @method copy
     *
     * @param vector {VectorE2}
     * @return {Vector2}
     * @static
     * @chainable
     */
    Vector2.copy = function (vector) {
        return Vector2.vector(vector.x, vector.y);
    };
    /**
     * @method lerp
     * @param a {VectorE2}
     * @param b {VectorE2}
     * @param α {number}
     * @return {Vector2} <code>a + α * (b - a)</code>
     * @static
     * @chainable
     */
    Vector2.lerp = function (a, b, α) {
        return Vector2.copy(b).sub(a).scale(α).add(a);
    };
    /**
     * <p>
     * Computes a unit vector with a random direction.
     * </p>
     */
    Vector2.random = function () {
        var x = randomRange_1.randomRange(-1, 1);
        var y = randomRange_1.randomRange(-1, 1);
        return Vector2.vector(x, y).normalize();
    };
    Vector2.vector = function (x, y) {
        return new Vector2([x, y]);
    };
    Vector2.zero = Vector2.vector(0, 0);
    return Vector2;
}());
exports.Vector2 = Vector2;
applyMixins_1.applyMixins(Vector2, [Lockable_1.LockableMixin]);
Vector2.zero.lock();
