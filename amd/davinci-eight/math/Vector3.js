var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../checks/expectArg', '../checks/isNumber', '../math/VectorN', '../math/wedgeXY', '../math/wedgeYZ', '../math/wedgeZX'], function (require, exports, expectArg, isNumber, VectorN, wedgeXY, wedgeYZ, wedgeZX) {
    /**
     * @class Vector3
     */
    var Vector3 = (function (_super) {
        __extends(Vector3, _super);
        /**
         * @class Vector3
         * @constructor
         * @param data {number[]} Default is [0, 0, 0].
         * @param modified {boolean} Default is false;
         */
        function Vector3(data, modified) {
            if (data === void 0) { data = [0, 0, 0]; }
            if (modified === void 0) { modified = false; }
            _super.call(this, data, modified, 3);
        }
        Vector3.dot = function (a, b) {
            return a.x * b.x + a.y * b.y + a.z * b.z;
        };
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
            return this.sum(this, v);
        };
        Vector3.prototype.sum = function (a, b) {
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            this.z = a.z + b.z;
            return this;
        };
        Vector3.prototype.applyMatrix3 = function (m) {
            var x = this.x;
            var y = this.y;
            var z = this.z;
            var e = m.data;
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
            var e = m.data;
            this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
            this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
            this.z = e[2] * x + e[6] * y + e[10] * z + e[14];
            return this;
        };
        /**
         * @method reflect
         * @param n {Cartesian3}
         * @return {Vector3}
         */
        Vector3.prototype.reflect = function (n) {
            var ax = this.x;
            var ay = this.y;
            var az = this.z;
            var nx = n.x;
            var ny = n.y;
            var nz = n.z;
            var dot2 = (ax * nx + ay * ny + az * nz) * 2;
            this.x = ax - dot2 * nx;
            this.y = ay - dot2 * ny;
            this.z = az - dot2 * nz;
            return this;
        };
        Vector3.prototype.rotate = function (spinor) {
            var x = this.x;
            var y = this.y;
            var z = this.z;
            var a = spinor.xy;
            var b = spinor.yz;
            var c = spinor.zx;
            var w = spinor.w;
            var ix = w * x - c * z + a * y;
            var iy = w * y - a * x + b * z;
            var iz = w * z - b * y + c * x;
            var iw = b * x + c * y + a * z;
            this.x = ix * w + iw * b + iy * a - iz * c;
            this.y = iy * w + iw * c + iz * b - ix * a;
            this.z = iz * w + iw * a + ix * c - iy * b;
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
            var x = wedgeYZ(ax, ay, az, bx, by, bz);
            var y = wedgeZX(ax, ay, az, bx, by, bz);
            var z = wedgeXY(ax, ay, az, bx, by, bz);
            this.set(x, y, z);
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
        Vector3.prototype.lerp = function (target, alpha) {
            this.x += (target.x - this.x) * alpha;
            this.y += (target.y - this.y) * alpha;
            this.z += (target.z - this.z) * alpha;
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
        Vector3.prototype.scale = function (scalar) {
            this.x *= scalar;
            this.y *= scalar;
            this.z *= scalar;
            return this;
        };
        Vector3.prototype.set = function (x, y, z) {
            this.x = expectArg('x', x).toBeNumber().value;
            this.y = expectArg('y', y).toBeNumber().value;
            this.z = expectArg('z', z).toBeNumber().value;
            return this;
        };
        Vector3.prototype.setMagnitude = function (magnitude) {
            var m = this.magnitude();
            if (m !== 0) {
                if (magnitude !== m) {
                    return this.scale(magnitude / m);
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
            return this.difference(this, v);
        };
        Vector3.prototype.difference = function (a, b) {
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
         * Returns the result of `this` + `rhs` without modifying `this`.
         * @method __add__
         * @param rhs {Vector3}
         * @return {Vector3}
         */
        Vector3.prototype.__add__ = function (rhs) {
            if (rhs instanceof Vector3) {
                return this.clone().add(rhs);
            }
            else {
                return void 0;
            }
        };
        Vector3.prototype.__sub__ = function (rhs) {
            if (rhs instanceof Vector3) {
                return this.clone().sub(rhs);
            }
            else {
                return void 0;
            }
        };
        Vector3.prototype.__mul__ = function (rhs) {
            if (isNumber(rhs)) {
                return this.clone().scale(rhs);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method copy
         * @param vector {Cartesian}
         * @return {Vector3}
         * @static
         */
        Vector3.copy = function (vector) {
            return new Vector3([vector.x, vector.y, vector.z]);
        };
        /**
         * <code>a + alpha * (b - a)</code>
         * @method lerp
         * @param a {Cartesian3}
         * @param b {Cartesian3}
         * @param alpha {number}
         * @return {Vector3}
         */
        Vector3.lerp = function (a, b, alpha) {
            return Vector3.copy(b).sub(a).scale(alpha).add(a);
        };
        /**
         * @method random
         * @return {Vector3}
         * @static
         */
        Vector3.random = function () {
            return new Vector3([Math.random(), Math.random(), Math.random()]);
        };
        Vector3.e1 = new Vector3([1, 0, 0]);
        Vector3.e2 = new Vector3([0, 1, 0]);
        Vector3.e3 = new Vector3([0, 0, 1]);
        return Vector3;
    })(VectorN);
    return Vector3;
});
