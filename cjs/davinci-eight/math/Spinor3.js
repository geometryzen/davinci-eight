var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AbstractVector = require('../math/AbstractVector');
/**
 * @class Spinor3
 */
var Spinor3 = (function (_super) {
    __extends(Spinor3, _super);
    function Spinor3(data) {
        if (data === void 0) { data = [0, 0, 0, 1]; }
        _super.call(this, data, 4);
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
    Spinor3.prototype.add = function (element) {
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
    Spinor3.prototype.multiply = function (rhs) {
        var w = rhs.w;
        return this;
    };
    Spinor3.prototype.multiplyScalar = function (scalar) {
        this.yz *= scalar;
        this.zx *= scalar;
        this.xy *= scalar;
        this.w *= scalar;
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
})(AbstractVector);
module.exports = Spinor3;
