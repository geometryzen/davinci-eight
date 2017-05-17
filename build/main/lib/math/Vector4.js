"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Coords_1 = require("../math/Coords");
/**
 *
 */
var Vector4 = (function (_super) {
    tslib_1.__extends(Vector4, _super);
    /**
     * @class Vector4
     * @constructor
     * @param data {number[]} Default is [0, 0, 0, 0] corresponding to x, y, z, and w coordinate labels.
     * @param modified {boolean} Default is false.
     */
    function Vector4(data, modified) {
        if (data === void 0) { data = [0, 0, 0, 0]; }
        if (modified === void 0) { modified = false; }
        return _super.call(this, data, modified, 4) || this;
    }
    Object.defineProperty(Vector4.prototype, "x", {
        /**
         * @property x
         * @type Number
         */
        get: function () {
            return this.coords[0];
        },
        set: function (value) {
            this.modified = this.modified || this.x !== value;
            this.coords[0] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector4.prototype, "y", {
        /**
         * @property y
         * @type Number
         */
        get: function () {
            return this.coords[1];
        },
        set: function (value) {
            this.modified = this.modified || this.y !== value;
            this.coords[1] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector4.prototype, "z", {
        /**
         * @property z
         * @type Number
         */
        get: function () {
            return this.coords[2];
        },
        set: function (value) {
            this.modified = this.modified || this.z !== value;
            this.coords[2] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector4.prototype, "w", {
        /**
         * @property w
         * @type Number
         */
        get: function () {
            return this.coords[3];
        },
        set: function (value) {
            this.modified = this.modified || this.w !== value;
            this.coords[3] = value;
        },
        enumerable: true,
        configurable: true
    });
    Vector4.prototype.setW = function (w) {
        this.w = w;
        return this;
    };
    Vector4.prototype.add = function (vector, α) {
        if (α === void 0) { α = 1; }
        this.x += vector.x * α;
        this.y += vector.y * α;
        this.z += vector.z * α;
        this.w += vector.w * α;
        return this;
    };
    Vector4.prototype.add2 = function (a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        this.w = a.w + b.w;
        return this;
    };
    /**
     * Pre-multiplies the column vector corresponding to this vector by the matrix.
     * The result is applied to this vector.
     *
     * @method applyMatrix
     * @param σ The 4x4 matrix that pre-multiplies this column vector.
     * @return {Vector4} <code>this</code>
     * @chainable
     */
    Vector4.prototype.applyMatrix = function (σ) {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var w = this.w;
        var e = σ.elements;
        this.x = e[0x0] * x + e[0x4] * y + e[0x8] * z + e[0xC] * w;
        this.y = e[0x1] * x + e[0x5] * y + e[0x9] * z + e[0xD] * w;
        this.z = e[0x2] * x + e[0x6] * y + e[0xA] * z + e[0xE] * w;
        this.w = e[0x3] * x + e[0x7] * y + e[0xB] * z + e[0xF] * w;
        return this;
    };
    /**
     * @method approx
     * @param n {number}
     * @return {Vector4}
     * @chainable
     */
    Vector4.prototype.approx = function (n) {
        _super.prototype.approx.call(this, n);
        return this;
    };
    Vector4.prototype.clone = function () {
        return new Vector4([this.x, this.y, this.z, this.w], this.modified);
    };
    Vector4.prototype.copy = function (v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        this.w = v.w;
        return this;
    };
    Vector4.prototype.divByScalar = function (α) {
        this.x /= α;
        this.y /= α;
        this.z /= α;
        this.w /= α;
        return this;
    };
    Vector4.prototype.lerp = function (target, α) {
        this.x += (target.x - this.x) * α;
        this.y += (target.y - this.y) * α;
        this.z += (target.z - this.z) * α;
        this.w += (target.w - this.w) * α;
        return this;
    };
    Vector4.prototype.lerp2 = function (a, b, α) {
        this.sub2(b, a).scale(α).add(a);
        return this;
    };
    Vector4.prototype.neg = function () {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        this.w = -this.w;
        return this;
    };
    Vector4.prototype.scale = function (α) {
        this.x *= α;
        this.y *= α;
        this.z *= α;
        this.w *= α;
        return this;
    };
    Vector4.prototype.reflect = function (n) {
        // TODO
        return this;
    };
    Vector4.prototype.rotate = function (rotor) {
        // TODO
        return this;
    };
    Vector4.prototype.stress = function (σ) {
        this.x *= σ.x;
        this.y *= σ.y;
        this.z *= σ.z;
        this.w *= σ.w;
        return this;
    };
    Vector4.prototype.sub = function (v, α) {
        this.x -= v.x * α;
        this.y -= v.y * α;
        this.z -= v.z * α;
        this.w -= v.w * α;
        return this;
    };
    Vector4.prototype.sub2 = function (a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        this.w = a.w - b.w;
        return this;
    };
    Vector4.prototype.magnitude = function () {
        throw new Error("TODO: Vector4.magnitude()");
    };
    Vector4.prototype.squaredNorm = function () {
        throw new Error("TODO: Vector4.squaredNorm()");
    };
    Vector4.prototype.toExponential = function (fractionDigits) {
        return "TODO Vector4.toExponential";
    };
    Vector4.prototype.toFixed = function (fractionDigits) {
        return "TODO Vector4.toFixed";
    };
    Vector4.prototype.toPrecision = function (precision) {
        return "TODO Vector4.toFixed";
    };
    Vector4.prototype.toString = function (radix) {
        return "TODO Vector4.toString";
    };
    Vector4.prototype.zero = function () {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 0;
        return this;
    };
    return Vector4;
}(Coords_1.Coords));
exports.Vector4 = Vector4;
