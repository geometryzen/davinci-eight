var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/dotVectorE2', '../math/extE2', '../checks/isDefined', '../checks/isNumber', '../checks/isObject', '../math/lcoE2', '../math/mulE2', '../checks/mustBeInteger', '../checks/mustBeNumber', '../checks/mustBeObject', '../checks/mustBeString', '../math/quadSpinorE2', '../math/quadVectorE2', '../i18n/readOnly', '../math/rcoE2', '../math/rotorFromDirections', '../math/scpE2', '../math/stringFromCoordinates', '../math/VectorN', '../math/wedgeXY'], function (require, exports, dotVector, extE2, isDefined, isNumber, isObject, lcoE2, mulE2, mustBeInteger, mustBeNumber, mustBeObject, mustBeString, quadSpinor, quadVector, readOnly, rcoE2, rotorFromDirections, scpE2, stringFromCoordinates, VectorN, wedgeXY) {
    // Symbolic constants for the coordinate indices into the data array.
    var COORD_W = 0;
    var COORD_X = 1;
    var COORD_Y = 2;
    var COORD_XY = 3;
    var PI = Math.PI;
    var abs = Math.abs;
    var atan2 = Math.atan2;
    var exp = Math.exp;
    var log = Math.log;
    var cos = Math.cos;
    var sin = Math.sin;
    var sqrt = Math.sqrt;
    var BASIS_LABELS = ["1", "e1", "e2", "I"];
    /**
     * Coordinates corresponding to basis labels.
     */
    function coordinates(m) {
        return [m.α, m.x, m.y, m.β];
    }
    /**
     * Promotes an unknown value to a G2, or returns undefined.
     */
    function duckCopy(value) {
        if (isObject(value)) {
            var m = value;
            if (isNumber(m.x) && isNumber(m.y)) {
                if (isNumber(m.α) && isNumber(m.β)) {
                    console.warn("Copying GeometricE2 to G2");
                    return G2.copy(m);
                }
                else {
                    console.warn("Copying VectorE2 to G2");
                    return G2.fromVector(m);
                }
            }
            else {
                if (isNumber(m.α) && isNumber(m.β)) {
                    console.warn("Copying SpinorE2 to G2");
                    return G2.fromSpinor(m);
                }
                else {
                    return void 0;
                }
            }
        }
        else {
            return void 0;
        }
    }
    function makeConstantE2(label, α, x, y, xy) {
        mustBeString('label', label);
        mustBeNumber('α', α);
        mustBeNumber('x', x);
        mustBeNumber('y', y);
        mustBeNumber('xy', xy);
        var that;
        that = {
            get α() {
                return α;
            },
            set α(unused) {
                throw new Error(readOnly(label + '.α').message);
            },
            get x() {
                return x;
            },
            set x(unused) {
                throw new Error(readOnly(label + '.x').message);
            },
            get y() {
                return y;
            },
            set y(unused) {
                throw new Error(readOnly(label + '.y').message);
            },
            get β() {
                return xy;
            },
            set β(unused) {
                throw new Error(readOnly(label + '.β').message);
            },
            get xy() {
                return xy;
            },
            set xy(unused) {
                throw new Error(readOnly(label + '.xy').message);
            },
            magnitude: function () {
                return sqrt(quadSpinor(that));
            },
            squaredNorm: function () {
                return quadSpinor(that);
            },
            toString: function () {
                return label;
            }
        };
        return that;
    }
    var zero = makeConstantE2('0', 0, 0, 0, 0);
    var one = makeConstantE2('1', 1, 0, 0, 0);
    var e1 = makeConstantE2('e1', 0, 1, 0, 0);
    var e2 = makeConstantE2('e2', 0, 0, 1, 0);
    var I = makeConstantE2('I', 0, 0, 0, 1);
    /**
     * @class G2
     * @extends GeometricE2
     * @beta
     */
    var G2 = (function (_super) {
        __extends(G2, _super);
        /**
         * Constructs a <code>G2</code>.
         * The multivector is initialized to zero.
         * @class G2
         * @beta
         * @constructor
         */
        function G2() {
            _super.call(this, [0, 0, 0, 0], false, 4);
        }
        Object.defineProperty(G2.prototype, "α", {
            /**
             * The coordinate corresponding to the unit standard basis scalar.
             * @property α
             * @type {number}
             */
            get: function () {
                return this.data[COORD_W];
            },
            set: function (α) {
                this.modified = this.modified || this.data[COORD_W] !== α;
                this.data[COORD_W] = α;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2.prototype, "x", {
            /**
             * The coordinate corresponding to the <b>e</b><sub>1</sub> standard basis vector.
             * @property x
             * @type {number}
             */
            get: function () {
                return this.data[COORD_X];
            },
            set: function (x) {
                this.modified = this.modified || this.data[COORD_X] !== x;
                this.data[COORD_X] = x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2.prototype, "y", {
            /**
             * The coordinate corresponding to the <b>e</b><sub>2</sub> standard basis vector.
             * @property y
             * @type {number}
             */
            get: function () {
                return this.data[COORD_Y];
            },
            set: function (y) {
                this.modified = this.modified || this.data[COORD_Y] !== y;
                this.data[COORD_Y] = y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2.prototype, "β", {
            /**
             * The coordinate corresponding to the <b>e</b><sub>1</sub><b>e</b><sub>2</sub> standard basis bivector.
             * @property β
             * @type {number}
             */
            get: function () {
                return this.data[COORD_XY];
            },
            set: function (β) {
                this.modified = this.modified || this.data[COORD_XY] !== β;
                this.data[COORD_XY] = β;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2.prototype, "xy", {
            get: function () {
                return this.data[COORD_XY];
            },
            set: function (xy) {
                this.modified = this.modified || this.data[COORD_XY] !== xy;
                this.data[COORD_XY] = xy;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * <p>
         * <code>this ⟼ this + M * α</code>
         * </p>
         * @method add
         * @param M {GeometricE2}
         * @param α [number = 1]
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.add = function (M, α) {
            if (α === void 0) { α = 1; }
            mustBeObject('M', M);
            mustBeNumber('α', α);
            this.α += M.α * α;
            this.x += M.x * α;
            this.y += M.y * α;
            this.β += M.β * α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this + Iβ</code>
         * </p>
         * @method addPseudo
         * @param β {number}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.addPseudo = function (β) {
            mustBeNumber('β', β);
            this.β += β;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this + α</code>
         * </p>
         * @method addScalar
         * @param α {number}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.addScalar = function (α) {
            mustBeNumber('α', α);
            this.α += α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this + v * α</code>
         * </p>
         * @method addVector
         * @param v {VectorE2}
         * @param α [number = 1]
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.addVector = function (v, α) {
            if (α === void 0) { α = 1; }
            mustBeObject('v', v);
            mustBeNumber('α', α);
            this.x += v.x * α;
            this.y += v.y * α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a + b</code>
         * </p>
         * @method add2
         * @param a {GeometricE2}
         * @param b {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.add2 = function (a, b) {
            mustBeObject('a', a);
            mustBeObject('b', b);
            this.α = a.α + b.α;
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            this.β = a.β + b.β;
            return this;
        };
        G2.prototype.adj = function () {
            throw new Error('TODO: G2.adj');
        };
        /**
         * @method angle
         * @return {G2}
         */
        G2.prototype.angle = function () {
            return this.log().grade(2);
        };
        /**
         * @method clone
         * @return {G2} <code>copy(this)</code>
         */
        G2.prototype.clone = function () {
            var m = new G2();
            m.copy(this);
            return m;
        };
        /**
         * <p>
         * <code>this ⟼ conjugate(this)</code>
         * </p>
         * @method conj
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.conj = function () {
            // FIXME: This is only the bivector part.
            // Also need to think about various involutions.
            this.β = -this.β;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this << m</code>
         * </p>
         * @method lco
         * @param m {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.lco = function (m) {
            return this.lco2(this, m);
        };
        /**
         * <p>
         * <code>this ⟼ a << b</code>
         * </p>
         * @method lco2
         * @param a {GeometricE2}
         * @param b {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.lco2 = function (a, b) {
            var a0 = a.α;
            var a1 = a.x;
            var a2 = a.y;
            var a3 = a.β;
            var b0 = b.α;
            var b1 = b.x;
            var b2 = b.y;
            var b3 = b.β;
            this.α = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            this.x = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            this.y = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            this.β = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this >> m</code>
         * </p>
         * @method rco
         * @param m {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.rco = function (m) {
            return this.rco2(this, m);
        };
        /**
         * <p>
         * <code>this ⟼ a >> b</code>
         * </p>
         * @method rco2
         * @param a {GeometricE2}
         * @param b {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.rco2 = function (a, b) {
            var a0 = a.α;
            var a1 = a.x;
            var a2 = a.y;
            var a3 = a.β;
            var b0 = b.α;
            var b1 = b.x;
            var b2 = b.y;
            var b3 = b.β;
            this.α = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            this.x = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            this.y = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            this.β = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ copy(M)</code>
         * </p>
         * @method copy
         * @param M {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.copy = function (M) {
            mustBeObject('M', M);
            this.α = M.α;
            this.x = M.x;
            this.y = M.y;
            this.β = M.β;
            return this;
        };
        /**
         * Sets this multivector to the value of the scalar, <code>α</code>.
         * @method copyScalar
         * @return {G2}
         * @chainable
         */
        G2.prototype.copyScalar = function (α) {
            return this.zero().addScalar(α);
        };
        /**
         * <p>
         * <code>this ⟼ copy(spinor)</code>
         * </p>
         * @method copySpinor
         * @param spinor {SpinorE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.copySpinor = function (spinor) {
            mustBeObject('spinor', spinor);
            this.α = spinor.α;
            this.x = 0;
            this.y = 0;
            this.β = spinor.xy;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ copyVector(vector)</code>
         * </p>
         * @method copyVector
         * @param vector {VectorE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.copyVector = function (vector) {
            mustBeObject('vector', vector);
            this.α = 0;
            this.x = vector.x;
            this.y = vector.y;
            this.β = 0;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this / m</code>
         * </p>
         * @method div
         * @param m {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.div = function (m) {
            return this.div2(this, m);
        };
        /**
         * <p>
         * <code>this ⟼ this / α</code>
         * </p>
         * @method divByScalar
         * @param α {number}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.divByScalar = function (α) {
            mustBeNumber('α', α);
            this.α /= α;
            this.x /= α;
            this.y /= α;
            this.β /= α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a / b</code>
         * </p>
         * @method div2
         * @param a {GeometricE2}
         * @param b {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.div2 = function (a, b) {
            // FIXME: Generalize
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ dual(m) = I * m</code>
         * </p>
         * @method dual
         * @param m {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.dual = function (m) {
            var w = -m.β;
            var x = +m.y;
            var y = -m.x;
            var β = +m.α;
            this.α = w;
            this.x = x;
            this.y = y;
            this.β = β;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ e<sup>this</sup></code>
         * </p>
         * @method exp
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.exp = function () {
            var w = this.α;
            var z = this.β;
            var expW = exp(w);
            // φ is actually the absolute value of one half the rotation angle.
            // The orientation of the rotation gets carried in the bivector components.
            var φ = sqrt(z * z);
            var s = expW * (φ !== 0 ? sin(φ) / φ : 1);
            this.α = expW * cos(φ);
            this.β = z * s;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ conj(this) / quad(this)</code>
         * </p>
         * @method inv
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.inv = function () {
            // FIXME: TODO
            this.conj();
            // this.divByScalar(this.squaredNorm());
            return this;
        };
        /**
         * @method isOne
         * @return {boolean}
         */
        G2.prototype.isOne = function () {
            return this.α === 1 && this.x === 0 && this.y === 0 && this.β === 0;
        };
        /**
         * @method isZero
         * @return {boolean}
         */
        G2.prototype.isZero = function () {
            return this.α === 0 && this.x === 0 && this.y === 0 && this.β === 0;
        };
        /**
         * <p>
         * <code>this ⟼ this + α * (target - this)</code>
         * </p>
         * @method lerp
         * @param target {GeometricE2}
         * @param α {number}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.lerp = function (target, α) {
            mustBeObject('target', target);
            mustBeNumber('α', α);
            this.α += (target.α - this.α) * α;
            this.x += (target.x - this.x) * α;
            this.y += (target.y - this.y) * α;
            this.β += (target.β - this.β) * α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a + α * (b - a)</code>
         * </p>
         * @method lerp2
         * @param a {GeometricE2}
         * @param b {GeometricE2}
         * @param α {number}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.lerp2 = function (a, b, α) {
            mustBeObject('a', a);
            mustBeObject('b', b);
            mustBeNumber('α', α);
            this.copy(a).lerp(b, α);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ log(sqrt(w * w + β * β)) + <b>e</b><sub>1</sub><b>e</b><sub>2</sub> * atan2(β, w)</code>
         * </p>
         * @method log
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.log = function () {
            // FIXME: This only handles the spinor components.
            var α = this.α;
            var β = this.β;
            this.α = log(sqrt(α * α + β * β));
            this.x = 0;
            this.y = 0;
            this.β = atan2(β, α);
            return this;
        };
        /**
         * Computes the <em>square root</em> of the <em>squared norm</em>.
         * @method magnitude
         * @return {number}
         */
        G2.prototype.magnitude = function () {
            return sqrt(this.squaredNorm());
        };
        /**
         * <p>
         * <code>this ⟼ this * s</code>
         * </p>
         * @method mul
         * @param m {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.mul = function (m) {
            return this.mul2(this, m);
        };
        /**
         * <p>
         * <code>this ⟼ a * b</code>
         * </p>
         * @method mul2
         * @param a {GeometricE2}
         * @param b {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.mul2 = function (a, b) {
            var a0 = a.α;
            var a1 = a.x;
            var a2 = a.y;
            var a3 = a.β;
            var b0 = b.α;
            var b1 = b.x;
            var b2 = b.y;
            var b3 = b.β;
            this.α = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            this.x = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            this.y = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            this.β = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ -1 * this</code>
         * </p>
         * @method neg
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.neg = function () {
            this.α = -this.α;
            this.x = -this.x;
            this.y = -this.y;
            this.β = -this.β;
            return this;
        };
        /**
        * <p>
        * <code>this ⟼ sqrt(this * conj(this))</code>
        * </p>
        * @method norm
        * @return {G2} <code>this</code>
        * @chainable
        */
        G2.prototype.norm = function () {
            this.α = this.magnitude();
            this.x = 0;
            this.y = 0;
            this.β = 0;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this / magnitude(this)</code>
         * </p>
         * @method normalize
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.normalize = function () {
            // The squaredNorm is the squared norm.
            var norm = sqrt(this.squaredNorm());
            this.α = this.α / norm;
            this.x = this.x / norm;
            this.y = this.y / norm;
            this.β = this.β / norm;
            return this;
        };
        /**
         * <p>
         * Updates <code>this</code> target to be the <em>quad</em> or <em>squared norm</em> of the target.
         * </p>
         * <p>
         * <code>this ⟼ scp(this, rev(this)) = this | ~this</code>
         * </p>
         * @method quad
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.quad = function () {
            this.α = this.squaredNorm();
            this.x = 0;
            this.y = 0;
            this.β = 0;
            return this;
        };
        /**
         * Computes the <em>squared norm</em> of this <code>G2</code> multivector.
         * @method squaredNorm
         * @return {number} <code>this | ~this</code>
         */
        G2.prototype.squaredNorm = function () {
            var w = this.α;
            var x = this.x;
            var y = this.y;
            var B = this.β;
            return w * w + x * x + y * y + B * B;
        };
        /**
         * <p>
         * <code>this ⟼ - n * this * n</code>
         * </p>
         * @method reflect
         * @param n {VectorE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.reflect = function (n) {
            // FIXME: This inly reflects the vector components.
            mustBeObject('n', n);
            var x = this.x;
            var y = this.y;
            var nx = n.x;
            var ny = n.y;
            var dot2 = (x * nx + y * ny) * 2;
            this.x = x - dot2 * nx;
            this.y = y - dot2 * ny;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ rev(this)</code>
         * </p>
         * @method reverse
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.rev = function () {
            // reverse has a ++-- structure.
            this.α = this.α;
            this.x = this.x;
            this.y = this.y;
            this.β = -this.β;
            return this;
        };
        /**
         * @method __tilde__
         * @return {G2}
         */
        G2.prototype.__tilde__ = function () {
            return G2.copy(this).rev();
        };
        /**
         * <p>
         * <code>this ⟼ R * this * rev(R)</code>
         * </p>
         * @method rotate
         * @param R {SpinorE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.rotate = function (R) {
            mustBeObject('R', R);
            // FIXME: This only rotates the vector components.
            var x = this.x;
            var y = this.y;
            var a = R.xy;
            var α = R.α;
            var ix = α * x + a * y;
            var iy = α * y - a * x;
            this.x = ix * α + iy * a;
            this.y = iy * α - ix * a;
            return this;
        };
        /**
         * Sets this multivector to a rotation from vector <code>a</code> to vector <code>b</code>.
         * @method rotorFromDirections
         * @param a {VectorE2} The starting vector
         * @param b {VectorE2} The ending vector
         * @return {G2} <code>this</code> The rotor representing a rotation from a to b.
         * @chainable
         */
        G2.prototype.rotorFromDirections = function (a, b) {
            if (isDefined(rotorFromDirections(a, b, quadVector, dotVector, this))) {
                return this;
            }
            else {
                // In two dimensions, the rotation plane is not ambiguous.
                // FIXME: This is a bit dubious.
                // Probably better to make undefined a first-class concept.
                this.rotorFromGeneratorAngle(G2.I, PI);
            }
            return this;
        };
        /**
         * <p>
         * <code>this = ⟼ exp(- B * θ / 2)</code>
         * </p>
         * @method rotorFromGeneratorAngle
         * @param B {SpinorE2}
         * @param θ {number}
         * @return {G2} <code>this</code>
         */
        G2.prototype.rotorFromGeneratorAngle = function (B, θ) {
            mustBeObject('B', B);
            mustBeNumber('θ', θ);
            // We assume that B really is just a bivector
            // by ignoring scalar and vector components.
            // Normally, B will have unit magnitude and B * B => -1.
            // However, we don't assume that is the case.
            // The effect will be a scaling of the angle.
            // A non unitary rotor, on the other hand, will scale the transformation.
            // We must also take into account the orientation of B.
            var β = B.xy;
            /**
             * Sandwich operation means we need the half-angle.
             */
            var φ = θ / 2;
            /**
             * scalar part = cos(|B| * θ / 2)
             */
            this.α = cos(abs(β) * φ);
            this.x = 0;
            this.y = 0;
            /**
             * pseudo part = -unit(B) * sin(|B| * θ / 2)
             */
            this.β = -sin(β * φ);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ scp(this, m)</code>
         * </p>
         * @method align
         * @param m {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.scp = function (m) {
            return this.scp2(this, m);
        };
        /**
         * <p>
         * <code>this ⟼ scp(a, b)</code>
         * </p>
         * @method scp2
         * @param a {GeometricE2}
         * @param b {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.scp2 = function (a, b) {
            this.α = scpE2(a.α, a.x, a.y, a.β, b.α, b.x, b.y, b.β, 0);
            this.x = 0;
            this.y = 0;
            this.β = 0;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this * α</code>
         * </p>
         * @method scale
         * @param α {number}
         */
        G2.prototype.scale = function (α) {
            mustBeNumber('α', α);
            this.α *= α;
            this.x *= α;
            this.y *= α;
            this.β *= α;
            return this;
        };
        G2.prototype.slerp = function (target, α) {
            mustBeObject('target', target);
            mustBeNumber('α', α);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a * b = a · b + a ^ b</code>
         * </p>
         * Sets this G2 to the geometric product a * b of the vector arguments.
         * @method spinor
         * @param a {VectorE2}
         * @param b {VectorE2}
         * @return {G2} <code>this</code>
         */
        G2.prototype.spinor = function (a, b) {
            var ax = a.x;
            var ay = a.y;
            var bx = b.x;
            var by = b.y;
            this.α = dotVector(a, b);
            this.x = 0;
            this.y = 0;
            this.β = wedgeXY(ax, ay, 0, bx, by, 0); // FIXME wedgeVectorsE2
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this - M * α</code>
         * </p>
         * @method sub
         * @param M {GeometricE2}
         * @param α [number = 1]
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.sub = function (M, α) {
            if (α === void 0) { α = 1; }
            mustBeObject('M', M);
            mustBeNumber('α', α);
            this.α -= M.α * α;
            this.x -= M.x * α;
            this.y -= M.y * α;
            this.β -= M.β * α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a - b</code>
         * </p>
         * @method sub2
         * @param a {GeometricE2}
         * @param b {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.sub2 = function (a, b) {
            mustBeObject('a', a);
            mustBeObject('b', b);
            this.α = a.α - b.α;
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.β = a.β - b.β;
            return this;
        };
        /**
         * Returns a string representing the number in exponential notation.
         * @method toExponential
         * @return {string}
         */
        G2.prototype.toExponential = function () {
            var coordToString = function (coord) { return coord.toExponential(); };
            return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS);
        };
        /**
         * Returns a string representing the number in fixed-point notation.
         * @method toFixed
         * @param fractionDigits [number]
         * @return {string}
         */
        G2.prototype.toFixed = function (fractionDigits) {
            var coordToString = function (coord) { return coord.toFixed(fractionDigits); };
            return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS);
        };
        /**
         * Returns a string representation of the number.
         * @method toString
         * @return {string}
         */
        G2.prototype.toString = function () {
            var coordToString = function (coord) { return coord.toString(); };
            return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS);
        };
        G2.prototype.grade = function (grade) {
            mustBeInteger('grade', grade);
            switch (grade) {
                case 0:
                    {
                        this.x = 0;
                        this.y = 0;
                        this.β = 0;
                    }
                    break;
                case 1:
                    {
                        this.α = 0;
                        this.β = 0;
                    }
                    break;
                case 2:
                    {
                        this.α = 0;
                        this.x = 0;
                        this.y = 0;
                    }
                    break;
                default: {
                    this.α = 0;
                    this.x = 0;
                    this.y = 0;
                    this.β = 0;
                }
            }
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this ^ m</code>
         * </p>
         * @method wedge
         * @param m {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.ext = function (m) {
            return this.ext2(this, m);
        };
        /**
         * <p>
         * <code>this ⟼ a ^ b</code>
         * </p>
         * @method ext2
         * @param a {GeometricE2}
         * @param b {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.ext2 = function (a, b) {
            var a0 = a.α;
            var a1 = a.x;
            var a2 = a.y;
            var a3 = a.β;
            var b0 = b.α;
            var b1 = b.x;
            var b2 = b.y;
            var b3 = b.β;
            this.α = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            this.x = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            this.y = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            this.β = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return this;
        };
        /**
         * Sets this multivector to the identity element for addition, <b>0</b>.
         * @method zero
         * @return {G2}
         * @chainable
         */
        G2.prototype.zero = function () {
            this.α = 0;
            this.x = 0;
            this.y = 0;
            this.β = 0;
            return this;
        };
        /**
         * @method __add__
         * @param rhs {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__add__ = function (rhs) {
            if (rhs instanceof G2) {
                return G2.copy(this).add(rhs);
            }
            else if (typeof rhs === 'number') {
                // Addition commutes, but addScalar might be useful.
                return G2.fromScalar(rhs).add(this);
            }
            else {
                var rhsCopy = duckCopy(rhs);
                if (rhsCopy) {
                    // rhs is a copy and addition commutes.
                    return rhsCopy.add(this);
                }
                else {
                    return void 0;
                }
            }
        };
        /**
         * @method __div__
         * @param rhs {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__div__ = function (rhs) {
            if (rhs instanceof G2) {
                return G2.copy(this).div(rhs);
            }
            else if (typeof rhs === 'number') {
                return G2.copy(this).divByScalar(rhs);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rdiv__
         * @param lhs {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__rdiv__ = function (lhs) {
            if (lhs instanceof G2) {
                return G2.copy(lhs).div(this);
            }
            else if (typeof lhs === 'number') {
                return G2.fromScalar(lhs).div(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __mul__
         * @param rhs {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__mul__ = function (rhs) {
            if (rhs instanceof G2) {
                return G2.copy(this).mul(rhs);
            }
            else if (typeof rhs === 'number') {
                return G2.copy(this).scale(rhs);
            }
            else {
                var rhsCopy = duckCopy(rhs);
                if (rhsCopy) {
                    // rhsCopy is a copy but multiplication does not commute.
                    // If we had rmul then we could mutate the rhs!
                    return this.__mul__(rhsCopy);
                }
                else {
                    return void 0;
                }
            }
        };
        /**
         * @method __rmul__
         * @param lhs {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof G2) {
                return G2.copy(lhs).mul(this);
            }
            else if (typeof lhs === 'number') {
                // Scalar multiplication commutes.
                return G2.copy(this).scale(lhs);
            }
            else {
                var lhsCopy = duckCopy(lhs);
                if (lhsCopy) {
                    // lhs is a copy, so we can mutate it, and use it on the left.
                    return lhsCopy.mul(this);
                }
                else {
                    return void 0;
                }
            }
        };
        /**
         * @method __radd__
         * @param lhs {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__radd__ = function (lhs) {
            if (lhs instanceof G2) {
                return G2.copy(lhs).add(this);
            }
            else if (typeof lhs === 'number') {
                return G2.fromScalar(lhs).add(this);
            }
            else {
                var lhsCopy = duckCopy(lhs);
                if (lhsCopy) {
                    // lhs is a copy, so we can mutate it.
                    return lhsCopy.add(this);
                }
                else {
                    return void 0;
                }
            }
        };
        /**
         * @method __sub__
         * @param rhs {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__sub__ = function (rhs) {
            if (rhs instanceof G2) {
                return G2.copy(this).sub(rhs);
            }
            else if (typeof rhs === 'number') {
                return G2.fromScalar(-rhs).add(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rsub__
         * @param lhs {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof G2) {
                return G2.copy(lhs).sub(this);
            }
            else if (typeof lhs === 'number') {
                return G2.fromScalar(lhs).sub(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __wedge__
         * @param rhs {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__wedge__ = function (rhs) {
            if (rhs instanceof G2) {
                return G2.copy(this).ext(rhs);
            }
            else if (typeof rhs === 'number') {
                // The outer product with a scalar is simply scalar multiplication.
                return G2.copy(this).scale(rhs);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rwedge__
         * @param lhs {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__rwedge__ = function (lhs) {
            if (lhs instanceof G2) {
                return G2.copy(lhs).ext(this);
            }
            else if (typeof lhs === 'number') {
                // The outer product with a scalar is simply scalar multiplication, and commutes.
                return G2.copy(this).scale(lhs);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __lshift__
         * @param other {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__lshift__ = function (rhs) {
            if (rhs instanceof G2) {
                return G2.copy(this).lco(rhs);
            }
            else if (typeof rhs === 'number') {
                return G2.copy(this).lco(G2.fromScalar(rhs));
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rlshift__
         * @param other {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__rlshift__ = function (lhs) {
            if (lhs instanceof G2) {
                return G2.copy(lhs).lco(this);
            }
            else if (typeof lhs === 'number') {
                return G2.fromScalar(lhs).lco(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rshift__
         * @param rhs {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__rshift__ = function (rhs) {
            if (rhs instanceof G2) {
                return G2.copy(this).rco(rhs);
            }
            else if (typeof rhs === 'number') {
                return G2.copy(this).rco(G2.fromScalar(rhs));
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rrshift__
         * @param lhs {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__rrshift__ = function (lhs) {
            if (lhs instanceof G2) {
                return G2.copy(lhs).rco(this);
            }
            else if (typeof lhs === 'number') {
                return G2.fromScalar(lhs).rco(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __vbar__
         * @param rhs {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__vbar__ = function (rhs) {
            if (rhs instanceof G2) {
                return G2.copy(this).scp(rhs);
            }
            else if (typeof rhs === 'number') {
                return G2.copy(this).scp(G2.fromScalar(rhs));
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rvbar__
         * @param lhs {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__rvbar__ = function (lhs) {
            if (lhs instanceof G2) {
                return G2.copy(lhs).scp(this);
            }
            else if (typeof lhs === 'number') {
                return G2.fromScalar(lhs).scp(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __pos__
         * @return {G2}
         * @private
         * @chainable
         */
        G2.prototype.__pos__ = function () {
            // It's important that we make a copy whenever using operators.
            return G2.copy(this); /*.pos()*/
        };
        /**
         * @method __neg__
         * @return {G2}
         * @private
         * @chainable
         */
        G2.prototype.__neg__ = function () {
            return G2.copy(this).neg();
        };
        Object.defineProperty(G2, "zero", {
            /**
             * The identity element for addition.
             * @property zero
             * @type {G2}
             * @readOnly
             * @static
             */
            get: function () { return G2.copy(zero); },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(G2, "one", {
            /**
             * The identity element for multiplication.
             * @property one
             * @type {G2}
             * @readOnly
             * @static
             */
            get: function () { return G2.copy(one); },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(G2, "e1", {
            /**
             * Basis vector corresponding to the <code>x</code> coordinate.
             * @property e1
             * @type {G2}
             * @readOnly
             * @static
             */
            get: function () { return G2.copy(e1); },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(G2, "e2", {
            /**
             * Basis vector corresponding to the <code>y</code> coordinate.
             * @property e2
             * @type {G2}
             * @readOnly
             * @static
             */
            get: function () { return G2.copy(e2); },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(G2, "I", {
            /**
             * Basis vector corresponding to the <code>β</code> coordinate.
             * @property I
             * @type {G2}
             * @readOnly
             * @static
             */
            get: function () { return G2.copy(I); },
            enumerable: true,
            configurable: true
        });
        ;
        /**
         * @method copy
         * @param M {GeometricE2}
         * @return {G2}
         * @static
         */
        G2.copy = function (M) {
            var copy = new G2();
            copy.α = M.α;
            copy.x = M.x;
            copy.y = M.y;
            copy.β = M.β;
            return copy;
        };
        /**
         * @method fromScalar
         * @param α {number}
         * @return {G2}
         * @static
         * @chainable
         */
        G2.fromScalar = function (α) {
            return new G2().addScalar(α);
        };
        /**
         * @method fromSpinor
         * @param spinor {SpinorE2}
         * @return {G2}
         * @static
         */
        G2.fromSpinor = function (spinor) {
            return new G2().copySpinor(spinor);
        };
        /**
         * @method fromVector
         * @param vector {VectorE2}
         * @return {G2}
         * @static
         */
        G2.fromVector = function (vector) {
            if (isDefined(vector)) {
                return new G2().copyVector(vector);
            }
            else {
                // We could also return an undefined value here!
                return void 0;
            }
        };
        /**
        * @method lerp
        * @param A {GeometricE2}
        * @param B {GeometricE2}
        * @param α {number}
        * @return {G2} <code>A + α * (B - A)</code>
        * @static
        */
        G2.lerp = function (A, B, α) {
            return G2.copy(A).lerp(B, α);
            // return G2.copy(B).sub(A).scale(α).add(A)
        };
        /**
         * Computes the rotor that rotates vector <code>a</code> to vector <code>b</code>.
         * @method rotorFromDirections
         * @param a {VectorE2} The <em>from</em> vector.
         * @param b {VectorE2} The <em>to</em> vector.
         * @return {G2}
         * @static
         */
        G2.rotorFromDirections = function (a, b) {
            return new G2().rotorFromDirections(a, b);
        };
        return G2;
    })(VectorN);
    return G2;
});
