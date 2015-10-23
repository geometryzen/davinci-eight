import cartesianQuaditudeE3 = require('../math/cartesianQuaditudeE3')
import Euclidean3 = require('../math/Euclidean3')
import euclidean3Quaditude1Arg = require('../math/euclidean3Quaditude1Arg')
import euclidean3Quaditude2Arg = require('../math/euclidean3Quaditude2Arg')
import expectArg = require('../checks/expectArg')
import GeometricElement = require('../math/GeometricElement')
import mustBeNumber = require('../checks/mustBeNumber')
import mustBeObject = require('../checks/mustBeObject')
import Mutable = require('../math/Mutable')
import SpinorE3 = require('../math/SpinorE3')
import VectorE3 = require('../math/VectorE3')
import VectorN = require('../math/VectorN')
import wedgeXY = require('../math/wedgeXY')
import wedgeYZ = require('../math/wedgeYZ')
import wedgeZX = require('../math/wedgeZX')

let exp = Math.exp
let cos = Math.cos
let sin = Math.sin

/**
 * @class MutableSpinorE3
 * @extends VectorN<number>
 */
class MutableSpinorE3 extends VectorN<number> implements SpinorE3, Mutable<number[]>, GeometricElement<SpinorE3, MutableSpinorE3, MutableSpinorE3, VectorE3, VectorE3>
{
    /**
     * @class MutableSpinorE3
     * @constructor
     * @param data [number[] = [0, 0, 0, 1]] Corresponds to the basis e2e3, e3e1, e1e2, 1
     * @param modified [boolean = false]
     */
    constructor(data: number[] = [0, 0, 0, 1], modified: boolean = false) {
        super(data, modified, 4)
    }
    /**
     * @property yz
     * @type Number
     */
    get yz(): number {
        return this.data[0]
    }
    set yz(yz: number) {
        mustBeNumber('yz', yz)
        this.modified = this.modified || this.yz !== yz
        this.data[0] = yz;
    }
    /**
     * @property zx
     * @type Number
     */
    get zx(): number {
        return this.data[1];
    }
    set zx(zx: number) {
        mustBeNumber('zx', zx)
        this.modified = this.modified || this.zx !== zx;
        this.data[1] = zx;
    }
    /**
     * @property xy
     * @type Number
     */
    get xy(): number {
        return this.data[2];
    }
    set xy(xy: number) {
        mustBeNumber('xy', xy)
        this.modified = this.modified || this.xy !== xy;
        this.data[2] = xy;
    }
    /**
     * @property w
     * @type Number
     */
    get w(): number {
        return this.data[3];
    }
    set w(w: number) {
        mustBeNumber('w', w)
        this.modified = this.modified || this.w !== w;
        this.data[3] = w;
    }
    /**
     * <p>
     * <code>this ⟼ this + α * spinor</code>
     * </p>
     * @method add
     * @param spinor {SpinorE3}
     * @param α [number = 1]
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    add(spinor: SpinorE3, α: number = 1): MutableSpinorE3 {
        mustBeObject('spinor', spinor)
        mustBeNumber('α', α)
        this.yz += spinor.yz * α
        this.zx += spinor.zx * α
        this.xy += spinor.xy * α
        this.w += spinor.w * α
        return this
    }
    /**
     * <p>
     * <code>this ⟼ a + b</code>
     * </p>
     * @method add2
     * @param a {SpinorE3}
     * @param b {SpinorE3}
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    add2(a: SpinorE3, b: SpinorE3): MutableSpinorE3 {
        this.w = a.w + b.w
        this.yz = a.yz + b.yz
        this.zx = a.zx + b.zx
        this.xy = a.xy + b.xy
        return this;
    }
    /**
     * @method clone
     * @return {MutableSpinorE3} A copy of <code>this</code>.
     * @chainable
     */
    clone(): MutableSpinorE3 {
        return new MutableSpinorE3([this.yz, this.zx, this.xy, this.w])
    }
    /**
     * <p>
     * <code>this ⟼ (w, -B)</code>
     * </p>
     * @method conj
     * @return {MutableSpinorE3} <code>this</code>
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
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    copy(spinor: SpinorE3): MutableSpinorE3 {
        mustBeObject('spinor', spinor)
        this.yz = mustBeNumber('spinor.yz', spinor.yz)
        this.zx = mustBeNumber('spinor.zx', spinor.zx)
        this.xy = mustBeNumber('spinor.xy', spinor.xy)
        this.w = mustBeNumber('spinor.w', spinor.w)
        return this;
    }
    /**
     * <p>
     * <code>this ⟼ this / s</code>
     * </p>
     * @method divide
     * @param s {SpinorE3}
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    divide(s: SpinorE3): MutableSpinorE3 {
        return this.multiply2(this, s)
    }
    /**
     * <p>
     * <code>this ⟼ a / b</code>
     * </p>
     * @method divide2
     * @param a {SpinorE3}
     * @param b {SpinorE3}
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    divide2(a: SpinorE3, b: SpinorE3) {
        let a0 = a.w;
        let a1 = a.yz;
        let a2 = a.zx;
        let a3 = a.xy;
        let b0 = b.w;
        let b1 = b.yz;
        let b2 = b.zx;
        let b3 = b.xy;
        // Compare this to the product for Quaternions
        // It would be interesting to DRY this out.
        this.w = a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3;
        // this.w = a0 * b0 - cartesianQuaditudeE3(a1, a2, a3, b1, b2, b3)
        this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
        this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
        this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
        return this;
    }
    /**
     * <p>
     * <code>this ⟼ this / α</code>
     * </p>
     * @method divideByScalar
     * @param α {number}
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    divideByScalar(α: number): MutableSpinorE3 {
        this.yz /= α
        this.zx /= α
        this.xy /= α
        this.w /= α
        return this
    }
    /**
     * <p>
     * <code>this ⟼ dual(v) = I * v</code>
     * </p>
     * Notice that the dual of a vector is related to the spinor by the right-hand rule.
     * @method dual
     * @param v {VectorE3} The vector whose dual will be used to set this spinor.
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    dual(v: VectorE3): MutableSpinorE3 {
        mustBeObject('v', v)
        this.yz = mustBeNumber('v.x', v.x)
        this.zx = mustBeNumber('v.y', v.y)
        this.xy = mustBeNumber('v.z', v.z)
        this.w = 0
        return this
    }
    /**
     * <p>
     * <code>this ⟼ e<sup>this</sup></code>
     * </p>
     * @method exp
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    exp(): MutableSpinorE3 {
        let w = this.w
        let x = this.yz
        let y = this.zx
        let z = this.xy
        let expW = exp(w)
        // φ is actually the absolute value of one half the rotation angle.
        // The orientation of the rotation gets carried in the bivector components.
        let φ = Math.sqrt(x * x + y * y + z * z)
        let s = expW * (φ !== 0 ? sin(φ) / φ : 1)
        this.w = expW * cos(φ);
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
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    inv() {
        this.conj()
        this.divideByScalar(this.quaditude());
        return this
    }
    /**
     * <p>
     * <code>this ⟼ this + α * (target - this)</code>
     * </p>
     * @method lerp
     * @param target {SpinorE3}
     * @param α {number}
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    // FIXME: Should really be slerp?
    lerp(target: SpinorE3, α: number): MutableSpinorE3 {
        var R2 = MutableSpinorE3.copy(target)
        var R1 = this.clone()
        var R = R2.multiply(R1.inv())
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
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    lerp2(a: SpinorE3, b: SpinorE3, α: number): MutableSpinorE3 {
        this.sub2(b, a).scale(α).add(a)
        return this
    }
    /**
     * <p>
     * <code>this ⟼ log(this)</code>
     * </p>
     * @method log
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    log(): MutableSpinorE3 {
        let w = this.w
        let x = this.yz
        let y = this.zx
        let z = this.xy
        let bb = x * x + y * y + z * z
        let R2 = Math.sqrt(bb)
        let R0 = Math.abs(w)
        let R = Math.sqrt(w * w + bb)
        this.w = Math.log(R)
        let f = Math.atan2(R2, R0) / R2
        this.yz = x * f
        this.zx = y * f
        this.xy = z * f
        return this;
    }
    magnitude() {
        return Math.sqrt(this.quaditude());
    }
    /**
     * <p>
     * <code>this ⟼ this * s</code>
     * </p>
     * @method multiply
     * @param s {SpinorE3}
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    multiply(s: SpinorE3): MutableSpinorE3 {
        return this.multiply2(this, s)
    }
    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     * @method multiply2
     * @param a {SpinorE3}
     * @param b {SpinorE3}
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    multiply2(a: SpinorE3, b: SpinorE3) {
        let a0 = a.w;
        let a1 = a.yz;
        let a2 = a.zx;
        let a3 = a.xy;
        let b0 = b.w;
        let b1 = b.yz;
        let b2 = b.zx;
        let b3 = b.xy;
        // Compare this to the product for Quaternions
        // It would be interesting to DRY this out.
        this.w = a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3;
        // this.w = a0 * b0 - cartesianQuaditudeE3(a1, a2, a3, b1, b2, b3)
        this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
        this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
        this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
        return this;
    }
    /**
    * <p>
    * <code>this ⟼ sqrt(this * conj(this))</code>
    * </p>
    * @method norm
    * @return {MutableSpinorE3} <code>this</code>
    * @chainable
    */
    norm(): MutableSpinorE3 {
        this.w = this.magnitude()
        this.yz = 0
        this.zx = 0
        this.xy = 0
        return this
    }
    /**
     * <p>
     * <code>this ⟼ this / magnitude(this)</code>
     * </p>
     * @method normalize
     * @return {MutableQuaternion} <code>this</code>
     * @chainable
     */
    normalize(): MutableSpinorE3 {
        let modulus = this.magnitude()
        this.yz = this.yz / modulus
        this.zx = this.zx / modulus
        this.xy = this.xy / modulus
        this.w = this.w / modulus
        return this
    }
    /**
     * <p>
     * <code>this ⟼ this * α</code>
     * </p>
     * @method scale
     * @param α {number}
     * @return {MutableSpinorE3} <code>this</code>
     */
    scale(α: number): MutableSpinorE3 {
        mustBeNumber('α', α)
        this.yz *= α;
        this.zx *= α;
        this.xy *= α;
        this.w *= α;
        return this;
    }
    /**
     * @method quaditude
     * @return {number} <code>this * conj(this)</code>
     */
    quaditude(): number {
        let w = this.w;
        let yz = this.yz;
        let zx = this.zx;
        let xy = this.xy;
        return w * w + yz * yz + zx * zx + xy * xy;
    }
    /**
     * <p>
     * <code>this = (w, B) ⟼ (w, -B)</code>
     * </p>
     * @method reverse
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    reverse(): MutableSpinorE3 {
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
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    reflect(n: VectorE3): MutableSpinorE3 {
        let w = this.w;
        let yz = this.yz;
        let zx = this.zx;
        let xy = this.xy;
        let nx = n.x;
        let ny = n.y;
        let nz = n.z;
        let nn = nx * nx + ny * ny + nz * nz
        let nB = nx * yz + ny * zx + nz * xy
        this.w = nn * w
        this.xy = 2 * nz * nB - nn * xy
        this.yz = 2 * nx * nB - nn * yz
        this.zx = 2 * ny * nB - nn * zx
        return this;
    }
    /**
     * <p>
     * <code>this = ⟼ rotor * this * reverse(rotor)</code>
     * </p>
     * @method rotate
     * @param rotor {SpinorE3}
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    rotate(rotor: SpinorE3): MutableSpinorE3 {
        console.warn("MutableSpinorE3.rotate is not implemented")
        return this;
    }
    /**
     * <p>
     * Computes a rotor, R, from two unit vectors, where
     * R = (1 + b * a) / sqrt(2 * (1 + b << a))
     * </p>
     * @method rotor
     * @param b {VectorE3} The ending unit vector
     * @param a {VectorE3} The starting unit vector
     * @return {MutableSpinorE3} <code>this</code> The rotor representing a rotation from a to b.
     * @chainable
     */
    rotor(b: VectorE3, a: VectorE3): MutableSpinorE3 {
        this.spinor(b, a)
        this.w += 1
        var denom = Math.sqrt(2 * (1 + euclidean3Quaditude2Arg(b, a)))
        this.divideByScalar(denom)
        return this;
    }
    /**
     * <p>
     * <code>this = ⟼ exp(- dual(a) * θ / 2)</code>
     * </p>
     * @method rotorFromAxisAngle
     * @param axis {VectorE3}
     * @param θ {number}
     * @return {MutableSpinorE3} <code>this</code>
     */
    rotorFromAxisAngle(axis: VectorE3, θ: number): MutableSpinorE3 {
        let φ = θ / 2
        let s = sin(φ)
        this.yz = -axis.x * s
        this.zx = -axis.y * s
        this.xy = -axis.z * s
        this.w = cos(φ)
        return this
    }

    /**
     * <p>
     * <code>this ⟼ this - s * α</code>
     * </p>
     * @method sub
     * @param s {SpinorE3}
     * @param α [number = 1]
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    sub(s: SpinorE3, α: number = 1): MutableSpinorE3 {
        mustBeObject('s', s)
        mustBeNumber('α', α)
        this.yz -= s.yz * α
        this.zx -= s.zx * α
        this.xy -= s.xy * α
        this.w -= s.w * α
        return this
    }
    /**
     * <p>
     * <code>this ⟼ a - b</code>
     * </p>
     * @method sub2
     * @param a {SpinorE3}
     * @param b {SpinorE3}
     * @return {MutableSpinorE3} <code>this</code>
     * @chainable
     */
    sub2(a: SpinorE3, b: SpinorE3): MutableSpinorE3 {
        this.yz = a.yz - b.yz
        this.zx = a.zx - b.zx
        this.xy = a.xy - b.xy
        this.w = a.w - b.w
        return this;
    }
    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     * Sets this MutableSpinorE3 to the geometric product a * b of the vector arguments. 
     * @method spinor
     * @param a {VectorE3}
     * @param b {VectorE3}
     * @return {MutableSpinorE3}
     */
    spinor(a: VectorE3, b: VectorE3) {

        let ax = a.x
        let ay = a.y
        let az = a.z
        let bx = b.x
        let by = b.y
        let bz = b.z

        this.w = cartesianQuaditudeE3(ax, ay, az, bx, by, bz)
        this.yz = wedgeYZ(ax, ay, az, bx, by, bz)
        this.zx = wedgeZX(ax, ay, az, bx, by, bz)
        this.xy = wedgeXY(ax, ay, az, bx, by, bz)

        return this
    }
    /**
     * @method toString
     * @return {string} A non-normative string representation of the target.
     */
    toString(): string {
        return "MutableSpinorE3({yz: " + this.yz + ", zx: " + this.zx + ", xy: " + this.xy + ", w: " + this.w + "})"
    }
    /**
     * @method copy
     * @param spinor {SpinorE3}
     * @return {MutableSpinorE3} A copy of the <code>spinor</code> argument.
     * @static
     */
    static copy(spinor: SpinorE3): MutableSpinorE3 {
        return new MutableSpinorE3().copy(spinor);
    }
    /**
     * @method lerp
     * @param a {SpinorE3}
     * @param b {SpinorE3}
     * @param α {number}
     * @return {MutableSpinorE3} <code>a + α * (b - a)</code>
     * @static
     */
    static lerp(a: SpinorE3, b: SpinorE3, α: number): MutableSpinorE3 {
        return MutableSpinorE3.copy(a).lerp(b, α)
    }
}

export = MutableSpinorE3;
