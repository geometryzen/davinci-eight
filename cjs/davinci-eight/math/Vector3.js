var expectArg = require('../checks/expectArg');
/**
 * @class Vector3
 */
var Vector3 = (function () {
    /**
     * @class Vector3
     * @constructor
     * @param data {number[]}
     */
    function Vector3(data) {
        if (data === void 0) { data = [0, 0, 0]; }
        this.data = data;
        this.modified = false;
    }
    Vector3.dot = function (a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    };
    Object.defineProperty(Vector3.prototype, "data", {
        get: function () {
            if (this.$data) {
                return this.$data;
            }
            else if (this.$callback) {
                var data = this.$callback();
                expectArg('callback()', data).toSatisfy(data.length === 3, "callback() length must be 3");
                return this.$callback();
            }
            else {
                throw new Error("Vector3 is undefined.");
            }
        },
        set: function (data) {
            expectArg('data', data).toSatisfy(data.length === 3, "data length must be 3");
            this.$data = data;
            this.$callback = void 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector3.prototype, "callback", {
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
    Object.defineProperty(Vector3.prototype, "x", {
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
    Object.defineProperty(Vector3.prototype, "y", {
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
    Object.defineProperty(Vector3.prototype, "z", {
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
    /**
     * Performs in-place addition of vectors.
     *
     * @method add
     * @param v {Vector3} The vector to add to this vector.
     */
    Vector3.prototype.add = function (v) {
        return this.addVectors(this, v);
    };
    Vector3.prototype.addVectors = function (a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        return this;
    };
    Vector3.prototype.applyMatrix3 = function (m) {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var e = m.elements;
        this.x = e[0x0] * x + e[0x3] * y + e[0x6] * z;
        this.y = e[0x1] * x + e[0x4] * y + e[0x7] * z;
        this.z = e[0x2] * x + e[0x5] * y + e[0x8] * z;
        return this;
    };
    /**
     * Pre-multiplies the column vector corresponding to this vector by the matrix.
     * The result is applied to this vector.
     * Strictly speaking, this method does not make much sense because the dimensions
     * of the square matrix and column vector don't match.
     * TODO: Used by TubeGeometry.
     * @method applyMatrix
     * @param m The 4x4 matrix that pre-multiplies this column vector.
     */
    Vector3.prototype.applyMatrix4 = function (m) {
        var x = this.x, y = this.y, z = this.z;
        var e = m.elements;
        this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
        this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
        this.z = e[2] * x + e[6] * y + e[10] * z + e[14];
        return this;
    };
    Vector3.prototype.applyQuaternion = function (q) {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var qx = q.x;
        var qy = q.y;
        var qz = q.z;
        var qw = q.w;
        // calculate quat * vector
        var ix = qw * x + qy * z - qz * y;
        var iy = qw * y + qz * x - qx * z;
        var iz = qw * z + qx * y - qy * x;
        var iw = -qx * x - qy * y - qz * z;
        // calculate (quat * vector) * inverse quat
        this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
        return this;
    };
    Vector3.prototype.applySpinor = function (spinor) {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var qx = spinor.yz;
        var qy = spinor.zx;
        var qz = spinor.xy;
        var qw = spinor.w;
        // calculate quat * vector
        var ix = qw * x + qy * z - qz * y;
        var iy = qw * y + qz * x - qx * z;
        var iz = qw * z + qx * y - qy * x;
        var iw = -qx * x - qy * y - qz * z;
        // calculate (quat * vector) * inverse quat
        this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
        return this;
    };
    Vector3.prototype.clone = function () {
        return new Vector3([this.x, this.y, this.z]);
    };
    Vector3.prototype.copy = function (v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    };
    Vector3.prototype.cross = function (v) {
        return this.crossVectors(this, v);
    };
    Vector3.prototype.crossVectors = function (a, b) {
        var ax = a.x, ay = a.y, az = a.z;
        var bx = b.x, by = b.y, bz = b.z;
        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;
        return this;
    };
    Vector3.prototype.distanceTo = function (position) {
        return Math.sqrt(this.quadranceTo(position));
    };
    Vector3.prototype.quadranceTo = function (position) {
        var dx = this.x - position.x;
        var dy = this.y - position.y;
        var dz = this.z - position.z;
        return dx * dx + dy * dy + dz * dz;
    };
    Vector3.prototype.divideScalar = function (scalar) {
        if (scalar !== 0) {
            var invScalar = 1 / scalar;
            this.x *= invScalar;
            this.y *= invScalar;
            this.z *= invScalar;
        }
        else {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        }
        return this;
    };
    Vector3.prototype.dot = function (v) {
        return Vector3.dot(this, v);
    };
    Vector3.prototype.magnitude = function () {
        return Math.sqrt(this.quaditude());
    };
    Vector3.prototype.quaditude = function () {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        return x * x + y * y + z * z;
    };
    Vector3.prototype.lerp = function (v, alpha) {
        this.x += (v.x - this.x) * alpha;
        this.y += (v.y - this.y) * alpha;
        this.z += (v.z - this.z) * alpha;
        return this;
    };
    Vector3.prototype.normalize = function () {
        return this.divideScalar(this.magnitude());
    };
    Vector3.prototype.multiply = function (v) {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        return this;
    };
    Vector3.prototype.multiplyScalar = function (scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    };
    Vector3.prototype.set = function (x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    };
    Vector3.prototype.setMagnitude = function (magnitude) {
        var m = this.magnitude();
        if (m !== 0) {
            if (magnitude !== m) {
                return this.multiplyScalar(magnitude / m);
            }
            else {
                return this; // No change
            }
        }
        else {
            // Former magnitude was zero, i.e. a null vector.
            throw new Error("Attempting to set the magnitude of a null vector.");
        }
    };
    Vector3.prototype.setX = function (x) {
        this.x = x;
        return this;
    };
    Vector3.prototype.setY = function (y) {
        this.y = y;
        return this;
    };
    Vector3.prototype.setZ = function (z) {
        this.z = z;
        return this;
    };
    Vector3.prototype.sub = function (v) {
        return this.subVectors(this, v);
    };
    Vector3.prototype.subVectors = function (a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        return this;
    };
    /**
     * @method toString
     * @return {string} A non-normative string representation of the target.
     */
    Vector3.prototype.toString = function () {
        return "Vector3({x: " + this.x + ", y: " + this.y + ", z: " + this.z + "})";
    };
    /**
     * @method copy
     * Copy constructor.
     */
    Vector3.copy = function (vector) {
        return new Vector3([vector.x, vector.y, vector.z]);
    };
    Vector3.e1 = new Vector3([1, 0, 0]);
    Vector3.e2 = new Vector3([0, 1, 0]);
    Vector3.e3 = new Vector3([0, 0, 1]);
    return Vector3;
})();
module.exports = Vector3;
