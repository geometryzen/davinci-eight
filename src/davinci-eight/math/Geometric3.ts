import CartesianG3 from './CartesianG3'
import {Coords} from './Coords';
import arraysEQ from './arraysEQ';
import dotVector from './dotVectorE3';
import {G3} from './G3';
import EventEmitter from '../utils/EventEmitter';
import extG3 from './extG3';
import gauss from './gauss'
import GeometricE3 from './GeometricE3';
import GeometricOperators from './GeometricOperators';
import isDefined from '../checks/isDefined';
import isScalarG3 from './isScalarG3';
import lcoG3 from './lcoG3';
import maskG3 from './maskG3'
import mulE3 from './mulE3';
import mulG3 from './mulG3';
import MutableGeometricElement from './MutableGeometricElement';
import randomRange from './randomRange'
import readOnly from '../i18n/readOnly'
import rcoG3 from './rcoG3';
import rotorFromDirections from './rotorFromDirectionsE3';
import scpG3 from './scpG3';
import Scalar from './Scalar';
import SpinorE3 from './SpinorE3';
import squaredNormG3 from './squaredNormG3';
import stringFromCoordinates from './stringFromCoordinates';
import VectorE3 from './VectorE3';
import wedgeXY from './wedgeXY';
import wedgeYZ from './wedgeYZ';
import wedgeZX from './wedgeZX';

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
 *
 */
export class Geometric3 extends Coords implements CartesianG3, GeometricE3, MutableGeometricElement<GeometricE3, Geometric3, SpinorE3, VectorE3, number, number, number>, GeometricOperators<Geometric3, number> {

  /**
   *
   */
  private eventBus: EventEmitter<Geometric3>;

  /**
   * Constructs a <code>Geometric3</code>.
   * The multivector is initialized to zero.
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
   */
  get α(): number {
    return this.coords[COORD_SCALAR];
  }
  set α(α: number) {
    this.setCoordinate(COORD_SCALAR, α, 'α');
  }

  /**
   * The scalar part of this multivector.
   */
  get alpha(): number {
    return this.coords[COORD_SCALAR];
  }
  set alpha(alpha: number) {
    this.setCoordinate(COORD_SCALAR, alpha, 'alpha');
  }

  /**
   * The coordinate corresponding to the <b>e</b><sub>1</sub> standard basis vector.
   */
  get x(): number {
    return this.coords[COORD_X]
  }
  set x(x: number) {
    this.setCoordinate(COORD_X, x, 'x');
  }

  /**
   * The coordinate corresponding to the <b>e</b><sub>2</sub> standard basis vector.
   */
  get y(): number {
    return this.coords[COORD_Y]
  }
  set y(y: number) {
    this.setCoordinate(COORD_Y, y, 'y');
  }

  /**
   * The coordinate corresponding to the <b>e</b><sub>3</sub> standard basis vector.
   */
  get z(): number {
    return this.coords[COORD_Z]
  }
  set z(z: number) {
    this.setCoordinate(COORD_Z, z, 'z');
  }

  /**
   * The coordinate corresponding to the <b>e</b><sub>2</sub><b>e</b><sub>3</sub> standard basis bivector.
   */
  get yz(): number {
    return this.coords[COORD_YZ]
  }
  set yz(yz: number) {
    this.setCoordinate(COORD_YZ, yz, 'yz');
  }

  /**
   * The coordinate corresponding to the <b>e</b><sub>3</sub><b>e</b><sub>1</sub> standard basis bivector.
   */
  get zx(): number {
    return this.coords[COORD_ZX]
  }
  set zx(zx: number) {
    this.setCoordinate(COORD_ZX, zx, 'zx');
  }

  /**
   * The coordinate corresponding to the <b>e</b><sub>1</sub><b>e</b><sub>2</sub> standard basis bivector.
   */
  get xy(): number {
    return this.coords[COORD_XY]
  }
  set xy(xy: number) {
    this.setCoordinate(COORD_XY, xy, 'xy');
  }

  /**
   * The pseudoscalar part of this multivector.
   */
  get β(): number {
    return this.coords[COORD_PSEUDO]
  }
  set β(β: number) {
    this.setCoordinate(COORD_PSEUDO, β, 'β');
  }

  /**
   * The pseudoscalar part of this multivector.
   */
  get beta(): number {
    return this.coords[COORD_PSEUDO]
  }
  set beta(beta: number) {
    this.setCoordinate(COORD_PSEUDO, beta, 'beta');
  }

  /**
   *
   */
  get maskG3(): number {
    const coords = this._coords
    const α = coords[COORD_SCALAR]
    const x = coords[COORD_X]
    const y = coords[COORD_Y]
    const z = coords[COORD_Z]
    const yz = coords[COORD_YZ]
    const zx = coords[COORD_ZX]
    const xy = coords[COORD_XY]
    const β = coords[COORD_PSEUDO]
    let mask = 0x0
    if (α !== 0) {
      mask += 0x1
    }
    if (x !== 0 || y !== 0 || z !== 0) {
      mask += 0x2
    }
    if (yz !== 0 || zx !== 0 || xy !== 0) {
      mask += 0x4
    }
    if (β !== 0) {
      mask += 0x8
    }
    return mask
  }
  set maskG3(unused: number) {
    throw new Error(readOnly('maskG3').message)
  }

  /**
   * <p>
   * <code>this ⟼ this + M * α</code>
   * </p>
   *
   * @param M
   * @param α
   * @returns <code>this</code>
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
   *
   * @param β
   * @returns <code>this</code>
   */
  addPseudo(β: number): Geometric3 {
    this.β += β
    return this
  }

  /**
   * <p>
   * <code>this ⟼ this + α</code>
   * </p>
   *
   * @param α
   * @returns <code>this</code>
   */
  addScalar(α: number): Geometric3 {
    this.α += α
    return this
  }

  /**
   * <p>
   * <code>this ⟼ this + v * α</code>
   * </p>
   *
   * @param v
   * @param α
   * @returns <code>this</code>
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
   *
   * @param a
   * @param b
   * @returns <code>this</code>
   */
  add2(a: GeometricE3, b: GeometricE3) {
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

  adj() {
      // TODO
      return this
  }

  /**
   *
   */
  angle() {
    return this.log().grade(2);
  }

  /**
   * @param n
   * @returns
   */
  approx(n: number) {
    super.approx(n)
    return this
  }

  /**
   * @returns <code>copy(this)</code>
   */
  clone() {
    return Geometric3.copy(this)
  }

  /**
   * <p>
   * <code>this ⟼ conjugate(this)</code>
   * </p>
   *
   * @returns <code>this</code>
   */
  conj() {
    // FIXME: This is only the bivector part.
    // Also need to think about various involutions.
    this.yz = -this.yz;
    this.zx = -this.zx;
    this.xy = -this.xy;
    return this
  }

  /**
   * Copies the coordinate values into this <code>Geometric3</code>.
   *
   * @param coordinates
   * @returns <code>this</code>
   */
  copyCoordinates(coordinates: number[]) {
    // Copy using the setters so that the modified flag is updated.
    this.α = coordinates[COORD_SCALAR]
    this.x = coordinates[COORD_X]
    this.y = coordinates[COORD_Y]
    this.z = coordinates[COORD_Z]
    this.yz = coordinates[COORD_YZ]
    this.zx = coordinates[COORD_ZX]
    this.xy = coordinates[COORD_XY]
    this.β = coordinates[COORD_PSEUDO]
    return this
  }

  /**
   * @method distanceTo
   * @param point {VectorE3}
   * @return {number}
   */
  distanceTo(point: VectorE3): number {
    if (isDefined(point)) {
      return sqrt(this.quadranceTo(point));
    }
    else {
      return void 0
    }
  }

  /**
   * @method quadranceTo
   * @param point {VectorE3}
   * @return {number}
   */
  quadranceTo(point: VectorE3): number {
    if (isDefined(point)) {
      const dx = this.x - point.x
      const dy = this.y - point.y
      const dz = this.z - point.z
      return dx * dx + dy * dy + dz * dz
    }
    else {
      return void 0
    }
  }

  /**
   * <p>
   * <code>this ⟼ this << m</code>
   * </p>
   *
   * @param m
   * @returns <code>this</code>
   */
  lco(m: GeometricE3) {
    return this.lco2(this, m)
  }

  /**
   * <p>
   * <code>this ⟼ a << b</code>
   * </p>
   *
   * @param a
   * @param b
   * @return <code>this</code>
   */
  lco2(a: GeometricE3, b: GeometricE3) {
    return lcoG3(a, b, this)
  }

  /**
   * <p>
   * <code>this ⟼ this >> m</code>
   * </p>
   *
   * @param m
   * @return <code>this</code>
   */
  rco(m: GeometricE3) {
    return this.rco2(this, m)
  }

  /**
   * <p>
   * <code>this ⟼ a >> b</code>
   * </p>
   *
   * @param a
   * @param b
   * @returns <code>this</code>
   */
  rco2(a: GeometricE3, b: GeometricE3) {
    return rcoG3(a, b, this)
  }

  /**
   * <p>
   * <code>this ⟼ copy(v)</code>
   * </p>
   *
   * @param M
   * @returns <code>this</code>
   */
  copy(M: GeometricE3) {
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
   * @param α
   * @returns
   */
  copyScalar(α: number) {
    return this.zero().addScalar(α)
  }

  /**
   * <p>
   * <code>this ⟼ copy(spinor)</code>
   * </p>
   *
   * @param spinor
   * @returns <code>this</code>
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
   *
   * @param vector
   * @returns <code>this</code>
   */
  copyVector(vector: VectorE3) {
    // FIXME: This fails for copying self
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
   *
   * @param m
   * @returns <code>this</code>
   */
  div(m: GeometricE3) {
    if (isScalarG3(m)) {
      return this.divByScalar(m.α)
    }
    else {
      const α = m.α
      const x = m.x
      const y = m.y
      const z = m.z
      const xy = m.xy
      const yz = m.yz
      const zx = m.zx
      const β = m.β

      const A = [
        [α, x, y, z, -xy, -yz, -zx, -β],
        [x, α, xy, -zx, -y, -β, z, -yz],
        [y, -xy, α, yz, x, -z, -β, -zx],
        [z, zx, -yz, α, -β, y, -x, -xy],
        [xy, -y, x, β, α, zx, -yz, z],
        [yz, β, -z, y, -zx, α, xy, x],
        [zx, z, β, -x, yz, -xy, α, y],
        [β, yz, zx, xy, z, x, y, α]
      ]

      const b = [1, 0, 0, 0, 0, 0, 0, 0]

      const X = gauss(A, b)

      const a0 = this.α
      const a1 = this.x
      const a2 = this.y
      const a3 = this.z
      const a4 = this.xy
      const a5 = this.yz
      const a6 = this.zx
      const a7 = this.β

      const b0 = X[0]
      const b1 = X[1]
      const b2 = X[2]
      const b3 = X[3]
      const b4 = X[4]
      const b5 = X[5]
      const b6 = X[6]
      const b7 = X[7]

      const c0 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0)
      const c1 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1)
      const c2 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2)
      const c3 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3)
      const c4 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4)
      const c5 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5)
      const c6 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6)
      const c7 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7)

      this.α = c0
      this.x = c1
      this.y = c2
      this.z = c3
      this.xy = c4
      this.yz = c5
      this.zx = c6
      this.β = c7
    }
    return this
  }

  /**
   * <p>
   * <code>this ⟼ this / α</code>
   * </p>
   *
   * @param α
   * @returns <code>this</code>
   */
  divByScalar(α: number) {
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
   *
   * @param a
   * @param b
   * @returns <code>this</code>
   */
  div2(a: SpinorE3, b: SpinorE3) {
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
   *
   * @param m
   * @returns <code>this</code>
   */
  dual(m: GeometricE3) {
    const w = -m.β
    const x = -m.yz
    const y = -m.zx
    const z = -m.xy
    const yz = m.x
    const zx = m.y
    const xy = m.z
    const β = m.α

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
   * @param other
   * @returns
   */
  equals(other: any): boolean {
    if (other instanceof Geometric3) {
      const that: Geometric3 = other
      return arraysEQ(this.coords, that.coords)
    }
    else {
      return false
    }
  }

  /**
   * <p>
   * <code>this ⟼ e<sup>this</sup></code>
   * </p>
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
   * Computes the inverse of this multivector. 
   * </p>
   */
  inv() {
    const α = this.α
    const x = this.x
    const y = this.y
    const z = this.z
    const xy = this.xy
    const yz = this.yz
    const zx = this.zx
    const β = this.β

    const A = [
      [α, x, y, z, -xy, -yz, -zx, -β],
      [x, α, xy, -zx, -y, -β, z, -yz],
      [y, -xy, α, yz, x, -z, -β, -zx],
      [z, zx, -yz, α, -β, y, -x, -xy],
      [xy, -y, x, β, α, zx, -yz, z],
      [yz, β, -z, y, -zx, α, xy, x],
      [zx, z, β, -x, yz, -xy, α, y],
      [β, yz, zx, xy, z, x, y, α]
    ]

    const b = [1, 0, 0, 0, 0, 0, 0, 0]

    const X = gauss(A, b)

    this.α = X[0]
    this.x = X[1]
    this.y = X[2]
    this.z = X[3]
    this.xy = X[4]
    this.yz = X[5]
    this.zx = X[6]
    this.β = X[7]

    return this
  }

  /**
   *
   * @returns
   */
  isOne(): boolean {
    return this.α === 1 && this.x === 0 && this.y === 0 && this.z === 0 && this.yz === 0 && this.zx === 0 && this.xy === 0 && this.β === 0
  }

  /**
   *
   * @returns
   */
  isZero(): boolean {
    return this.α === 0 && this.x === 0 && this.y === 0 && this.z === 0 && this.yz === 0 && this.zx === 0 && this.xy === 0 && this.β === 0
  }

  /**
   * <p>
   * <code>this ⟼ this + α * (target - this)</code>
   * </p>
   *
   * @param target
   * @param α
   * @returns <code>this</code>
   */
  lerp(target: GeometricE3, α: number) {
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
   *
   * @param a
   * @param b
   * @param α
   * @returns <code>this</code>
   */
  lerp2(a: GeometricE3, b: GeometricE3, α: number) {
    this.copy(a).lerp(b, α)
    return this
  }

  /**
   * <p>
   * <code>this ⟼ log(this)</code>
   * </p>
   *
   * @returns <code>this</code>
   * @chainable
   */
  log() {
    const α = this.α
    const x = this.yz
    const y = this.zx
    const z = this.xy
    const BB = x * x + y * y + z * z
    const B = sqrt(BB)
    const f = atan2(B, α) / B
    this.α = log(sqrt(α * α + BB))
    this.yz = x * f
    this.zx = y * f
    this.xy = z * f
    return this
  }

  /**
   * <p>
   * Computes the <em>square root</em> of the <em>squared norm</em>.
   * </p>
   *
   * @returns
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
   * @param m
   * @returns <code>this</code>
   */
  mul(m: GeometricE3) {
    return this.mul2(this, m)
  }

  /**
   * <p>
   * <code>this ⟼ a * b</code>
   * </p>
   *
   * @param a
   * @param b
   * @returns <code>this</code>
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
   *
   * @returns <code>this</code>
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
   *
   * @returns <code>this</code>
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
   * <p>
   * If the magnitude is zero (a <em>null</em> multivector), this multivector is unchanged.
   * Since the metric is Euclidean, this will only happen if the multivector is also the
   * <em>zero</em> multivector.
   * </p>
   *
   * @returns <code>this</code>
   * @chainable
   */
  normalize(): Geometric3 {
    const norm: number = this.magnitude()
    if (norm !== 0) {
      this.α = this.α / norm
      this.x = this.x / norm
      this.y = this.y / norm
      this.z = this.z / norm
      this.yz = this.yz / norm
      this.zx = this.zx / norm
      this.xy = this.xy / norm
      this.β = this.β / norm
    }
    return this
  }

  /**
   * Sets this multivector to the identity element for multiplication, <b>1</b>.
   *
   * @returns
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
   *
   * @returns <code>this</code>
   * @chainable
   */
  quad(): Geometric3 {
    this.α = this.squaredNormSansUnits()
    this.yz = 0
    this.zx = 0
    this.xy = 0
    return this
  }

  /**
   * <p>
   * Computes the <em>squared norm</em> of this multivector.
   * </p>
   *
   * @return {number} <code>this * conj(this)</code>
   */
  squaredNorm(): number {
    return this.squaredNormSansUnits()
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
   *
   * @param n
   * @returns <code>this</code>
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
   *
   * @returns <code>this</code>
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
   * @returns
   */
  __tilde__(): Geometric3 {
    return Geometric3.copy(this).rev()
  }

  /**
   * <p>
   * <code>this ⟼ R * this * rev(R)</code>
   * </p>
   *
   * @param R
   * @returns <code>this</code>
   * @chainable
   */
  rotate(R: SpinorE3) {
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
   *
   * @param a The starting unit vector
   * @param b The ending unit vector
   * @returns <code>this</code> The rotor representing a rotation from a to b.
   * @chainable
   */
  rotorFromDirections(a: VectorE3, b: VectorE3) {
    rotorFromDirections(a, b, this)
    return this
  }

  /**
   * <p>
   * <code>this = ⟼ exp(- B * θ / 2) = cos(|B| * θ / 2) - B * sin(|B| * θ / 2) / |B|</code>
   * </p>
   *
   * @param B
   * @param θ The rotation angle when applied on both sides: R M ~R
   * @returns <code>this</code>
   * @chainable
   */
  rotorFromGeneratorAngle(B: SpinorE3, θ: number) {
    const φ = θ / 2
    const yz = B.yz
    const zx = B.zx
    const xy = B.xy
    const quad = yz * yz + zx * zx + xy * xy
    const m = Math.sqrt(quad)
    const s = sin(m * φ)
    this.α = cos(m * φ)
    this.x = 0
    this.y = 0
    this.z = 0
    this.yz = -yz * s / m
    this.zx = -zx * s / m
    this.xy = -xy * s / m
    this.β = 0
    return this
  }

  /**
   * <p>
   * <code>this ⟼ scp(this, m)</code>
   * </p>
   *
   * @param m
   * @returns <code>this</code>
   * @chainable
   */
  scp(m: GeometricE3) {
    return this.scp2(this, m)
  }

  /**
   * <p>
   * <code>this ⟼ scp(a, b)</code>
   * </p>
   *
   * @param a
   * @param b
   * @returns <code>this</code>
   * @chainable
   */
  scp2(a: GeometricE3, b: GeometricE3) {
    return scpG3(a, b, this)
  }

  /**
   * <p>
   * <code>this ⟼ this * α</code>
   * </p>
   *
   * @param α
   */
  scale(α: number) {
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

  /**
   * Not Implemented
   *
   * @param target
   * @param α
   * @returns
   * @chainable
   */
  slerp(target: GeometricE3, α: number) {
    // TODO
    return this
  }

  /**
   * Applies the diagonal elements of a scaling matrix to this multivector.
   *
   * @param σ
   * @returns
   * @chainable
   */
  stress(σ: VectorE3) {
    this.x *= σ.x
    this.y *= σ.y
    this.z *= σ.z
    // TODO: Action on other components TBD.
    return this
  }

  /**
   * <p>
   * <code>this ⟼ a * b</code>
   * </p>
   * Sets this Geometric3 to the geometric product a * b of the vector arguments.
   *
   * @param a
   * @param b
   * @returns <code>this</code>
   */
  versor(a: VectorE3, b: VectorE3) {
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
   *
   * @param M
   * @param α
   * @returns <code>this</code>
   * @chainable
   */
  sub(M: GeometricE3, α = 1) {
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
   * <code>this ⟼ this - v * α</code>
   * </p>
   *
   * @param v
   * @param α
   * @returns <code>this</code>
   * @chainable
   */
  subVector(v: VectorE3, α = 1) {
    this.x -= v.x * α
    this.y -= v.y * α
    this.z -= v.z * α
    return this
  }

  /**
   * <p>
   * <code>this ⟼ a - b</code>
   * </p>
   *
   * @param a
   * @param b
   * @returns <code>this</code>
   * @chainable
   */
  sub2(a: GeometricE3, b: GeometricE3) {
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
   *
   * @param fractionDigits
   * @returns
   */
  toExponential(fractionDigits?: number): string {
    const coordToString = function(coord: number): string { return coord.toExponential(fractionDigits) };
    return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS)
  }

  /**
   * Returns a string representing the number in fixed-point notation.
   *
   * @param fractionDigits
   * @returns
   */
  toFixed(fractionDigits?: number): string {
    const coordToString = function(coord: number): string { return coord.toFixed(fractionDigits) };
    return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS)
  }

  /**
   * @param precision
   * @returns
   */
  toPrecision(precision?: number): string {
    const coordToString = function(coord: number): string { return coord.toPrecision(precision) };
    return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS)
  }

  /**
   * Returns a string representation of the number.
   *
   * @param radix
   * @returns
   */
  toString(radix?: number): string {
    const coordToString = function(coord: number): string { return coord.toString(radix) };
    return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS)
  }

  /**
   * @param grade
   * @returns
   * @chainable
   */
  grade(grade: number) {
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
   *
   * @param m
   * @returns <code>this</code>
   * @chainable
   */
  ext(m: GeometricE3) {
    return this.ext2(this, m)
  }

  /**
   * <p>
   * <code>this ⟼ a ^ b</code>
   * </p>
   *
   * @param a
   * @param b
   * @returns <code>this</code>
   * @chainable
   */
  ext2(a: GeometricE3, b: GeometricE3) {
    return extG3(a, b, this)
  }

  /**
   * Sets this multivector to the identity element for addition, <b>0</b>.
   *
   * @returns
   * @chainable
   */
  zero() {
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
   * @param rhs
   * @returns
   * @private
   */
  __add__(rhs: number | CartesianG3): Geometric3 {
    const duckR = maskG3(rhs)
    if (duckR) {
      return this.clone().add(duckR)
    }
    else {
      return void 0
    }
  }

  /**
   * @param rhs
   * @returns
   * @private
   */
  __div__(rhs: number | CartesianG3) {
    const duckR = maskG3(rhs)
    if (duckR) {
      return this.clone().div(duckR)
    }
    else {
      return void 0
    }
  }

  /**
   * @param lhs
   * @returns
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
   * @param rhs
   * @returns
   * @private
   */
  __mul__(rhs: number | CartesianG3) {
    const duckR = maskG3(rhs)
    if (duckR) {
      return this.clone().mul(duckR)
    }
    else {
      return void 0
    }
  }

  /**
   * @param lhs
   * @returns
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
   * @param lhs
   * @returns
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
   * @param rhs
   * @returns
   * @private
   */
  __sub__(rhs: number | CartesianG3): Geometric3 {
    const duckR = maskG3(rhs)
    if (duckR) {
      return this.clone().sub(duckR)
    }
    else {
      return void 0
    }
  }

  /**
   * @param lhs
   * @returns
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
   * @param rhs
   * @returns
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
   * @param lhs
   * @returns
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
   * @param rhs
   * @returns
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
   * @param other
   * @returns
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
   * @param rhs
   * @returns
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
   * @param other
   * @returns
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
   * @param rhs
   * @returns
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
   * @param lhs
   * @returns
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
   * @returns
   * @private
   * @chainable
   */
  __bang__(): Geometric3 {
    return Geometric3.copy(this).inv()
  }

  /**
   * @returns
   * @private
   * @chainable
   */
  __pos__() {
    return Geometric3.copy(this)/*.pos()*/
  }

  /**
   * @returns
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
   * @returns
   */
  static zero(): Geometric3 { return new Geometric3() }

  /**
   * Constructs a Geometric3 representing the number one.
   * The identity element for multiplication, <b>1</b>.
   *
   * @returns
   */
  static one(): Geometric3 { return new Geometric3().addScalar(1) }

  /**
   * Constructs a basis vector corresponding to the <code>x</code> coordinate.
   *
   * @returns
   */
  static e1(): Geometric3 { return Geometric3.vector(1, 0, 0) }

  /**
   * Constructs a basis vector corresponding to the <code>y</code> coordinate.
   *
   * @returns
   */
  static e2(): Geometric3 { return Geometric3.vector(0, 1, 0) }

  /**
   * Constructs a basis vector corresponding to the <code>z</code> coordinate.
   *
   * @returns
   */
  static e3(): Geometric3 { return Geometric3.vector(0, 0, 1) }

  /**
   * Constructs a basis vector corresponding to the <code>β</code> coordinate.
   *
   * @returns
   */
  static I(): Geometric3 { return new Geometric3().addPseudo(1) }

  /**
   * @param M
   * @returns
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
   * @param scalar
   * @returns
   */
  static fromScalar(scalar: Scalar): Geometric3 {
    return new Geometric3().copyScalar(scalar.α)
  }

  /**
   * @param spinor
   * @returns
   */
  static fromSpinor(spinor: SpinorE3): Geometric3 {
    const copy = new Geometric3()
    copy.α = spinor.α
    copy.yz = spinor.yz
    copy.zx = spinor.zx
    copy.xy = spinor.xy
    return copy
  }

  /**
   * @param vector
   * @returns
   */
  static fromVector(vector: VectorE3): Geometric3 {
    const copy = new Geometric3()
    copy.x = vector.x
    copy.y = vector.y
    copy.z = vector.z
    return copy
  }

  /**
   * @param A
   * @param B
   * @param α
   * @returns <code>A + α * (B - A)</code>
   */
  static lerp(A: GeometricE3, B: GeometricE3, α: number): Geometric3 {
    return Geometric3.copy(A).lerp(B, α)
  }

  /**
   * <p>
   * Computes a unit multivector with a random direction.
   * </p>
   *
   * @returns
   */
  static random(): Geometric3 {
    const g = new Geometric3()
    g.α = randomRange(-1, 1)
    g.x = randomRange(-1, 1)
    g.y = randomRange(-1, 1)
    g.z = randomRange(-1, 1)
    g.yz = randomRange(-1, 1)
    g.zx = randomRange(-1, 1)
    g.xy = randomRange(-1, 1)
    g.β = randomRange(-1, 1)
    g.normalize()
    return g
  }

  /**
   * Computes the rotor that rotates vector <code>a</code> to vector <code>b</code>.
   *
   * @param a The <em>from</em> vector.
   * @param b The <em>to</em> vector.
   * @returns
   */
  static rotorFromDirections(a: VectorE3, b: VectorE3): Geometric3 {
    return new Geometric3().rotorFromDirections(a, b)
  }

  /**
   * @param α
   * @returns
   */
  static scalar(α: number): Geometric3 {
    return new Geometric3().copyScalar(α)
  }

  /**
   * @param yz
   * @param zx
   * @param xy
   * @param α
   * @returns
   */
  static spinor(yz: number, zx: number, xy: number, α: number): Geometric3 {
    const spinor = new Geometric3()
    spinor.yz = yz
    spinor.zx = zx
    spinor.xy = xy
    spinor.α = α
    spinor.modified = false
    return spinor
  }

  /**
   * @param x
   * @param y
   * @param z
   * @returns
   */
  static vector(x: number, y: number, z: number): Geometric3 {
    const v = new Geometric3()
    v.x = x
    v.y = y
    v.z = z
    v.modified = false
    return v
  }

  /**u
   * @param a
   * @param b
   * @returns
   */
  static wedge(a: Geometric3, b: Geometric3): Geometric3 {

    const ax = a.x
    const ay = a.y
    const az = a.z
    const bx = b.x
    const by = b.y
    const bz = b.z

    const yz = wedgeYZ(ax, ay, az, bx, by, bz)
    const zx = wedgeZX(ax, ay, az, bx, by, bz)
    const xy = wedgeXY(ax, ay, az, bx, by, bz)

    return Geometric3.spinor(yz, zx, xy, 0)
  }
}
