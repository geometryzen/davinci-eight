"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Coords_1 = require("../math/Coords");
var exp = Math.exp;
var log = Math.log;
var sqrt = Math.sqrt;
var COORD_X = 0;
/**
 * @class Vector1
 */
var Vector1 = (function (_super) {
    tslib_1.__extends(Vector1, _super);
    /**
     * @class Vector1
     * @constructor
     * @param data {number[]} Default is [0].
     * @param modified {boolean} Default is false.
     */
    function Vector1(data, modified) {
        if (data === void 0) { data = [0]; }
        if (modified === void 0) { modified = false; }
        return _super.call(this, data, modified, 1) || this;
    }
    Object.defineProperty(Vector1.prototype, "x", {
        /**
         * @property x
         * @type Number
         */
        get: function () {
            return this.coords[COORD_X];
        },
        set: function (value) {
            this.modified = this.modified || this.x !== value;
            this.coords[COORD_X] = value;
        },
        enumerable: true,
        configurable: true
    });
    Vector1.prototype.set = function (x) {
        this.x = x;
        return this;
    };
    Vector1.prototype.add = function (vector, alpha) {
        if (alpha === void 0) { alpha = 1; }
        this.x += vector.x * alpha;
        return this;
    };
    Vector1.prototype.add2 = function (a, b) {
        this.x = a.x + b.x;
        return this;
    };
    Vector1.prototype.scp = function (v) {
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ σ * this<sup>T</sup></code>
     * </p>
     *
     * @method applyMatrix
     * @param σ {Matrix1}
     * @return {Vector1} <code>this</code>
     * @chainable
     */
    Vector1.prototype.applyMatrix = function (σ) {
        var x = this.x;
        var e = σ.elements;
        this.x = e[0x0] * x;
        return this;
    };
    /**
     * @method approx
     * @param n {number}
     * @return {Vector1}
     * @chainable
     */
    Vector1.prototype.approx = function (n) {
        _super.prototype.approx.call(this, n);
        return this;
    };
    /**
     * The Clifford conjugate.
     * The multiplier for the grade x is (-1) raised to the power x * (x + 1) / 2
     * The pattern of grades is +--++--+
     *
     * @returns conj(this)
     */
    Vector1.prototype.conj = function () {
        return this;
    };
    Vector1.prototype.copy = function (v) {
        this.x = v.x;
        return this;
    };
    Vector1.prototype.det = function () {
        return this.x;
    };
    Vector1.prototype.dual = function () {
        return this;
    };
    Vector1.prototype.exp = function () {
        this.x = exp(this.x);
        return this;
    };
    Vector1.prototype.one = function () {
        this.x = 1;
        return this;
    };
    Vector1.prototype.inv = function () {
        this.x = 1 / this.x;
        return this;
    };
    Vector1.prototype.lco = function (v) {
        return this;
    };
    Vector1.prototype.log = function () {
        this.x = log(this.x);
        return this;
    };
    Vector1.prototype.mul = function (v) {
        this.x *= v.x;
        return this;
    };
    Vector1.prototype.norm = function () {
        return this;
    };
    Vector1.prototype.div = function (v) {
        this.x /= v.x;
        return this;
    };
    Vector1.prototype.divByScalar = function (scalar) {
        this.x /= scalar;
        return this;
    };
    Vector1.prototype.min = function (v) {
        if (this.x > v.x) {
            this.x = v.x;
        }
        return this;
    };
    Vector1.prototype.max = function (v) {
        if (this.x < v.x) {
            this.x = v.x;
        }
        return this;
    };
    Vector1.prototype.floor = function () {
        this.x = Math.floor(this.x);
        return this;
    };
    Vector1.prototype.ceil = function () {
        this.x = Math.ceil(this.x);
        return this;
    };
    Vector1.prototype.rev = function () {
        return this;
    };
    Vector1.prototype.rco = function (v) {
        return this;
    };
    Vector1.prototype.round = function () {
        this.x = Math.round(this.x);
        return this;
    };
    Vector1.prototype.roundToZero = function () {
        this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
        return this;
    };
    Vector1.prototype.scale = function (scalar) {
        this.x *= scalar;
        return this;
    };
    Vector1.prototype.stress = function (σ) {
        this.x *= σ.x;
        return this;
    };
    Vector1.prototype.sub = function (v) {
        this.x -= v.x;
        return this;
    };
    Vector1.prototype.subScalar = function (s) {
        this.x -= s;
        return this;
    };
    Vector1.prototype.sub2 = function (a, b) {
        this.x = a.x - b.x;
        return this;
    };
    /**
     * @method neg
     * @return {Vector1} <code>this</code>
     */
    Vector1.prototype.neg = function () {
        this.x = -this.x;
        return this;
    };
    /**
     * @method distanceTo
     * @param point {VectorE1}
     * @return {number}
     */
    Vector1.prototype.distanceTo = function (position) {
        return sqrt(this.quadranceTo(position));
    };
    Vector1.prototype.dot = function (v) {
        return this.x * v.x;
    };
    /**
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     * @method magnitude
     * @return {number}
     */
    Vector1.prototype.magnitude = function () {
        return sqrt(this.squaredNorm());
    };
    Vector1.prototype.normalize = function () {
        return this.divByScalar(this.magnitude());
    };
    Vector1.prototype.mul2 = function (a, b) {
        return this;
    };
    Vector1.prototype.quad = function () {
        var x = this.x;
        this.x = x * x;
        return this;
    };
    Vector1.prototype.squaredNorm = function () {
        return this.x * this.x;
    };
    Vector1.prototype.quadranceTo = function (position) {
        var dx = this.x - position.x;
        return dx * dx;
    };
    Vector1.prototype.reflect = function (n) {
        // FIXME: TODO
        return this;
    };
    Vector1.prototype.reflection = function (n) {
        // FIXME: TODO
        return this;
    };
    Vector1.prototype.rotate = function (rotor) {
        return this;
    };
    /**
     * this ⟼ this + α * (v - this)</code>
     * @method lerp
     * @param v {VectorE1}
     * @param α {number}
     * @return {MutanbleNumber}
     * @chainable
     */
    Vector1.prototype.lerp = function (v, α) {
        this.x += (v.x - this.x) * α;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ a + α * (b - a)</code>
     * </p>
     * @method lerp2
     * @param a {Vector1}
     * @param b {Vector1}
     * @param α {number}
     * @return {Vector1}
     * @chainable
     */
    Vector1.prototype.lerp2 = function (a, b, α) {
        this.sub2(b, a).scale(α).add(a);
        return this;
    };
    Vector1.prototype.equals = function (v) {
        return v.x === this.x;
    };
    Vector1.prototype.fromArray = function (array, offset) {
        if (offset === void 0) { offset = 0; }
        this.x = array[offset];
        return this;
    };
    Vector1.prototype.toArray = function (array, offset) {
        if (array === void 0) { array = []; }
        if (offset === void 0) { offset = 0; }
        array[offset] = this.x;
        return array;
    };
    Vector1.prototype.toExponential = function (fractionDigits) {
        return "TODO: Vector1.toExponential";
    };
    Vector1.prototype.toFixed = function (fractionDigits) {
        return "TODO: Vector1.toFixed";
    };
    Vector1.prototype.toPrecision = function (precision) {
        return "TODO: Vector1.toPrecision";
    };
    Vector1.prototype.toString = function (radix) {
        return "TODO: Vector1.toString";
    };
    /**
     * @method translation
     * @param d {VectorE0}
     * @return {Vector1}
     * @chainable
     */
    Vector1.prototype.translation = function (d) {
        return this.one();
    };
    Vector1.prototype.fromAttribute = function (attribute, index, offset) {
        if (offset === void 0) { offset = 0; }
        index = index * attribute.itemSize + offset;
        this.x = attribute.array[index];
        return this;
    };
    Vector1.prototype.clone = function () {
        return new Vector1([this.x]);
    };
    Vector1.prototype.ext = function (v) {
        return this;
    };
    /**
     * Sets this vector to the identity element for addition, <b>0</b>.
     * @method zero
     * @return {Vector1}
     * @chainable
     */
    Vector1.prototype.zero = function () {
        this.x = 0;
        return this;
    };
    /**
     * @method random
     * @return {Vector1}
     * @static
     * @chainable
     */
    Vector1.random = function () {
        return new Vector1([Math.random()]);
    };
    /**
     *
     */
    Vector1.zero = function () {
        return new Vector1([0]);
    };
    return Vector1;
}(Coords_1.Coords));
exports.Vector1 = Vector1;
