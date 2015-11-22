var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/VectorN'], function (require, exports, VectorN) {
    var exp = Math.exp;
    var log = Math.log;
    var sqrt = Math.sqrt;
    var COORD_X = 0;
    /**
     * @class R1
     */
    var R1 = (function (_super) {
        __extends(R1, _super);
        /**
         * @class R1
         * @constructor
         * @param data {number[]} Default is [0].
         * @param modified {boolean} Default is false.
         */
        function R1(data, modified) {
            if (data === void 0) { data = [0]; }
            if (modified === void 0) { modified = false; }
            _super.call(this, data, modified, 1);
        }
        Object.defineProperty(R1.prototype, "x", {
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
        R1.prototype.set = function (x) {
            this.x = x;
            return this;
        };
        R1.prototype.add = function (vector, alpha) {
            if (alpha === void 0) { alpha = 1; }
            this.x += vector.x * alpha;
            return this;
        };
        R1.prototype.add2 = function (a, b) {
            this.x = a.x + b.x;
            return this;
        };
        R1.prototype.scp = function (v) {
            return this;
        };
        R1.prototype.adj = function () {
            throw new Error('TODO: R1.adj');
        };
        R1.prototype.conj = function () {
            return this;
        };
        R1.prototype.copy = function (v) {
            this.x = v.x;
            return this;
        };
        R1.prototype.det = function () {
            return this.x;
        };
        R1.prototype.dual = function () {
            return this;
        };
        R1.prototype.exp = function () {
            this.x = exp(this.x);
            return this;
        };
        R1.prototype.one = function () {
            this.x = 1;
            return this;
        };
        R1.prototype.inv = function () {
            this.x = 1 / this.x;
            return this;
        };
        R1.prototype.lco = function (v) {
            return this;
        };
        R1.prototype.log = function () {
            this.x = log(this.x);
            return this;
        };
        R1.prototype.mul = function (v) {
            this.x *= v.x;
            return this;
        };
        R1.prototype.norm = function () {
            return this;
        };
        R1.prototype.div = function (v) {
            this.x /= v.x;
            return this;
        };
        R1.prototype.divByScalar = function (scalar) {
            this.x /= scalar;
            return this;
        };
        R1.prototype.min = function (v) {
            if (this.x > v.x) {
                this.x = v.x;
            }
            return this;
        };
        R1.prototype.max = function (v) {
            if (this.x < v.x) {
                this.x = v.x;
            }
            return this;
        };
        R1.prototype.floor = function () {
            this.x = Math.floor(this.x);
            return this;
        };
        R1.prototype.ceil = function () {
            this.x = Math.ceil(this.x);
            return this;
        };
        R1.prototype.rev = function () {
            return this;
        };
        R1.prototype.rco = function (v) {
            return this;
        };
        R1.prototype.round = function () {
            this.x = Math.round(this.x);
            return this;
        };
        R1.prototype.roundToZero = function () {
            this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
            return this;
        };
        R1.prototype.scale = function (scalar) {
            this.x *= scalar;
            return this;
        };
        R1.prototype.sub = function (v) {
            this.x -= v.x;
            return this;
        };
        R1.prototype.subScalar = function (s) {
            this.x -= s;
            return this;
        };
        R1.prototype.sub2 = function (a, b) {
            this.x = a.x - b.x;
            return this;
        };
        /**
         * @method neg
         * @return {R1} <code>this</code>
         */
        R1.prototype.neg = function () {
            this.x = -this.x;
            return this;
        };
        /**
         * @method distanceTo
         * @param point {VectorE1}
         * @return {number}
         */
        R1.prototype.distanceTo = function (position) {
            return sqrt(this.quadranceTo(position));
        };
        R1.prototype.dot = function (v) {
            return this.x * v.x;
        };
        /**
         * Computes the <em>square root</em> of the <em>squared norm</em>.
         * @method magnitude
         * @return {number}
         */
        R1.prototype.magnitude = function () {
            return sqrt(this.squaredNorm());
        };
        R1.prototype.direction = function () {
            return this.divByScalar(this.magnitude());
        };
        R1.prototype.mul2 = function (a, b) {
            return this;
        };
        R1.prototype.quad = function () {
            var x = this.x;
            this.x = x * x;
            return this;
        };
        R1.prototype.squaredNorm = function () {
            return this.x * this.x;
        };
        R1.prototype.quadranceTo = function (position) {
            var dx = this.x - position.x;
            return dx * dx;
        };
        R1.prototype.reflect = function (n) {
            // FIXME: TODO
            return this;
        };
        R1.prototype.reflection = function (n) {
            // FIXME: TODO
            return this;
        };
        R1.prototype.rotate = function (rotor) {
            return this;
        };
        /**
         * this ⟼ this + α * (v - this)</code>
         * @method lerp
         * @param v {VectorE1}
         * @param α {number}
         * @return {MutanbleNumber}
         * @chainable
         */
        R1.prototype.lerp = function (v, α) {
            this.x += (v.x - this.x) * α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a + α * (b - a)</code>
         * </p>
         * @method lerp2
         * @param a {R1}
         * @param b {R1}
         * @param α {number}
         * @return {R1}
         * @chainable
         */
        R1.prototype.lerp2 = function (a, b, α) {
            this.sub2(b, a).scale(α).add(a);
            return this;
        };
        R1.prototype.equals = function (v) {
            return v.x === this.x;
        };
        R1.prototype.fromArray = function (array, offset) {
            if (offset === void 0) { offset = 0; }
            this.x = array[offset];
            return this;
        };
        R1.prototype.slerp = function (v, α) {
            return this;
        };
        R1.prototype.toArray = function (array, offset) {
            if (array === void 0) { array = []; }
            if (offset === void 0) { offset = 0; }
            array[offset] = this.x;
            return array;
        };
        R1.prototype.toExponential = function () {
            return "TODO: R1.toExponential";
        };
        R1.prototype.toFixed = function (digits) {
            return "TODO: R1.toFixed";
        };
        /**
         * @method translation
         * @param d {VectorE0}
         * @return {R1}
         * @chainable
         */
        R1.prototype.translation = function (d) {
            return this.one();
        };
        R1.prototype.fromAttribute = function (attribute, index, offset) {
            if (offset === void 0) { offset = 0; }
            index = index * attribute.itemSize + offset;
            this.x = attribute.array[index];
            return this;
        };
        R1.prototype.clone = function () {
            return new R1([this.x]);
        };
        R1.prototype.ext = function (v) {
            return this;
        };
        /**
         * Sets this vector to the identity element for addition, <b>0</b>.
         * @method zero
         * @return {R1}
         * @chainable
         */
        R1.prototype.zero = function () {
            this.x = 0;
            return this;
        };
        return R1;
    })(VectorN);
    return R1;
});
