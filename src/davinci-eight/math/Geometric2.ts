import arraysEQ from './arraysEQ';
import b2 from '../geometries/b2';
import b3 from '../geometries/b3';
import { Coords } from './Coords';
import dotVector from './dotVectorE2';
import extE2 from './extE2';
import gauss from './gauss';
import GeometricE2 from './GeometricE2';
import isDefined from '../checks/isDefined';
import isNumber from '../checks/isNumber';
import isObject from '../checks/isObject';
import lcoE2 from './lcoE2';
import mulE2 from './mulE2';
import mustBeInteger from '../checks/mustBeInteger';
import mustBeNumber from '../checks/mustBeNumber';
import mustBeObject from '../checks/mustBeObject';
import notImplemented from '../i18n/notImplemented';
import notSupported from '../i18n/notSupported';
import Pseudo from './Pseudo';
import rcoE2 from './rcoE2';
import rotorFromDirections from './rotorFromDirectionsE2';
import scpE2 from './scpE2';
import SpinorE2 from './SpinorE2';
import stringFromCoordinates from './stringFromCoordinates';
import VectorE2 from './VectorE2';
import wedgeXY from './wedgeXY';

// GraphicsProgramSymbols constants for the coordinate indices into the data array.
const COORD_SCALAR = 0;
const COORD_X = 1;
const COORD_Y = 2;
const COORD_PSEUDO = 3;

const abs = Math.abs;
const atan2 = Math.atan2;
const exp = Math.exp;
const log = Math.log;
const cos = Math.cos;
const sin = Math.sin;
const sqrt = Math.sqrt;

const LEFTWARDS_ARROW = "←";
const RIGHTWARDS_ARROW = "→";
const UPWARDS_ARROW = "↑";
const DOWNWARDS_ARROW = "↓";
const CLOCKWISE_OPEN_CIRCLE_ARROW = "↻";
const ANTICLOCKWISE_OPEN_CIRCLE_ARROW = "↺";

const ARROW_LABELS = ["1", [LEFTWARDS_ARROW, RIGHTWARDS_ARROW], [DOWNWARDS_ARROW, UPWARDS_ARROW], [CLOCKWISE_OPEN_CIRCLE_ARROW, ANTICLOCKWISE_OPEN_CIRCLE_ARROW]];
const COMPASS_LABELS = ["1", ['W', 'E'], ['S', 'N'], [CLOCKWISE_OPEN_CIRCLE_ARROW, ANTICLOCKWISE_OPEN_CIRCLE_ARROW]];
const STANDARD_LABELS = ["1", "e1", "e2", "I"];

/**
 * Coordinates corresponding to basis labels.
 */
function coordinates(m: GeometricE2): number[] {
    return [m.a, m.x, m.y, m.b];
}

/**
 * Promotes an unknown value to a Geometric2, or returns undefined.
 */
function duckCopy(value: any): Geometric2 {
    if (isObject(value)) {
        const m = <GeometricE2>value;
        if (isNumber(m.x) && isNumber(m.y)) {
            if (isNumber(m.a) && isNumber(m.b)) {
                console.warn("Copying GeometricE2 to Geometric2");
                return Geometric2.copy(m);
            }
            else {
                console.warn("Copying VectorE2 to Geometric2");
                return Geometric2.fromVector(m);
            }
        }
        else {
            if (isNumber(m.a) && isNumber(m.b)) {
                console.warn("Copying SpinorE2 to Geometric2");
                return Geometric2.fromSpinor(m);
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

/**
 * <p>
 * A <em>mutable</em> multivector for the <em>Euclidean</em> plane with <em>Cartesian</em> coordinates.
 * </p>
 * <p>
 * The mutable nature of this class makes it suitable for high-preformance applications by avoiding temporary object creation.
 * Danger Will Robinson! It's easy to accidentally mutate a <code>Geometric2</code> quantity!
 * </p>
 * <p>
 * </p>
 *
 * @example
 *     // The constructor creates the zero multivector, a quantity with all components equal to zero.
 *     const M = new EIGHT.Geometric2()
 *
 * @class Geometric2
 * @extends Coords
 * @beta
 */
export class Geometric2 extends Coords implements GeometricE2 {

    /**
     * @property BASIS_LABELS
     * @type {(string | string[])[]}
     * @static
     */
    static BASIS_LABELS = STANDARD_LABELS;

    /**
     * @property BASIS_LABELS_COMPASS
     * @type {(string | string[])[]}
     * @static
     */
    static BASIS_LABELS_COMPASS = COMPASS_LABELS;

    /**
     * @property BASIS_LABELS_GEOMETRIC
     * @type {(string | string[])[]}
     * @static
     */
    static BASIS_LABELS_GEOMETRIC = ARROW_LABELS;

    /**
     * @property BASIS_LABELS_STANDARD
     * @type {(string | string[])[]}
     * @static
     */
    static BASIS_LABELS_STANDARD = STANDARD_LABELS;

    /**
     * @class Geometric2
     * @constructor
     */
    constructor() {
        super([0, 0, 0, 0], false, 4);
    }

    /**
     * <p>
     * The coordinate corresponding to <b>1</b> a.k.a. the unit standard basis scalar.
     * </p>
     * <p>
     * This is a longhand alias for the <code>α</code> property (suitable for conventional keyboards).
     * </p>
     */
    get a(): number {
        return this.coords[COORD_SCALAR];
    }
    set a(a: number) {
        this.modified = this.modified || this.coords[COORD_SCALAR] !== a;
        this.coords[COORD_SCALAR] = a;
    }

    /**
     * <p>
     * The coordinate corresponding to the <b>e</b><sub>1</sub> standard basis vector.
     * </p>
     *
     * @property x
     * @type {number}
     */
    get x(): number {
        return this.coords[COORD_X];
    }
    set x(x: number) {
        this.modified = this.modified || this.coords[COORD_X] !== x;
        this.coords[COORD_X] = x;
    }

    /**
     * <p>
     * The coordinate corresponding to the <b>e</b><sub>2</sub> standard basis vector.
     * </p>
     *
     * @property y
     * @type {number}
     */
    get y(): number {
        return this.coords[COORD_Y];
    }
    set y(y: number) {
        this.modified = this.modified || this.coords[COORD_Y] !== y;
        this.coords[COORD_Y] = y;
    }

    /**
     * <p>
     * The coordinate corresponding to the <b>e</b><sub>1</sub><b>e</b><sub>2</sub> standard basis bivector.
     * </p>
     * <p>
     * This is a longhand alias for the <code>β</code> property (suitable for conventional keyboards).
     * </p>
     */
    get b(): number {
        return this.coords[COORD_PSEUDO];
    }
    set b(b: number) {
        this.modified = this.modified || this.coords[COORD_PSEUDO] !== b;
        this.coords[COORD_PSEUDO] = b;
    }

    /**
     * @property xy
     * @type number
     * @private
     */
    private get xy(): number {
        return this.coords[COORD_PSEUDO];
    }
    private set xy(xy: number) {
        this.modified = this.modified || this.coords[COORD_PSEUDO] !== xy;
        this.coords[COORD_PSEUDO] = xy;
    }

    /**
     * <p>
     * <code>this ⟼ this + M * α</code>
     * </p>
     *
     * @method add
     * @param M {GeometricE2}
     * @param [α = 1] {number}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    add(M: GeometricE2, α = 1): Geometric2 {
        mustBeObject('M', M);
        mustBeNumber('α', α);
        this.a += M.a * α;
        this.x += M.x * α;
        this.y += M.y * α;
        this.b += M.b * α;
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ a + b</code>
     * </p>
     *
     * @method add2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    add2(a: GeometricE2, b: GeometricE2): Geometric2 {
        mustBeObject('a', a);
        mustBeObject('b', b);
        this.a = a.a + b.a;
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.b = a.b + b.b;
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ this + Iβ</code>
     * </p>
     *
     * @method addPseudo
     * @param β {number}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    addPseudo(β: number): Geometric2 {
        mustBeNumber('β', β);
        this.b += β;
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ this + α</code>
     * </p>
     *
     * @method addScalar
     * @param α {number}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    addScalar(α: number): Geometric2 {
        mustBeNumber('α', α);
        this.a += α;
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ this + v * α</code>
     * </p>
     *
     * @method addVector
     * @param v {VectorE2}
     * @param [α = 1] {number}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    addVector(v: VectorE2, α = 1): Geometric2 {
        mustBeObject('v', v);
        mustBeNumber('α', α);
        this.x += v.x * α;
        this.y += v.y * α;
        return this;
    }

    /**
     * @method adj
     * @return {Geometric2}
     * @chainable
     */
    adj(): Geometric2 {
        throw new Error(notImplemented('adj').message);
    }

    /**
     * <p>
     * <code>this ⟼ log(this).grade(2)</code>
     * </p>
     *
     * @method angle
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    angle(): Geometric2 {
        return this.log().grade(2);
    }

    /**
     * @method approx
     * @param n {number}
     * @return {Geometric2}
     * @chainable
     */
    approx(n: number): Geometric2 {
        super.approx(n);
        return this;
    }

    /**
     * @method clone
     * @return {Geometric2} <code>copy(this)</code>
     * @chainable
     */
    clone(): Geometric2 {
        const m = new Geometric2();
        m.copy(this);
        return m;
    }

    /**
     * <p>
     * <code>this ⟼ conjugate(this)</code>
     * </p>
     *
     * @method conj
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    conj(): Geometric2 {
        // FIXME: This is only the bivector part.
        // Also need to think about various involutions.
        this.b = -this.b;
        return this;
    }

    /**
     * @method cos
     * @return {Geometric2}
     */
    cos(): Geometric2 {
        throw new Error(notImplemented('cos').message);
    }

    /**
     * @method cosh
     * @return {Geometric2}
     */
    cosh(): Geometric2 {
        throw new Error(notImplemented('cosh').message);
    }

    /**
     * @method distanceTo
     * @param M {GeometricE2}
     * @return {number}
     */
    distanceTo(M: GeometricE2): number {
        const α = this.a - M.a;
        const x = this.x - M.x;
        const y = this.y - M.y;
        const β = this.b - M.b;
        return Math.sqrt(scpE2(α, x, y, β, α, x, y, β, 0));
    }

    /**
     * <p>
     * <code>this ⟼ copy(M)</code>
     * </p>
     *
     * @method copy
     * @param M {GeometricE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    copy(M: GeometricE2): Geometric2 {
        mustBeObject('M', M);
        this.a = M.a;
        this.x = M.x;
        this.y = M.y;
        this.b = M.b;
        return this;
    }

    /**
     * Sets this multivector to the value of the scalar, <code>α</code>.
     *
     * @method copyScalar
     * @param α {number}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    copyScalar(α: number): Geometric2 {
        return this.zero().addScalar(α);
    }

    /**
     * <p>
     * <code>this ⟼ copy(spinor)</code>
     * </p>
     *
     * @method copySpinor
     * @param spinor {SpinorE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    copySpinor(spinor: SpinorE2) {
        mustBeObject('spinor', spinor);
        this.a = spinor.a;
        this.x = 0;
        this.y = 0;
        this.b = spinor.b;
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ copyVector(vector)</code>
     * </p>
     *
     * @method copyVector
     * @param vector {VectorE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    copyVector(vector: VectorE2) {
        mustBeObject('vector', vector);
        this.a = 0;
        this.x = vector.x;
        this.y = vector.y;
        this.b = 0;
        return this;
    }

    /**
     * @method cubicBezier
     * @param t {number}
     * @param controlBegin {GeometricE2}
     * @param controlEnd {GeometricE2}
     * @param endPoint {GeometricE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    cubicBezier(t: number, controlBegin: GeometricE2, controlEnd: GeometricE2, endPoint: GeometricE2) {
        let α = b3(t, this.a, controlBegin.a, controlEnd.a, endPoint.a);
        let x = b3(t, this.x, controlBegin.x, controlEnd.x, endPoint.x);
        let y = b3(t, this.y, controlBegin.y, controlEnd.y, endPoint.y);
        let β = b3(t, this.b, controlBegin.b, controlEnd.b, endPoint.b);
        this.a = α;
        this.x = x;
        this.y = y;
        this.b = β;
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ this / magnitude(this)</code>
     * </p>
     *
     * @method normalize
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    normalize(): Geometric2 {
        const norm: number = this.magnitude();
        this.a = this.a / norm;
        this.x = this.x / norm;
        this.y = this.y / norm;
        this.b = this.b / norm;
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ this / m</code>
     * </p>
     *
     * @method div
     * @param m {GeometricE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    div(m: GeometricE2): Geometric2 {
        return this.div2(this, m);
    }

    /**
     * <p>
     * <code>this ⟼ a / b</code>
     * </p>
     *
     * @method div2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    div2(a: GeometricE2, b: GeometricE2): Geometric2 {
        // Invert b using this then multiply, being careful to account for the case
        // when a and this are the same instance by getting a's coordinates first.
        const a0 = a.a;
        const a1 = a.x;
        const a2 = a.y;
        const a3 = a.b;
        this.copy(b).inv();
        const b0 = this.a;
        const b1 = this.x;
        const b2 = this.y;
        const b3 = this.b;
        this.a = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        this.x = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        this.y = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        this.b = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ this / α</code>
     * </p>
     *
     * @method divByScalar
     * @param α {number}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    divByScalar(α: number): Geometric2 {
        mustBeNumber('α', α);
        this.a /= α;
        this.x /= α;
        this.y /= α;
        this.b /= α;
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ dual(m) = I * m</code>
     * </p>
     *
     * @method dual
     * @param m {GeometricE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    dual(m: GeometricE2) {
        let w = -m.b;
        let x = +m.y;
        let y = -m.x;
        let β = +m.a;

        this.a = w;
        this.x = x;
        this.y = y;
        this.b = β;
        return this;
    }

    /**
     * @method equals
     * @param other {any}
     * @return {boolean}
     */
    equals(other: any): boolean {
        if (other instanceof Geometric2) {
            const that: Geometric2 = other;
            return arraysEQ(this.coords, that.coords);
        }
        else {
            return false;
        }
    }

    /**
     * <p>
     * <code>this ⟼ e<sup>this</sup></code>
     * </p>
     *
     * @method exp
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    exp() {
        const w = this.a;
        const z = this.b;
        const expW = exp(w);
        // φ is actually the absolute value of one half the rotation angle.
        // The orientation of the rotation gets carried in the bivector components.
        const φ = sqrt(z * z);
        const s = expW * (φ !== 0 ? sin(φ) / φ : 1);
        this.a = expW * cos(φ);
        this.b = z * s;
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ this ^ m</code>
     * </p>
     *
     * @method ext
     * @param m {GeometricE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    ext(m: GeometricE2): Geometric2 {
        return this.ext2(this, m);
    }

    /**
     * <p>
     * <code>this ⟼ a ^ b</code>
     * </p>
     *
     * @method ext2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    ext2(a: GeometricE2, b: GeometricE2): Geometric2 {
        const a0 = a.a;
        const a1 = a.x;
        const a2 = a.y;
        const a3 = a.b;
        const b0 = b.a;
        const b1 = b.x;
        const b2 = b.y;
        const b3 = b.b;
        this.a = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        this.x = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        this.y = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        this.b = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return this;
    }

    /**
     * Sets this multivector to its inverse, if it exists.
     *
     * @method inv
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    inv(): Geometric2 {
        // We convert the mutivector/geometric product into a tensor
        // representation with the consequence that inverting the multivector
        // is equivalent to solving a matrix equation, AX = b for X.
        const α = this.a;
        const x = this.x;
        const y = this.y;
        const β = this.b;

        const A = [
            [α, x, y, -β],
            [x, α, β, -y],
            [y, -β, α, x],
            [β, -y, x, α]
        ];

        const b = [1, 0, 0, 0];

        const X = gauss(A, b);

        this.a = X[0];
        this.x = X[1];
        this.y = X[2];
        this.b = X[3];

        return this;
    }

    /**
     * @method isOne
     * @return {boolean}
     */
    isOne(): boolean {
        return this.a === 1 && this.x === 0 && this.y === 0 && this.b === 0;
    }

    /**
     * @method isZero
     * @return {boolean}
     */
    isZero(): boolean {
        return this.a === 0 && this.x === 0 && this.y === 0 && this.b === 0;
    }

    /**
     * <p>
     * <code>this ⟼ this << m</code>
     * </p>
     *
     * @method lco
     * @param m {GeometricE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    lco(m: GeometricE2): Geometric2 {
        return this.lco2(this, m);
    }

    /**
     * <p>
     * <code>this ⟼ a << b</code>
     * </p>
     *
     * @method lco2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    lco2(a: GeometricE2, b: GeometricE2): Geometric2 {
        const a0 = a.a;
        const a1 = a.x;
        const a2 = a.y;
        const a3 = a.b;
        const b0 = b.a;
        const b1 = b.x;
        const b2 = b.y;
        const b3 = b.b;
        this.a = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        this.x = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        this.y = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        this.b = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ this + α * (target - this)</code>
     * </p>
     *
     * @method lerp
     * @param target {GeometricE2}
     * @param α {number}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    lerp(target: GeometricE2, α: number): Geometric2 {
        mustBeObject('target', target);
        mustBeNumber('α', α);
        this.a += (target.a - this.a) * α;
        this.x += (target.x - this.x) * α;
        this.y += (target.y - this.y) * α;
        this.b += (target.b - this.b) * α;
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ a + α * (b - a)</code>
     * </p>
     *
     * @method lerp2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @param α {number}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    lerp2(a: GeometricE2, b: GeometricE2, α: number): Geometric2 {
        mustBeObject('a', a);
        mustBeObject('b', b);
        mustBeNumber('α', α);
        this.copy(a).lerp(b, α);
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ log(sqrt(w * w + β * β)) + <b>e</b><sub>1</sub><b>e</b><sub>2</sub> * atan2(β, w)</code>
     * </p>
     *
     * @method log
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    log(): Geometric2 {
        // FIXME: This only handles the spinor components.
        const α = this.a;
        const β = this.b;
        this.a = log(sqrt(α * α + β * β));
        this.x = 0;
        this.y = 0;
        this.b = atan2(β, α);
        return this;
    }

    /**
     * <p>
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     * </p>
     * <p>
     * This method does not change this multivector.
     * </p>
     *
     * @method magnitude
     * @return {number}
     */
    magnitude(): number {
        return sqrt(this.squaredNormSansUnits());
    }

    /**
     * Intentionally undocumented.
     */
    magnitudeSansUnits(): number {
        return sqrt(this.squaredNormSansUnits());
    }

    /**
     * <p>
     * <code>this ⟼ this * s</code>
     * </p>
     *
     * @method mul
     * @param m {GeometricE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    mul(m: GeometricE2): Geometric2 {
        return this.mul2(this, m);
    }

    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     *
     * @method mul2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    mul2(a: GeometricE2, b: GeometricE2): Geometric2 {
        const a0 = a.a;
        const a1 = a.x;
        const a2 = a.y;
        const a3 = a.b;
        const b0 = b.a;
        const b1 = b.x;
        const b2 = b.y;
        const b3 = b.b;
        this.a = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        this.x = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        this.y = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        this.b = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ -1 * this</code>
     * </p>
     *
     * @method neg
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    neg(): Geometric2 {
        this.a = -this.a;
        this.x = -this.x;
        this.y = -this.y;
        this.b = -this.b;
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ sqrt(this * conj(this))</code>
     * </p>
     *
     * @method norm
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    norm(): Geometric2 {
        this.a = this.magnitudeSansUnits();
        this.x = 0;
        this.y = 0;
        this.b = 0;
        return this;
    }

    /**
     * Sets this multivector to the identity element for multiplication, <b>1</b>.
     *
     * @method one
     * @return {Geometric2}
     * @chainable
     */
    one() {
        this.a = 1;
        this.x = 0;
        this.y = 0;
        this.b = 0;
        return this;
    }

    /**
     * @method pow
     * @return {Geometric2}
     */
    pow(M: GeometricE2): Geometric2 {
        throw new Error(notImplemented('pow').message);
    }

    /**
     * <p>
     * Updates <code>this</code> target to be the <em>quad</em> or <em>squared norm</em> of the target.
     * </p>
     * <p>
     * <code>this ⟼ scp(this, rev(this)) = this | ~this</code>
     * </p>
     *
     * @method quad
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    quad(): Geometric2 {
        this.a = this.squaredNormSansUnits();
        this.x = 0;
        this.y = 0;
        this.b = 0;
        return this;
    }

    /**
     * @method quadraticBezier
     * @param t {number}
     * @param controlPoint {GeometricE2}
     * @param endPoint {GeometricE2}
     * @return {Geometric2}
     */
    quadraticBezier(t: number, controlPoint: GeometricE2, endPoint: GeometricE2) {
        let α = b2(t, this.a, controlPoint.a, endPoint.a);
        let x = b2(t, this.x, controlPoint.x, endPoint.x);
        let y = b2(t, this.y, controlPoint.y, endPoint.y);
        let β = b2(t, this.b, controlPoint.b, endPoint.b);
        this.a = α;
        this.x = x;
        this.y = y;
        this.b = β;
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ this >> m</code>
     * </p>
     *
     * @method rco
     * @param m {GeometricE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    rco(m: GeometricE2): Geometric2 {
        return this.rco2(this, m);
    }

    /**
     * <p>
     * <code>this ⟼ a >> b</code>
     * </p>
     *
     * @method rco2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    rco2(a: GeometricE2, b: GeometricE2): Geometric2 {
        const a0 = a.a;
        const a1 = a.x;
        const a2 = a.y;
        const a3 = a.b;
        const b0 = b.a;
        const b1 = b.x;
        const b2 = b.y;
        const b3 = b.b;
        this.a = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        this.x = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        this.y = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        this.b = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ - n * this * n</code>
     * </p>
     */
    reflect(n: VectorE2) {
        mustBeObject('n', n);

        const nx = n.x;
        const ny = n.y;
        mustBeNumber('n.x', nx);
        mustBeNumber('n.y', ny);
        const x = this.x;
        const y = this.y;

        const μ = nx * nx - ny * ny;
        const λ = -2 * nx * ny;

        this.a = -this.a;
        this.x = λ * y - μ * x;
        this.y = λ * x + μ * y;
        this.b = +this.b;

        return this;
    }

    /**
     * <p>
     * <code>this ⟼ rev(this)</code>
     * </p>
     *
     * @method rev
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    rev(): Geometric2 {
        // reverse has a ++-- structure.
        this.a = this.a;
        this.x = this.x;
        this.y = this.y;
        this.b = -this.b;
        return this;
    }

    /**
     * @method sin
     * @return {Geometric2}
     */
    sin(): Geometric2 {
        throw new Error(notImplemented('sin').message);
    }

    /**
     * @method sinh
     * @return {Geometric2}
     */
    sinh(): Geometric2 {
        throw new Error(notImplemented('sinh').message);
    }

    /**
     * <p>
     * <code>this ⟼ R * this * rev(R)</code>
     * </p>
     *
     * @method rotate
     * @param R {SpinorE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    rotate(R: SpinorE2): Geometric2 {
        mustBeObject('R', R);

        const x = this.x;
        const y = this.y;

        const β = R.b;
        const α = R.a;

        const ix = α * x + β * y;
        const iy = α * y - β * x;

        this.x = ix * α + iy * β;
        this.y = iy * α - ix * β;

        return this;
    }

    /**
     * Sets this multivector to a rotation from vector <code>a</code> to vector <code>b</code>.
     *
     * @method rotorFromDirections
     * @param a {VectorE2} The starting vector
     * @param b {VectorE2} The ending vector
     * @return {Geometric2} <code>this</code> The rotor representing a rotation from a to b.
     * @chainable
     */
    rotorFromDirections(a: VectorE2, b: VectorE2): Geometric2 {
        rotorFromDirections(a, b, this);
        return this;
    }

    rotorFromVectorToVector(a: VectorE2, b: VectorE2): Geometric2 {
        rotorFromDirections(a, b, this);
        return this;
    }

    /**
     * <p>
     * <code>this = ⟼ exp(- B * θ / 2)</code>
     * </p>
     *
     * @method rotorFromGeneratorAngle
     * @param B {SpinorE2}
     * @param θ {number}
     * @return {Geometric2} <code>this</code>
     */
    rotorFromGeneratorAngle(B: SpinorE2, θ: number): Geometric2 {
        mustBeObject('B', B);
        mustBeNumber('θ', θ);
        // We assume that B really is just a bivector
        // by ignoring scalar and vector components.
        // Normally, B will have unit magnitude and B * B => -1.
        // However, we don't assume that is the case.
        // The effect will be a scaling of the angle.
        // A non unitary rotor, on the other hand, will scale the transformation.
        // We must also take into account the orientation of B.
        const β = B.b;
        /**
         * Sandwich operation means we need the half-angle.
         */
        const φ = θ / 2;
        /**
         * scalar part = cos(|B| * θ / 2)
         */
        this.a = cos(abs(β) * φ);
        this.x = 0;
        this.y = 0;
        /**
         * pseudo part = -unit(B) * sin(|B| * θ / 2)
         */
        this.b = -sin(β * φ);
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ scp(this, m)</code>
     * </p>
     *
     * @method scp
     * @param m {GeometricE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    scp(m: GeometricE2): Geometric2 {
        return this.scp2(this, m);
    }

    /**
     * <p>
     * <code>this ⟼ scp(a, b)</code>
     * </p>
     *
     * @method scp2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    scp2(a: GeometricE2, b: GeometricE2) {
        this.a = scpE2(a.a, a.x, a.y, a.b, b.a, b.x, b.y, b.b, 0);
        this.x = 0;
        this.y = 0;
        this.b = 0;
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ this * α</code>
     * </p>
     *
     * @method scale
     * @param α {number} 
     */
    scale(α: number): Geometric2 {
        mustBeNumber('α', α);
        this.a *= α;
        this.x *= α;
        this.y *= α;
        this.b *= α;
        return this;
    }

    /**
     * @method slerp
     * @param target {GeometricE2}
     * @param α {number}
     * @return {Geometric2}
     */
    slerp(target: GeometricE2, α: number): Geometric2 {
        // mustBeObject('target', target)
        // mustBeNumber('α', α)
        throw new Error(notImplemented('slerp').message);
    }

    /**
     * @method stress
     * @param σ {VectorE2}
     * @return {Geometric2}
     */
    stress(σ: VectorE2): Geometric2 {
        throw new Error(notSupported('stress').message);
    }

    /**
     * <p>
     * <code>this ⟼ a * b = a · b + a ^ b</code>
     * </p>
     *
     * Sets this Geometric2 to the geometric product a * b of the vector arguments.
     *
     * @method versor
     * @param a {VectorE2}
     * @param b {VectorE2}
     * @return {Geometric2} <code>this</code>
     */
    versor(a: VectorE2, b: VectorE2): Geometric2 {
        const ax = a.x;
        const ay = a.y;
        const bx = b.x;
        const by = b.y;

        this.a = dotVector(a, b);
        this.x = 0;
        this.y = 0;
        this.b = wedgeXY(ax, ay, 0, bx, by, 0);

        return this;
    }

    /**
     * <p>
     * Computes the <em>squared norm</em> of this <code>Geometric2</code> multivector.
     * </p>
     * <p>
     * This method does not change this multivector.
     * </p>
     *
     * @method squaredNorm
     * @return {number}
     */
    squaredNorm(): number {
        return this.squaredNormSansUnits();
    }

    /**
     * Intentionally undocumented.
     */
    squaredNormSansUnits(): number {
        let w = this.a;
        let x = this.x;
        let y = this.y;
        let B = this.b;
        return w * w + x * x + y * y + B * B;
    }

    /**
     * <p>
     * <code>this ⟼ this - M * α</code>
     * </p>
     *
     * @method sub
     * @param M {GeometricE2}
     * @param [α = 1] {number}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    sub(M: GeometricE2, α = 1): Geometric2 {
        mustBeObject('M', M);
        mustBeNumber('α', α);
        this.a -= M.a * α;
        this.x -= M.x * α;
        this.y -= M.y * α;
        this.b -= M.b * α;
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ a - b</code>
     * </p>
     *
     * @method sub2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    sub2(a: GeometricE2, b: GeometricE2): Geometric2 {
        mustBeObject('a', a);
        mustBeObject('b', b);
        this.a = a.a - b.a;
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.b = a.b - b.b;
        return this;
    }

    /**
     * Returns a string representing the number in exponential notation.
     *
     * @method toExponential
     * @param [fractionDigits] {number}
     * @return {string}
     */
    toExponential(fractionDigits?: number): string {
        const coordToString = function (coord: number): string { return coord.toExponential(fractionDigits); };
        return stringFromCoordinates(coordinates(this), coordToString, Geometric2.BASIS_LABELS);
    }

    /**
     * Returns a string representing the number in fixed-point notation.
     *
     * @method toFixed
     * @param [fractionDigits] {number}
     * @return {string}
     */
    toFixed(fractionDigits?: number): string {
        const coordToString = function (coord: number): string { return coord.toFixed(fractionDigits); };
        return stringFromCoordinates(coordinates(this), coordToString, Geometric2.BASIS_LABELS);
    }

    /**
     * @method toPrecision
     * @param [precision] {number}
     * @return {string}
     */
    toPrecision(precision?: number): string {
        const coordToString = function (coord: number): string { return coord.toPrecision(precision); };
        return stringFromCoordinates(coordinates(this), coordToString, Geometric2.BASIS_LABELS);
    }

    /**
     * Returns a string representation of the number.
     *
     * @method toString
     * @param [radix] {number}
     * @return {string} 
     */
    toString(radix?: number): string {
        const coordToString = function (coord: number): string { return coord.toString(radix); };
        return stringFromCoordinates(coordinates(this), coordToString, Geometric2.BASIS_LABELS);
    }

    /**
     * @method grade
     * @param grade {number}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    grade(grade: number): Geometric2 {
        mustBeInteger('grade', grade);
        switch (grade) {
            case 0: {
                this.x = 0;
                this.y = 0;
                this.b = 0;
                break;
            }
            case 1: {
                this.a = 0;
                this.b = 0;
                break;
            }
            case 2: {
                this.a = 0;
                this.x = 0;
                this.y = 0;
                break;
            }
            default: {
                this.a = 0;
                this.x = 0;
                this.y = 0;
                this.b = 0;
            }
        }
        return this;
    }

    /**
     * Sets this multivector to the identity element for addition, <b>0</b>.
     *
     * @method zero
     * @return {Geometric2}
     * @chainable
     */
    zero(): Geometric2 {
        this.a = 0;
        this.x = 0;
        this.y = 0;
        this.b = 0;
        return this;
    }

    /**
     * @method __add__
     * @param rhs {any}
     * @return {Geometric2}
     * @private
     */
    __add__(rhs: any) {
        if (rhs instanceof Geometric2) {
            return Geometric2.copy(this).add(rhs);
        }
        else if (typeof rhs === 'number') {
            // Addition commutes, but addScalar might be useful.
            return Geometric2.scalar(rhs).add(this);
        }
        else {
            const rhsCopy = duckCopy(rhs);
            if (rhsCopy) {
                // rhs is a copy and addition commutes.
                return rhsCopy.add(this);
            }
            else {
                return void 0;
            }
        }
    }

    /**
     * @method __div__
     * @param rhs {any}
     * @return {Geometric2}
     * @private
     */
    __div__(rhs: any) {
        if (rhs instanceof Geometric2) {
            return Geometric2.copy(this).div(rhs);
        }
        else if (typeof rhs === 'number') {
            return Geometric2.copy(this).divByScalar(rhs);
        }
        else {
            return void 0;
        }
    }

    /**
     * @method __rdiv__
     * @param lhs {any}
     * @return {Geometric2}
     * @private
     */
    __rdiv__(lhs: any) {
        if (lhs instanceof Geometric2) {
            return Geometric2.copy(lhs).div(this);
        }
        else if (typeof lhs === 'number') {
            return Geometric2.scalar(lhs).div(this);
        }
        else {
            return void 0;
        }
    }

    /**
     * @method __mul__
     * @param rhs {any}
     * @return {Geometric2}
     * @private
     */
    __mul__(rhs: any): Geometric2 {
        if (rhs instanceof Geometric2) {
            return Geometric2.copy(this).mul(rhs);
        }
        else if (typeof rhs === 'number') {
            return Geometric2.copy(this).scale(rhs);
        }
        else {
            const rhsCopy = duckCopy(rhs);
            if (rhsCopy) {
                // rhsCopy is a copy but multiplication does not commute.
                // If we had rmul then we could mutate the rhs!
                return this.__mul__(rhsCopy);
            }
            else {
                return void 0;
            }
        }
    }

    /**
     * @method __rmul__
     * @param lhs {any}
     * @return {Geometric2}
     * @private
     */
    __rmul__(lhs: any) {
        if (lhs instanceof Geometric2) {
            return Geometric2.copy(lhs).mul(this);
        }
        else if (typeof lhs === 'number') {
            return Geometric2.copy(this).scale(lhs);
        }
        else {
            const lhsCopy = duckCopy(lhs);
            if (lhsCopy) {
                // lhs is a copy, so we can mutate it, and use it on the left.
                return lhsCopy.mul(this);
            }
            else {
                return void 0;
            }
        }
    }

    /**
     * @method __radd__
     * @param lhs {any}
     * @return {Geometric2}
     * @private
     */
    __radd__(lhs: any) {
        if (lhs instanceof Geometric2) {
            return Geometric2.copy(lhs).add(this);
        }
        else if (typeof lhs === 'number') {
            return Geometric2.scalar(lhs).add(this);
        }
        else {
            const lhsCopy = duckCopy(lhs);
            if (lhsCopy) {
                // lhs is a copy, so we can mutate it.
                return lhsCopy.add(this);
            }
            else {
                return void 0;
            }
        }
    }

    /**
     * @method __sub__
     * @param rhs {any}
     * @return {Geometric2}
     * @private
     */
    __sub__(rhs: any) {
        if (rhs instanceof Geometric2) {
            return Geometric2.copy(this).sub(rhs);
        }
        else if (typeof rhs === 'number') {
            return Geometric2.scalar(-rhs).add(this);
        }
        else {
            return void 0;
        }
    }

    /**
     * @method __rsub__
     * @param lhs {any}
     * @return {Geometric2}
     * @private
     */
    __rsub__(lhs: any) {
        if (lhs instanceof Geometric2) {
            return Geometric2.copy(lhs).sub(this);
        }
        else if (typeof lhs === 'number') {
            return Geometric2.scalar(lhs).sub(this);
        }
        else {
            return void 0;
        }
    }

    /**
     * @method __wedge__
     * @param rhs {any}
     * @return {Geometric2}
     * @private
     */
    __wedge__(rhs: any) {
        if (rhs instanceof Geometric2) {
            return Geometric2.copy(this).ext(rhs);
        }
        else if (typeof rhs === 'number') {
            // The outer product with a scalar is simply scalar multiplication.
            return Geometric2.copy(this).scale(rhs);
        }
        else {
            return void 0;
        }
    }

    /**
     * @method __rwedge__
     * @param lhs {any}
     * @return {Geometric2}
     * @private
     */
    __rwedge__(lhs: any) {
        if (lhs instanceof Geometric2) {
            return Geometric2.copy(lhs).ext(this);
        }
        else if (typeof lhs === 'number') {
            // The outer product with a scalar is simply scalar multiplication, and commutes.
            return Geometric2.copy(this).scale(lhs);
        }
        else {
            return void 0;
        }
    }

    /**
     * @method __lshift__
     * @param other {any}
     * @return {Geometric2}
     * @private
     */
    __lshift__(rhs: any) {
        if (rhs instanceof Geometric2) {
            return Geometric2.copy(this).lco(rhs);
        }
        else if (typeof rhs === 'number') {
            return Geometric2.copy(this).lco(Geometric2.scalar(rhs));
        }
        else {
            return void 0;
        }
    }

    /**
     * @method __rlshift__
     * @param other {any}
     * @return {Geometric2}
     * @private
     */
    __rlshift__(lhs: any) {
        if (lhs instanceof Geometric2) {
            return Geometric2.copy(lhs).lco(this);
        }
        else if (typeof lhs === 'number') {
            return Geometric2.scalar(lhs).lco(this);
        }
        else {
            return void 0;
        }
    }

    /**
     * @method __rshift__
     * @param rhs {any}
     * @return {Geometric2}
     * @private
     */
    __rshift__(rhs: any) {
        if (rhs instanceof Geometric2) {
            return Geometric2.copy(this).rco(rhs);
        }
        else if (typeof rhs === 'number') {
            return Geometric2.copy(this).rco(Geometric2.scalar(rhs));
        }
        else {
            return void 0;
        }
    }

    /**
     * @method __rrshift__
     * @param lhs {any}
     * @return {Geometric2}
     * @private
     */
    __rrshift__(lhs: any) {
        if (lhs instanceof Geometric2) {
            return Geometric2.copy(lhs).rco(this);
        }
        else if (typeof lhs === 'number') {
            return Geometric2.scalar(lhs).rco(this);
        }
        else {
            return void 0;
        }
    }

    /**
     * @method __vbar__
     * @param rhs {any}
     * @return {Geometric2}
     * @private
     */
    __vbar__(rhs: any) {
        if (rhs instanceof Geometric2) {
            return Geometric2.copy(this).scp(rhs);
        }
        else if (typeof rhs === 'number') {
            return Geometric2.copy(this).scp(Geometric2.scalar(rhs));
        }
        else {
            return void 0;
        }
    }

    /**
     * @method __rvbar__
     * @param lhs {any}
     * @return {Geometric2}
     * @private
     */
    __rvbar__(lhs: any) {
        if (lhs instanceof Geometric2) {
            return Geometric2.copy(lhs).scp(this);
        }
        else if (typeof lhs === 'number') {
            return Geometric2.scalar(lhs).scp(this);
        }
        else {
            return void 0;
        }
    }

    /**
     * @method __bang__
     * @return {Geometric2}
     * @private
     * @chainable
     */
    __bang__(): Geometric2 {
        return Geometric2.copy(this).inv();
    }

    /**
     * @method __tilde__
     * @return {Geometric2}
     * @private
     * @chainable
     */
    __tilde__(): Geometric2 {
        return Geometric2.copy(this).rev();
    }

    /**
     * @method __pos__
     * @return {Geometric2}
     * @private
     * @chainable
     */
    __pos__(): Geometric2 {
        // It's important that we make a copy whenever using operators.
        return Geometric2.copy(this);
    }

    /**
     * @method __neg__
     * @return {Geometric2}
     * @private
     * @chainable
     */
    __neg__(): Geometric2 {
        return Geometric2.copy(this).neg();
    }

    /**
     * @method copy
     * @param M {GeometricE2}
     * @return {Geometric2}
     * @static
     * @chainable
     */
    static copy(M: GeometricE2): Geometric2 {
        const copy = new Geometric2();
        copy.a = M.a;
        copy.x = M.x;
        copy.y = M.y;
        copy.b = M.b;
        return copy;
    }

    /**
     * @method e1
     * @return {Geometric2}
     * @static
     * @chainable
     */
    static e1(): Geometric2 {
        return Geometric2.vector(1, 0);
    }

    /**
     * @method e2
     * @return {Geometric2}
     * @static
     * @chainable
     */
    static e2(): Geometric2 {
        return Geometric2.vector(0, 1);
    }

    /**
     * @method fromCartesian
     * @param α {number} The scalar coordinate.
     * @param x {number} The x coordinate.
     * @param y {number} The y coordinate.
     * @param β {number} The pseudoscalar coordinate.
     * @return {Geometric2}
     * @static
     */
    static fromCartesian(α: number, x: number, y: number, β: number): Geometric2 {
        const m = new Geometric2();
        m.a = α;
        m.x = x;
        m.y = y;
        m.b = β;
        return m;
    }

    static fromBivector(B: Pseudo): Geometric2 {
        return Geometric2.fromCartesian(0, 0, 0, B.b);
    }

    /**
     * @method fromSpinor
     * @param spinor {SpinorE2}
     * @return {Geometric2}
     * @static
     * @chainable
     */
    static fromSpinor(spinor: SpinorE2): Geometric2 {
        return new Geometric2().copySpinor(spinor);
    }

    /**
     * @method fromVector
     * @param vector {VectorE2}
     * @return {Geometric2}
     * @static
     * @chainable
     */
    static fromVector(vector: VectorE2): Geometric2 {
        if (isDefined(vector)) {
            return new Geometric2().copyVector(vector);
        }
        else {
            // We could also return an undefined value here!
            return void 0;
        }
    }

    /**
     * @method I
     * @return {Geometric2}
     * @static
     * @chainable
     */
    static I(): Geometric2 {
        return Geometric2.pseudo(1);
    }

    /**
     * @method lerp
     * @param A {GeometricE2}
     * @param B {GeometricE2}
     * @param α {number}
     * @return {Geometric2} <code>A + α * (B - A)</code>
     * @static
     * @chainable
     */
    static lerp(A: GeometricE2, B: GeometricE2, α: number): Geometric2 {
        return Geometric2.copy(A).lerp(B, α);
        // return Geometric2.copy(B).sub(A).scale(α).add(A)
    }

    /**
     * @method one
     * @return {Geometric2}
     * @static
     * @chainable
     */
    static one(): Geometric2 {
        return Geometric2.scalar(1);
    }

    /**
     * Computes the rotor that rotates vector <code>a</code> to vector <code>b</code>.
     *
     * @method rotorFromDirections
     * @param a {VectorE2} The <em>from</em> vector.
     * @param b {VectorE2} The <em>to</em> vector.
     * @return {Geometric2}
     * @static
     * @chainable
     */
    static rotorFromDirections(a: VectorE2, b: VectorE2): Geometric2 {
        return new Geometric2().rotorFromDirections(a, b);
    }

    /**
     * @method pseudo
     * @param β {number}
     * @return {Geometric2}
     * @static
     * @chainable
     */
    static pseudo(β: number): Geometric2 {
        return Geometric2.fromCartesian(0, 0, 0, β);
    }

    /**
     * @method scalar
     * @param α {number}
     * @return {Geometric2}
     * @static
     * @chainable
     */
    static scalar(α: number): Geometric2 {
        return Geometric2.fromCartesian(α, 0, 0, 0);
    }

    /**
     * @method vector
     * @param x {number}
     * @param y {number}
     * @return {Geometric2}
     * @static
     * @chainable
     */
    static vector(x: number, y: number): Geometric2 {
        return Geometric2.fromCartesian(0, x, y, 0);
    }

    /**
     * @method zero
     * @return {Geometric2}
     * @static
     * @chainable
     */
    static zero(): Geometric2 {
        return Geometric2.scalar(0);
    }
}
