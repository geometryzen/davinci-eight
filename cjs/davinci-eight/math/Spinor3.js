var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var VectorN = require('../math/VectorN');
var wedgeXY = require('../math/wedgeXY');
var wedgeYZ = require('../math/wedgeYZ');
var wedgeZX = require('../math/wedgeZX');
/**
 * @class Spinor3
 */
var Spinor3 = (function (_super) {
    __extends(Spinor3, _super);
    function Spinor3(data, modified) {
        if (data === void 0) { data = [0, 0, 0, 1]; }
        if (modified === void 0) { modified = false; }
        _super.call(this, data, modified, 4);
    }
    Object.defineProperty(Spinor3.prototype, "yz", {
        /**
         * @property yz
         * @type Number
         */
        get: function () {
            return this.data[0];
        },
        set: function (value) {
            this.modified = this.modified || this.yz !== value;
            this.data[0] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Spinor3.prototype, "zx", {
        /**
         * @property zx
         * @type Number
         */
        get: function () {
            return this.data[1];
        },
        set: function (value) {
            this.modified = this.modified || this.zx !== value;
            this.data[1] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Spinor3.prototype, "xy", {
        /**
         * @property xy
         * @type Number
         */
        get: function () {
            return this.data[2];
        },
        set: function (value) {
            this.modified = this.modified || this.xy !== value;
            this.data[2] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Spinor3.prototype, "w", {
        /**
         * @property w
         * @type Number
         */
        get: function () {
            return this.data[3];
        },
        set: function (value) {
            this.modified = this.modified || this.w !== value;
            this.data[3] = value;
        },
        enumerable: true,
        configurable: true
    });
    Spinor3.prototype.add = function (rhs) {
        return this;
    };
    Spinor3.prototype.addVectors = function (a, b) {
        return this;
    };
    Spinor3.prototype.clone = function () {
        return new Spinor3([this.yz, this.zx, this.xy, this.w]);
    };
    Spinor3.prototype.copy = function (spinor) {
        this.yz = spinor.yz;
        this.zx = spinor.zx;
        this.xy = spinor.xy;
        this.w = spinor.w;
        return this;
    };
    Spinor3.prototype.divideScalar = function (scalar) {
        this.yz /= scalar;
        this.zx /= scalar;
        this.xy /= scalar;
        this.w /= scalar;
        return this;
    };
    Spinor3.prototype.exp = function () {
        var w = this.w;
        var yz = this.yz;
        var zx = this.zx;
        var xy = this.xy;
        var expW = Math.exp(w);
        var B = Math.sqrt(yz * yz + zx * zx + xy * xy);
        var s = expW * (B !== 0 ? Math.sin(B) / B : 1);
        this.w = expW * Math.cos(B);
        this.yz = yz * s;
        this.zx = zx * s;
        this.xy = xy * s;
        return this;
    };
    Spinor3.prototype.lerp = function (target, alpha) {
        this.xy += (target.xy - this.xy) * alpha;
        this.yz += (target.yz - this.yz) * alpha;
        this.zx += (target.zx - this.zx) * alpha;
        this.w += (target.w - this.w) * alpha;
        return this;
    };
    Spinor3.prototype.magnitude = function () {
        return Math.sqrt(this.quaditude());
    };
    Spinor3.prototype.multiply = function (rhs) {
        return this.multiplySpinors(this, rhs);
    };
    Spinor3.prototype.multiplySpinors = function (a, b) {
        var a0 = a.w;
        var a1 = a.yz;
        var a2 = a.zx;
        var a3 = a.xy;
        var b0 = b.w;
        var b1 = b.yz;
        var b2 = b.zx;
        var b3 = b.xy;
        this.w = a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3;
        this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
        this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
        this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
        return this;
    };
    Spinor3.prototype.multiplyScalar = function (scalar) {
        this.yz *= scalar;
        this.zx *= scalar;
        this.xy *= scalar;
        this.w *= scalar;
        return this;
    };
    Spinor3.prototype.quaditude = function () {
        var w = this.w;
        var yz = this.yz;
        var zx = this.zx;
        var xy = this.xy;
        return w * w + yz * yz + zx * zx + xy * xy;
    };
    Spinor3.prototype.reverse = function () {
        this.yz *= -1;
        this.zx *= -1;
        this.xy *= -1;
        return this;
    };
    Spinor3.prototype.sub = function (rhs) {
        return this;
    };
    Spinor3.prototype.wedgeVectors = function (a, b) {
        var ax = a.x, ay = a.y, az = a.z;
        var bx = b.x, by = b.y, bz = b.z;
        this.w = 0;
        this.yz = wedgeYZ(ax, ay, az, bx, by, bz);
        this.zx = wedgeZX(ax, ay, az, bx, by, bz);
        this.xy = wedgeXY(ax, ay, az, bx, by, bz);
        return this;
    };
    /**
     * @method toString
     * @return {string} A non-normative string representation of the target.
     */
    Spinor3.prototype.toString = function () {
        return "Spinor3({yz: " + this.yz + ", zx: " + this.zx + ", xy: " + this.xy + ", w: " + this.w + "})";
    };
    return Spinor3;
})(VectorN);
module.exports = Spinor3;
