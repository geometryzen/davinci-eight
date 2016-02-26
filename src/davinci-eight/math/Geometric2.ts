import b2 from '../geometries/b2';
import b3 from '../geometries/b3';
import Coords from './Coords';
import dotVector from './dotVectorE2';
import G2 from './G2';
import extE2 from './extE2';
import GeometricE2 from './GeometricE2';
import isDefined from '../checks/isDefined';
import isNumber from '../checks/isNumber';
import isObject from '../checks/isObject';
import lcoE2 from './lcoE2';
import GeometricOperators from './GeometricOperators';
import Measure from './Measure';
import mulE2 from './mulE2';
import mustBeInteger from '../checks/mustBeInteger';
import mustBeNumber from '../checks/mustBeNumber';
import mustBeObject from '../checks/mustBeObject';
import MutableGeometricElement from './MutableGeometricElement';
import notSupported from '../i18n/notSupported';
import rcoE2 from './rcoE2';
import rotorFromDirections from './rotorFromDirectionsE2';
import scpE2 from './scpE2';
import SpinorE2 from './SpinorE2';
import stringFromCoordinates from './stringFromCoordinates';
import Unit from './Unit';
import VectorE2 from './VectorE2';
import wedgeXY from './wedgeXY';

/**
 * @module EIGHT
 * @submodule math
 */

// GraphicsProgramSymbols constants for the coordinate indices into the data array.
const COORD_SCALAR = 0
const COORD_X = 1
const COORD_Y = 2
const COORD_PSEUDO = 3

const abs = Math.abs
const atan2 = Math.atan2
const exp = Math.exp
const log = Math.log
const cos = Math.cos
const sin = Math.sin
const sqrt = Math.sqrt

// const LEFTWARDS_ARROW = "←"
// const RIGHTWARDS_ARROW = "→"
// const UPWARDS_ARROW = "↑"
// const DOWNWARDS_ARROW = "↓"
// const BULLSEYE = "◎"
// const CLOCKWISE_OPEN_CIRCLE_ARROW = "↻"
// const ANTICLOCKWISE_OPEN_CIRCLE_ARROW = "↺"

// const ARROW_LABELS = ["1", [LEFTWARDS_ARROW, RIGHTWARDS_ARROW], [DOWNWARDS_ARROW, UPWARDS_ARROW], [CLOCKWISE_OPEN_CIRCLE_ARROW, ANTICLOCKWISE_OPEN_CIRCLE_ARROW]]
const STANDARD_LABELS = ["1", "e1", "e2", "I"]

/**
 * Coordinates corresponding to basis labels.
 */
function coordinates(m: GeometricE2): number[] {
    return [m.α, m.x, m.y, m.β]
}

/**
 * Promotes an unknown value to a Geometric2, or returns undefined.
 */
function duckCopy(value: any): Geometric2 {
    if (isObject(value)) {
        let m = <GeometricE2>value
        if (isNumber(m.x) && isNumber(m.y)) {
            if (isNumber(m.α) && isNumber(m.β)) {
                console.warn("Copying GeometricE2 to Geometric2")
                return Geometric2.copy(m)
            }
            else {
                console.warn("Copying VectorE2 to Geometric2")
                return Geometric2.fromVector(m)
            }
        }
        else {
            if (isNumber(m.α) && isNumber(m.β)) {
                console.warn("Copying SpinorE2 to Geometric2")
                return Geometric2.fromSpinor(m)
            }
            else {
                return void 0
            }
        }
    }
    else {
        return void 0
    }
}

/**
 * @class Geometric2
 * @extends Coords
 * @beta
 */
export default class Geometric2 extends Coords implements GeometricE2, Measure<Geometric2>, MutableGeometricElement<GeometricE2, Geometric2, SpinorE2, VectorE2>, GeometricOperators<Geometric2> {
    /**
     * @property BASIS_LABELS
     * @type {(string | string[])[]}
     */
    static BASIS_LABELS: (string | string[])[] = STANDARD_LABELS

    /**
     * The optional unit of measure.
     * @property uom
     * @type {Unit}
     * @beta
     */
    uom: Unit;

    /**
     * Constructs a <code>Geometric2</code>.
     * The multivector is initialized to zero.
     * @class Geometric2
     * @beta
     * @constructor
     */
    constructor() {
        super([0, 0, 0, 0], false, 4)
    }

    /**
     * The coordinate corresponding to the unit standard basis scalar.
     * @property α
     * @type {number}
     */
    get α(): number {
        return this.coords[COORD_SCALAR]
    }
    set α(α: number) {
        this.modified = this.modified || this.coords[COORD_SCALAR] !== α
        this.coords[COORD_SCALAR] = α
    }

    /**
     * The coordinate corresponding to the unit standard basis scalar.
     * @property alpha
     * @type {number}
     */
    get alpha(): number {
        return this.coords[COORD_SCALAR]
    }
    set alpha(alpha: number) {
        this.modified = this.modified || this.coords[COORD_SCALAR] !== alpha
        this.coords[COORD_SCALAR] = alpha
    }

    /**
     * The coordinate corresponding to the <b>e</b><sub>1</sub> standard basis vector.
     * @property x
     * @type {number}
     */
    get x(): number {
        return this.coords[COORD_X]
    }
    set x(x: number) {
        this.modified = this.modified || this.coords[COORD_X] !== x
        this.coords[COORD_X] = x
    }

    /**
     * The coordinate corresponding to the <b>e</b><sub>2</sub> standard basis vector.
     * @property y
     * @type {number}
     */
    get y(): number {
        return this.coords[COORD_Y]
    }
    set y(y: number) {
        this.modified = this.modified || this.coords[COORD_Y] !== y
        this.coords[COORD_Y] = y
    }

    /**
     * The coordinate corresponding to the <b>e</b><sub>1</sub><b>e</b><sub>2</sub> standard basis bivector.
     * @property β
     * @type {number}
     */
    get β(): number {
        return this.coords[COORD_PSEUDO]
    }
    set β(β: number) {
        this.modified = this.modified || this.coords[COORD_PSEUDO] !== β
        this.coords[COORD_PSEUDO] = β
    }

    /**
     * The coordinate corresponding to the <b>e</b><sub>1</sub><b>e</b><sub>2</sub> standard basis bivector.
     * @property beta
     * @type {number}
     */
    get beta(): number {
        return this.coords[COORD_PSEUDO]
    }
    set beta(beta: number) {
        this.modified = this.modified || this.coords[COORD_PSEUDO] !== beta
        this.coords[COORD_PSEUDO] = beta
    }

    get xy(): number {
        return this.coords[COORD_PSEUDO]
    }
    set xy(xy: number) {
        this.modified = this.modified || this.coords[COORD_PSEUDO] !== xy
        this.coords[COORD_PSEUDO] = xy
    }

    /**
     * <p>
     * <code>this ⟼ this + M * α</code>
     * </p>
     * @method add
     * @param M {GeometricE2}
     * @param [α = 1] {number}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    add(M: GeometricE2, α = 1): Geometric2 {
        mustBeObject('M', M)
        mustBeNumber('α', α)
        this.α += M.α * α
        this.x += M.x * α
        this.y += M.y * α
        this.β += M.β * α
        return this
    }

    /**
     * <p>
     * <code>this ⟼ a + b</code>
     * </p>
     * @method add2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    add2(a: GeometricE2, b: GeometricE2): Geometric2 {
        mustBeObject('a', a)
        mustBeObject('b', b)
        this.α = a.α + b.α
        this.x = a.x + b.x
        this.y = a.y + b.y
        this.β = a.β + b.β
        return this
    }

    /**
     * <p>
     * <code>this ⟼ this + Iβ</code>
     * </p>
     * @method addPseudo
     * @param β {number}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    addPseudo(β: number): Geometric2 {
        mustBeNumber('β', β)
        this.β += β
        return this
    }

    /**
     * <p>
     * <code>this ⟼ this + α</code>
     * </p>
     * @method addScalar
     * @param α {number}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    addScalar(α: number): Geometric2 {
        mustBeNumber('α', α)
        this.α += α
        return this
    }

    /**
     * <p>
     * <code>this ⟼ this + v * α</code>
     * </p>
     * @method addVector
     * @param v {VectorE2}
     * @param [α = 1] {number}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    addVector(v: VectorE2, α = 1): Geometric2 {
        mustBeObject('v', v)
        mustBeNumber('α', α)
        this.x += v.x * α
        this.y += v.y * α
        return this
    }

    adj(): Geometric2 {
        throw new Error('TODO: Geometric2.adj')
    }

    /**
     * <p>
     * <code>this ⟼ log(this).grade(2)</code>
     * </p>
     * @method angle
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    angle(): Geometric2 {
        return this.log().grade(2);
    }

    /**
     * @method clone
     * @return {Geometric2} <code>copy(this)</code>
     * @chainable
     */
    clone(): Geometric2 {
        let m = new Geometric2()
        m.copy(this)
        return m
    }

    /**
     * <p>
     * <code>this ⟼ conjugate(this)</code>
     * </p>
     * @method conj
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    conj(): Geometric2 {
        // FIXME: This is only the bivector part.
        // Also need to think about various involutions.
        this.β = -this.β;
        return this
    }

    cos(): Geometric2 {
        throw new Error("TODO: Geometric2.cos")
    }

    cosh(): Geometric2 {
        throw new Error("TODO: Geometric2.cosh")
    }

    distanceTo(point: GeometricE2): number {
        throw new Error("TODO: Geometric2.distanceTo")
    }

    equals(point: GeometricE2): boolean {
        throw new Error("TODO: Geometric2.equals")
    }

    /**
     * <p>
     * <code>this ⟼ copy(M)</code>
     * </p>
     * @method copy
     * @param M {GeometricE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    copy(M: GeometricE2): Geometric2 {
        mustBeObject('M', M)
        this.α = M.α
        this.x = M.x
        this.y = M.y
        this.β = M.β
        return this
    }

    /**
     * Sets this multivector to the value of the scalar, <code>α</code>.
     * @method copyScalar
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    copyScalar(α: number): Geometric2 {
        return this.zero().addScalar(α)
    }

    /**
     * <p>
     * <code>this ⟼ copy(spinor)</code>
     * </p>
     * @method copySpinor
     * @param spinor {SpinorE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    copySpinor(spinor: SpinorE2) {
        mustBeObject('spinor', spinor)
        this.α = spinor.α
        this.x = 0
        this.y = 0
        this.β = spinor.β
        return this
    }

    /**
     * <p>
     * <code>this ⟼ copyVector(vector)</code>
     * </p>
     * @method copyVector
     * @param vector {VectorE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    copyVector(vector: VectorE2) {
        mustBeObject('vector', vector)
        this.α = 0
        this.x = vector.x
        this.y = vector.y
        this.β = 0
        return this
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
        let α = b3(t, this.α, controlBegin.α, controlEnd.α, endPoint.α);
        let x = b3(t, this.x, controlBegin.x, controlEnd.x, endPoint.x);
        let y = b3(t, this.y, controlBegin.y, controlEnd.y, endPoint.y);
        let β = b3(t, this.β, controlBegin.β, controlEnd.β, endPoint.β);
        this.α = α;
        this.x = x;
        this.y = y;
        this.β = β;
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ this / magnitude(this)</code>
     * </p>
     * @method direction
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    direction(): Geometric2 {
        const norm = sqrt(this.squaredNormSansUnits())
        this.α = this.α / norm
        this.x = this.x / norm
        this.y = this.y / norm
        this.β = this.β / norm
        return this
    }

    /**
     * <p>
     * <code>this ⟼ this / m</code>
     * </p>
     * @method div
     * @param m {GeometricE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    div(m: GeometricE2): Geometric2 {
        return this.div2(this, m)
    }

    /**
     * <p>
     * <code>this ⟼ a / b</code>
     * </p>
     * @method div2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    div2(a: SpinorE2, b: SpinorE2): Geometric2 {
        // FIXME: Generalize
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ this / α</code>
     * </p>
     * @method divByScalar
     * @param α {number}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    divByScalar(α: number): Geometric2 {
        mustBeNumber('α', α)
        this.α /= α
        this.x /= α
        this.y /= α
        this.β /= α
        return this
    }

    /**
     * <p>
     * <code>this ⟼ dual(m) = I * m</code>
     * </p>
     * @method dual
     * @param m {GeometricE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    dual(m: GeometricE2) {
        let w = -m.β
        let x = +m.y
        let y = -m.x
        let β = +m.α

        this.α = w
        this.x = x
        this.y = y
        this.β = β
        return this
    }

    /**
     * <p>
     * <code>this ⟼ e<sup>this</sup></code>
     * </p>
     * @method exp
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    exp() {
        let w = this.α
        let z = this.β
        let expW = exp(w)
        // φ is actually the absolute value of one half the rotation angle.
        // The orientation of the rotation gets carried in the bivector components.
        let φ = sqrt(z * z)
        let s = expW * (φ !== 0 ? sin(φ) / φ : 1)
        this.α = expW * cos(φ)
        this.β = z * s
        return this
    }

    /**
     * <p>
     * <code>this ⟼ this ^ m</code>
     * </p>
     * @method ext
     * @param m {GeometricE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    ext(m: GeometricE2): Geometric2 {
        return this.ext2(this, m)
    }

    /**
     * <p>
     * <code>this ⟼ a ^ b</code>
     * </p>
     * @method ext2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    ext2(a: GeometricE2, b: GeometricE2): Geometric2 {
        let a0 = a.α
        let a1 = a.x
        let a2 = a.y
        let a3 = a.β
        let b0 = b.α
        let b1 = b.x
        let b2 = b.y
        let b3 = b.β
        this.α = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 0)
        this.x = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 1)
        this.y = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 2)
        this.β = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 3)
        return this
    }

    /**
     * <p>
     * <code>this ⟼ conj(this) / quad(this)</code>
     * </p>
     * @method inv
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    inv(): Geometric2 {
        // FIXME: TODO
        this.conj()
        // this.divByScalar(this.squaredNorm());
        return this
    }

    /**
     * @method isOne
     * @return {boolean}
     */
    isOne(): boolean {
        return this.α === 1 && this.x === 0 && this.y === 0 && this.β === 0
    }

    /**
     * @method isZero
     * @return {boolean}
     */
    isZero(): boolean {
        return this.α === 0 && this.x === 0 && this.y === 0 && this.β === 0
    }

    /**
     * <p>
     * <code>this ⟼ this << m</code>
     * </p>
     * @method lco
     * @param m {GeometricE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    lco(m: GeometricE2): Geometric2 {
        return this.lco2(this, m)
    }

    /**
     * <p>
     * <code>this ⟼ a << b</code>
     * </p>
     * @method lco2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    lco2(a: GeometricE2, b: GeometricE2): Geometric2 {
        let a0 = a.α
        let a1 = a.x
        let a2 = a.y
        let a3 = a.β
        let b0 = b.α
        let b1 = b.x
        let b2 = b.y
        let b3 = b.β
        this.α = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 0)
        this.x = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 1)
        this.y = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 2)
        this.β = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 3)
        return this
    }

    /**
     * <p>
     * <code>this ⟼ this + α * (target - this)</code>
     * </p>
     * @method lerp
     * @param target {GeometricE2}
     * @param α {number}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    lerp(target: GeometricE2, α: number): Geometric2 {
        mustBeObject('target', target)
        mustBeNumber('α', α)
        this.α += (target.α - this.α) * α;
        this.x += (target.x - this.x) * α;
        this.y += (target.y - this.y) * α;
        this.β += (target.β - this.β) * α;
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ a + α * (b - a)</code>
     * </p>
     * @method lerp2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @param α {number}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    lerp2(a: GeometricE2, b: GeometricE2, α: number): Geometric2 {
        mustBeObject('a', a)
        mustBeObject('b', b)
        mustBeNumber('α', α)
        this.copy(a).lerp(b, α)
        return this
    }

    /**
     * <p>
     * <code>this ⟼ log(sqrt(w * w + β * β)) + <b>e</b><sub>1</sub><b>e</b><sub>2</sub> * atan2(β, w)</code>
     * </p>
     * @method log
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    log() {
        // FIXME: This only handles the spinor components.
        let α = this.α
        let β = this.β
        this.α = log(sqrt(α * α + β * β))
        this.x = 0
        this.y = 0
        this.β = atan2(β, α)
        return this;
    }

    /**
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     * @method magnitude
     * @return {Geometric2}
     */
    magnitude(): Geometric2 {
        return this.norm();
    }

    magnitudeSansUnits(): number {
        return sqrt(this.squaredNormSansUnits());
    }

    /**
     * <p>
     * <code>this ⟼ this * s</code>
     * </p>
     * @method mul
     * @param m {GeometricE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    mul(m: GeometricE2): Geometric2 {
        return this.mul2(this, m)
    }

    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     * @method mul2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    mul2(a: GeometricE2, b: GeometricE2) {
        let a0 = a.α
        let a1 = a.x
        let a2 = a.y
        let a3 = a.β
        let b0 = b.α
        let b1 = b.x
        let b2 = b.y
        let b3 = b.β
        this.α = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 0)
        this.x = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 1)
        this.y = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 2)
        this.β = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 3)
        return this
    }

    /**
     * <p>
     * <code>this ⟼ -1 * this</code>
     * </p>
     * @method neg
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    neg() {
        this.α = -this.α
        this.x = -this.x
        this.y = -this.y
        this.β = -this.β
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ sqrt(this * conj(this))</code>
     * </p>
     * @method norm
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    norm(): Geometric2 {
        this.α = this.magnitudeSansUnits()
        this.x = 0
        this.y = 0
        this.β = 0
        return this
    }

    /**
     * Sets this multivector to the identity element for multiplication, <b>1</b>.
     * @method one
     * @return {Geometric2}
     * @chainable
     */
    one() {
        this.α = 1
        this.x = 0
        this.y = 0
        this.β = 0
        return this
    }

    pow(): Geometric2 {
        throw new Error("TODO: Geometric2.pow")
    }

    /**
     * <p>
     * Updates <code>this</code> target to be the <em>quad</em> or <em>squared norm</em> of the target.
     * </p>
     * <p>
     * <code>this ⟼ scp(this, rev(this)) = this | ~this</code>
     * </p>
     * @method quad
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    quad(): Geometric2 {
        this.α = this.squaredNormSansUnits()
        this.x = 0
        this.y = 0
        this.β = 0
        return this
    }

    /**
     * @method quadraticBezier
     * @param t {number}
     * @param controlPoint {GeometricE2}
     * @param endPoint {GeometricE2}
     * @return {Geometric2}
     */
    quadraticBezier(t: number, controlPoint: GeometricE2, endPoint: GeometricE2) {
        let α = b2(t, this.α, controlPoint.α, endPoint.α);
        let x = b2(t, this.x, controlPoint.x, endPoint.x);
        let y = b2(t, this.y, controlPoint.y, endPoint.y);
        let β = b2(t, this.β, controlPoint.β, endPoint.β);
        this.α = α;
        this.x = x;
        this.y = y;
        this.β = β;
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ this >> m</code>
     * </p>
     * @method rco
     * @param m {GeometricE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    rco(m: GeometricE2): Geometric2 {
        return this.rco2(this, m)
    }

    /**
     * <p>
     * <code>this ⟼ a >> b</code>
     * </p>
     * @method rco2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    rco2(a: GeometricE2, b: GeometricE2): Geometric2 {
        let a0 = a.α
        let a1 = a.x
        let a2 = a.y
        let a3 = a.β
        let b0 = b.α
        let b1 = b.x
        let b2 = b.y
        let b3 = b.β
        this.α = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 0)
        this.x = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 1)
        this.y = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 2)
        this.β = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 3)
        return this
    }

    /**
     * <p>
     * <code>this ⟼ - n * this * n</code>
     * </p>
     * @method reflect
     * @param n {VectorE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    reflect(n: VectorE2): Geometric2 {
        // TODO: Optimize.
        mustBeObject('n', n);
        let N = G2.fromVectorE2(n);
        let M = G2.copy(this);
        let R = N.mul(M).mul(N).scale(-1);
        this.copy(R);
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ rev(this)</code>
     * </p>
     * @method reverse
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    rev(): Geometric2 {
        // reverse has a ++-- structure.
        this.α = this.α
        this.x = this.x
        this.y = this.y
        this.β = -this.β
        return this
    }

    sin(): Geometric2 {
        throw new Error("Geometric2.sin")
    }

    sinh(): Geometric2 {
        throw new Error("Geometric2.sinh")
    }

    /**
     * <p>
     * <code>this ⟼ R * this * rev(R)</code>
     * </p>
     * @method rotate
     * @param R {SpinorE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    rotate(R: SpinorE2): Geometric2 {
        mustBeObject('R', R);

        const x = this.x;
        const y = this.y;

        const β = R.β;
        const α = R.α;

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
        rotorFromDirections(a, b, this)
        return this
    }

    /**
     * <p>
     * <code>this = ⟼ exp(- B * θ / 2)</code>
     * </p>
     * @method rotorFromGeneratorAngle
     * @param B {SpinorE2}
     * @param θ {number}
     * @return {Geometric2} <code>this</code>
     */
    rotorFromGeneratorAngle(B: SpinorE2, θ: number): Geometric2 {
        mustBeObject('B', B)
        mustBeNumber('θ', θ)
        // We assume that B really is just a bivector
        // by ignoring scalar and vector components.
        // Normally, B will have unit magnitude and B * B => -1.
        // However, we don't assume that is the case.
        // The effect will be a scaling of the angle.
        // A non unitary rotor, on the other hand, will scale the transformation.
        // We must also take into account the orientation of B.
        const β = B.β
        /**
         * Sandwich operation means we need the half-angle.
         */
        const φ = θ / 2
        /**
         * scalar part = cos(|B| * θ / 2)
         */
        this.α = cos(abs(β) * φ)
        this.x = 0
        this.y = 0
        /**
         * pseudo part = -unit(B) * sin(|B| * θ / 2)
         */
        this.β = -sin(β * φ)
        return this
    }

    /**
     * <p>
     * <code>this ⟼ scp(this, m)</code>
     * </p>
     * @method scp
     * @param m {GeometricE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    scp(m: GeometricE2): Geometric2 {
        return this.scp2(this, m)
    }

    /**
     * <p>
     * <code>this ⟼ scp(a, b)</code>
     * </p>
     * @method scp2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    scp2(a: GeometricE2, b: GeometricE2) {
        this.α = scpE2(a.α, a.x, a.y, a.β, b.α, b.x, b.y, b.β, 0)
        this.x = 0
        this.y = 0
        this.β = 0
        return this
    }

    /**
     * <p>
     * <code>this ⟼ this * α</code>
     * </p>
     * @method scale
     * @param α {number} 
     */
    scale(α: number): Geometric2 {
        mustBeNumber('α', α)
        this.α *= α
        this.x *= α
        this.y *= α
        this.β *= α
        return this
    }

    slerp(target: GeometricE2, α: number): Geometric2 {
        mustBeObject('target', target)
        mustBeNumber('α', α)
        return this;
    }

    stress(σ: VectorE2): Geometric2 {
        throw new Error(notSupported('stress').message)
    }

    /**
     * <p>
     * <code>this ⟼ a * b = a · b + a ^ b</code>
     * </p>
     * Sets this Geometric2 to the geometric product a * b of the vector arguments.
     *
     * @method versor
     * @param a {VectorE2}
     * @param b {VectorE2}
     * @return {Geometric2} <code>this</code>
     */
    versor(a: VectorE2, b: VectorE2) {
        const ax = a.x
        const ay = a.y
        const bx = b.x
        const by = b.y

        this.α = dotVector(a, b)
        this.x = 0
        this.y = 0
        this.β = wedgeXY(ax, ay, 0, bx, by, 0)

        return this
    }

    /**
     * Computes the <em>squared norm</em> of this <code>Geometric2</code> multivector. 
     * @method squaredNorm
     * @return {number} <code>this | ~this</code>
     */
    squaredNorm(): Geometric2 {
        this.α = this.squaredNormSansUnits()
        this.x = 0
        this.y = 0
        this.β = 0
        return this
    }

    squaredNormSansUnits(): number {
        let w = this.α
        let x = this.x
        let y = this.y
        let B = this.β
        return w * w + x * x + y * y + B * B
    }

    /**
     * <p>
     * <code>this ⟼ this - M * α</code>
     * </p>
     * @method sub
     * @param M {GeometricE2}
     * @param [α = 1] {number}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    sub(M: GeometricE2, α = 1): Geometric2 {
        mustBeObject('M', M)
        mustBeNumber('α', α)
        this.α -= M.α * α
        this.x -= M.x * α
        this.y -= M.y * α
        this.β -= M.β * α
        return this
    }

    /**
     * <p>
     * <code>this ⟼ a - b</code>
     * </p>
     * @method sub2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    sub2(a: GeometricE2, b: GeometricE2): Geometric2 {
        mustBeObject('a', a)
        mustBeObject('b', b)
        this.α = a.α - b.α
        this.x = a.x - b.x
        this.y = a.y - b.y
        this.β = a.β - b.β
        return this
    }

    /**
     * Returns a string representing the number in exponential notation.
     * @method toExponential
     * @return {string}
     */
    toExponential(): string {
        var coordToString = function(coord: number): string { return coord.toExponential() };
        return stringFromCoordinates(coordinates(this), coordToString, Geometric2.BASIS_LABELS)
    }

    /**
     * Returns a string representing the number in fixed-point notation.
     * @method toFixed
     * @param [fractionDigits] {number}
     * @return {string}
     */
    toFixed(fractionDigits?: number): string {
        const coordToString = function(coord: number): string { return coord.toFixed(fractionDigits) };
        return stringFromCoordinates(coordinates(this), coordToString, Geometric2.BASIS_LABELS)
    }

    /**
     * Returns a string representation of the number.
     * @method toString
     * @return {string} 
     */
    toString(): string {
        const coordToString = function(coord: number): string { return coord.toString() };
        return stringFromCoordinates(coordinates(this), coordToString, Geometric2.BASIS_LABELS)
    }

    /**
     * @method grade
     * @param grade {number}
     * @return {Geometric2} <code>this</code>
     * @chainable
     */
    grade(grade: number): Geometric2 {
        mustBeInteger('grade', grade)
        switch (grade) {
            case 0: {
                this.x = 0;
                this.y = 0;
                this.β = 0;
            }
                break;
            case 1: {
                this.α = 0;
                this.β = 0;
            }
                break;
            case 2: {
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
    }

    /**
     * Sets this multivector to the identity element for addition, <b>0</b>.
     * @method zero
     * @return {Geometric2}
     * @chainable
     */
    zero(): Geometric2 {
        this.α = 0
        this.x = 0
        this.y = 0
        this.β = 0
        return this
    }

    /**
     * @method __add__
     * @param rhs {any}
     * @return {Geometric2}
     * @private
     */
    __add__(rhs: any) {
        if (rhs instanceof Geometric2) {
            return Geometric2.copy(this).add(rhs)
        }
        else if (typeof rhs === 'number') {
            // Addition commutes, but addScalar might be useful.
            return Geometric2.fromScalar(rhs).add(this)
        }
        else {
            let rhsCopy = duckCopy(rhs)
            if (rhsCopy) {
                // rhs is a copy and addition commutes.
                return rhsCopy.add(this)
            }
            else {
                return void 0
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
            return Geometric2.copy(this).div(rhs)
        }
        else if (typeof rhs === 'number') {
            return Geometric2.copy(this).divByScalar(rhs)
        }
        else {
            return void 0
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
            return Geometric2.copy(lhs).div(this)
        }
        else if (typeof lhs === 'number') {
            return Geometric2.fromScalar(lhs).div(this)
        }
        else {
            return void 0
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
            return Geometric2.copy(this).mul(rhs)
        }
        else if (typeof rhs === 'number') {
            return Geometric2.copy(this).scale(rhs)
        }
        else {
            let rhsCopy = duckCopy(rhs)
            if (rhsCopy) {
                // rhsCopy is a copy but multiplication does not commute.
                // If we had rmul then we could mutate the rhs!
                return this.__mul__(rhsCopy);
            }
            else {
                return void 0
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
            return Geometric2.copy(lhs).mul(this)
        }
        else if (typeof lhs === 'number') {
            return Geometric2.copy(this).scale(lhs)
        }
        else {
            let lhsCopy = duckCopy(lhs)
            if (lhsCopy) {
                // lhs is a copy, so we can mutate it, and use it on the left.
                return lhsCopy.mul(this)
            }
            else {
                return void 0
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
            return Geometric2.copy(lhs).add(this)
        }
        else if (typeof lhs === 'number') {
            return Geometric2.fromScalar(lhs).add(this)
        }
        else {
            let lhsCopy = duckCopy(lhs)
            if (lhsCopy) {
                // lhs is a copy, so we can mutate it.
                return lhsCopy.add(this)
            }
            else {
                return void 0
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
            return Geometric2.copy(this).sub(rhs)
        }
        else if (typeof rhs === 'number') {
            return Geometric2.fromScalar(-rhs).add(this)
        }
        else {
            return void 0
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
            return Geometric2.copy(lhs).sub(this)
        }
        else if (typeof lhs === 'number') {
            return Geometric2.fromScalar(lhs).sub(this)
        }
        else {
            return void 0
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
            return Geometric2.copy(this).ext(rhs)
        }
        else if (typeof rhs === 'number') {
            // The outer product with a scalar is simply scalar multiplication.
            return Geometric2.copy(this).scale(rhs)
        }
        else {
            return void 0
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
            return Geometric2.copy(lhs).ext(this)
        }
        else if (typeof lhs === 'number') {
            // The outer product with a scalar is simply scalar multiplication, and commutes.
            return Geometric2.copy(this).scale(lhs)
        }
        else {
            return void 0
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
            return Geometric2.copy(this).lco(rhs)
        }
        else if (typeof rhs === 'number') {
            return Geometric2.copy(this).lco(Geometric2.fromScalar(rhs))
        }
        else {
            return void 0
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
            return Geometric2.copy(lhs).lco(this)
        }
        else if (typeof lhs === 'number') {
            return Geometric2.fromScalar(lhs).lco(this)
        }
        else {
            return void 0
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
            return Geometric2.copy(this).rco(rhs)
        }
        else if (typeof rhs === 'number') {
            return Geometric2.copy(this).rco(Geometric2.fromScalar(rhs))
        }
        else {
            return void 0
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
            return Geometric2.copy(lhs).rco(this)
        }
        else if (typeof lhs === 'number') {
            return Geometric2.fromScalar(lhs).rco(this)
        }
        else {
            return void 0
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
            return Geometric2.copy(this).scp(rhs)
        }
        else if (typeof rhs === 'number') {
            return Geometric2.copy(this).scp(Geometric2.fromScalar(rhs))
        }
        else {
            return void 0
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
            return Geometric2.copy(lhs).scp(this)
        }
        else if (typeof lhs === 'number') {
            return Geometric2.fromScalar(lhs).scp(this)
        }
        else {
            return void 0
        }
    }

    /**
     * @method __bang__
     * @return {Geometric2}
     * @private
     * @chainable
     */
    __bang__(): Geometric2 {
        return Geometric2.copy(this).inv()
    }

    /**
     * @method __tilde__
     * @return {Geometric2}
     * @private
     * @chainable
     */
    __tilde__(): Geometric2 {
        return Geometric2.copy(this).rev()
    }

    /**
     * @method __pos__
     * @return {Geometric2}
     * @private
     * @chainable
     */
    __pos__(): Geometric2 {
        // It's important that we make a copy whenever using operators.
        return Geometric2.copy(this)/*.pos()*/
    }

    /**
     * @method __neg__
     * @return {Geometric2}
     * @private
     * @chainable
     */
    __neg__(): Geometric2 {
        return Geometric2.copy(this).neg()
    }

    /**
     * Intentionally undocumented.
     */
    static fromCartesian(α: number, x: number, y: number, β: number, uom?: Unit): Geometric2 {
        const m = new Geometric2()
        m.α = α
        m.x = x
        m.y = y
        m.β = β
        m.uom = uom
        return m
    }

    /**
     * @method copy
     * @param M {GeometricE2}
     * @return {Geometric2}
     * @static
     * @chainable
     */
    static copy(M: GeometricE2): Geometric2 {
        const copy = new Geometric2()
        copy.α = M.α
        copy.x = M.x
        copy.y = M.y
        copy.β = M.β
        return copy
    }

    /**
     * @method fromScalar
     * @param α {number}
     * @return {Geometric2}
     * @static
     * @chainable
     */
    static fromScalar(α: number): Geometric2 {
        return new Geometric2().addScalar(α)
    }

    /**
     * @method fromSpinor
     * @param spinor {SpinorE2}
     * @return {Geometric2}
     * @static
     * @chainable
     */
    static fromSpinor(spinor: SpinorE2): Geometric2 {
        return new Geometric2().copySpinor(spinor)
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
            return new Geometric2().copyVector(vector)
        }
        else {
            // We could also return an undefined value here!
            return void 0
        }
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
        return Geometric2.copy(A).lerp(B, α)
        // return Geometric2.copy(B).sub(A).scale(α).add(A)
    }

    /**
     * Computes the rotor that rotates vector <code>a</code> to vector <code>b</code>.
     * @method rotorFromDirections
     * @param a {VectorE2} The <em>from</em> vector.
     * @param b {VectorE2} The <em>to</em> vector.
     * @return {Geometric2}
     * @static
     * @chainable
     */
    static rotorFromDirections(a: VectorE2, b: VectorE2): Geometric2 {
        return new Geometric2().rotorFromDirections(a, b)
    }

    /**
     * @method vector
     * @param x {number}
     * @param y {number}
     * @return {Geometric2}
     * @static
     */
    static vector(x: number, y: number): Geometric2 {
        return this.fromCartesian(0, x, y, 0)
    }
}
