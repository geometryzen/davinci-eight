import Cartesian3 = require('../math/Cartesian3')
import cartesianQuaditudeE3 = require('../math/cartesianQuaditudeE3')
import VectorN = require('../math/VectorN')
import euclidean3Quaditude2Arg = require('../math/euclidean3Quaditude2Arg')
import expectArg = require('../checks/expectArg')
import GeometricElement = require('../math/GeometricElement')
import mustBeNumber = require('../checks/mustBeNumber')
import mustBeObject = require('../checks/mustBeObject')
import Mutable = require('../math/Mutable')
import euclidean3Quaditude1Arg = require('../math/euclidean3Quaditude1Arg')
import Spinor3Coords = require('../math/Spinor3Coords')
import wedgeXY = require('../math/wedgeXY')
import wedgeYZ = require('../math/wedgeYZ')
import wedgeZX = require('../math/wedgeZX')

let exp = Math.exp
let cos = Math.cos
let sin = Math.sin

/**
 * @class Spinor3
 * @extends VectorN<number>
 */
class Spinor3 extends VectorN<number> implements Spinor3Coords, Mutable<number[]>, GeometricElement<Spinor3Coords, Spinor3, Spinor3, Cartesian3, Cartesian3>
{
  /**
   * @class Spinor3
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
   * @param spinor {Spinor3Coords}
   * @param α [number = 1]
   * @return {Spinor3} <code>this</code>
   * @chainable
   */
  add(spinor: Spinor3Coords, α: number = 1): Spinor3 {
    mustBeObject('spinor', spinor)
    mustBeNumber('α', α)
    this.yz += spinor.yz * α
    this.zx += spinor.zx * α
    this.xy += spinor.xy * α
    this.w += spinor.w * α
    return this
  }
  /**
   * @method clone
   * @return {Spinor3} A copy of <code>this</code>.
   * @chainable
   */
  clone(): Spinor3 {
    return new Spinor3([this.yz, this.zx, this.xy, this.w])
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
   * @param spinor {Spinor3Coords}
   * @return {Spinor3} <code>this</code>
   * @chainable
   */
  copy(spinor: Spinor3Coords): Spinor3 {
    this.yz = spinor.yz;
    this.zx = spinor.zx;
    this.xy = spinor.xy;
    this.w = spinor.w;
    return this;
  }
  /**
   * <p>
   * <code>this ⟼ a - b</code>
   * </p>
   * @method diff
   * @param a {Spinor3Coords}
   * @param b {Spinor3Coords}
   * @return {Spinor3} <code>this</code>
   * @chainable
   */
  diff(a: Spinor3Coords, b: Spinor3Coords): Spinor3 {
    this.yz = a.yz - b.yz
    this.zx = a.zx - b.zx
    this.xy = a.xy - b.xy
    this.w = a.w - b.w
    return this;
  }
  /**
   * <p>
   * <code>this ⟼ this / α</code>
   * </p>
   * @method divideByScalar
   * @param α {number}
   * @return {Spinor3} <code>this</code>
   * @chainable
   */
  divideByScalar(α: number): Spinor3 {
    this.yz /= α
    this.zx /= α
    this.xy /= α
    this.w /= α
    return this
  }
  /**
   * <p>
   * <code>this ⟼ dual(this)</code>
   * </p>
   * Sets this Spinor to the value of the dual of the vector, I * v.
   * Notice that the dual of a vector is related to the spinor by the right-hand rule.
   * @method dual
   * @param vector {Cartesian3} The vector whose dual will be used to set this spinor.
   * @return {Spinor3} <code>this</code>
   * @chainable
   */
  dual(vector: Cartesian3): Spinor3 {
    this.yz = vector.x
    this.zx = vector.y
    this.xy = vector.z
    this.w = 0
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
   * @return {Spinor3} <code>this</code>
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
   * @param target {Spinor3Coords}
   * @param α {number}
   * @return {Spinor3} <code>this</code>
   * @chainable
   */
  // FIXME: Should really be slerp?
  lerp(target: Spinor3Coords, α: number): Spinor3 {
    var R2 = Spinor3.copy(target)
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
   * @param a {Spinor3Coords}
   * @param b {Spinor3Coords}
   * @param α {number}
   * @return {Spinor3} <code>this</code>
   * @chainable
   */
  lerp2(a: Spinor3Coords, b: Spinor3Coords, α: number): Spinor3 {
    this.diff(b, a).scale(α).add(a)
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
   * <code>this ⟼ this * rhs</code>
   * </p>
   * @method multiply
   * @param rhs {Spinor3Coords}
   * @return {Spinor3} <code>this</code>
   * @chainable
   */
  multiply(rhs: Spinor3Coords): Spinor3 {
    return this.product(this, rhs)
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
    this.w = this.magnitude()
    this.yz = 0
    this.zx = 0
    this.xy = 0
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
    this.yz *= α;
    this.zx *= α;
    this.xy *= α;
    this.w *= α;
    return this;
  }
  /**
   * <p>
   * <code>this ⟼ a * b</code>
   * </p>
   * @method product
   * @param a {Spinor3Coords}
   * @param b {Spinor3Coords}
   * @return {Spinor3} <code>this</code>
   * @chainable
   */
  product(a: Spinor3Coords, b: Spinor3Coords): Spinor3 {
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
    this.w  = a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3;
    this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
    this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
    this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
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
   * @return {Spinor3} <code>this</code>
   * @chainable
   */
  reverse(): Spinor3 {
    this.yz *= - 1;
    this.zx *= - 1;
    this.xy *= - 1;
    return this;
  }
  /**
   * Sets this Spinor to the value of its reflection in the plane orthogonal to n.
   * The geometric formula for bivector reflection is B' = n * B * n.
   * @method reflect
   * @param n {Cartesian3}
   * @return {Spinor3} <code>this</code>
   * @chainable
   */
  reflect(n: Cartesian3): Spinor3 {
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
   * @param rotor {Spinor3Coords}
   * @return {Spinor3} <code>this</code>
   * @chainable
   */
  rotate(rotor: Spinor3Coords): Spinor3 {
    console.warn("Spinor3.rotate is not implemented")
    return this;
  }
  /**
   * <p>
   * Computes a rotor, R, from two unit vectors, where
   * R = (1 + b * a) / sqrt(2 * (1 + b << a))
   * </p>
   * @method rotor
   * @param b {Cartesian3} The ending unit vector
   * @param a {Cartesian3} The starting unit vector
   * @return {Spinor3} <code>this</code> The rotor representing a rotation from a to b.
   * @chainable
   */
  rotor(b: Cartesian3, a: Cartesian3): Spinor3 {
    var bLength = Math.sqrt(euclidean3Quaditude1Arg(b))
    var aLength = Math.sqrt(euclidean3Quaditude1Arg(a))
    b = { x: b.x / bLength, y: b.y / bLength, z: b.z / bLength }
    a = { x: a.x / aLength, y: a.y / aLength, z: a.z / aLength }
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
   * @param axis {Cartesian3}
   * @param θ {number}
   * @return {Spinor3} <code>this</code>
   */
  rotorFromAxisAngle(axis: Cartesian3, θ: number): Spinor3 {
    //this.dual(a).scale(-θ/2).exp()
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
   * <code>this ⟼ this - rhs</code>
   * </p>
   * @method sub
   * @param rhs {Spinor3Coords}
   * @return {Spinor3} <code>this</code>
   * @chainable
   */
  sub(rhs: Spinor3Coords): Spinor3 {
    return this;
  }
  /**
   * <p>
   * <code>this ⟼ a + b</code>
   * </p>
   * @method sum
   * @param a {Spinor3Coords}
   * @param b {Spinor3Coords}
   * @return {Spinor3} <code>this</code>
   * @chainable
   */
  sum(a: Spinor3Coords, b: Spinor3Coords): Spinor3 {
    this.w = a.w + b.w
    this.yz = a.yz + b.yz
    this.zx = a.zx + b.zx
    this.xy = a.xy + b.xy
    return this;
  }
  /**
   * <p>
   * <code>this ⟼ a * b</code>
   * </p>
   * Sets this Spinor3 to the geometric product a * b of the vector arguments. 
   * @method spinor
   * @param a {Cartesian3}
   * @param b {Cartesian3}
   * @return {Spinor3}
   */
  spinor(a: Cartesian3, b: Cartesian3): Spinor3 {

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
    return "Spinor3({yz: " + this.yz + ", zx: " + this.zx + ", xy: " + this.xy + ", w: " + this.w + "})"
  }
  /**
   * @method copy
   * @param spinor {Spinor3Coords}
   * @return {Spinor3} A copy of the <code>spinor</code> argument.
   * @static
   */
  static copy(spinor: Spinor3Coords): Spinor3 {
    return new Spinor3().copy(spinor);
  }
  /**
   * @method lerp
   * @param a {Spinor3Coords}
   * @param b {Spinor3Coords}
   * @param α {number}
   * @return {Spinor3} <code>a + α * (b - a)</code>
   * @static
   */
  static lerp(a: Spinor3Coords, b: Spinor3Coords, α: number): Spinor3 {
    return Spinor3.copy(a).lerp(b, α)
  }
}

export = Spinor3;
