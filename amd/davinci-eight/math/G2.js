var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/dotVectorsE2', '../math/extE2', '../checks/isNumber', '../checks/isObject', '../math/lcoE2', '../math/mulE2', '../checks/mustBeNumber', '../checks/mustBeObject', '../checks/mustBeString', '../i18n/readOnly', '../math/rcoE2', '../math/scpE2', '../math/stringFromCoordinates', '../math/VectorN', '../math/wedgeXY'], function (require, exports, dotVectorsE2, extE2, isNumber, isObject, lcoE2, mulE2, mustBeNumber, mustBeObject, mustBeString, readOnly, rcoE2, scpE2, stringFromCoordinates, VectorN, wedgeXY) {
    // Symbolic constants for the coordinate indices into the data array.
    var COORD_W = 0;
    var COORD_X = 1;
    var COORD_Y = 2;
    var COORD_XY = 3;
    var abs = Math.abs;
    var atan2 = Math.atan2;
    var exp = Math.exp;
    var cos = Math.cos;
    var sin = Math.sin;
    var BASIS_LABELS = ["1", "e1", "e2", "I"];
    /**
     * Coordinates corresponding to basis labels.
     */
    function coordinates(m) {
        return [m.w, m.x, m.y, m.xy];
    }
    /**
     * Promotes an unknown value to a G2, or returns undefined.
     */
    function duckCopy(value) {
        if (isObject(value)) {
            var m = value;
            if (isNumber(m.x) && isNumber(m.y)) {
                if (isNumber(m.w) && isNumber(m.xy)) {
                    console.warn("Copying GeometricE2 to G2");
                    return G2.copy(m);
                }
                else {
                    console.warn("Copying VectorE2 to G2");
                    return G2.fromVector(m);
                }
            }
            else {
                if (isNumber(m.w) && isNumber(m.xy)) {
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
    function makeConstantE2(label, w, x, y, xy) {
        mustBeString('label', label);
        mustBeNumber('w', w);
        mustBeNumber('x', x);
        mustBeNumber('y', y);
        mustBeNumber('xy', xy);
        var that;
        that = {
            get w() {
                return w;
            },
            set w(unused) {
                throw new Error(readOnly(label + '.w').message);
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
            get xy() {
                return xy;
            },
            set xy(unused) {
                throw new Error(readOnly(label + '.xy').message);
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
        Object.defineProperty(G2.prototype, "w", {
            /**
             * The coordinate corresponding to the unit standard basis scalar.
             * @property w
             * @type {number}
             */
            get: function () {
                return this.data[COORD_W];
            },
            set: function (w) {
                mustBeNumber('w', w);
                this.modified = this.modified || this.data[COORD_W] !== w;
                this.data[COORD_W] = w;
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
                mustBeNumber('x', x);
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
                mustBeNumber('y', y);
                this.modified = this.modified || this.data[COORD_Y] !== y;
                this.data[COORD_Y] = y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2.prototype, "xy", {
            /**
             * The coordinate corresponding to the <b>e</b><sub>1</sub><b>e</b><sub>2</sub> standard basis bivector.
             * @property xy
             * @type {number}
             */
            get: function () {
                return this.data[COORD_XY];
            },
            set: function (xy) {
                mustBeNumber('xy', xy);
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
            this.w += M.w * α;
            this.x += M.x * α;
            this.y += M.y * α;
            this.xy += M.xy * α;
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
            this.w = a.w + b.w;
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            this.xy = a.xy + b.xy;
            return this;
        };
        /**
         * Assuming <code>this = A * exp(B * θ)</code>, returns the <em>principal value</em> of θ.
         * @method arg
         * @return {number}
         */
        G2.prototype.arg = function () {
            return atan2(this.xy, this.w);
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
            this.xy = -this.xy;
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
            return this.conL2(this, m);
        };
        /**
         * <p>
         * <code>this ⟼ a << b</code>
         * </p>
         * @method conL2
         * @param a {GeometricE2}
         * @param b {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.conL2 = function (a, b) {
            var a0 = a.w;
            var a1 = a.x;
            var a2 = a.y;
            var a3 = a.xy;
            var b0 = b.w;
            var b1 = b.x;
            var b2 = b.y;
            var b3 = b.xy;
            this.w = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            this.x = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            this.y = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            this.xy = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
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
            return this.conR2(this, m);
        };
        /**
         * <p>
         * <code>this ⟼ a >> b</code>
         * </p>
         * @method conR2
         * @param a {GeometricE2}
         * @param b {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.conR2 = function (a, b) {
            var a0 = a.w;
            var a1 = a.x;
            var a2 = a.y;
            var a3 = a.xy;
            var b0 = b.w;
            var b1 = b.x;
            var b2 = b.y;
            var b3 = b.xy;
            this.w = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            this.x = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            this.y = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            this.xy = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
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
            this.w = M.w;
            this.x = M.x;
            this.y = M.y;
            this.xy = M.xy;
            return this;
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
            this.w = spinor.w;
            this.x = 0;
            this.y = 0;
            this.xy = spinor.xy;
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
            this.w = 0;
            this.x = vector.x;
            this.y = vector.y;
            this.xy = 0;
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
         * @method divideByScalar
         * @param α {number}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.divideByScalar = function (α) {
            mustBeNumber('α', α);
            this.w /= α;
            this.x /= α;
            this.y /= α;
            this.xy /= α;
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
            var w = -m.xy;
            var x = +m.y;
            var y = -m.x;
            var xy = +m.w;
            this.w = w;
            this.x = x;
            this.y = y;
            this.xy = xy;
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
            var w = this.w;
            var z = this.xy;
            var expW = exp(w);
            // φ is actually the absolute value of one half the rotation angle.
            // The orientation of the rotation gets carried in the bivector components.
            var φ = Math.sqrt(z * z);
            var s = expW * (φ !== 0 ? sin(φ) / φ : 1);
            this.w = expW * cos(φ);
            this.xy = z * s;
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
            // this.divideByScalar(this.quaditude());
            return this;
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
            this.w += (target.w - this.w) * α;
            this.x += (target.x - this.x) * α;
            this.y += (target.y - this.y) * α;
            this.xy += (target.xy - this.xy) * α;
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
         * <code>this ⟼ log(sqrt(w * w + xy * xy)) + <b>e</b><sub>1</sub><b>e</b><sub>2</sub> * atan2(xy, w)</code>
         * </p>
         * @method log
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.log = function () {
            // FIXME: This only handles the spinor components.
            var w = this.w;
            var xy = this.xy;
            var r = Math.sqrt(w * w + xy * xy);
            this.w = Math.log(r);
            this.x = 0;
            this.y = 0;
            this.xy = Math.atan2(xy, w);
            return this;
        };
        /**
         * @method magnitude
         * @return {number}
         */
        G2.prototype.magnitude = function () {
            return Math.sqrt(this.quaditude());
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
            var a0 = a.w;
            var a1 = a.x;
            var a2 = a.y;
            var a3 = a.xy;
            var b0 = b.w;
            var b1 = b.x;
            var b2 = b.y;
            var b3 = b.xy;
            this.w = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            this.x = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            this.y = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            this.xy = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
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
            this.w = -this.w;
            this.x = -this.x;
            this.y = -this.y;
            this.xy = -this.xy;
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
            // FIXME: TODO
            this.w = this.magnitude();
            this.xy = 0;
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
            // The quaditude is the squared norm.
            var norm = Math.sqrt(this.quaditude());
            this.w = this.w / norm;
            this.x = this.x / norm;
            this.y = this.y / norm;
            this.xy = this.xy / norm;
            return this;
        };
        /**
         * @method quaditude
         * @return {number} <code>this * conj(this)</code>
         */
        G2.prototype.quaditude = function () {
            // FIXME: TODO
            var w = this.w;
            var xy = this.xy;
            return w * w + xy * xy;
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
         * <code>this ⟼ reverse(this)</code>
         * </p>
         * @method reverse
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.reverse = function () {
            // reverse has a ++-- structure.
            this.w = this.w;
            this.x = this.x;
            this.y = this.y;
            this.xy = -this.xy;
            return this;
        };
        /**
         * @method __tilde__
         * @return {G2}
         */
        G2.prototype.__tilde__ = function () {
            return G2.copy(this).reverse();
        };
        /**
         * <p>
         * <code>this ⟼ R * this * reverse(R)</code>
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
            var w = R.w;
            var ix = w * x + a * y;
            var iy = w * y - a * x;
            this.x = ix * w + iy * a;
            this.y = iy * w - ix * a;
            return this;
        };
        /**
         * <p>
         * Computes a rotor, R, from two unit vectors, where
         * R = (1 + b * a) / sqrt(2 * (1 + b << a))
         * </p>
         * @method rotor
         * @param b {VectorE2} The ending unit vector
         * @param a {VectorE2} The starting unit vector
         * @return {G2} <code>this</code> The rotor representing a rotation from a to b.
         * @chainable
         */
        G2.prototype.rotor = function (b, a) {
            this.spinor(b, a);
            this.w += 1; // FIXME: addScalar would make this all chainable
            return this.divideByScalar(Math.sqrt(2 * (1 + dotVectorsE2(b, a))));
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
            var xy = B.xy;
            /**
             * Sandwich operation means we need the half-angle.
             */
            var φ = θ / 2;
            /**
             * scalar part = cos(|B| * θ / 2)
             */
            this.w = cos(abs(xy) * φ);
            this.x = 0;
            this.y = 0;
            /**
             * pseudo part = -unit(B) * sin(|B| * θ / 2)
             */
            this.xy = -sin(xy * φ);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ align(this, m)</code>
         * </p>
         * @method align
         * @param m {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.align = function (m) {
            return this.align2(this, m);
        };
        /**
         * <p>
         * <code>this ⟼ align(a, b)</code>
         * </p>
         * @method align2
         * @param a {GeometricE2}
         * @param b {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.align2 = function (a, b) {
            this.w = scpE2(a.w, a.x, a.y, a.xy, b.w, b.x, b.y, b.xy, 0);
            this.x = 0;
            this.y = 0;
            this.xy = 0;
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
            this.w *= α;
            this.x *= α;
            this.y *= α;
            this.xy *= α;
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
            this.w = dotVectorsE2(a, b);
            this.x = 0;
            this.y = 0;
            this.xy = wedgeXY(ax, ay, 0, bx, by, 0); // FIXME wedgeVectorsE2
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
            this.w -= M.w * α;
            this.x -= M.x * α;
            this.y -= M.y * α;
            this.xy -= M.xy * α;
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
            this.w = a.w - b.w;
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.xy = a.xy - b.xy;
            return this;
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
        /**
         * <p>
         * <code>this ⟼ this ^ m</code>
         * </p>
         * @method wedge
         * @param m {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.wedge = function (m) {
            return this.wedge2(this, m);
        };
        /**
         * <p>
         * <code>this ⟼ a ^ b</code>
         * </p>
         * @method wedge2
         * @param a {GeometricE2}
         * @param b {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.wedge2 = function (a, b) {
            var a0 = a.w;
            var a1 = a.x;
            var a2 = a.y;
            var a3 = a.xy;
            var b0 = b.w;
            var b1 = b.x;
            var b2 = b.y;
            var b3 = b.xy;
            this.w = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            this.x = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            this.y = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            this.xy = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return this;
        };
        /**
         * @method __add__
         * @param other {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__add__ = function (other) {
            if (other instanceof G2) {
                return G2.copy(this).add(other);
            }
            else if (typeof other === 'number') {
                return G2.fromScalar(other).add(this);
            }
            else {
                var rhs = duckCopy(other);
                if (rhs) {
                    // rhs is a copy and addition commutes.
                    return rhs.add(this);
                }
                else {
                    return void 0;
                }
            }
        };
        /**
         * @method __div__
         * @param other {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__div__ = function (other) {
            if (other instanceof G2) {
                return G2.copy(this).div(other);
            }
            else if (typeof other === 'number') {
                return G2.copy(this).divideByScalar(other);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __mul__
         * @param other {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__mul__ = function (other) {
            if (other instanceof G2) {
                return G2.copy(this).mul(other);
            }
            else if (typeof other === 'number') {
                return G2.copy(this).scale(other);
            }
            else {
                var rhs = duckCopy(other);
                if (rhs) {
                    // rhs is a copy but multiplication does not commute.
                    // If we had rmul then we could mutate the rhs!
                    return this.__mul__(rhs);
                }
                else {
                    return void 0;
                }
            }
        };
        /**
         * @method __rmul__
         * @param other {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__rmul__ = function (other) {
            if (other instanceof G2) {
                return G2.copy(other).mul(this);
            }
            else if (typeof other === 'number') {
                // Scalar multiplication commutes.
                return G2.copy(this).scale(other);
            }
            else {
                var lhs = duckCopy(other);
                if (lhs) {
                    // lhs is a copy, so we can mutate it.
                    return lhs.mul(this);
                }
                else {
                    return void 0;
                }
            }
        };
        /**
         * @method __radd__
         * @param other {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__radd__ = function (other) {
            if (other instanceof G2) {
                var rhs = other;
                return G2.copy(other).add(this);
            }
            else if (typeof other === 'number') {
                return G2.fromScalar(other).add(this);
            }
            else {
                var lhs = duckCopy(other);
                if (lhs) {
                    // lhs is a copy, so we can mutate it.
                    return lhs.add(this);
                }
                else {
                    return void 0;
                }
            }
        };
        /**
         * @method __sub__
         * @param other {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__sub__ = function (other) {
            if (other instanceof G2) {
                var rhs = other;
                return G2.copy(this).sub(rhs);
            }
            else if (typeof other === 'number') {
                return G2.fromScalar(-other).add(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rsub__
         * @param other {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__rsub__ = function (other) {
            if (other instanceof G2) {
                var rhs = other;
                return G2.copy(other).sub(this);
            }
            else if (typeof other === 'number') {
                return G2.fromScalar(other).sub(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __wedge__
         * @param other {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__wedge__ = function (other) {
            if (other instanceof G2) {
                return G2.copy(this).wedge(other);
            }
            else if (typeof other === 'number') {
                // The outer product with a scalar is simply scalar multiplication.
                return G2.copy(this).scale(other);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rwedge__
         * @param other {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__rwedge__ = function (other) {
            if (other instanceof G2) {
                return G2.copy(other).wedge(this);
            }
            else if (typeof other === 'number') {
                // The outer product with a scalar is simply scalar multiplication, and commutes
                return G2.copy(this).scale(other);
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
        G2.prototype.__lshift__ = function (other) {
            if (other instanceof G2) {
                return G2.copy(this).lco(other);
            }
            else if (typeof other === 'number') {
                return G2.fromScalar(other).lco(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rshift__
         * @param other {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__rshift__ = function (other) {
            if (other instanceof G2) {
                return G2.copy(this).rco(other);
            }
            else if (typeof other === 'number') {
                return G2.fromScalar(other).rco(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __vbar__
         * @param other {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__vbar__ = function (other) {
            if (other instanceof G2) {
                return G2.copy(this).align(other);
            }
            else if (typeof other === 'number') {
                return G2.fromScalar(other).align(this);
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
             * Basis vector corresponding to the <code>xy</code> coordinate.
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
            copy.w = M.w;
            copy.x = M.x;
            copy.y = M.y;
            copy.xy = M.xy;
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
            var copy = new G2();
            copy.w = α;
            return copy;
        };
        /**
         * @method fromSpinor
         * @param spinor {SpinorE2}
         * @return {G2}
         * @static
         */
        G2.fromSpinor = function (spinor) {
            var copy = new G2();
            copy.w = spinor.w;
            copy.x = 0;
            copy.y = 0;
            copy.xy = spinor.xy;
            return copy;
        };
        /**
         * @method fromVector
         * @param vector {VectorE2}
         * @return {G2}
         * @static
         */
        G2.fromVector = function (vector) {
            var copy = new G2();
            copy.w = 0;
            copy.x = vector.x;
            copy.y = vector.y;
            copy.xy = 0;
            return copy;
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
        return G2;
    })(VectorN);
    return G2;
});
