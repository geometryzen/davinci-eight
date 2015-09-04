var expectArg = require('../checks/expectArg');
/**
 * @class Vector1
 */
var Vector1 = (function () {
    /**
     * @class Vector1
     * @constructor
     * @param data {number[]}
     */
    function Vector1(data) {
        if (data === void 0) { data = [0, 0]; }
        this.data = data;
        this.modified = false;
    }
    Object.defineProperty(Vector1.prototype, "data", {
        get: function () {
            if (this.$data) {
                return this.$data;
            }
            else if (this.$callback) {
                var data = this.$callback();
                expectArg('callback()', data).toSatisfy(data.length === 1, "callback() length must be 1");
                return this.$callback();
            }
            else {
                throw new Error("Vector1 is undefined.");
            }
        },
        set: function (data) {
            expectArg('data', data).toSatisfy(data.length === 1, "data length must be 1");
            this.$data = data;
            this.$callback = void 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector1.prototype, "callback", {
        get: function () {
            return this.$callback;
        },
        set: function (reactTo) {
            this.$callback = reactTo;
            this.$data = void 0;
        },
        enumerable: true,
        configurable: true
    });
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
    Vector1.prototype.setComponent = function (index, value) {
        switch (index) {
            case 0:
                this.x = value;
                break;
            default: throw new Error('index is out of range: ' + index);
        }
    };
    Vector1.prototype.getComponent = function (index) {
        switch (index) {
            case 0: return this.x;
            default: throw new Error('index is out of range: ' + index);
        }
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
    Vector1.prototype.addVectors = function (a, b) {
        this.x = a.x + b.x;
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
    Vector1.prototype.subVectors = function (a, b) {
        this.x = a.x - b.x;
        return this;
    };
    Vector1.prototype.multiply = function (v) {
        this.x *= v.x;
        return this;
    };
    Vector1.prototype.multiplyScalar = function (s) {
        this.x *= s;
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
        this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);
        return this;
    };
    Vector1.prototype.equals = function (v) {
        return v.x === this.x;
    };
    Vector1.prototype.fromArray = function (array, offset) {
        if (offset === undefined)
            offset = 0;
        this.x = array[offset];
        return this;
    };
    Vector1.prototype.toArray = function (array, offset) {
        if (array === undefined)
            array = [];
        if (offset === undefined)
            offset = 0;
        array[offset] = this.x;
        return array;
    };
    Vector1.prototype.fromAttribute = function (attribute, index, offset) {
        if (offset === undefined)
            offset = 0;
        index = index * attribute.itemSize + offset;
        this.x = attribute.array[index];
        return this;
    };
    Vector1.prototype.clone = function () {
        return new Vector1([this.x]);
    };
    return Vector1;
})();
module.exports = Vector1;