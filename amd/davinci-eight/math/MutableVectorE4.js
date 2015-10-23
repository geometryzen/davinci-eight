var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/VectorN'], function (require, exports, VectorN) {
    /**
     * @class MutableVectorE4
     */
    var MutableVectorE4 = (function (_super) {
        __extends(MutableVectorE4, _super);
        /**
         * @class MutableVectorE4
         * @constructor
         * @param data {number[]} Default is [0, 0, 0, 0].
         * @param modified {boolean} Default is false.
         */
        function MutableVectorE4(data, modified) {
            if (data === void 0) { data = [0, 0, 0, 0]; }
            if (modified === void 0) { modified = false; }
            _super.call(this, data, modified, 4);
        }
        Object.defineProperty(MutableVectorE4.prototype, "x", {
            /**
             * @property x
             * @type Number
             */
            get: function () {
                return this.data[0];
            },
            set: function (value) {
                this.modified = this.modified || this.x !== value;
                this.data[0] = value;
            },
            enumerable: true,
            configurable: true
        });
        MutableVectorE4.prototype.setX = function (x) {
            this.x = x;
            return this;
        };
        Object.defineProperty(MutableVectorE4.prototype, "y", {
            /**
             * @property y
             * @type Number
             */
            get: function () {
                return this.data[1];
            },
            set: function (value) {
                this.modified = this.modified || this.y !== value;
                this.data[1] = value;
            },
            enumerable: true,
            configurable: true
        });
        MutableVectorE4.prototype.setY = function (y) {
            this.y = y;
            return this;
        };
        Object.defineProperty(MutableVectorE4.prototype, "z", {
            /**
             * @property z
             * @type Number
             */
            get: function () {
                return this.data[2];
            },
            set: function (value) {
                this.modified = this.modified || this.z !== value;
                this.data[2] = value;
            },
            enumerable: true,
            configurable: true
        });
        MutableVectorE4.prototype.setZ = function (z) {
            this.z = z;
            return this;
        };
        Object.defineProperty(MutableVectorE4.prototype, "w", {
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
        MutableVectorE4.prototype.setW = function (w) {
            this.w = w;
            return this;
        };
        MutableVectorE4.prototype.add = function (vector, α) {
            if (α === void 0) { α = 1; }
            this.x += vector.x * α;
            this.y += vector.y * α;
            this.z += vector.z * α;
            this.w += vector.w * α;
            return this;
        };
        MutableVectorE4.prototype.add2 = function (a, b) {
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            this.z = a.z + b.z;
            this.w = a.w + b.w;
            return this;
        };
        MutableVectorE4.prototype.clone = function () {
            return new MutableVectorE4([this.x, this.y, this.z, this.w]);
        };
        MutableVectorE4.prototype.copy = function (v) {
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
            this.w = v.w;
            return this;
        };
        MutableVectorE4.prototype.divideByScalar = function (α) {
            this.x /= α;
            this.y /= α;
            this.z /= α;
            this.w /= α;
            return this;
        };
        MutableVectorE4.prototype.lerp = function (target, α) {
            this.x += (target.x - this.x) * α;
            this.y += (target.y - this.y) * α;
            this.z += (target.z - this.z) * α;
            this.w += (target.w - this.w) * α;
            return this;
        };
        MutableVectorE4.prototype.lerp2 = function (a, b, α) {
            this.sub2(b, a).scale(α).add(a);
            return this;
        };
        MutableVectorE4.prototype.scale = function (α) {
            this.x *= α;
            this.y *= α;
            this.z *= α;
            this.w *= α;
            return this;
        };
        MutableVectorE4.prototype.reflect = function (n) {
            // TODO
            return this;
        };
        MutableVectorE4.prototype.rotate = function (rotor) {
            // TODO
            return this;
        };
        MutableVectorE4.prototype.sub = function (v, α) {
            this.x -= v.x * α;
            this.y -= v.y * α;
            this.z -= v.z * α;
            this.w -= v.w * α;
            return this;
        };
        MutableVectorE4.prototype.sub2 = function (a, b) {
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.z = a.z - b.z;
            this.w = a.w - b.w;
            return this;
        };
        return MutableVectorE4;
    })(VectorN);
    return MutableVectorE4;
});
