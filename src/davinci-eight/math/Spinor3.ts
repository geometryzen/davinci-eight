import CartesianG3 from './CartesianG3'
import Coords from './Coords';
import dotVectorCartesianE3 from './dotVectorCartesianE3';
import mulSpinorE3YZ from './mulSpinorE3YZ';
import mulSpinorE3ZX from './mulSpinorE3ZX';
import mulSpinorE3XY from './mulSpinorE3XY';
import mulSpinorE3alpha from './mulSpinorE3alpha';
import MutableGeometricElement from './MutableGeometricElement';
import mustBeInteger from '../checks/mustBeInteger';
import mustBeNumber from '../checks/mustBeNumber';
import mustBeObject from '../checks/mustBeObject';
import Mutable from './Mutable';
import quadSpinor from './quadSpinorE3';
import randomRange from './randomRange'
import readOnly from '../i18n/readOnly'
import rotorFromDirections from './rotorFromDirectionsE3';
import SpinorE3 from '../math/SpinorE3';
import toStringCustom from './toStringCustom';
import VectorE3 from './VectorE3';
import wedgeXY from './wedgeXY';
import wedgeYZ from './wedgeYZ';
import wedgeZX from './wedgeZX';

/**
 * @module EIGHT
 * @submodule math
 */

// Constants for the coordinate indices into the coords array.
const COORD_YZ = 0
const COORD_ZX = 1
const COORD_XY = 2
const COORD_SCALAR = 3
const BASIS_LABELS = ['e23', 'e31', 'e12', '1']

/**
 * Coordinates corresponding to basis labels.
 */
function coordinates(m: SpinorE3): number[] {
  return [m.yz, m.zx, m.xy, m.α]
}

const exp = Math.exp
const cos = Math.cos
const sin = Math.sin
const sqrt = Math.sqrt

const magicCode = Math.random()

/**
 * A <em>mutable</em> Geometric Number representing the even sub-algebra of G3.
 *
 * @class Spinor3
 * @extends Coords
 */
export default class Spinor3 extends Coords implements CartesianG3, SpinorE3, Mutable<number[]>, MutableGeometricElement<SpinorE3, Spinor3, Spinor3, VectorE3, number, number, number> {

  /**
   * @method constructor
   * @param coordinates {number[]}
   * @param code {number}
   * @private
   */
  constructor(coordinates: number[], code: number) {
    super(coordinates, false, 4)
    if (code !== magicCode) {
      throw new Error("Use the static creation methods instead of the constructor")
    }
  }

  /**
   * The coordinate corresponding to the <b>e</b><sub>23</sub> basis bivector.
   *
   * @property yz
   * @type Number
   */
  get yz(): number {
    return this._coords[COORD_YZ]
  }
  set yz(yz: number) {
    mustBeNumber('yz', yz)
    this.modified = this.modified || this.yz !== yz
    this._coords[COORD_YZ] = yz;
  }

  /**
   * The coordinate corresponding to the <b>e</b><sub>31</sub> basis bivector.
   *
   * @property zx
   * @type Number
   */
  get zx(): number {
    return this._coords[COORD_ZX];
  }
  set zx(zx: number) {
    mustBeNumber('zx', zx)
    this.modified = this.modified || this.zx !== zx;
    this._coords[COORD_ZX] = zx;
  }

  /**
   * The coordinate corresponding to the <b>e</b><sub>12</sub> basis bivector.
   *
   * @property xy
   * @type Number
   */
  get xy(): number {
    return this._coords[COORD_XY];
  }
  set xy(xy: number) {
    mustBeNumber('xy', xy)
    this.modified = this.modified || this.xy !== xy;
    this._coords[COORD_XY] = xy;
  }

  /**
   * The coordinate corresponding to the <b>1</b> basis scalar.
   *
   * @property alpha
   * @type Number
   */
  get alpha(): number {
    return this._coords[COORD_SCALAR];
  }
  set alpha(alpha: number) {
    mustBeNumber('alpha', alpha)
    this.modified = this.modified || this.alpha !== alpha;
    this._coords[COORD_SCALAR] = alpha;
  }

  /**
   * The coordinate corresponding to the <b>1</b> basis scalar.
   *
   * @property α
   * @type Number
   */
  get α(): number {
    return this._coords[COORD_SCALAR];
  }
  set α(α: number) {
    mustBeNumber('α', α)
    this.modified = this.modified || this.α !== α;
    this._coords[COORD_SCALAR] = α;
  }

  /**
   * @property maskG3
   * @type number
   * @readOnly
   */
  get maskG3(): number {
    const coords = this._coords
    const α = coords[COORD_SCALAR]
    const yz = coords[COORD_YZ]
    const zx = coords[COORD_ZX]
    const xy = coords[COORD_XY]
    let m = 0x0
    if (α !== 0) {
      m += 0x1
    }
    if (yz !== 0 || zx !== 0 || xy !== 0) {
      m += 0x4
    }
    return m
  }
  set maskG3(unused: number) {
    throw new Error(readOnly('maskG3').message)
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
   * @return {Spinor3}
   * @chainable
   * @beta
   */
  adj(): Spinor3 {
    throw new Error('TODO: Spinor3.adj')
  }

  /**
   * @method angle
   * @return {Spinor3}
   * @chainable
   */
  angle(): Spinor3 {
    return this.log().grade(2);
  }

  /**
   * @method approx
   * @param n {number}
   * @return {Spinor3}
   * @chainable
   */
  approx(n: number): Spinor3 {
    super.approx(n)
    return this
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
   *
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
   * <code>this ⟼ copy(source)</code>
   * </p>
   *
   * @method copy
   * @param source {SpinorE3}
   * @return {Spinor3} <code>this</code>
   * @chainable
   */
  copy(source: SpinorE3): Spinor3 {
    if (source) {
      this.yz = source.yz
      this.zx = source.zx
      this.xy = source.xy
      this.α = source.α
      return this
    }
    else {
      throw new Error("source for copy must be a spinor")
    }
  }

  /**
   * Sets this spinor to the value of the scalar, <code>α</code>.
   *
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
   *
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
   *
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
    // How does this compare to Geometric3
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
   *
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
   *
   * @method dual
   * @param v {VectorE3} The vector whose dual will be used to set this spinor.
   * @param changeSign {boolean}
   * @return {Spinor3} <code>this</code>
   * @chainable
   */
  dual(v: VectorE3, changeSign: boolean): Spinor3 {
    this.α = 0
    this.yz = v.x
    this.zx = v.y
    this.xy = v.z
    if (changeSign) {
      this.neg()
    }
    return this
  }

  equals(other: any): boolean {
    if (other instanceof Spinor3) {
      const that: Spinor3 = other
      return this.yz === that.yz && this.zx === that.zx && this.xy === that.xy && this.α === that.α
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
   *
   * @method inv
   * @return {Spinor3} <code>this</code>
   * @chainable
   */
  inv(): Spinor3 {
    this.conj()
    this.divByScalar(this.squaredNormSansUnits());
    return this
  }

  /**
   * @method isOne
   * @return {boolean} 
   */
  isOne(): boolean {
    return this.α === 1 && this.xy === 0 && this.yz === 0 && this.zx === 0
  }

  /**
   * @method isZero
   * @return {boolean} 
   */
  isZero(): boolean {
    return this.α === 0 && this.xy === 0 && this.yz === 0 && this.zx === 0
  }

  /**
   * @method lco
   * @param rhs {Spinor3}
   * @return {Spinor3}
   * @chainable
   */
  lco(rhs: SpinorE3): Spinor3 {
    return this.lco2(this, rhs)
  }

  /**
   *
   */
  lco2(a: SpinorE3, b: SpinorE3): Spinor3 {
    // FIXME: How to leverage? Maybe break up? Don't want performance hit.
    // scpG3(a, b, this)
    return this
  }

  /**
   * <p>
   * <code>this ⟼ this + α * (target - this)</code>
   * </p>
   *
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
   *
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
   *
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
   * <code>this ⟼ this * rhs</code>
   * </p>
   *
   * @method mul
   * @param rhs {SpinorE3}
   * @return {Spinor3} <code>this</code>
   * @chainable
   */
  mul(rhs: SpinorE3): Spinor3 {

    const α = mulSpinorE3alpha(this, rhs)
    const yz = mulSpinorE3YZ(this, rhs)
    const zx = mulSpinorE3ZX(this, rhs)
    const xy = mulSpinorE3XY(this, rhs)

    this.α = α
    this.yz = yz
    this.zx = zx
    this.xy = xy

    return this
  }

  /**
   * <p>
   * <code>this ⟼ a * b</code>
   * </p>
   *
   * @method mul2
   * @param a {SpinorE3}
   * @param b {SpinorE3}
   * @return {Spinor3} <code>this</code>
   * @chainable
   */
  mul2(a: SpinorE3, b: SpinorE3): Spinor3 {

    const α = mulSpinorE3alpha(a, b)
    const yz = mulSpinorE3YZ(a, b)
    const zx = mulSpinorE3ZX(a, b)
    const xy = mulSpinorE3XY(a, b)

    this.α = α
    this.yz = yz
    this.zx = zx
    this.xy = xy

    return this
  }

  /**
   * @method neg
   *
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
   *
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
   *
   * @method normalize
   * @return {Spinor3} <code>this</code>
   * @chainable
   */
  normalize(): Spinor3 {
    const m = this.magnitude()
    this.yz = this.yz / m
    this.zx = this.zx / m
    this.xy = this.xy / m
    this.α = this.α / m
    return this
  }


  /**
   * Sets this spinor to the identity element for multiplication, <b>1</b>.
   *
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
   *
   * @method quad
   * @return {Spinor3} <code>this</code>
   * @chainable
   */
  quad(): Spinor3 {
    const squaredNorm = this.squaredNormSansUnits()
    return this.zero().addScalar(squaredNorm)
  }

  /**
   * <p>
   * This method does not change this multivector.
   * </p>
   *
   * @method squaredNorm
   * @return {number}
   */
  squaredNorm(): number {
    return quadSpinor(this)
  }

  /**
   * Intentionally undocumented.
   */
  squaredNormSansUnits(): number {
    return quadSpinor(this)
  }

  /**
   * @method stress
   * @param σ {VectorE3}
   * @return {Spinor3}
   * @chainable
   */
  stress(σ: VectorE3): Spinor3 {
    // There is no change to the scalar coordinate, α.
    this.yz = this.yz * σ.y * σ.z
    this.zx = this.zx * σ.z * σ.x
    this.xy = this.xy * σ.x * σ.y
    return this
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
   *
   * @method rev
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
   *
   * @method reflect
   * @param n {VectorE3}
   * @return {Spinor3} <code>this</code>
   * @chainable
   */
  reflect(n: VectorE3) {
    const w = this.α;
    const yz = this.yz;
    const zx = this.zx;
    const xy = this.xy;
    const nx = n.x;
    const ny = n.y;
    const nz = n.z;
    const nn = nx * nx + ny * ny + nz * nz
    const nB = nx * yz + ny * zx + nz * xy
    this.α = nn * w
    this.xy = 2 * nz * nB - nn * xy
    this.yz = 2 * nx * nB - nn * yz
    this.zx = 2 * ny * nB - nn * zx
    return this;
  }

  /**
   * <p>
   * <code>this = ⟼ R * this * rev(R)</code>
   * </p>
   *
   * @method rotate
   * @param R {SpinorE3}
   * @return {Spinor3} <code>this</code>
   * @chainable
   */
  rotate(R: SpinorE3): Spinor3 {
    // R * this * rev(R) = R * rev(R * rev(this))
    this.rev()
    this.mul2(R, this)
    this.rev()
    this.mul2(R, this)
    return this
  }

  /**
   * <p>
   * Computes a rotor, R, from two vectors, where
   * R = (abs(b) * abs(a) + b * a) / sqrt(2 * (quad(b) * quad(a) + abs(b) * abs(a) * b << a))
   * </p>
   *
   * @method rotorFromDirections
   * @param a {VectorE3} The <em>from</em> vector.
   * @param b {VectorE3} The <em>to</em> vector.
   * @return {Spinor3} <code>this</code> The rotor representing a rotation from a to b.
   * @chainable
   */
  rotorFromDirections(a: VectorE3, b: VectorE3): Spinor3 {
    rotorFromDirections(a, b, this)
    return this
  }

  /**
   * <p>
   * <code>this = ⟼ exp(- B * θ / 2)</code>
   * </p>
   *
   * @method rotorFromGeneratorAngle
   * @param B {SpinorE3}
   * @param θ {number}
   * @return {Spinor3} <code>this</code>
   * @chainable
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
   *
   * @method scale
   * @param α {number}
   * @return {Spinor3} <code>this</code>
   * @chainable
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
   *
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
   *
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
   *
   * Sets this Spinor3 to the geometric product, a * b, of the vector arguments.
   *
   * @method versor
   * @param a {VectorE3}
   * @param b {VectorE3}
   * @return {Spinor3}
   * @chainable
   */
  versor(a: VectorE3, b: VectorE3): Spinor3 {

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

  /**
   * <p>
   * <code>this ⟼ a ^ b</code>
   * </p>
   *
   * Sets this Spinor3 to the exterior product, a ^ b, of the vector arguments.
   *
   * @method wedge
   * @param a {VectorE3}
   * @param b {VectorE3}
   * @return {Spinor3}
   * @chainable
   */
  wedge(a: VectorE3, b: VectorE3): Spinor3 {

    const ax = a.x
    const ay = a.y
    const az = a.z
    const bx = b.x
    const by = b.y
    const bz = b.z

    this.α = 0
    this.yz = wedgeYZ(ax, ay, az, bx, by, bz)
    this.zx = wedgeZX(ax, ay, az, bx, by, bz)
    this.xy = wedgeXY(ax, ay, az, bx, by, bz)

    return this
  }

  /**
   * @method grade
   * @param grade {number}
   * @return {Spinor3}
   * @chainable
   */
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

  /**
   * @method toExponential
   * @param [fractionDigits] {number}
   * @return {string}
   */
  toExponential(fractionDigits?: number): string {
    const coordToString = function(coord: number): string { return coord.toExponential(fractionDigits) }
    return toStringCustom(coordinates(this), void 0, coordToString, BASIS_LABELS)
  }

  /**
   * @method toFixed
   * @param [fractionDigits] {number}
   * @return {string}
   */
  toFixed(fractionDigits?: number): string {
    const coordToString = function(coord: number): string { return coord.toFixed(fractionDigits) }
    return toStringCustom(coordinates(this), void 0, coordToString, BASIS_LABELS)
  }

  /**
   * @method toPrecision
   * @param [position] {number}
   * @return {string}
   */
  toPrecision(position?: number): string {
    const coordToString = function(coord: number): string { return coord.toPrecision(position) }
    return toStringCustom(coordinates(this), void 0, coordToString, BASIS_LABELS)
  }

  /**
   * @method toString
   * @param [radix] {number}
   * @return {string} A non-normative string representation of the target.
   */
  toString(radix?: number): string {
    const coordToString = function(coord: number): string { return coord.toString(radix) }
    return toStringCustom(coordinates(this), void 0, coordToString, BASIS_LABELS)
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
   *
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
   * @chainable
   */
  static copy(spinor: SpinorE3): Spinor3 {
    const s = Spinor3.zero().copy(spinor)
    s.modified = false
    return s
  }

  /**
   * Computes I * <code>v</code>, the dual of <code>v</code>.
   *
   * @method dual
   * @param v {VectorE3}
   * @param changeSign {boolean}
   * @return {Spinor3}
   * @static
   * @chainable
   */
  static dual(v: VectorE3, changeSign: boolean): Spinor3 {
    return Spinor3.zero().dual(v, changeSign)
  }

  /**
   * @method isOne
   * @param spinor {SpinorE3}
   * @return {boolean}
   * @static
   */
  static isOne(spinor: SpinorE3): boolean {
    return spinor.α === 1 && spinor.yz === 0 && spinor.zx === 0 && spinor.xy === 0
  }

  /**
   * @method lerp
   * @param a {SpinorE3}
   * @param b {SpinorE3}
   * @param α {number}
   * @return {Spinor3} <code>a + α * (b - a)</code>
   * @static
   * @chainable
   */
  static lerp(a: SpinorE3, b: SpinorE3, α: number): Spinor3 {
    return Spinor3.copy(a).lerp(b, α)
  }

  /**
   * @method one
   * @return {Spinor3}
   * @static
   * @chainable
   */
  static one(): Spinor3 {
    return Spinor3.spinor(0, 0, 0, 1)
  }

  /**
   * <p>
   * Computes a unit spinor with a random direction.
   * </p>
   *
   * @method random
   * @return {Spinor3}
   * @static
   * @chainable
   */
  static random(): Spinor3 {
    const yz = randomRange(-1, 1)
    const zx = randomRange(-1, 1)
    const xy = randomRange(-1, 1)
    const α = randomRange(-1, 1)
    return Spinor3.spinor(yz, zx, xy, α).normalize()
  }

  /**
   * Computes the rotor that rotates vector <code>a</code> to vector <code>b</code>.
   *
   * @method rotorFromDirections
   * @param a {VectorE3} The <em>from</em> vector.
   * @param b {VectorE3} The <em>to</em> vector.
   * @return {Spinor3}
   * @static
   * @chainable
   */
  static rotorFromDirections(a: VectorE3, b: VectorE3): Spinor3 {
    return Spinor3.zero().rotorFromDirections(a, b)
  }

  /**
   * @method spinor
   * @param yz {number}
   * @param zx {number}
   * @param xy {number}
   * @param α {number}
   * @return {Spinor3}
   * @static
   * @chainable
   */
  static spinor(yz: number, zx: number, xy: number, α: number): Spinor3 {
    return new Spinor3([yz, zx, xy, α], magicCode)
  }

  /**
   * @method wedge
   * @param a {VectorE3}
   * @param b {VectorE3}
   * @return {Spinor3}
   * @static
   * @chainable
   */
  static wedge(a: VectorE3, b: VectorE3): Spinor3 {

    const ax = a.x
    const ay = a.y
    const az = a.z
    const bx = b.x
    const by = b.y
    const bz = b.z

    const yz = wedgeYZ(ax, ay, az, bx, by, bz)
    const zx = wedgeZX(ax, ay, az, bx, by, bz)
    const xy = wedgeXY(ax, ay, az, bx, by, bz)

    return Spinor3.spinor(yz, zx, xy, 0)
  }

  /**
   * @method zero
   * @return {Spinor3}
   * @static
   * #chainable
   */
  static zero(): Spinor3 {
    return Spinor3.spinor(0, 0, 0, 0)
  }
}
