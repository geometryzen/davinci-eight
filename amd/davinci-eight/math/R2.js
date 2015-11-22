var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/b2', '../geometries/b3', '../math/VectorN'], function (require, exports, b2, b3, VectorN) {
    var exp = Math.exp;
    var log = Math.log;
    var sqrt = Math.sqrt;
    var COORD_X = 0;
    var COORD_Y = 1;
    /**
     * @class R2
     */
    var R2 = (function (_super) {
        __extends(R2, _super);
        /**
         * @class R2
         * @constructor
         * @param data {number[]} Default is [0, 0].
         * @param modified {boolean} Default is false.
         */
        function R2(data, modified) {
            if (data === void 0) { data = [0, 0]; }
            if (modified === void 0) { modified = false; }
            _super.call(this, data, modified, 2);
        }
        Object.defineProperty(R2.prototype, "x", {
            /**
             * @property x
             * @type Number
             */
            get: function () {
                return this.coords[COORD_X];
            },
            set: function (value) {
                this.modified = this.modified || this.x !== value;
                this.coords[COORD_X] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(R2.prototype, "y", {
            /**
             * @property y
             * @type Number
             */
            get: function () {
                return this.coords[COORD_Y];
            },
            set: function (value) {
                this.modified = this.modified || this.y !== value;
                this.coords[COORD_Y] = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
        set(x: number, y: number): R2 {
            this.x = x;
            this.y = y;
            return this;
        }
        */
        /**
         * @method copy
         * @param v {{x: number; y: number}}
         * @return {R2}
         * @chainable
         */
        R2.prototype.copy = function (v) {
            this.x = v.x;
            this.y = v.y;
            return this;
        };
        R2.prototype.add = function (v, alpha) {
            if (alpha === void 0) { alpha = 1; }
            this.x += v.x * alpha;
            this.y += v.y * alpha;
            return this;
        };
        R2.prototype.add2 = function (a, b) {
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ m * this<sup>T</sup></code>
         * </p>
         * @method applyMatrix
         * @param m {Mat2R}
         * @return {R2} <code>this</code>
         * @chainable
         */
        R2.prototype.applyMatrix = function (m) {
            var x = this.x;
            var y = this.y;
            var e = m.elements;
            this.x = e[0x0] * x + e[0x2] * y;
            this.y = e[0x1] * x + e[0x3] * y;
            return this;
        };
        /**
         * @method cubicBezier
         * @param t {number}
         * @param controlBegin {VectorE2}
         * @param endPoint {VectorE2}
         * @return {R2}
         */
        R2.prototype.cubicBezier = function (t, controlBegin, controlEnd, endPoint) {
            var x = b3(t, this.x, controlBegin.x, controlEnd.x, endPoint.x);
            var y = b3(t, this.y, controlBegin.y, controlEnd.y, endPoint.y);
            this.x = x;
            this.y = y;
            return this;
        };
        R2.prototype.sub = function (v) {
            this.x -= v.x;
            this.y -= v.y;
            return this;
        };
        R2.prototype.subScalar = function (s) {
            this.x -= s;
            this.y -= s;
            return this;
        };
        R2.prototype.sub2 = function (a, b) {
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            return this;
        };
        R2.prototype.scale = function (s) {
            this.x *= s;
            this.y *= s;
            return this;
        };
        R2.prototype.divByScalar = function (scalar) {
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
        R2.prototype.min = function (v) {
            if (this.x > v.x) {
                this.x = v.x;
            }
            if (this.y > v.y) {
                this.y = v.y;
            }
            return this;
        };
        R2.prototype.max = function (v) {
            if (this.x < v.x) {
                this.x = v.x;
            }
            if (this.y < v.y) {
                this.y = v.y;
            }
            return this;
        };
        R2.prototype.floor = function () {
            this.x = Math.floor(this.x);
            this.y = Math.floor(this.y);
            return this;
        };
        R2.prototype.ceil = function () {
            this.x = Math.ceil(this.x);
            this.y = Math.ceil(this.y);
            return this;
        };
        R2.prototype.round = function () {
            this.x = Math.round(this.x);
            this.y = Math.round(this.y);
            return this;
        };
        R2.prototype.roundToZero = function () {
            this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
            this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y);
            return this;
        };
        /**
         * @method neg
         * @return {R2} <code>this</code>
         * @chainable
         */
        R2.prototype.neg = function () {
            this.x = -this.x;
            this.y = -this.y;
            return this;
        };
        /**
         * @method distanceTo
         * @param point {VectorE2}
         * @return {number}
         */
        R2.prototype.distanceTo = function (position) {
            return sqrt(this.quadranceTo(position));
        };
        R2.prototype.dot = function (v) {
            return this.x * v.x + this.y * v.y;
        };
        /**
         * Computes the <em>square root</em> of the <em>squared norm</em>.
         * @method magnitude
         * @return {number}
         */
        R2.prototype.magnitude = function () {
            return sqrt(this.squaredNorm());
        };
        R2.prototype.direction = function () {
            return this.divByScalar(this.magnitude());
        };
        R2.prototype.squaredNorm = function () {
            return this.x * this.x + this.y * this.y;
        };
        R2.prototype.quadranceTo = function (position) {
            var dx = this.x - position.x;
            var dy = this.y - position.y;
            return dx * dx + dy * dy;
        };
        /**
         * @method quadraticBezier
         * @param t {number}
         * @param controlPoint {VectorE2}
         * @param endPoint {VectorE2}
         * @return {R2}
         */
        R2.prototype.quadraticBezier = function (t, controlPoint, endPoint) {
            var x = b2(t, this.x, controlPoint.x, endPoint.x);
            var y = b2(t, this.y, controlPoint.y, endPoint.y);
            this.x = x;
            this.y = y;
            return this;
        };
        R2.prototype.reflect = function (n) {
            // FIXME: TODO
            return this;
        };
        R2.prototype.rotate = function (rotor) {
            return this;
        };
        /**
         * this ⟼ this + (v - this) * α
         * @method lerp
         * @param v {VectorE2}
         * @param α {number}
         * @return {R2}
         * @chainable
         */
        R2.prototype.lerp = function (v, α) {
            this.x += (v.x - this.x) * α;
            this.y += (v.y - this.y) * α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a + α * (b - a)</code>
         * </p>
         * @method lerp2
         * @param a {VectorE2}
         * @param b {VectorE2}
         * @param α {number}
         * @return {R2} <code>this</code>
         * @chainable
         */
        R2.prototype.lerp2 = function (a, b, α) {
            this.copy(a).lerp(b, α);
            return this;
        };
        R2.prototype.equals = function (v) {
            return ((v.x === this.x) && (v.y === this.y));
        };
        R2.prototype.slerp = function (v, α) {
            return this;
        };
        R2.prototype.toExponential = function () {
            return "TODO: R2.toExponential";
        };
        R2.prototype.toFixed = function (digits) {
            return "TODO: R2.toString";
        };
        R2.prototype.fromArray = function (array, offset) {
            if (offset === void 0) { offset = 0; }
            this.x = array[offset];
            this.y = array[offset + 1];
            return this;
        };
        R2.prototype.fromAttribute = function (attribute, index, offset) {
            if (offset === void 0) { offset = 0; }
            index = index * attribute.itemSize + offset;
            this.x = attribute.array[index];
            this.y = attribute.array[index + 1];
            return this;
        };
        R2.prototype.clone = function () {
            return new R2([this.x, this.y]);
        };
        /**
         * Sets this vector to the identity element for addition, <b>0</b>.
         * @method zero
         * @return {R2}
         * @chainable
         */
        R2.prototype.zero = function () {
            this.x = 0;
            this.y = 0;
            return this;
        };
        /**
         * @method copy
         * @param vector {{x: number; y: number}}
         * @return {R2}
         * @static
         */
        R2.copy = function (vector) {
            return new R2([vector.x, vector.y]);
        };
        /**
         * @method lerp
         * @param a {VectorE2}
         * @param b {VectorE2}
         * @param α {number}
         * @return {R2} <code>a + α * (b - a)</code>
         * @static
         */
        R2.lerp = function (a, b, α) {
            return R2.copy(b).sub(a).scale(α).add(a);
        };
        /**
         * @method random
         * @return {R2}
         * @static
         */
        R2.random = function () {
            return new R2([Math.random(), Math.random()]);
        };
        return R2;
    })(VectorN);
    return R2;
});
