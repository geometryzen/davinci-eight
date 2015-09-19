var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/VectorN'], function (require, exports, VectorN) {
    /**
     * @class Vector1
     */
    var Vector1 = (function (_super) {
        __extends(Vector1, _super);
        /**
         * @class Vector1
         * @constructor
         * @param data {number[]} Default is [0].
         * @param modified {boolean} Default is false.
         */
        function Vector1(data, modified) {
            if (data === void 0) { data = [0]; }
            if (modified === void 0) { modified = false; }
            _super.call(this, data, modified, 1);
        }
        Object.defineProperty(Vector1.prototype, "x", {
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
        Vector1.prototype.set = function (x) {
            this.x = x;
            return this;
        };
        Vector1.prototype.setX = function (x) {
            this.x = x;
            return this;
        };
        Vector1.prototype.copy = function (v) {
            this.x = v.x;
            return this;
        };
        Vector1.prototype.add = function (v) {
            this.x += v.x;
            return this;
        };
        Vector1.prototype.addScalar = function (s) {
            this.x += s;
            return this;
        };
        Vector1.prototype.sum = function (a, b) {
            this.x = a.x + b.x;
            return this;
        };
        Vector1.prototype.exp = function () {
            this.x = Math.exp(this.x);
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
        Vector1.prototype.difference = function (a, b) {
            this.x = a.x - b.x;
            return this;
        };
        Vector1.prototype.multiply = function (v) {
            this.x *= v.x;
            return this;
        };
        Vector1.prototype.multiplyScalar = function (scalar) {
            this.x *= scalar;
            return this;
        };
        Vector1.prototype.divide = function (v) {
            this.x /= v.x;
            return this;
        };
        Vector1.prototype.divideScalar = function (scalar) {
            if (scalar !== 0) {
                var invScalar = 1 / scalar;
                this.x *= invScalar;
            }
            else {
                this.x = 0;
            }
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
        Vector1.prototype.round = function () {
            this.x = Math.round(this.x);
            return this;
        };
        Vector1.prototype.roundToZero = function () {
            this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
            return this;
        };
        Vector1.prototype.negate = function () {
            this.x = -this.x;
            return this;
        };
        Vector1.prototype.distanceTo = function (position) {
            return Math.sqrt(this.quadranceTo(position));
        };
        Vector1.prototype.dot = function (v) {
            return this.x * v.x;
        };
        Vector1.prototype.magnitude = function () {
            return Math.sqrt(this.quaditude());
        };
        Vector1.prototype.normalize = function () {
            return this.divideScalar(this.magnitude());
        };
        Vector1.prototype.quaditude = function () {
            return this.x * this.x;
        };
        Vector1.prototype.quadranceTo = function (position) {
            var dx = this.x - position.x;
            return dx * dx;
        };
        Vector1.prototype.rotate = function (rotor) {
            return this;
        };
        Vector1.prototype.setMagnitude = function (l) {
            var oldLength = this.magnitude();
            if (oldLength !== 0 && l !== oldLength) {
                this.multiplyScalar(l / oldLength);
            }
            return this;
        };
        Vector1.prototype.lerp = function (v, alpha) {
            this.x += (v.x - this.x) * alpha;
            return this;
        };
        Vector1.prototype.lerpVectors = function (v1, v2, alpha) {
            this.difference(v2, v1).multiplyScalar(alpha).add(v1);
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
        Vector1.prototype.fromAttribute = function (attribute, index, offset) {
            if (offset === void 0) { offset = 0; }
            index = index * attribute.itemSize + offset;
            this.x = attribute.array[index];
            return this;
        };
        Vector1.prototype.clone = function () {
            return new Vector1([this.x]);
        };
        return Vector1;
    })(VectorN);
    return Vector1;
});
