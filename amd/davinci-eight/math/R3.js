var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/dotVectorE3', '../math/Euclidean3', '../checks/isDefined', '../checks/isNumber', '../checks/mustBeNumber', '../checks/mustBeObject', '../math/VectorN', '../math/wedgeXY', '../math/wedgeYZ', '../math/wedgeZX'], function (require, exports, dotVectorE3, Euclidean3, isDefined, isNumber, mustBeNumber, mustBeObject, VectorN, wedgeXY, wedgeYZ, wedgeZX) {
    /**
     * @class R3
     * @extends VectorN<number>
     */
    var R3 = (function (_super) {
        __extends(R3, _super);
        /**
         * @class R3
         * @constructor
         * @param data [number[] = [0, 0, 0]]
         * @param modified [boolean = false]
         */
        function R3(data, modified) {
            if (data === void 0) { data = [0, 0, 0]; }
            if (modified === void 0) { modified = false; }
            _super.call(this, data, modified, 3);
        }
        /**
         * @method dot
         * @param a {VectorE3}
         * @param b {VectorE3}
         * @return {number}
         * @static
         */
        R3.dot = function (a, b) {
            return a.x * b.x + a.y * b.y + a.z * b.z;
        };
        Object.defineProperty(R3.prototype, "x", {
            /**
             * @property x
             * @type {number}
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
        Object.defineProperty(R3.prototype, "y", {
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
        Object.defineProperty(R3.prototype, "z", {
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
         * <p>
         * <code>this ⟼ this + vector * α</code>
         * </p>
         * @method add
         * @param vector {R3}
         * @param α [number = 1]
         * @return {R3} <code>this</code>
         * @chainable
         */
        R3.prototype.add = function (vector, α) {
            if (α === void 0) { α = 1; }
            mustBeObject('vector', vector);
            mustBeNumber('α', α);
            this.x += vector.x * α;
            this.y += vector.y * α;
            this.z += vector.z * α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a + b</code>
         * </p>
         * @method add2
         * @param a {VectorE3}
         * @param b {VectorE3}
         * @return {R3} <code>this</code>
         * @chainable
         */
        R3.prototype.add2 = function (a, b) {
            mustBeObject('a', a);
            mustBeObject('b', b);
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            this.z = a.z + b.z;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ m * this</code>
         * </p>
         * @method applyMatrix3
         * @param m {Matrix3}
         * @return {R3} <code>this</code>
         * @chainable
         * @deprecated
         */
        R3.prototype.applyMatrix3 = function (m) {
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
         * TODO: Used by TubeSimplexGeometry.
         * @method applyMatrix
         * @param m The 4x4 matrix that pre-multiplies this column vector.
         * @return {R3} <code>this</code>
         * @chainable
         * @deprecated
         */
        R3.prototype.applyMatrix4 = function (m) {
            var x = this.x, y = this.y, z = this.z;
            var e = m.data;
            this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
            this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
            this.z = e[2] * x + e[6] * y + e[10] * z + e[14];
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ - n * this * n</code>
         * </p>
         * @method reflect
         * @param n {VectorE3}
         * @return {R3} <code>this</code>
         * @chainable
         */
        R3.prototype.reflect = function (n) {
            mustBeObject('n', n);
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
        /**
         * <p>
         * <code>this ⟼ R * this * rev(R)</code>
         * </p>
         * @method rotate
         * @param R {SpinorE3}
         * @return {R3} <code>this</code>
         * @chainable
         */
        R3.prototype.rotate = function (R) {
            mustBeObject('R', R);
            var x = this.x;
            var y = this.y;
            var z = this.z;
            var a = R.xy;
            var b = R.yz;
            var c = R.zx;
            var w = R.α;
            var ix = w * x - c * z + a * y;
            var iy = w * y - a * x + b * z;
            var iz = w * z - b * y + c * x;
            var iw = b * x + c * y + a * z;
            this.x = ix * w + iw * b + iy * a - iz * c;
            this.y = iy * w + iw * c + iz * b - ix * a;
            this.z = iz * w + iw * a + ix * c - iy * b;
            return this;
        };
        /**
         * @method clone
         * @return {R3} <code>copy(this)</code>
         */
        R3.prototype.clone = function () {
            return new R3([this.x, this.y, this.z]);
        };
        /**
         * <p>
         * <code>this ⟼ copy(v)</code>
         * </p>
         * @method copy
         * @param v {VectorE3}
         * @return {R3} <code>this</code>
         * @chainable
         */
        R3.prototype.copy = function (v) {
            mustBeObject('v', v);
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this ✕ v</code>
         * </p>
         * @method cross
         * @param v {VectorE3}
         * @return {R3} <code>this</code>
         * @chainable
         */
        R3.prototype.cross = function (v) {
            mustBeObject('v', v);
            return this.cross2(this, v);
        };
        /**
         * <p>
         * <code>this ⟼ a ✕ b</code>
         * </p>
         * @method cross2
         * @param a {VectorE3}
         * @param b {VectorE3}
         * @return {R3} <code>this</code>
         * @chainable
         */
        R3.prototype.cross2 = function (a, b) {
            mustBeObject('a', a);
            mustBeObject('b', b);
            var ax = a.x, ay = a.y, az = a.z;
            var bx = b.x, by = b.y, bz = b.z;
            this.x = wedgeYZ(ax, ay, az, bx, by, bz);
            this.y = wedgeZX(ax, ay, az, bx, by, bz);
            this.z = wedgeXY(ax, ay, az, bx, by, bz);
            return this;
        };
        /**
         * @method distanceTo
         * @param point {VectorE3}
         * @return {number}
         */
        R3.prototype.distanceTo = function (point) {
            if (isDefined(point)) {
                return Math.sqrt(this.quadranceTo(point));
            }
            else {
                return void 0;
            }
        };
        /**
         * @method quadranceTo
         * @param point {VectorE3}
         * @return {number}
         */
        R3.prototype.quadranceTo = function (point) {
            if (isDefined(point)) {
                var dx = this.x - point.x;
                var dy = this.y - point.y;
                var dz = this.z - point.z;
                return dx * dx + dy * dy + dz * dz;
            }
            else {
                return void 0;
            }
        };
        /**
         * <p>
         * <code>this ⟼ this / α</code>
         * </p>
         * @method divByScalar
         * @param α {number}
         * @return {R3} <code>this</code>
         * @chainable
         */
        R3.prototype.divByScalar = function (α) {
            mustBeNumber('α', α);
            if (α !== 0) {
                var invScalar = 1 / α;
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
        /**
         * @method dot
         * @param v {VectorE3}
         * @return {number}
         */
        R3.prototype.dot = function (v) {
            return R3.dot(this, v);
        };
        /**
         * Returns the (Euclidean) norm of this vector.
         * @method magnitude
         * @return {number} <code>norm(this)</code>
         */
        R3.prototype.magnitude = function () {
            return Math.sqrt(this.squaredNorm());
        };
        /**
         * @method neg
         * @return {R3} <code>this</code>
         * @chainable
         */
        R3.prototype.neg = function () {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            return this;
        };
        /**
         * Returns the (Euclidean) inner product of this vector with itself.
         * @method squaredNorm
         * @return {number} <code>this ⋅ this</code> or <code>norm(this) * norm(this)</code>
         */
        R3.prototype.squaredNorm = function () {
            // quad = scp(v, rev(v)) = scp(v, v)
            // TODO: This is correct but could be optimized.
            return dotVectorE3(this, this);
        };
        /**
         * <p>
         * <code>this ⟼ this + α * (target - this)</code>
         * </p>
         * @method lerp
         * @param target {VectorE3}
         * @param α {number}
         * @return {R3} <code>this</code>
         * @chainable
         */
        R3.prototype.lerp = function (target, α) {
            mustBeObject('target', target);
            mustBeNumber('α', α);
            this.x += (target.x - this.x) * α;
            this.y += (target.y - this.y) * α;
            this.z += (target.z - this.z) * α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a + α * (b - a)</code>
         * </p>
         * @method lerp2
         * @param a {VectorE3}
         * @param b {VectorE3}
         * @param α {number}
         * @return {R3} <code>this</code>
         * @chainable
         */
        R3.prototype.lerp2 = function (a, b, α) {
            mustBeObject('a', a);
            mustBeObject('b', b);
            mustBeNumber('α', α);
            this.copy(a).lerp(b, α);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this / norm(this)</code>
         * </p>
         * @method normalize
         * @return {R3} <code>this</code>
         * @chainable
         */
        R3.prototype.normalize = function () {
            return this.divByScalar(this.magnitude());
        };
        /**
         * <p>
         * <code>this ⟼ this * α</code>
         * </p>
         * @method scale
         * @param α {number}
         */
        R3.prototype.scale = function (α) {
            mustBeNumber('α', α);
            this.x *= α;
            this.y *= α;
            this.z *= α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this</code>, with components modified.
         * </p>
         * @method set
         * @param x {number}
         * @param y {number}
         * @param z {number}
         * @return {R3} <code>this</code>
         * @chainable
         * @deprecated
         */
        R3.prototype.setXYZ = function (x, y, z) {
            this.x = mustBeNumber('x', x);
            this.y = mustBeNumber('y', y);
            this.z = mustBeNumber('z', z);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ magnitude * this / norm(this)</code>
         * </p>
         * @method setMagnitude
         * @param magnitude {number}
         * @return {R3} <code>this</code>
         */
        R3.prototype.setMagnitude = function (magnitude) {
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
        /**
         * @method setX
         * @param x {number}
         * @return {R3} <code>this</code>
         * @chainable
         * @deprecated
         */
        R3.prototype.setX = function (x) {
            mustBeNumber('x', x);
            this.x = x;
            return this;
        };
        /**
         * @method setY
         * @param y {number}
         * @return {R3} <code>this</code>
         * @chainable
         * @deprecated
         */
        R3.prototype.setY = function (y) {
            mustBeNumber('y', y);
            this.y = y;
            return this;
        };
        /**
         * @method setZ
         * @param z {number}
         * @return {R3} <code>this</code>
         * @chainable
         * @deprecated
         */
        R3.prototype.setZ = function (z) {
            mustBeNumber('z', z);
            this.z = z;
            return this;
        };
        R3.prototype.slerp = function (target, α) {
            mustBeObject('target', target);
            mustBeNumber('α', α);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this - v</code>
         * </p>
         * @method sub
         * @param v {VectorE3}
         * @param α [number = 1]
         * @return {R3} <code>this</code>
         * @chainable
         */
        R3.prototype.sub = function (v, α) {
            if (α === void 0) { α = 1; }
            mustBeObject('v', v);
            mustBeNumber('α', α);
            this.x -= v.x * α;
            this.y -= v.y * α;
            this.z -= v.z * α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a - b</code>
         * </p>
         * @method sub2
         * @param a {VectorE3}
         * @param b {VectorE3}
         * @return {R3} <code>this</code>
         * @chainable
         */
        R3.prototype.sub2 = function (a, b) {
            mustBeObject('a', a);
            mustBeObject('b', b);
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.z = a.z - b.z;
            return this;
        };
        R3.prototype.toExponential = function () {
            return "TODO R2.toExponential";
        };
        R3.prototype.toFixed = function (digits) {
            return "TODO R2.toFixed";
        };
        /**
         * @method toString
         * @return {string} A non-normative string representation of the target.
         */
        R3.prototype.toString = function () {
            return "R3({x: " + this.x + ", y: " + this.y + ", z: " + this.z + "})";
        };
        /**
         * Sets this vector to the identity element for addition, <b>0</b>.
         * @method zero
         * @return {R3}
         * @chainable
         */
        R3.prototype.zero = function () {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            return this;
        };
        R3.prototype.__add__ = function (rhs) {
            if (rhs instanceof R3) {
                return this.clone().add(rhs, 1.0);
            }
            else {
                return void 0;
            }
        };
        R3.prototype.__sub__ = function (rhs) {
            if (rhs instanceof R3) {
                return this.clone().sub(rhs);
            }
            else {
                return void 0;
            }
        };
        R3.prototype.__mul__ = function (rhs) {
            if (isNumber(rhs)) {
                return this.clone().scale(rhs);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method copy
         * @param vector {VectorE3}
         * @return {R3}
         * @static
         */
        R3.copy = function (vector) {
            return new R3([vector.x, vector.y, vector.z]);
        };
        /**
         * @method lerp
         * @param a {VectorE3}
         * @param b {VectorE3}
         * @param α {number}
         * @return {R3} <code>a + α * (b - a)</code>
         * @static
         */
        R3.lerp = function (a, b, α) {
            return R3.copy(b).sub(a).scale(α).add(a);
        };
        /**
         * @method random
         * @return {R3}
         * @static
         */
        R3.random = function () {
            return new R3([Math.random(), Math.random(), Math.random()]);
        };
        /**
         * @property e1
         * @type {Euclidean3}
         * @static
         */
        R3.e1 = Euclidean3.e1;
        /**
         * @property e2
         * @type {Euclidean3}
         * @static
         */
        R3.e2 = Euclidean3.e2;
        /**
         * @property e3
         * @type {Euclidean3}
         * @static
         */
        R3.e3 = Euclidean3.e3;
        return R3;
    })(VectorN);
    return R3;
});
