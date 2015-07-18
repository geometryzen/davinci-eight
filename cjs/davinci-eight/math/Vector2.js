var Vector2 = (function () {
    function Vector2(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
    Vector2.prototype.set = function (x, y) {
        this.x = x;
        this.y = y;
        return this;
    };
    Vector2.prototype.setX = function (x) {
        this.x = x;
        return this;
    };
    Vector2.prototype.setY = function (y) {
        this.y = y;
        return this;
    };
    Vector2.prototype.setComponent = function (index, value) {
        switch (index) {
            case 0:
                this.x = value;
                break;
            case 1:
                this.y = value;
                break;
            default: throw new Error('index is out of range: ' + index);
        }
    };
    Vector2.prototype.getComponent = function (index) {
        switch (index) {
            case 0: return this.x;
            case 1: return this.y;
            default: throw new Error('index is out of range: ' + index);
        }
    };
    Vector2.prototype.copy = function (v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    };
    Vector2.prototype.add = function (v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    };
    Vector2.prototype.addScalar = function (s) {
        this.x += s;
        this.y += s;
        return this;
    };
    Vector2.prototype.addVectors = function (a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        return this;
    };
    Vector2.prototype.sub = function (v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    };
    Vector2.prototype.subScalar = function (s) {
        this.x -= s;
        this.y -= s;
        return this;
    };
    Vector2.prototype.subVectors = function (a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        return this;
    };
    Vector2.prototype.multiply = function (v) {
        this.x *= v.x;
        this.y *= v.y;
        return this;
    };
    Vector2.prototype.multiplyScalar = function (s) {
        this.x *= s;
        this.y *= s;
        return this;
    };
    Vector2.prototype.divide = function (v) {
        this.x /= v.x;
        this.y /= v.y;
        return this;
    };
    Vector2.prototype.divideScalar = function (scalar) {
        if (scalar !== 0) {
            var invScalar = 1 / scalar;
            this.x *= invScalar;
            this.y *= invScalar;
        }
        else {
            this.x = 0;
            this.y = 0;
        }
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
    Vector2.prototype.negate = function () {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    };
    Vector2.prototype.dot = function (v) {
        return this.x * v.x + this.y * v.y;
    };
    Vector2.prototype.lengthSq = function () {
        return this.x * this.x + this.y * this.y;
    };
    Vector2.prototype.length = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    Vector2.prototype.normalize = function () {
        return this.divideScalar(this.length());
    };
    Vector2.prototype.distanceTo = function (v) {
        return Math.sqrt(this.distanceToSquared(v));
    };
    Vector2.prototype.distanceToSquared = function (v) {
        var dx = this.x - v.x, dy = this.y - v.y;
        return dx * dx + dy * dy;
    };
    Vector2.prototype.setLength = function (l) {
        var oldLength = this.length();
        if (oldLength !== 0 && l !== oldLength) {
            this.multiplyScalar(l / oldLength);
        }
        return this;
    };
    Vector2.prototype.lerp = function (v, alpha) {
        this.x += (v.x - this.x) * alpha;
        this.y += (v.y - this.y) * alpha;
        return this;
    };
    Vector2.prototype.lerpVectors = function (v1, v2, alpha) {
        this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);
        return this;
    };
    Vector2.prototype.equals = function (v) {
        return ((v.x === this.x) && (v.y === this.y));
    };
    Vector2.prototype.fromArray = function (array, offset) {
        if (offset === undefined)
            offset = 0;
        this.x = array[offset];
        this.y = array[offset + 1];
        return this;
    };
    Vector2.prototype.toArray = function (array, offset) {
        if (array === undefined)
            array = [];
        if (offset === undefined)
            offset = 0;
        array[offset] = this.x;
        array[offset + 1] = this.y;
        return array;
    };
    Vector2.prototype.fromAttribute = function (attribute, index, offset) {
        if (offset === undefined)
            offset = 0;
        index = index * attribute.itemSize + offset;
        this.x = attribute.array[index];
        this.y = attribute.array[index + 1];
        return this;
    };
    Vector2.prototype.clone = function () {
        return new Vector2(this.x, this.y);
    };
    return Vector2;
})();
module.exports = Vector2;
