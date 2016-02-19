import dotVectorCartesianE3 from '../math/dotVectorCartesianE3';
import dotVector from '../math/dotVectorE3';
import MutableGeometricElement3D from '../math/MutableGeometricElement3D';
import mustBeInteger from '../checks/mustBeInteger';
import mustBeNumber from '../checks/mustBeNumber';
import mustBeObject from '../checks/mustBeObject';
import Mutable from '../math/Mutable';
import quadSpinor from '../math/quadSpinorE3';
import quadVector from '../math/quadVectorE3';
import rotorFromDirections from '../math/rotorFromDirections';
import SpinorE3 from '../math/SpinorE3';
import VectorE3 from '../math/VectorE3';
import VectorN from '../math/VectorN';
import wedgeXY from '../math/wedgeXY';
import wedgeYZ from '../math/wedgeYZ';
import wedgeZX from '../math/wedgeZX';

/**
 * @module EIGHT
 * @submodule math
 */

// GraphicsProgramSymbols constants for the coordinate indices into the coords array.
const COORD_YZ = 0
const COORD_ZX = 1
const COORD_XY = 2
const COORD_SCALAR = 3

function one(): number[] {
    const coords = [0, 0, 0, 0]
    coords[COORD_SCALAR] = 1
    return coords
}

const exp = Math.exp
const cos = Math.cos
const sin = Math.sin
const sqrt = Math.sqrt

/**
 * @class Spinor3
 * @extends VectorN<number>
 */
export default class Spinor3 extends VectorN<number> implements SpinorE3, Mutable<number[]>, MutableGeometricElement3D<SpinorE3, Spinor3, Spinor3, VectorE3> {
    /**
     * Constructs a <code>Spinor3</code> from a <code>number[]</code>.
     * For a <em>geometric</em> implementation, use the static methods.
     * @class Spinor3
     * @constructor
     */
    constructor(coordinates = one(), modified = false) {
        super(coordinates, modified, 4)
    }

    /**
     * @property yz
     * @type Number
     */
    get yz(): number {
        return this.coords[COORD_YZ]
    }
    set yz(yz: number) {
        mustBeNumber('yz', yz)
        this.modified = this.modified || this.yz !== yz
        this.coords[COORD_YZ] = yz;
    }

    /**
     * @property zx
     * @type Number
     */
    get zx(): number {
        return this.coords[COORD_ZX];
    }
    set zx(zx: number) {
        mustBeNumber('zx', zx)
        this.modified = this.modified || this.zx !== zx;
        this.coords[COORD_ZX] = zx;
    }

    /**
     * @property xy
     * @type Number
     */
    get xy(): number {
        return this.coords[COORD_XY];
    }
    set xy(xy: number) {
        mustBeNumber('xy', xy)
        this.modified = this.modified || this.xy !== xy;
        this.coords[COORD_XY] = xy;
    }

    /**
     * @property alpha
     * @type Number
     */
    get alpha(): number {
        return this.coords[COORD_SCALAR];
    }
    set alpha(alpha: number) {
        mustBeNumber('alpha', alpha)
        this.modified = this.modified || this.alpha !== alpha;
        this.coords[COORD_SCALAR] = alpha;
    }

    /**
     * @property α
     * @type Number
     */
    get α(): number {
        return this.coords[COORD_SCALAR];
    }
    set α(α: number) {
        mustBeNumber('α', α)
        this.modified = this.modified || this.α !== α;
        this.coords[COORD_SCALAR] = α;
    }

    /**
     * <p>
     * <code>this ⟼ this + α * spinor</code>
     * </p>
     * @method add
     * @param spinor {SpinorE3}
     * @param [α = 1] {number}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    add(spinor: SpinorE3, α = 1): Spinor3 {
        mustBeObject('spinor', spinor)
        mustBeNumber('α', α)
        this.yz += spinor.yz * α
        this.zx += spinor.zx * α
        this.xy += spinor.xy * α
        this.α += spinor.α * α
        return this
    }

    /**
     * <p>
     * <code>this ⟼ a + b</code>
     * </p>
     * @method add2
     * @param a {SpinorE3}
     * @param b {SpinorE3}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    add2(a: SpinorE3, b: SpinorE3): Spinor3 {
        this.α = a.α + b.α
        this.yz = a.yz + b.yz
        this.zx = a.zx + b.zx
        this.xy = a.xy + b.xy
        return this;
    }

    /**
     * Intentionally undocumented.
     */
    addPseudo(β: number): Spinor3 {
        mustBeNumber('β', β)
        return this
    }

    /**
     * <p>
     * <code>this ⟼ this + α</code>
     * </p>
     * @method addScalar
     * @param α {number}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    addScalar(α: number): Spinor3 {
        mustBeNumber('α', α)
        this.α += α
        return this
    }

    /**
     * @method adj
     * @return {number}
     * @beta
     */
    adj(): Spinor3 {
        throw new Error('TODO: Spinor3.adj')
    }

    /**
     * @method angle
     * @return {Spinor3}
     */
    angle(): Spinor3 {
        return this.log().grade(2);
    }

    /**
     * @method clone
     * @return {Spinor3} A copy of <code>this</code>.
     * @chainable
     */
    clone(): Spinor3 {
        return Spinor3.copy(this)
    }

    /**
     * <p>
     * <code>this ⟼ (w, -B)</code>
     * </p>
     * @method conj
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    conj() {
        this.yz = -this.yz
        this.zx = -this.zx
        this.xy = -this.xy
        return this
    }

    /**
     * <p>
     * <code>this ⟼ copy(spinor)</code>
     * </p>
     * @method copy
     * @param spinor {SpinorE3}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    copy(spinor: SpinorE3): Spinor3 {
        mustBeObject('spinor', spinor)
        this.yz = mustBeNumber('spinor.yz', spinor.yz)
        this.zx = mustBeNumber('spinor.zx', spinor.zx)
        this.xy = mustBeNumber('spinor.xy', spinor.xy)
        this.α = mustBeNumber('spinor.α', spinor.α)
        return this;
    }

    /**
     * Sets this spinor to the value of the scalar, <code>α</code>.
     * @method copyScalar
     * @param α {number} The scalar to be copied.
     * @return {Spinor3}
     * @chainable
     */
    copyScalar(α: number): Spinor3 {
        return this.zero().addScalar(α)
    }

    /**
     * Intentionally undocumented.
     */
    copySpinor(s: SpinorE3): Spinor3 {
        return this.copy(s);
    }

    /**
     * Intentionally undocumented.
     */
    copyVector(vector: VectorE3): Spinor3 {
        return this.zero()
    }

    /**
     * <p>
     * <code>this ⟼ this / s</code>
     * </p>
     * @method div
     * @param s {SpinorE3}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    div(s: SpinorE3): Spinor3 {
        return this.div2(this, s)
    }

    /**
     * <p>
     * <code>this ⟼ a / b</code>
     * </p>
     * @method div2
     * @param a {SpinorE3}
     * @param b {SpinorE3}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    div2(a: SpinorE3, b: SpinorE3) {
        let a0 = a.α;
        let a1 = a.yz;
        let a2 = a.zx;
        let a3 = a.xy;
        let b0 = b.α;
        let b1 = b.yz;
        let b2 = b.zx;
        let b3 = b.xy;
        // Compare this to the product for Quaternions
        // How does this compare to G3m
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
     * <code>this ⟼ this / α</code>
     * </p>
     * @method divByScalar
     * @param α {number}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    divByScalar(α: number): Spinor3 {
        this.yz /= α
        this.zx /= α
        this.xy /= α
        this.α /= α
        return this
    }
    /**
     * <p>
     * <code>this ⟼ dual(v) = I * v</code>
     * </p>
     * @method dual
     * @param v {VectorE3} The vector whose dual will be used to set this spinor.
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    dual(v: VectorE3) {
        mustBeObject('v', v)
        this.α = 0
        this.yz = mustBeNumber('v.x', v.x)
        this.zx = mustBeNumber('v.y', v.y)
        this.xy = mustBeNumber('v.z', v.z)
        return this
    }
    /**
     * <p>
     * <code>this ⟼ e<sup>this</sup></code>
     * </p>
     * @method exp
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    exp(): Spinor3 {
        let w = this.α
        let x = this.yz
        let y = this.zx
        let z = this.xy
        let expW = exp(w)
        // φ is actually the absolute value of one half the rotation angle.
        // The orientation of the rotation gets carried in the bivector components.
        // FIXME: DRY
        let φ = sqrt(x * x + y * y + z * z)
        let s = expW * (φ !== 0 ? sin(φ) / φ : 1)
        this.α = expW * cos(φ);
        this.yz = x * s;
        this.zx = y * s;
        this.xy = z * s;
        return this;
    }
    /**
     * <p>
     * <code>this ⟼ conj(this) / quad(this)</code>
     * </p>
     * @method inv
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    inv(): Spinor3 {
        this.conj()
        this.divByScalar(this.squaredNormSansUnits());
        return this
    }

    lco(rhs: SpinorE3): Spinor3 {
        return this.lco2(this, rhs)
    }

    lco2(a: SpinorE3, b: SpinorE3): Spinor3 {
        // FIXME: How to leverage? Maybe break up? Don't want performance hit.
        // scpG3(a, b, this)
        return this
    }

    /**
     * <p>
     * <code>this ⟼ this + α * (target - this)</code>
     * </p>
     * @method lerp
     * @param target {SpinorE3}
     * @param α {number}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    // FIXME: Should really be slerp?
    lerp(target: SpinorE3, α: number): Spinor3 {
        var Vector2 = Spinor3.copy(target)
        var Vector1 = this.clone()
        var R = Vector2.mul(Vector1.inv())
        R.log()
        R.scale(α)
        R.exp()
        this.copy(R)
        return this
    }
    /**
     * <p>
     * <code>this ⟼ a + α * (b - a)</code>
     * <p>
     * @method lerp2
     * @param a {SpinorE3}
     * @param b {SpinorE3}
     * @param α {number}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    lerp2(a: SpinorE3, b: SpinorE3, α: number): Spinor3 {
        this.sub2(b, a).scale(α).add(a)
        return this
    }
    /**
     * <p>
     * <code>this ⟼ log(this)</code>
     * </p>
     * @method log
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    log(): Spinor3 {
        // FIXME: Wrong
        let w = this.α
        let x = this.yz
        let y = this.zx
        let z = this.xy
        // FIXME: DRY
        let bb = x * x + y * y + z * z
        let Vector2 = sqrt(bb)
        let R0 = Math.abs(w)
        let R = sqrt(w * w + bb)
        this.α = Math.log(R)
        let θ = Math.atan2(Vector2, R0) / Vector2
        // The angle, θ, produced by atan2 will be in the range [-π, +π]
        this.yz = x * θ
        this.zx = y * θ
        this.xy = z * θ
        return this;
    }

    /**
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     * @method magnitude
     * @return {Spinor3}
     */
    magnitude(): Spinor3 {
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
     * @param s {SpinorE3}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    mul(s: SpinorE3): Spinor3 {
        return this.mul2(this, s)
    }
    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     * @method mul2
     * @param a {SpinorE3}
     * @param b {SpinorE3}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    mul2(a: SpinorE3, b: SpinorE3) {
        let a0 = a.α;
        let a1 = a.yz;
        let a2 = a.zx;
        let a3 = a.xy;
        let b0 = b.α;
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
     * @method neg
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    neg(): Spinor3 {
        this.α = -this.α
        this.yz = -this.yz
        this.zx = -this.zx
        this.xy = -this.xy
        return this
    }

    /**
     * <p>
     * <code>this ⟼ sqrt(this * conj(this))</code>
     * </p>
     * @method norm
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    norm(): Spinor3 {
        let norm = this.magnitudeSansUnits();
        return this.zero().addScalar(norm);
    }

    /**
     * <p>
     * <code>this ⟼ this / magnitude(this)</code>
     * </p>
     * @method direction
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    direction(): Spinor3 {
        let modulus = this.magnitudeSansUnits();
        this.yz = this.yz / modulus;
        this.zx = this.zx / modulus;
        this.xy = this.xy / modulus;
        this.α = this.α / modulus;
        return this;
    }


    /**
     * Sets this spinor to the identity element for multiplication, <b>1</b>.
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    one() {
        this.α = 1
        this.yz = 0
        this.zx = 0
        this.xy = 0
        return this
    }

    /**
     * <p>
     * <code>this ⟼ this * conj(this)</code>
     * </p>
     * @method quad
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    quad(): Spinor3 {
        return this.squaredNorm();
    }

    /**
     * @method squaredNorm
     * @return {Spinor3} <code>this * conj(this)</code>
     * @chainable
     */
    squaredNorm(): Spinor3 {
        let squaredNorm = this.squaredNormSansUnits()
        return this.zero().addScalar(squaredNorm)
    }

    /**
     * Intentionally undocumented.
     */
    squaredNormSansUnits(): number {
        return quadSpinor(this)
    }

    rco(rhs: SpinorE3): Spinor3 {
        return this.rco2(this, rhs)
    }

    rco2(a: SpinorE3, b: SpinorE3): Spinor3 {
        // FIXME: How to leverage? Maybe break up? Don't want performance hit.
        // scpG3(a, b, this)
        return this
    }

    /**
     * <p>
     * <code>this = (w, B) ⟼ (w, -B)</code>
     * </p>
     * @method reverse
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    rev(): Spinor3 {
        this.yz *= - 1;
        this.zx *= - 1;
        this.xy *= - 1;
        return this;
    }
    /**
     * Sets this Spinor to the value of its reflection in the plane orthogonal to n.
     * The geometric formula for bivector reflection is B' = n * B * n.
     * @method reflect
     * @param n {VectorE3}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    reflect(n: VectorE3): Spinor3 {
        let w = this.α;
        let yz = this.yz;
        let zx = this.zx;
        let xy = this.xy;
        let nx = n.x;
        let ny = n.y;
        let nz = n.z;
        let nn = nx * nx + ny * ny + nz * nz
        let nB = nx * yz + ny * zx + nz * xy
        this.α = nn * w
        this.xy = 2 * nz * nB - nn * xy
        this.yz = 2 * nx * nB - nn * yz
        this.zx = 2 * ny * nB - nn * zx
        return this;
    }
    /**
     * <p>
     * <code>this = ⟼ rotor * this * rev(rotor)</code>
     * </p>
     * @method rotate
     * @param rotor {SpinorE3}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    rotate(rotor: SpinorE3): Spinor3 {
        console.warn("Spinor3.rotate is not implemented")
        return this;
    }
    /**
     * <p>
     * Computes a rotor, R, from two vectors, where
     * R = (abs(b) * abs(a) + b * a) / sqrt(2 * (quad(b) * quad(a) + abs(b) * abs(a) * b << a))
     * </p>
     * @method rotor
     * @param a {VectorE3} The <em>from</em> vector.
     * @param b {VectorE3} The <em>to</em> vector.
     * @return {Spinor3} <code>this</code> The rotor representing a rotation from a to b.
     * @chainable
     */
    rotorFromDirections(a: VectorE3, b: VectorE3): Spinor3 {
        return rotorFromDirections(a, b, quadVector, dotVector, this)
    }

    /**
     * <p>
     * <code>this = ⟼ exp(- dual(a) * θ / 2)</code>
     * </p>
     * @method rotorFromAxisAngle
     * @param axis {VectorE3}
     * @param θ {number}
     * @return {Spinor3} <code>this</code>
     */
    rotorFromAxisAngle(axis: VectorE3, θ: number): Spinor3 {
        let φ = θ / 2
        let s = sin(φ)
        this.yz = -axis.x * s
        this.zx = -axis.y * s
        this.xy = -axis.z * s
        this.α = cos(φ)
        return this
    }

    /**
     * <p>
     * <code>this = ⟼ exp(- B * θ / 2)</code>
     * </p>
     * @method rotorFromGeneratorAngle
     * @param B {SpinorE3}
     * @param θ {number}
     * @return {Spinor3} <code>this</code>
     */
    rotorFromGeneratorAngle(B: SpinorE3, θ: number): Spinor3 {
        let φ = θ / 2
        let s = sin(φ)
        this.yz = -B.yz * s
        this.zx = -B.zx * s
        this.xy = -B.xy * s
        this.α = cos(φ)
        return this
    }

    scp(rhs: SpinorE3): Spinor3 {
        return this.scp2(this, rhs)
    }
    scp2(a: SpinorE3, b: SpinorE3): Spinor3 {
        // FIXME: How to leverage? Maybe break up? Don't want performance hit.
        // scpG3(a, b, this)
        return this
    }
    /**
     * <p>
     * <code>this ⟼ this * α</code>
     * </p>
     * @method scale
     * @param α {number}
     * @return {Spinor3} <code>this</code>
     */
    scale(α: number): Spinor3 {
        mustBeNumber('α', α)
        this.yz *= α;
        this.zx *= α;
        this.xy *= α;
        this.α *= α;
        return this;
    }

    slerp(target: SpinorE3, α: number): Spinor3 {
        var Vector2 = Spinor3.copy(target)
        var Vector1 = this.clone()
        var R = Vector2.mul(Vector1.inv())
        R.log()
        R.scale(α)
        R.exp()
        this.copy(R)
        return this
    }

    /**
     * <p>
     * <code>this ⟼ this - s * α</code>
     * </p>
     * @method sub
     * @param s {SpinorE3}
     * @param [α = 1] {number}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    sub(s: SpinorE3, α = 1): Spinor3 {
        mustBeObject('s', s)
        mustBeNumber('α', α)
        this.yz -= s.yz * α
        this.zx -= s.zx * α
        this.xy -= s.xy * α
        this.α -= s.α * α
        return this
    }
    /**
     * <p>
     * <code>this ⟼ a - b</code>
     * </p>
     * @method sub2
     * @param a {SpinorE3}
     * @param b {SpinorE3}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    sub2(a: SpinorE3, b: SpinorE3): Spinor3 {
        this.yz = a.yz - b.yz
        this.zx = a.zx - b.zx
        this.xy = a.xy - b.xy
        this.α = a.α - b.α
        return this;
    }
    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     * Sets this Spinor3 to the geometric product a * b of the vector arguments.
     *
     * @method versor
     * @param a {VectorE3}
     * @param b {VectorE3}
     * @return {Spinor3}
     */
    versor(a: VectorE3, b: VectorE3) {

        const ax = a.x
        const ay = a.y
        const az = a.z
        const bx = b.x
        const by = b.y
        const bz = b.z

        this.α = dotVectorCartesianE3(ax, ay, az, bx, by, bz)
        this.yz = wedgeYZ(ax, ay, az, bx, by, bz)
        this.zx = wedgeZX(ax, ay, az, bx, by, bz)
        this.xy = wedgeXY(ax, ay, az, bx, by, bz)

        return this
    }

    grade(grade: number): Spinor3 {
        mustBeInteger('grade', grade)
        switch (grade) {
            case 0: {
                this.yz = 0;
                this.zx = 0;
                this.xy = 0;
            }
                break;
            case 2: {
                this.α = 0;
            }
                break;
            default: {
                this.α = 0;
                this.yz = 0;
                this.zx = 0;
                this.xy = 0;
            }
        }
        return this;
    }

    toExponential(): string {
        // FIXME: Do like others.
        return this.toString()
    }
    toFixed(digits?: number): string {
        // FIXME: Do like others.
        return this.toString()
    }
    /**
     * @method toString
     * @return {string} A non-normative string representation of the target.
     */
    toString(): string {
        return "Spinor3({yz: " + this.yz + ", zx: " + this.zx + ", xy: " + this.xy + ", w: " + this.α + "})"
    }
    ext(rhs: SpinorE3): Spinor3 {
        return this.ext2(this, rhs)
    }
    ext2(a: SpinorE3, b: SpinorE3): Spinor3 {
        // FIXME: How to leverage? Maybe break up? Don't want performance hit.
        // scpG3(a, b, this)
        return this
    }

    /**
     * Sets this spinor to the identity element for addition, <b>0</b>.
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    zero(): Spinor3 {
        this.α = 0
        this.yz = 0
        this.zx = 0
        this.xy = 0
        return this
    }

    /**
     * @method copy
     * @param spinor {SpinorE3}
     * @return {Spinor3} A copy of the <code>spinor</code> argument.
     * @static
     */
    static copy(spinor: SpinorE3): Spinor3 {
        return new Spinor3().copy(spinor)
    }

    /**
     * Computes I * <code>v</code>, the dual of <code>v</code>.
     * @method dual
     * @param v {VectorE3}
     * @return {Spinor3}
     */
    static dual(v: VectorE3): Spinor3 {
        return new Spinor3().dual(v)
    }

    /**
     * @method lerp
     * @param a {SpinorE3}
     * @param b {SpinorE3}
     * @param α {number}
     * @return {Spinor3} <code>a + α * (b - a)</code>
     * @static
     */
    static lerp(a: SpinorE3, b: SpinorE3, α: number): Spinor3 {
        return Spinor3.copy(a).lerp(b, α)
    }

    /**
     * Computes the rotor that rotates vector <code>a</code> to vector <code>b</code>.
     * @method rotorFromDirections
     * @param a {VectorE3} The <em>from</em> vector.
     * @param b {VectorE3} The <em>to</em> vector.
     * @return {Spinor3}
     * @static
     */
    static rotorFromDirections(a: VectorE3, b: VectorE3): Spinor3 {
        return new Spinor3().rotorFromDirections(a, b)
    }
}
