import Cartesian3 = require('../math/Cartesian3')
import VectorN = require('../math/VectorN')
import dotVector3 = require('../math/dotVector3')
import expectArg = require('../checks/expectArg')
import GeometricElement = require('../math/GeometricElement')
import mustBeNumber = require('../checks/mustBeNumber')
import Mutable = require('../math/Mutable')
import quaditude3 = require('../math/quaditude3')
import Spinor3Coords = require('../math/Spinor3Coords')
import wedgeXY = require('../math/wedgeXY')
import wedgeYZ = require('../math/wedgeYZ')
import wedgeZX = require('../math/wedgeZX')

/**
 * @class Spinor3
 */
class Spinor3 extends VectorN<number> implements Spinor3Coords, Mutable<number[]>, GeometricElement<Spinor3Coords, Spinor3, Spinor3Coords, Cartesian3>
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
   * @method add
   * @param rhs {Spinor3Coords}
   * @return {Spinor3}
   */
  add(rhs: Spinor3Coords): Spinor3 {
    return this;
  }
  /**
   * @method clone
   * @return {Spinor3}
   */
  clone(): Spinor3 {
    return new Spinor3([this.yz, this.zx, this.xy, this.w]);
  }
  /**
   * @method conjugate
   * @return {Spinor3}
   */
  conjugate() {
    this.yz *= -1
    this.zx *= -1
    this.xy *= -1
    return this
  }
  /**
   * @method copy
   * @param spinor {Spinor3Coords}
   * @return {Spinor3}
   */
  copy(spinor: Spinor3Coords): Spinor3 {
    this.yz = spinor.yz;
    this.zx = spinor.zx;
    this.xy = spinor.xy;
    this.w  = spinor.w;
    return this;
  }
  /**
   * @method difference
   * @param a {Spinor3Coords}
   * @param b {Spinor3Coords}
   * @return {Spinor3}
   */
  difference(a: Spinor3Coords, b: Spinor3Coords): Spinor3 {
    return this;
  }
  divideScalar(scalar: number) {
    this.yz /= scalar;
    this.zx /= scalar;
    this.xy /= scalar;
    this.w  /= scalar;
    return this;
  }
  exp(): Spinor3 {
    let w  = this.w;
    let x = this.yz;
    let y = this.zx;
    let z = this.xy;
    let expW  = Math.exp(w);
    let B  = Math.sqrt(x * x + y * y + z * z);
    let s  = expW * (B !== 0 ? Math.sin(B) / B : 1);
    this.w  = expW * Math.cos(B);
    this.yz = x * s;
    this.zx = y * s;
    this.xy = z * s;
    return this;
  }
  inverse() {
    this.conjugate()
    this.divideScalar(this.quaditude());
    return this
  }
  lerp(target: Spinor3Coords, alpha: number): Spinor3 {
    var R2 = Spinor3.copy(target)
    var R1 = this.clone()
    var R = R2.multiply(R1.inverse())
    R.log()
    R.scale(alpha)
    R.exp()
    this.copy(R)
    return this
  }
  /**
   * @method log
   * @return {Spinor3}
   */
  log(): Spinor3 {
    let w = this.w
    let x = this.yz
    let y = this.zx
    let z = this.xy
    let bb = x * x + y * y + z * z
    let R2 = Math.sqrt(bb)
    let R0 = Math.abs(w)
    let R  = Math.sqrt(w * w + bb)
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
   * @method multiply
   * @param rhs {Spinor3Coords}
   * @return {Spinor3}
   */
  multiply(rhs: Spinor3Coords): Spinor3 {
    return this.product(this, rhs);
  }
  /**
   * @method scale
   * @param scalar {number}
   * @return {Spinor3}
   */
  scale(scalar: number): Spinor3 {
    this.yz *= scalar;
    this.zx *= scalar;
    this.xy *= scalar;
    this.w  *= scalar;
    return this;
  }
  product(a: Spinor3Coords, b: Spinor3Coords): Spinor3 {
    let a0 = a.w;
    let a1 = a.yz;
    let a2 = a.zx;
    let a3 = a.xy;
    let b0 = b.w;
    let b1 = b.yz;
    let b2 = b.zx;
    let b3 = b.xy;
    this.w  = a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3;
    this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
    this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
    this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
    return this;
  }
  quaditude() {
    let w  = this.w;
    let yz = this.yz;
    let zx = this.zx;
    let xy = this.xy;
    return w * w + yz * yz + zx * zx + xy * xy;
  }
  reverse() {
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
   * @return {Spinor3}
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
  rotate(rotor: Spinor3Coords): Spinor3 {
    return this;
  }
  /**
   * Computes a rotor, R, from two unit vectors, where
   * R = (1 + b * a) / sqrt(2 * (1 + b << a))
   * @method rotor
   * @param b {Cartesian3} The ending unit vector
   * @param a {Cartesian3} The starting unit vector
   * @return {Spinor3} The rotor representing a rotation from a to b.
   */
  rotor(b: Cartesian3, a: Cartesian3) {
    var bLength = Math.sqrt(quaditude3(b))
    var aLength = Math.sqrt(quaditude3(a))
    b = {x: b.x / bLength, y: b.y / bLength, z: b.z / bLength}
    a = {x: a.x / aLength, y: a.y / aLength, z: a.z / aLength}
    this.spinor(b, a)
    this.w += 1
    var denom = Math.sqrt(2 * (1 + dotVector3(b, a)))
    this.divideScalar(denom)
    return this;
  }
  sub(rhs: Spinor3Coords) {
    return this;
  }
  sum(a: Spinor3Coords, b: Spinor3Coords) {
    return this;
  }
  /**
   * @method spinor
   * @param a {Cartesian3}
   * @param b {Cartesian3}
   * @return {Spinor3}
   */
  spinor(a: Cartesian3, b: Cartesian3) {

    let ax = a.x;
    let ay = a.y;
    let az = a.z;
    let bx = b.x;
    let by = b.y;
    let bz = b.z;

    this.w  = dotVector3(a, b);
    this.yz = wedgeYZ(ax, ay, az, bx, by, bz);
    this.zx = wedgeZX(ax, ay, az, bx, by, bz);
    this.xy = wedgeXY(ax, ay, az, bx, by, bz);

    return this;
  }
  /**
   * @method toString
   * @return {string} A non-normative string representation of the target.
   */
  toString(): string {
    return "Spinor3({yz: " + this.yz + ", zx: " + this.zx + ", xy: " + this.xy + ", w: " + this.w + "})"
  }
  static copy(spinor: Spinor3Coords): Spinor3 {
    return new Spinor3().copy(spinor);
  }
  static lerp(a: Spinor3Coords, b: Spinor3Coords, alpha: number): Spinor3 {
    return Spinor3.copy(a).lerp(b, alpha)
  }
}

export = Spinor3;
