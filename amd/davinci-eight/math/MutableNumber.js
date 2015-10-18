var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/VectorN'], function (require, exports, VectorN) {
    /**
     * @class MutableNumber
     */
    var MutableNumber = (function (_super) {
        __extends(MutableNumber, _super);
        /**
         * @class MutableNumber
         * @constructor
         * @param data {number[]} Default is [0].
         * @param modified {boolean} Default is false.
         */
        function MutableNumber(data, modified) {
            if (data === void 0) { data = [0]; }
            if (modified === void 0) { modified = false; }
            _super.call(this, data, modified, 1);
        }
        Object.defineProperty(MutableNumber.prototype, "x", {
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
        MutableNumber.prototype.set = function (x) {
            this.x = x;
            return this;
        };
        MutableNumber.prototype.setX = function (x) {
            this.x = x;
            return this;
        };
        MutableNumber.prototype.copy = function (v) {
            this.x = v.x;
            return this;
        };
        MutableNumber.prototype.add = function (v) {
            this.x += v.x;
            return this;
        };
        MutableNumber.prototype.addScalar = function (s) {
            this.x += s;
            return this;
        };
        MutableNumber.prototype.determinant = function () {
            return this.x;
        };
        MutableNumber.prototype.sum = function (a, b) {
            this.x = a.x + b.x;
            return this;
        };
        MutableNumber.prototype.exp = function () {
            this.x = Math.exp(this.x);
            return this;
        };
        MutableNumber.prototype.sub = function (v) {
            this.x -= v.x;
            return this;
        };
        MutableNumber.prototype.subScalar = function (s) {
            this.x -= s;
            return this;
        };
        MutableNumber.prototype.difference = function (a, b) {
            this.x = a.x - b.x;
            return this;
        };
        MutableNumber.prototype.identity = function () {
            this.x = 1;
            return this;
        };
        MutableNumber.prototype.multiply = function (v) {
            this.x *= v.x;
            return this;
        };
        MutableNumber.prototype.scale = function (scalar) {
            this.x *= scalar;
            return this;
        };
        MutableNumber.prototype.divide = function (v) {
            this.x /= v.x;
            return this;
        };
        MutableNumber.prototype.divideScalar = function (scalar) {
            if (scalar !== 0) {
                var invScalar = 1 / scalar;
                this.x *= invScalar;
            }
            else {
                this.x = 0;
            }
            return this;
        };
        MutableNumber.prototype.min = function (v) {
            if (this.x > v.x) {
                this.x = v.x;
            }
            return this;
        };
        MutableNumber.prototype.max = function (v) {
            if (this.x < v.x) {
                this.x = v.x;
            }
            return this;
        };
        MutableNumber.prototype.floor = function () {
            this.x = Math.floor(this.x);
            return this;
        };
        MutableNumber.prototype.ceil = function () {
            this.x = Math.ceil(this.x);
            return this;
        };
        MutableNumber.prototype.round = function () {
            this.x = Math.round(this.x);
            return this;
        };
        MutableNumber.prototype.roundToZero = function () {
            this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
            return this;
        };
        MutableNumber.prototype.negate = function () {
            this.x = -this.x;
            return this;
        };
        MutableNumber.prototype.distanceTo = function (position) {
            return Math.sqrt(this.quadranceTo(position));
        };
        MutableNumber.prototype.dot = function (v) {
            return this.x * v.x;
        };
        MutableNumber.prototype.magnitude = function () {
            return Math.sqrt(this.quaditude());
        };
        MutableNumber.prototype.normalize = function () {
            return this.divideScalar(this.magnitude());
        };
        MutableNumber.prototype.product = function (a, b) {
            return this;
        };
        MutableNumber.prototype.quaditude = function () {
            return this.x * this.x;
        };
        MutableNumber.prototype.quadranceTo = function (position) {
            var dx = this.x - position.x;
            return dx * dx;
        };
        MutableNumber.prototype.reflect = function (n) {
            // FIXME: TODO
            return this;
        };
        MutableNumber.prototype.rotate = function (rotor) {
            return this;
        };
        MutableNumber.prototype.setMagnitude = function (l) {
            var oldLength = this.magnitude();
            if (oldLength !== 0 && l !== oldLength) {
                this.scale(l / oldLength);
            }
            return this;
        };
        MutableNumber.prototype.lerp = function (v, alpha) {
            this.x += (v.x - this.x) * alpha;
            return this;
        };
        MutableNumber.prototype.lerpVectors = function (v1, v2, alpha) {
            this.difference(v2, v1).scale(alpha).add(v1);
            return this;
        };
        MutableNumber.prototype.equals = function (v) {
            return v.x === this.x;
        };
        MutableNumber.prototype.fromArray = function (array, offset) {
            if (offset === void 0) { offset = 0; }
            this.x = array[offset];
            return this;
        };
        MutableNumber.prototype.toArray = function (array, offset) {
            if (array === void 0) { array = []; }
            if (offset === void 0) { offset = 0; }
            array[offset] = this.x;
            return array;
        };
        MutableNumber.prototype.fromAttribute = function (attribute, index, offset) {
            if (offset === void 0) { offset = 0; }
            index = index * attribute.itemSize + offset;
            this.x = attribute.array[index];
            return this;
        };
        MutableNumber.prototype.clone = function () {
            return new MutableNumber([this.x]);
        };
        return MutableNumber;
    })(VectorN);
    return MutableNumber;
});
