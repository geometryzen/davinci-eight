import dotVectorCartesianE3 = require('../math/dotVectorCartesianE3')
import copyToArray = require('../collections/copyToArray')
import dotVector = require('../math/dotVectorE3')
import MutableGeometricElement3D = require('../math/MutableGeometricElement3D')
import mustBeInteger = require('../checks/mustBeInteger')
import mustBeNumber = require('../checks/mustBeNumber')
import mustBeObject = require('../checks/mustBeObject')
import Mutable = require('../math/Mutable')
import quadSpinor = require('../math/quadSpinorE3')
import quadVector = require('../math/quadVectorE3')
import rotorFromDirections = require('../math/rotorFromDirections')
import scpG3 = require('../math/scpG3')
import SpinorE3 = require('../math/SpinorE3')
import TrigMethods = require('../math/TrigMethods')
import VectorE3 = require('../math/VectorE3')
import VectorN = require('../math/VectorN')
import wedgeXY = require('../math/wedgeXY')
import wedgeYZ = require('../math/wedgeYZ')
import wedgeZX = require('../math/wedgeZX')

// Symbolic constants for the coordinate indices into the coords array.
let COORD_YZ = 0
let COORD_ZX = 1
let COORD_XY = 2
let COORD_SCALAR = 3

function one(): number[] {
    let coords = [0, 0, 0, 0]
    coords[COORD_SCALAR] = 1
    return coords
}

let exp = Math.exp
let cos = Math.cos
let sin = Math.sin
let sqrt = Math.sqrt

/**
 * @class SpinG3
 * @extends VectorN<number>
 */
class SpinG3 extends VectorN<number> implements SpinorE3, Mutable<number[]>, MutableGeometricElement3D<SpinorE3, SpinG3, SpinG3, VectorE3>
{
    /**
     * Constructs a <code>SpinG3</code> from a <code>number[]</code>.
     * For a <em>geometric</em> implementation, use the static methods.
     * @class SpinG3
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
     * @param α [number = 1]
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    add(spinor: SpinorE3, α: number = 1): SpinG3 {
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
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    add2(a: SpinorE3, b: SpinorE3): SpinG3 {
        this.α = a.α + b.α
        this.yz = a.yz + b.yz
        this.zx = a.zx + b.zx
        this.xy = a.xy + b.xy
        return this;
    }

    /**
     * Intentionally undocumented.
     */
    addPseudo(β: number): SpinG3 {
        mustBeNumber('β', β)
        return this
    }

    /**
     * <p>
     * <code>this ⟼ this + α</code>
     * </p>
     * @method addScalar
     * @param α {number}
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    addScalar(α: number): SpinG3 {
        mustBeNumber('α', α)
        this.α += α
        return this
    }

    /**
     * @method adj
     * @return {number}
     * @beta
     */
    adj(): SpinG3 {
        throw new Error('TODO: SpinG3.adj')
    }

    /**
     * @method angle
     * @return {SpinG3}
     */
    angle(): SpinG3 {
        return this.log().grade(2);
    }

    /**
     * @method clone
     * @return {SpinG3} A copy of <code>this</code>.
     * @chainable
     */
    clone(): SpinG3 {
        return SpinG3.copy(this)
    }

    /**
     * <p>
     * <code>this ⟼ (w, -B)</code>
     * </p>
     * @method conj
     * @return {SpinG3} <code>this</code>
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
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    copy(spinor: SpinorE3): SpinG3 {
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
     * @return {SpinG3}
     * @chainable
     */
    copyScalar(α: number): SpinG3 {
        return this.zero().addScalar(α)
    }

    /**
     * Intentionally undocumented.
     */
    copySpinor(s: SpinorE3): SpinG3 {
        return this.copy(s);
    }

    /**
     * Intentionally undocumented.
     */
    copyVector(vector: VectorE3): SpinG3 {
        return this.zero()
    }

    /**
     * <p>
     * <code>this ⟼ this / s</code>
     * </p>
     * @method div
     * @param s {SpinorE3}
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    div(s: SpinorE3): SpinG3 {
        return this.div2(this, s)
    }

    /**
     * <p>
     * <code>this ⟼ a / b</code>
     * </p>
     * @method div2
     * @param a {SpinorE3}
     * @param b {SpinorE3}
     * @return {SpinG3} <code>this</code>
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
        // How does this compare to G3
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
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    divByScalar(α: number): SpinG3 {
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
     * @return {SpinG3} <code>this</code>
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
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    exp(): SpinG3 {
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
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    inv() {
        this.conj()
        this.divByScalar(this.squaredNorm());
        return this
    }

    lco(rhs: SpinorE3): SpinG3 {
        return this.lco2(this, rhs)
    }

    lco2(a: SpinorE3, b: SpinorE3): SpinG3 {
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
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    // FIXME: Should really be slerp?
    lerp(target: SpinorE3, α: number): SpinG3 {
        var R2 = SpinG3.copy(target)
        var R1 = this.clone()
        var R = R2.mul(R1.inv())
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
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    lerp2(a: SpinorE3, b: SpinorE3, α: number): SpinG3 {
        this.sub2(b, a).scale(α).add(a)
        return this
    }
    /**
     * <p>
     * <code>this ⟼ log(this)</code>
     * </p>
     * @method log
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    log(): SpinG3 {
        // FIXME: Wrong
        let w = this.α
        let x = this.yz
        let y = this.zx
        let z = this.xy
        // FIXME: DRY
        let bb = x * x + y * y + z * z
        let R2 = sqrt(bb)
        let R0 = Math.abs(w)
        let R = sqrt(w * w + bb)
        this.α = Math.log(R)
        let θ = Math.atan2(R2, R0) / R2
        // The angle, θ, produced by atan2 will be in the range [-π, +π]
        this.yz = x * θ
        this.zx = y * θ
        this.xy = z * θ
        return this;
    }

    /**
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     * @method magnitude
     * @return {number}
     */
    magnitude(): number {
        return sqrt(this.squaredNorm());
    }

    /**
     * <p>
     * <code>this ⟼ this * s</code>
     * </p>
     * @method mul
     * @param s {SpinorE3}
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    mul(s: SpinorE3): SpinG3 {
        return this.mul2(this, s)
    }
    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     * @method mul2
     * @param a {SpinorE3}
     * @param b {SpinorE3}
     * @return {SpinG3} <code>this</code>
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
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    neg(): SpinG3 {
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
    * @return {SpinG3} <code>this</code>
    * @chainable
    */
    norm(): SpinG3 {
        let norm = this.magnitude()
        return this.zero().addScalar(norm)
    }

    /**
     * <p>
     * <code>this ⟼ this / magnitude(this)</code>
     * </p>
     * @method direction
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    direction(): SpinG3 {
        let modulus = this.magnitude()
        this.yz = this.yz / modulus
        this.zx = this.zx / modulus
        this.xy = this.xy / modulus
        this.α = this.α / modulus
        return this
    }


    /**
     * Sets this spinor to the identity element for multiplication, <b>1</b>.
     * @return {SpinG3} <code>this</code>
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
    * @return {SpinG3} <code>this</code>
    * @chainable
    */
    quad(): SpinG3 {
        let squaredNorm = this.squaredNorm()
        return this.zero().addScalar(squaredNorm)
    }
    /**
     * @method squaredNorm
     * @return {number} <code>this * conj(this)</code>
     */
    squaredNorm(): number {
        return quadSpinor(this)
    }

    rco(rhs: SpinorE3): SpinG3 {
        return this.rco2(this, rhs)
    }

    rco2(a: SpinorE3, b: SpinorE3): SpinG3 {
        // FIXME: How to leverage? Maybe break up? Don't want performance hit.
        // scpG3(a, b, this)
        return this
    }

    /**
     * <p>
     * <code>this = (w, B) ⟼ (w, -B)</code>
     * </p>
     * @method reverse
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    rev(): SpinG3 {
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
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    reflect(n: VectorE3): SpinG3 {
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
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    rotate(rotor: SpinorE3): SpinG3 {
        console.warn("SpinG3.rotate is not implemented")
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
     * @return {SpinG3} <code>this</code> The rotor representing a rotation from a to b.
     * @chainable
     */
    rotorFromDirections(a: VectorE3, b: VectorE3): SpinG3 {
        return rotorFromDirections(a, b, quadVector, dotVector, this)
    }

    /**
     * <p>
     * <code>this = ⟼ exp(- dual(a) * θ / 2)</code>
     * </p>
     * @method rotorFromAxisAngle
     * @param axis {VectorE3}
     * @param θ {number}
     * @return {SpinG3} <code>this</code>
     */
    rotorFromAxisAngle(axis: VectorE3, θ: number): SpinG3 {
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
     * @return {SpinG3} <code>this</code>
     */
    rotorFromGeneratorAngle(B: SpinorE3, θ: number): SpinG3 {
        let φ = θ / 2
        let s = sin(φ)
        this.yz = -B.yz * s
        this.zx = -B.zx * s
        this.xy = -B.xy * s
        this.α = cos(φ)
        return this
    }

    scp(rhs: SpinorE3): SpinG3 {
        return this.scp2(this, rhs)
    }
    scp2(a: SpinorE3, b: SpinorE3): SpinG3 {
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
     * @return {SpinG3} <code>this</code>
     */
    scale(α: number): SpinG3 {
        mustBeNumber('α', α)
        this.yz *= α;
        this.zx *= α;
        this.xy *= α;
        this.α *= α;
        return this;
    }

    slerp(target: SpinorE3, α: number): SpinG3 {
        var R2 = SpinG3.copy(target)
        var R1 = this.clone()
        var R = R2.mul(R1.inv())
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
     * @param α [number = 1]
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    sub(s: SpinorE3, α: number = 1): SpinG3 {
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
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    sub2(a: SpinorE3, b: SpinorE3): SpinG3 {
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
     * Sets this SpinG3 to the geometric product a * b of the vector arguments. 
     * @method spinor
     * @param a {VectorE3}
     * @param b {VectorE3}
     * @return {SpinG3}
     */
    spinor(a: VectorE3, b: VectorE3) {

        let ax = a.x
        let ay = a.y
        let az = a.z
        let bx = b.x
        let by = b.y
        let bz = b.z

        this.α = dotVectorCartesianE3(ax, ay, az, bx, by, bz)
        this.yz = wedgeYZ(ax, ay, az, bx, by, bz)
        this.zx = wedgeZX(ax, ay, az, bx, by, bz)
        this.xy = wedgeXY(ax, ay, az, bx, by, bz)

        return this
    }

    grade(grade: number): SpinG3 {
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
        return "SpinG3({yz: " + this.yz + ", zx: " + this.zx + ", xy: " + this.xy + ", w: " + this.α + "})"
    }
    ext(rhs: SpinorE3): SpinG3 {
        return this.ext2(this, rhs)
    }
    ext2(a: SpinorE3, b: SpinorE3): SpinG3 {
        // FIXME: How to leverage? Maybe break up? Don't want performance hit.
        // scpG3(a, b, this)
        return this
    }

    /**
     * Sets this spinor to the identity element for addition, <b>0</b>.
     * @return {SpinG3} <code>this</code>
     * @chainable
     */
    zero(): SpinG3 {
        this.α = 0
        this.yz = 0
        this.zx = 0
        this.xy = 0
        return this
    }

    /**
     * @method copy
     * @param spinor {SpinorE3}
     * @return {SpinG3} A copy of the <code>spinor</code> argument.
     * @static
     */
    static copy(spinor: SpinorE3): SpinG3 {
        return new SpinG3().copy(spinor)
    }

    /**
     * Computes I * <code>v</code>, the dual of <code>v</code>.
     * @method dual
     * @param v {VectorE3}
     * @return {SpinG3}
     */
    static dual(v: VectorE3): SpinG3 {
        return new SpinG3().dual(v)
    }

    /**
     * @method lerp
     * @param a {SpinorE3}
     * @param b {SpinorE3}
     * @param α {number}
     * @return {SpinG3} <code>a + α * (b - a)</code>
     * @static
     */
    static lerp(a: SpinorE3, b: SpinorE3, α: number): SpinG3 {
        return SpinG3.copy(a).lerp(b, α)
    }

    /**
     * Computes the rotor that rotates vector <code>a</code> to vector <code>b</code>.
     * @method rotorFromDirections
     * @param a {VectorE3} The <em>from</em> vector.
     * @param b {VectorE3} The <em>to</em> vector.
     * @return {SpinG3}
     * @static
     */
    static rotorFromDirections(a: VectorE3, b: VectorE3): SpinG3 {
        return new SpinG3().rotorFromDirections(a, b)
    }
}

export = SpinG3;
