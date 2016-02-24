import dotVector from './dotVectorE3';
import G3 from './G3';
import EventEmitter from '../utils/EventEmitter';
import extG3 from './extG3';
import GeometricE3 from './GeometricE3';
import GeometricOperators from './GeometricOperators';
import isScalarG3 from './isScalarG3';
import lcoG3 from './lcoG3';
import mulG3 from './mulG3';
import MutableGeometricElement3D from './MutableGeometricElement3D';
import rcoG3 from './rcoG3';
import rotorFromDirections from './rotorFromDirectionsE3';
import scpG3 from './scpG3';
import Scalar from './Scalar';
import SpinorE3 from './SpinorE3';
import squaredNormG3 from './squaredNormG3';
import stringFromCoordinates from './stringFromCoordinates';
import VectorE3 from './VectorE3';
import VectorN from './VectorN';
import wedgeXY from './wedgeXY';
import wedgeYZ from './wedgeYZ';
import wedgeZX from './wedgeZX';

/**
 * Geometric Algebra and Mathematical abstractions.
 *
 * @module EIGHT
 * @submodule math
 */

// Symbolic constants for the coordinate indices into the data array.
const COORD_SCALAR = 0
const COORD_X = 1
const COORD_Y = 2
const COORD_Z = 3
const COORD_XY = 4
const COORD_YZ = 5
const COORD_ZX = 6
const COORD_PSEUDO = 7

const BASIS_LABELS = ["1", "e1", "e2", "e3", "e12", "e23", "e31", "e123"]

/**
 * Coordinates corresponding to basis labels.
 */
function coordinates(m: GeometricE3): number[] {
    return [m.α, m.x, m.y, m.z, m.xy, m.yz, m.zx, m.β]
}

const EVENT_NAME_CHANGE = 'change';

const atan2 = Math.atan2
const exp = Math.exp
const cos = Math.cos
const log = Math.log
const sin = Math.sin
const sqrt = Math.sqrt

/**
 * @class Geometric3
 * @extends GeometricE3
 * @beta
 */
export default class Geometric3 extends VectorN<number> implements GeometricE3, MutableGeometricElement3D<GeometricE3, Geometric3, SpinorE3, VectorE3>, GeometricOperators<Geometric3> {

    /**
     * @property eventBus
     * @type EventEmitter
     * @private
     */
    private eventBus: EventEmitter<Geometric3>;

    /**
     * Constructs a <code>Geometric3</code>.
     * The multivector is initialized to zero.
     * @class Geometric3
     * @beta
     * @constructor
     */
    constructor() {
        super([0, 0, 0, 0, 0, 0, 0, 0], false, 8);
        this.eventBus = new EventEmitter<Geometric3>(this);
    }

    on(eventName: string, callback: (eventName: string, key: string, value: number, source: Geometric3) => void) {
        this.eventBus.addEventListener(eventName, callback);
    }

    off(eventName: string, callback: (eventName: string, key: string, value: number, source: Geometric3) => void) {
        this.eventBus.removeEventListener(eventName, callback);
    }

    /**
     * Consistently set a coordinate value in the most optimized way.
     */
    private setCoordinate(index: number, newValue: number, name: string) {
        const coords = this.coords;
        const previous = coords[index];
        if (newValue !== previous) {
            coords[index] = newValue;
            this.modified = true;
            this.eventBus.emit(EVENT_NAME_CHANGE, name, newValue);
        }
    }

    /**
     * The scalar part of this multivector.
     * @property α
     * @type {number}
     */
    get α(): number {
        return this.coords[COORD_SCALAR];
    }
    set α(α: number) {
        this.setCoordinate(COORD_SCALAR, α, 'α');
    }

    /**
     * The scalar part of this multivector.
     * @property alpha
     * @type {number}
     */
    get alpha(): number {
        return this.coords[COORD_SCALAR];
    }
    set alpha(alpha: number) {
        this.setCoordinate(COORD_SCALAR, alpha, 'alpha');
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
        this.setCoordinate(COORD_X, x, 'x');
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
        this.setCoordinate(COORD_Y, y, 'y');
    }

    /**
     * The coordinate corresponding to the <b>e</b><sub>3</sub> standard basis vector.
     * @property z
     * @type {number}
     */
    get z(): number {
        return this.coords[COORD_Z]
    }
    set z(z: number) {
        this.setCoordinate(COORD_Z, z, 'z');
    }

    /**
     * The coordinate corresponding to the <b>e</b><sub>2</sub><b>e</b><sub>3</sub> standard basis bivector.
     * @property yz
     * @type {number}
     */
    get yz(): number {
        return this.coords[COORD_YZ]
    }
    set yz(yz: number) {
        this.setCoordinate(COORD_YZ, yz, 'yz');
    }

    /**
     * The coordinate corresponding to the <b>e</b><sub>3</sub><b>e</b><sub>1</sub> standard basis bivector.
     * @property zx
     * @type {number}
     */
    get zx(): number {
        return this.coords[COORD_ZX]
    }
    set zx(zx: number) {
        this.setCoordinate(COORD_ZX, zx, 'zx');
    }

    /**
     * The coordinate corresponding to the <b>e</b><sub>1</sub><b>e</b><sub>2</sub> standard basis bivector.
     * @property xy
     * @type {number}
     */
    get xy(): number {
        return this.coords[COORD_XY]
    }
    set xy(xy: number) {
        this.setCoordinate(COORD_XY, xy, 'xy');
    }

    /**
     * The pseudoscalar part of this multivector.
     * @property β
     * @type {number}
     */
    get β(): number {
        return this.coords[COORD_PSEUDO]
    }
    set β(β: number) {
        this.setCoordinate(COORD_PSEUDO, β, 'β');
    }

    /**
     * The pseudoscalar part of this multivector.
     * @property beta
     * @type {number}
     */
    get beta(): number {
        return this.coords[COORD_PSEUDO]
    }
    set beta(beta: number) {
        this.setCoordinate(COORD_PSEUDO, beta, 'beta');
    }

    /**
     * <p>
     * <code>this ⟼ this + M * α</code>
     * </p>
     * @method add
     * @param M {GeometricE3}
     * @param [α = 1] {number}
     * @return {Geometric3} <code>this</code>
     * @chainable
     */
    add(M: GeometricE3, α = 1): Geometric3 {
        this.α += M.α * α
        this.x += M.x * α
        this.y += M.y * α
        this.z += M.z * α
        this.yz += M.yz * α
        this.zx += M.zx * α
        this.xy += M.xy * α
        this.β += M.β * α
        return this
    }

    /**
     * <p>
     * <code>this ⟼ this + Iβ</code>
     * </p>
     * @method addPseudo
     * @param β {number}
     * @return {Geometric3} <code>this</code>
     * @chainable
     */
    addPseudo(β: number): Geometric3 {
        this.β += β
        return this
    }

    /**
     * <p>
     * <code>this ⟼ this + α</code>
     * </p>
     * @method addScalar
     * @param α {number}
     * @return {Geometric3} <code>this</code>
     * @chainable
     */
    addScalar(α: number): Geometric3 {
        this.α += α
        return this
    }

    /**
     * <p>
     * <code>this ⟼ this + v * α</code>
     * </p>
     * @method addVector
     * @param v {VectorE3}
     * @param [α = 1] {number}
     * @return {Geometric3} <code>this</code>
     * @chainable
     */
    addVector(v: VectorE3, α = 1): Geometric3 {
        this.x += v.x * α
        this.y += v.y * α
        this.z += v.z * α
        return this
    }

    /**
     * <p>
     * <code>this ⟼ a + b</code>
     * </p>
     * @method add2
     * @param a {GeometricE3}
     * @param b {GeometricE3}
     * @return {Geometric3} <code>this</code>
     * @chainable
     */
    add2(a: GeometricE3, b: GeometricE3): Geometric3 {
        this.α = a.α + b.α
        this.x = a.x + b.x
        this.y = a.y + b.y
        this.z = a.z + b.z
        this.yz = a.yz + b.yz
        this.zx = a.zx + b.zx
        this.xy = a.xy + b.xy
        this.β = a.β + b.β
        return this
    }

    adj(): Geometric3 {
        throw new Error('TODO: Geometric3.adj')
    }

    /**
     * @method angle
     * @return {Geometric3}
     */
    angle(): Geometric3 {
        return this.log().grade(2);
    }

    /**
     * @method clone
     * @return {Geometric3} <code>copy(this)</code>
     * @chainable
     */
    clone(): Geometric3 {
        return Geometric3.copy(this)
    }

    /**
     * <p>
     * <code>this ⟼ conjugate(this)</code>
     * </p>
     * @method conj
     * @return {Geometric3} <code>this</code>
     * @chainable
     */
    conj(): Geometric3 {
        // FIXME: This is only the bivector part.
        // Also need to think about various involutions.
        this.yz = -this.yz;
        this.zx = -this.zx;
        this.xy = -this.xy;
        return this
    }

    /**
     * <p>
     * <code>this ⟼ this << m</code>
     * </p>
     * @method lco
     * @param m {GeometricE3}
     * @return {Geometric3} <code>this</code>
     * @chainable
     */
    lco(m: GeometricE3): Geometric3 {
        return this.lco2(this, m)
    }

    /**
     * <p>
     * <code>this ⟼ a << b</code>
     * </p>
     * @method lco2
     * @param a {GeometricE3}
     * @param b {GeometricE3}
     * @return {Geometric3} <code>this</code>
     * @chainable
     */
    lco2(a: GeometricE3, b: GeometricE3): Geometric3 {
        return lcoG3(a, b, this)
    }

    /**
     * <p>
     * <code>this ⟼ this >> m</code>
     * </p>
     * @method rco
     * @param m {GeometricE3}
     * @return {Geometric3} <code>this</code>
     * @chainable
     */
    rco(m: GeometricE3): Geometric3 {
        return this.rco2(this, m)
    }

    /**
     * <p>
     * <code>this ⟼ a >> b</code>
     * </p>
     * @method rco2
     * @param a {GeometricE3}
     * @param b {GeometricE3}
     * @return {Geometric3} <code>this</code>
     * @chainable
     */
    rco2(a: GeometricE3, b: GeometricE3): Geometric3 {
        return rcoG3(a, b, this)
    }

    /**
     * <p>
     * <code>this ⟼ copy(v)</code>
     * </p>
     * @method copy
     * @param M {VectorE3}
     * @return {Geometric3} <code>this</code>
     * @chainable
     */
    copy(M: GeometricE3): Geometric3 {
        this.α = M.α
        this.x = M.x
        this.y = M.y
        this.z = M.z
        this.yz = M.yz
        this.zx = M.zx
        this.xy = M.xy
        this.β = M.β

        return this
    }

    /**
     * Sets this multivector to the value of the scalar, <code>α</code>.
     *
     * @method copyScalar
     * @param α {number}
     * @return {Geometric3}
     * @chainable
     */
    copyScalar(α: number): Geometric3 {
        return this.zero().addScalar(α)
    }

    /**
     * <p>
     * <code>this ⟼ copy(spinor)</code>
     * </p>
     * @method copySpinor
     * @param spinor {SpinorE3}
     * @return {Geometric3} <code>this</code>
     * @chainable
     */
    copySpinor(spinor: SpinorE3) {
        this.zero()
        this.α = spinor.α
        this.yz = spinor.yz
        this.zx = spinor.zx
        this.xy = spinor.xy
        return this
    }

    /**
     * <p>
     * <code>this ⟼ copyVector(vector)</code>
     * </p>
     * @method copyVector
     * @param vector {VectorE3}
     * @return {Geometric3} <code>this</code>
     * @chainable
     */
    copyVector(vector: VectorE3) {
        this.zero()
        this.x = vector.x
        this.y = vector.y
        this.z = vector.z
        return this
    }

    /**
     * <p>
     * <code>this ⟼ this / m</code>
     * </p>
     * @method div
     * @param m {GeometricE3}
     * @return {Geometric3} <code>this</code>
     * @chainable
     */
    div(m: GeometricE3): Geometric3 {
        // TODO: Generalize (this is implemented in G3)
        if (isScalarG3(m)) {
            return this.divByScalar(m.α)
        }
        else {
            throw new Error("division with arbitrary multivectors is not supported")
        }
    }

    /**
     * <p>
     * <code>this ⟼ this / α</code>
     * </p>
     * @method divByScalar
     * @param α {number}
     * @return {Geometric3} <code>this</code>
     * @chainable
     */
    divByScalar(α: number): Geometric3 {
        this.α /= α
        this.x /= α
        this.y /= α
        this.z /= α
        this.yz /= α
        this.zx /= α
        this.xy /= α
        this.β /= α
        return this
    }

    /**
     * <p>
     * <code>this ⟼ a / b</code>
     * </p>
     * @method div2
     * @param a {GeometricE3}
     * @param b {GeometricE3}
     * @return {Geometric3} <code>this</code>
     * @chainable
     */
    div2(a: SpinorE3, b: SpinorE3): Geometric3 {
        // FIXME: Generalize
        let a0 = a.α
        let a1 = a.yz;
        let a2 = a.zx;
        let a3 = a.xy;
        let b0 = b.α
        let b1 = b.yz;
        let b2 = b.zx;
        let b3 = b.xy;
        // Compare this to the product for Quaternions
        // It would be interesting to DRY this out.
        this.α = a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3;
        // this.α = a0 * b0 - dotVectorCartesianE3(a1, a2, a3, b1, b2, b3)
        this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
        this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
        this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ dual(m) = I * m</code>
     * </p>
     * @method dual
     * @param m {GeometricE3}
     * @return {Geometric3} <code>this</code>
     * @chainable
     */
    dual(m: GeometricE3) {
        let w = -m.β
        let x = -m.yz
        let y = -m.zx
        let z = -m.xy
        let yz = m.x
        let zx = m.y
        let xy = m.z
        let β = m.α

        this.α = w
        this.x = x
        this.y = y
        this.z = z
        this.yz = yz
        this.zx = zx
        this.xy = xy
        this.β = β

        return this
    }

    /**
     * <p>
     * <code>this ⟼ e<sup>this</sup></code>
     * </p>
     * @method exp
     * @return {Geometric3} <code>this</code>
     * @chainable
     */
    exp() {
        // It's always the case that the scalar commutes with every other
        // grade of the multivector, so we can pull it out the front.
        let expW = exp(this.α)

        // In Geometric3 we have the special case that the pseudoscalar also commutes.
        // And since it squares to -1, we get a exp(Iβ) = cos(β) + I * sin(β) factor.
        // let cosβ = cos(this.β)
        // let sinβ = sin(this.β)

        // We are left with the vector and bivector components.
        // For a bivector (usual case), let B = I * φ, where φ is a vector.
        // We would get cos(φ) + I * n * sin(φ), where φ = |φ|n and n is a unit vector.
        let yz = this.yz
        let zx = this.zx
        let xy = this.xy
        // φ is actually the absolute value of one half the rotation angle.
        // The orientation of the rotation gets carried in the bivector components.
        let φ = sqrt(yz * yz + zx * zx + xy * xy)
        let s = φ !== 0 ? sin(φ) / φ : 1
        let cosφ = cos(φ);

        // For a vector a, we use exp(a) = cosh(a) + n * sinh(a)
        // The mixture of vector and bivector parts is more complex!
        this.α = cosφ;
        this.yz = yz * s;
        this.zx = zx * s;
        this.xy = xy * s;
        return this.scale(expW);
    }

    /**
     * <p>
     * <code>this ⟼ conj(this) / quad(this)</code>
     * </p>
     * @method inv
     * @return {Geometric3} <code>this</code>
     * @chainable
     */
    inv(): Geometric3 {
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
        return this.α === 1 && this.x === 0 && this.y === 0 && this.z === 0 && this.yz === 0 && this.zx === 0 && this.xy === 0 && this.β === 0
    }

    /**
     * @method isZero
     * @return {boolean}
     */
    isZero(): boolean {
        return this.α === 0 && this.x === 0 && this.y === 0 && this.z === 0 && this.yz === 0 && this.zx === 0 && this.xy === 0 && this.β === 0
    }

    /**
     * <p>
     * <code>this ⟼ this + α * (target - this)</code>
     * </p>
     * @method lerp
     * @param target {GeometricE3}
     * @param α {number}
     * @return {Geometric3} <code>this</code>
     * @chainable
     */
    lerp(target: GeometricE3, α: number): Geometric3 {
        this.α += (target.α - this.α) * α;
        this.x += (target.x - this.x) * α;
        this.y += (target.y - this.y) * α;
        this.z += (target.z - this.z) * α;
        this.yz += (target.yz - this.yz) * α;
        this.zx += (target.zx - this.zx) * α;
        this.xy += (target.xy - this.xy) * α;
        this.β += (target.β - this.β) * α;
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ a + α * (b - a)</code>
     * </p>
     * @method lerp2
     * @param a {GeometricE3}
     * @param b {GeometricE3}
     * @param α {number}
     * @return {Geometric3} <code>this</code>
     * @chainable
     */
    lerp2(a: GeometricE3, b: GeometricE3, α: number): Geometric3 {
        this.copy(a).lerp(b, α)
        return this
    }

    /**
     * <p>
     * <code>this ⟼ log(this)</code>
     * </p>
     * @method log
     * @return {Geometric3} <code>this</code>
     * @chainable
     */
    log() {
        let α = this.α
        let x = this.yz
        let y = this.zx
        let z = this.xy
        let BB = x * x + y * y + z * z
        let B = sqrt(BB)
        let f = atan2(B, α) / B
        this.α = log(sqrt(α * α + BB))
        this.yz = x * f
        this.zx = y * f
        this.xy = z * f
        return this
    }

    /**
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     * @method magnitude
     * @return {Geometric3}
     */
    magnitude(): Geometric3 {
        return this.norm();
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
     * @method mul
     * @param m {GeometricE3}
     * @return {Geometric3} <code>this</code>
     * @chainable
     */
    mul(m: GeometricE3): Geometric3 {
        return this.mul2(this, m)
    }

    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     * @method mul2
     * @param a {GeometricE3}
     * @param b {GeometricE3}
     * @return {Geometric3} <code>this</code>
     * @chainable
     */
    mul2(a: GeometricE3, b: GeometricE3): Geometric3 {
        mulG3(a, b, this._coords)
        return this
    }

    /**
     * <p>
     * <code>this ⟼ -1 * this</code>
     * </p>
     * @method neg
     * @return {Geometric3} <code>this</code>
     * @chainable
     */
    neg() {
        this.α = -this.α
        this.x = -this.x
        this.y = -this.y
        this.z = -this.z
        this.yz = -this.yz
        this.zx = -this.zx
        this.xy = -this.xy
        this.β = -this.β
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ sqrt(this * conj(this))</code>
     * </p>
     * @method norm
     * @return {Geometric3} <code>this</code>
     * @chainable
     */
    norm(): Geometric3 {
        this.α = this.magnitudeSansUnits()
        this.x = 0
        this.y = 0
        this.z = 0
        this.yz = 0
        this.zx = 0
        this.xy = 0
        this.β = 0
        return this
    }

    /**
     * <p>
     * <code>this ⟼ this / magnitude(this)</code>
     * </p>
     * @method direction
     * @return {Geometric3} <code>this</code>
     * @chainable
     */
    direction(): Geometric3 {
        // The squaredNorm is the squared norm.
        let norm = this.magnitudeSansUnits()
        this.α = this.α / norm
        this.x = this.x / norm
        this.y = this.y / norm
        this.z = this.z / norm
        this.yz = this.yz / norm
        this.zx = this.zx / norm
        this.xy = this.xy / norm
        this.β = this.β / norm
        return this
    }

    /**
     * Sets this multivector to the identity element for multiplication, <b>1</b>.
     * @method one
     * @return {Geometric3}
     * @chainable
     */
    one() {
        this.α = 1
        this.x = 0
        this.y = 0
        this.z = 0
        this.yz = 0
        this.zx = 0
        this.xy = 0
        this.β = 0
        return this
    }

    /**
     * <p>
     * <code>this ⟼ scp(this, rev(this)) = this | ~this</code>
     * </p>
     * @method quad
     * @return {Geometric3} <code>this</code>
     * @chainable
     */
    quad(): Geometric3 {
        return this.squaredNorm();
    }

    /**
     * Computes the <em>squared norm</em> of this multivector.
     * @method squaredNorm
     * @return {Geometric3} <code>this * conj(this)</code>
     */
    squaredNorm(): Geometric3 {
        // FIXME: TODO
        this.α = this.squaredNormSansUnits()
        this.yz = 0
        this.zx = 0
        this.xy = 0
        return this
    }

    /**
     * Intentionally undocumented
     */
    squaredNormSansUnits(): number {
        return squaredNormG3(this)
    }

    /**
     * <p>
     * <code>this ⟼ - n * this * n</code>
     * </p>
     * @method reflect
     * @param n {VectorE3}
     * @return {Geometric3} <code>this</code>
     * @chainable
     */
    reflect(n: VectorE3): Geometric3 {
        // TODO: Optimize.
        let N = G3.fromVector(n);
        let M = G3.copy(this);
        let R = N.mul(M).mul(N).scale(-1);
        this.copy(R);
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ rev(this)</code>
     * </p>
     * @method reverse
     * @return {Geometric3} <code>this</code>
     * @chainable
     */
    rev() {
        // reverse has a ++-- structure on the grades.
        this.α = +this.α
        this.x = +this.x
        this.y = +this.y
        this.z = +this.z
        this.yz = -this.yz
        this.zx = -this.zx
        this.xy = -this.xy
        this.β = -this.β
        return this
    }

    /**
     * @method __tilde__
     * @return {Geometric3}
     * @private
     */
    __tilde__(): Geometric3 {
        return Geometric3.copy(this).rev()
    }

    /**
     * <p>
     * <code>this ⟼ R * this * rev(R)</code>
     * </p>
     * @method rotate
     * @param R {SpinorE3}
     * @return {Geometric3} <code>this</code>
     * @chainable
     */
    rotate(R: SpinorE3): Geometric3 {
        // FIXME: This only rotates the vector components.
        let x = this.x;
        let y = this.y;
        let z = this.z;

        let a = R.xy;
        let b = R.yz;
        let c = R.zx;
        let α = R.α

        let ix = α * x - c * z + a * y;
        let iy = α * y - a * x + b * z;
        let iz = α * z - b * y + c * x;
        let iα = b * x + c * y + a * z;

        this.x = ix * α + iα * b + iy * a - iz * c;
        this.y = iy * α + iα * c + iz * b - ix * a;
        this.z = iz * α + iα * a + ix * c - iy * b;

        return this;
    }

    /**
     * <p>
     * Computes a rotor, R, from two unit vectors, where
     * R = (1 + b * a) / sqrt(2 * (1 + b << a))
     * </p>
     * @method rotorFromDirections
     * @param a {VectorE3} The starting unit vector
     * @param b {VectorE3} The ending unit vector
     * @return {Geometric3} <code>this</code> The rotor representing a rotation from a to b.
     * @chainable
     */
    rotorFromDirections(a: VectorE3, b: VectorE3): Geometric3 {
        rotorFromDirections(a, b, this)
        return this
    }

    /**
     * <p>
     * <code>this = ⟼ exp(- dual(a) * θ / 2)</code>
     * </p>
     * @method rotorFromAxisAngle
     * @param axis {VectorE3}
     * @param θ {number}
     * @return {Geometric3} <code>this</code>
     * @chainable
     */
    rotorFromAxisAngle(axis: VectorE3, θ: number): Geometric3 {
        // FIXME: TODO
        const φ = θ / 2
        const s = sin(φ)
        this.yz = -axis.x * s
        this.zx = -axis.y * s
        this.xy = -axis.z * s
        this.α = cos(φ)
        // FIXME; Zero out other coordinates
        return this
    }

    /**
     * <p>
     * <code>this = ⟼ exp(- B * θ / 2)</code>
     * </p>
     * @method rotorFromGeneratorAngle
     * @param B {SpinorE3}
     * @param θ {number} The rotation angle when applied on both sides: R M ~R
     * @return {Geometric3} <code>this</code>
     * @chainable
     */
    rotorFromGeneratorAngle(B: SpinorE3, θ: number): Geometric3 {
        // FIXME: TODO
        const φ = θ / 2
        const s = sin(φ)
        this.yz = -B.yz * s
        this.zx = -B.zx * s
        this.xy = -B.xy * s
        this.α = cos(φ)
        return this
    }

    /**
     * <p>
     * <code>this ⟼ scp(this, m)</code>
     * </p>
     * @method align
     * @param m {GeometricE3}
     * @return {Geometric3} <code>this</code>
     * @chainable
     */
    scp(m: GeometricE3): Geometric3 {
        return this.scp2(this, m)
    }

    /**
     * <p>
     * <code>this ⟼ scp(a, b)</code>
     * </p>
     * @method scp2
     * @param a {GeometricE3}
     * @param b {GeometricE3}
     * @return {Geometric3} <code>this</code>
     * @chainable
     */
    scp2(a: GeometricE3, b: GeometricE3): Geometric3 {
        return scpG3(a, b, this)
    }

    /**
     * <p>
     * <code>this ⟼ this * α</code>
     * </p>
     * @method scale
     * @param α {number} 
     */
    scale(α: number): Geometric3 {
        this.α *= α
        this.x *= α
        this.y *= α
        this.z *= α
        this.yz *= α
        this.zx *= α
        this.xy *= α
        this.β *= α
        return this
    }

    slerp(target: GeometricE3, α: number): Geometric3 {
        // TODO
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     * Sets this Geometric3 to the geometric product a * b of the vector arguments.
     *
     * @method versor
     * @param a {VectorE3}
     * @param b {VectorE3}
     * @return {Geometric3} <code>this</code>
     */
    versor(a: VectorE3, b: VectorE3): Geometric3 {
        const ax = a.x
        const ay = a.y
        const az = a.z
        const bx = b.x
        const by = b.y
        const bz = b.z

        this.zero()
        this.α = dotVector(a, b)
        this.yz = wedgeYZ(ax, ay, az, bx, by, bz)
        this.zx = wedgeZX(ax, ay, az, bx, by, bz)
        this.xy = wedgeXY(ax, ay, az, bx, by, bz)

        return this
    }

    /**
     * <p>
     * <code>this ⟼ this - M * α</code>
     * </p>
     * @method sub
     * @param M {GeometricE3}
     * @param [α = 1] {number}
     * @return {Geometric3} <code>this</code>
     * @chainable
     */
    sub(M: GeometricE3, α = 1): Geometric3 {
        this.α -= M.α * α
        this.x -= M.x * α
        this.y -= M.y * α
        this.z -= M.z * α
        this.yz -= M.yz * α
        this.zx -= M.zx * α
        this.xy -= M.xy * α
        this.β -= M.β * α
        return this
    }

    /**
     * <p>
     * <code>this ⟼ a - b</code>
     * </p>
     * @method sub2
     * @param a {GeometricE3}
     * @param b {GeometricE3}
     * @return {Geometric3} <code>this</code>
     * @chainable
     */
    sub2(a: GeometricE3, b: GeometricE3): Geometric3 {
        this.α = a.α - b.α
        this.x = a.x - b.x
        this.y = a.y - b.y
        this.z = a.z - b.z
        this.yz = a.yz - b.yz
        this.zx = a.zx - b.zx
        this.xy = a.xy - b.xy
        this.β = a.β - b.β
        return this
    }

    /**
     * Returns a string representing the number in exponential notation.
     * @method toExponential
     * @return {string}
     */
    toExponential(): string {
        const coordToString = function(coord: number): string { return coord.toExponential() };
        return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS)
    }

    /**
     * Returns a string representing the number in fixed-point notation.
     * @method toFixed
     * @param [fractionDigits] {number}
     * @return {string}
     */
    toFixed(fractionDigits?: number): string {
        const coordToString = function(coord: number): string { return coord.toFixed(fractionDigits) };
        return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS)
    }

    /**
     * Returns a string representation of the number.
     * @method toString
     * @return {string} 
     */
    toString(): string {
        const coordToString = function(coord: number): string { return coord.toString() };
        return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS)
    }

    /**
     * @method grade
     * @param grade {number}
     * @return {Geometric3}
     * @chainable
     */
    grade(grade: number): Geometric3 {
        switch (grade) {
            case 0: {
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.yz = 0;
                this.zx = 0;
                this.xy = 0;
                this.β = 0;
            }
                break;
            case 1: {
                this.α = 0;
                this.yz = 0;
                this.zx = 0;
                this.xy = 0;
                this.β = 0;
            }
                break;
            case 2: {
                this.α = 0;
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.β = 0;
            }
                break;
            case 3: {
                this.α = 0;
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.yz = 0;
                this.zx = 0;
                this.xy = 0;
            }
                break;
            default: {
                this.α = 0;
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.yz = 0;
                this.zx = 0;
                this.xy = 0;
                this.β = 0;
            }
        }
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ this ^ m</code>
     * </p>
     * @method wedge
     * @param m {GeometricE3}
     * @return {Geometric3} <code>this</code>
     * @chainable
     */
    ext(m: GeometricE3): Geometric3 {
        return this.ext2(this, m)
    }

    /**
     * <p>
     * <code>this ⟼ a ^ b</code>
     * </p>
     * @method ext2
     * @param a {GeometricE3}
     * @param b {GeometricE3}
     * @return {Geometric3} <code>this</code>
     * @chainable
     */
    ext2(a: GeometricE3, b: GeometricE3): Geometric3 {
        return extG3(a, b, this)
    }

    /**
     * Sets this multivector to the identity element for addition, <b>0</b>.
     * @method zero
     * @return {Geometric3}
     * @chainable
     */
    zero(): Geometric3 {
        this.α = 0
        this.x = 0
        this.y = 0
        this.z = 0
        this.yz = 0
        this.zx = 0
        this.xy = 0
        this.β = 0
        return this
    }

    /**
     * @method __add__
     * @param rhs {number | Geometric3}
     * @return {Geometric3}
     * @private
     */
    __add__(rhs: number | Geometric3) {
        if (rhs instanceof Geometric3) {
            return Geometric3.copy(this).add(rhs)
        }
        else if (typeof rhs === 'number') {
            return Geometric3.copy(this).add(Geometric3.scalar(rhs))
        }
        else {
            return void 0
        }
    }

    /**
     * @method __div__
     * @param rhs {number | Geometric3}
     * @return {Geometric3}
     * @private
     */
    __div__(rhs: number | Geometric3) {
        if (rhs instanceof Geometric3) {
            return Geometric3.copy(this).div(rhs)
        }
        else if (typeof rhs === 'number') {
            return Geometric3.copy(this).divByScalar(rhs)
        }
        else {
            return void 0
        }
    }

    /**
     * @method __rdiv__
     * @param lhs {number | Geometric3}
     * @return {Geometric3}
     * @private
     */
    __rdiv__(lhs: number | Geometric3) {
        if (lhs instanceof Geometric3) {
            return Geometric3.copy(lhs).div(this)
        }
        else if (typeof lhs === 'number') {
            return Geometric3.scalar(lhs).div(this)
        }
        else {
            return void 0
        }
    }

    /**
     * @method __mul__
     * @param rhs {number | Geometric3}
     * @return {Geometric3}
     * @private
     */
    __mul__(rhs: number | Geometric3) {
        if (rhs instanceof Geometric3) {
            return Geometric3.copy(this).mul(rhs)
        }
        else if (typeof rhs === 'number') {
            return Geometric3.copy(this).scale(rhs)
        }
        else {
            return void 0
        }
    }

    /**
     * @method __rmul__
     * @param lhs {number | Geometric3}
     * @return {Geometric3}
     * @private
     */
    __rmul__(lhs: number | Geometric3) {
        if (lhs instanceof Geometric3) {
            return Geometric3.copy(lhs).mul(this)
        }
        else if (typeof lhs === 'number') {
            return Geometric3.copy(this).scale(lhs)
        }
        else {
            return void 0
        }
    }

    /**
     * @method __radd__
     * @param lhs {number | Geometric3}
     * @return {Geometric3}
     * @private
     */
    __radd__(lhs: number | Geometric3) {
        if (lhs instanceof Geometric3) {
            return Geometric3.copy(lhs).add(this)
        }
        else if (typeof lhs === 'number') {
            return Geometric3.scalar(lhs).add(this)
        }
        else {
            return void 0
        }
    }
    /**
     * @method __sub__
     * @param rhs {number | Geometric3}
     * @return {Geometric3}
     * @private
     */
    __sub__(rhs: number | Geometric3) {
        if (rhs instanceof Geometric3) {
            return Geometric3.copy(this).sub(rhs)
        }
        else if (typeof rhs === 'number') {
            return Geometric3.scalar(rhs).neg().add(this)
        }
        else {
            return void 0
        }
    }
    /**
     * @method __rsub__
     * @param lhs {number | Geometric3}
     * @return {Geometric3}
     * @private
     */
    __rsub__(lhs: number | Geometric3) {
        if (lhs instanceof Geometric3) {
            return Geometric3.copy(lhs).sub(this)
        }
        else if (typeof lhs === 'number') {
            return Geometric3.scalar(lhs).sub(this)
        }
        else {
            return void 0
        }
    }

    /**
     * @method __wedge__
     * @param rhs {number | Geometric3}
     * @return {Geometric3}
     * @private
     */
    __wedge__(rhs: number | Geometric3) {
        if (rhs instanceof Geometric3) {
            return Geometric3.copy(this).ext(rhs)
        }
        else if (typeof rhs === 'number') {
            // The outer product with a scalar is scalar multiplication.
            return Geometric3.copy(this).scale(rhs)
        }
        else {
            return void 0
        }
    }

    /**
     * @method __rwedge__
     * @param lhs {number | Geometric3}
     * @return {Geometric3}
     * @private
     */
    __rwedge__(lhs: number | Geometric3) {
        if (lhs instanceof Geometric3) {
            return Geometric3.copy(lhs).ext(this)
        }
        else if (typeof lhs === 'number') {
            // The outer product with a scalar is scalar multiplication, and commutes.
            return Geometric3.copy(this).scale(lhs)
        }
        else {
            return void 0
        }
    }

    /**
     * @method __lshift__
     * @param rhs {number | Geometric3}
     * @return {Geometric3}
     * @private
     */
    __lshift__(rhs: number | Geometric3) {
        if (rhs instanceof Geometric3) {
            return Geometric3.copy(this).lco(rhs)
        }
        else if (typeof rhs === 'number') {
            return Geometric3.copy(this).lco(Geometric3.scalar(rhs))
        }
        else {
            return void 0
        }
    }

    /**
     * @method __rlshift__
     * @param other {number | Geometric3}
     * @return {Geometric3}
     * @private
     */
    __rlshift__(lhs: number | Geometric3) {
        if (lhs instanceof Geometric3) {
            return Geometric3.copy(lhs).lco(this)
        }
        else if (typeof lhs === 'number') {
            return Geometric3.scalar(lhs).lco(this)
        }
        else {
            return void 0
        }
    }

    /**
     * @method __rshift__
     * @param rhs {number | Geoemtric3}
     * @return {Geometric3}
     * @private
     */
    __rshift__(rhs: number | Geometric3) {
        if (rhs instanceof Geometric3) {
            return Geometric3.copy(this).rco(rhs)
        }
        else if (typeof rhs === 'number') {
            return Geometric3.copy(this).rco(Geometric3.scalar(rhs))
        }
        else {
            return void 0
        }
    }

    /**
     * @method __rrshift__
     * @param other {number | Geometric3}
     * @return {Geometric3}
     * @private
     */
    __rrshift__(lhs: number | Geometric3) {
        if (lhs instanceof Geometric3) {
            return Geometric3.copy(lhs).rco(this)
        }
        else if (typeof lhs === 'number') {
            return Geometric3.scalar(lhs).rco(this)
        }
        else {
            return void 0
        }
    }

    /**
     * @method __vbar__
     * @param rhs {number | Geometric3}
     * @return {Geometric3}
     * @private
     */
    __vbar__(rhs: number | Geometric3) {
        if (rhs instanceof Geometric3) {
            return Geometric3.copy(this).scp(rhs)
        }
        else if (typeof rhs === 'number') {
            return Geometric3.copy(this).scp(Geometric3.scalar(rhs))
        }
        else {
            return void 0
        }
    }

    /**
     * @method __rvbar__
     * @param lhs {number | Geometric3}
     * @return {Geometric3}
     * @private
     */
    __rvbar__(lhs: number | Geometric3) {
        if (lhs instanceof Geometric3) {
            return Geometric3.copy(lhs).scp(this)
        }
        else if (typeof lhs === 'number') {
            return Geometric3.scalar(lhs).scp(this)
        }
        else {
            return void 0
        }
    }

    /**
     * @method __bang__
     * @return {Geometric3}
     * @private
     * @chainable
     */
    __bang__(): Geometric3 {
        return Geometric3.copy(this).inv()
    }

    /**
     * @method __pos__
     * @return {Geometric3}
     * @private
     * @chainable
     */
    __pos__() {
        return Geometric3.copy(this)/*.pos()*/
    }

    /**
     * @method __neg__
     * @return {Geometric3}
     * @private
     * @chainable
     */
    __neg__() {
        return Geometric3.copy(this).neg()
    }

    /**
     * Constructs a Geometric3 representing the number zero.
     * The identity element for addition, <b>0</b>.
     *
     * @method zero
     * @return {Geometric3}
     * @static
     * @chainable
     */
    static zero(): Geometric3 { return new Geometric3() }

    /**
     * Constructs a Geometric3 representing the number one.
     * The identity element for multiplication, <b>1</b>.
     *
     * @method one
     * @return {Geometric3}
     * @static
     * @chainable
     */
    static one(): Geometric3 { return new Geometric3().addScalar(1) }

    /**
     * Constructs a basis vector corresponding to the <code>x</code> coordinate.
     *
     * @method e1
     * @return {Geometric3}
     * @static
     * @chainable
     */
    static e1(): Geometric3 { return Geometric3.vector(1, 0, 0) }

    /**
     * Constructs a basis vector corresponding to the <code>y</code> coordinate.
     *
     * @method e2
     * @return {Geometric3}
     * @static
     * @chainable
     */
    static e2(): Geometric3 { return Geometric3.vector(0, 1, 0) }

    /**
     * Constructs a basis vector corresponding to the <code>z</code> coordinate.
     *
     * @method e3
     * @return {Geometric3}
     * @static
     * @chainable
     */
    static e3(): Geometric3 { return Geometric3.vector(0, 0, 1) }

    /**
     * Constructs a basis vector corresponding to the <code>β</code> coordinate.
     *
     * @method I
     * @return {Geometric3}
     * @static
     * @chainable
     */
    static I(): Geometric3 { return new Geometric3().addPseudo(1) }

    /**
     * @method copy
     * @param M {GeometricE3}
     * @return {Geometric3}
     * @static
     * @chainable
     */
    static copy(M: GeometricE3): Geometric3 {
        const copy = new Geometric3()
        copy.α = M.α
        copy.x = M.x
        copy.y = M.y
        copy.z = M.z
        copy.yz = M.yz
        copy.zx = M.zx
        copy.xy = M.xy
        copy.β = M.β
        return copy
    }

    /**
     * @method fromScalar
     * @param scalar {Scalar}
     * @return {Geometric3}
     * @static
     * @chainable
     */
    static fromScalar(scalar: Scalar): Geometric3 {
        return new Geometric3().copyScalar(scalar.α)
    }

    /**
     * @method fromSpinor
     * @param spinor {SpinorE3}
     * @return {Geometric3}
     * @static
     * @chainable
     */
    static fromSpinor(spinor: SpinorE3): Geometric3 {
        const copy = new Geometric3()
        copy.α = spinor.α
        copy.yz = spinor.yz
        copy.zx = spinor.yz
        copy.xy = spinor.xy
        return copy
    }

    /**
     * @method fromVector
     * @param vector {VectorE3}
     * @return {Geometric3}
     * @static
     * @chainable
     */
    static fromVector(vector: VectorE3): Geometric3 {
        const copy = new Geometric3()
        copy.x = vector.x
        copy.y = vector.y
        copy.z = vector.z
        return copy
    }

    /**
     * @method lerp
     * @param A {GeometricE3}
     * @param B {GeometricE3}
     * @param α {number}
     * @return {Geometric3} <code>A + α * (B - A)</code>
     * @static
     * @chainable
     */
    static lerp(A: GeometricE3, B: GeometricE3, α: number): Geometric3 {
        return Geometric3.copy(A).lerp(B, α)
    }

    /**
     * Computes the rotor that rotates vector <code>a</code> to vector <code>b</code>.
     * @method rotorFromDirections
     * @param a {VectorE3} The <em>from</em> vector.
     * @param b {VectorE3} The <em>to</em> vector.
     * @return {Geometric3}
     * @static
     * @chainable
     */
    static rotorFromDirections(a: VectorE3, b: VectorE3): Geometric3 {
        return new Geometric3().rotorFromDirections(a, b)
    }

    /**
     * @method scalar
     * @param α {number}
     * @return {Geometric3}
     * @static
     * @chainable
     */
    static scalar(α: number): Geometric3 {
        return new Geometric3().copyScalar(α)
    }

    /**
     * @method vector
     * @param x {number}
     * @param y {number}
     * @param z {number}
     * @return {Geometric3}
     * @static
     * @chainable
     */
    static vector(x: number, y: number, z: number): Geometric3 {
        const v = new Geometric3()
        v.x = x
        v.y = y
        v.z = z
        return v
    }
}
