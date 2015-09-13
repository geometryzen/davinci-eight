import Cartesian3 = require('../math/Cartesian3');
import VectorN = require('../math/VectorN');
import expectArg = require('../checks/expectArg');
import GeometricElement = require('../math/GeometricElement');
import Mutable = require('../math/Mutable');
import Spinor3Coords = require('../math/Spinor3Coords');
import wedgeXY = require('../math/wedgeXY');
import wedgeYZ = require('../math/wedgeYZ');
import wedgeZX = require('../math/wedgeZX');
/**
 * @class Spinor3
 */
class Spinor3 extends VectorN<number> implements Spinor3Coords, Mutable<number[]>, GeometricElement<Spinor3Coords, Spinor3>
{
  constructor(data: number[] = [0, 0, 0, 1], modified: boolean = false) {
    super(data, modified, 4);
  }
  /**
   * @property yz
   * @type Number
   */
  get yz(): number {
    return this.data[0];
  }
  set yz(value: number) {
    this.modified = this.modified || this.yz !== value;
    this.data[0] = value;
  }
  /**
   * @property zx
   * @type Number
   */
  get zx(): number {
    return this.data[1];
  }
  set zx(value: number) {
    this.modified = this.modified || this.zx !== value;
    this.data[1] = value;
  }
  /**
   * @property xy
   * @type Number
   */
  get xy(): number {
    return this.data[2];
  }
  set xy(value: number) {
    this.modified = this.modified || this.xy !== value;
    this.data[2] = value;
  }
  /**
   * @property w
   * @type Number
   */
  get w(): number {
    return this.data[3];
  }
  set w(value: number) {
    this.modified = this.modified || this.w !== value;
    this.data[3] = value;
  }
  add(rhs: Spinor3Coords) {
    return this;
  }
  addVectors(a: Spinor3Coords, b: Spinor3Coords) {
    return this;
  }
  clone() {
    return new Spinor3([this.yz, this.zx, this.xy, this.w]);
  }
  copy(spinor: Spinor3Coords) {
    this.yz = spinor.yz;
    this.zx = spinor.zx;
    this.xy = spinor.xy;
    this.w  = spinor.w;
    return this;
  }
  divideScalar(scalar: number) {
    this.yz /= scalar;
    this.zx /= scalar;
    this.xy /= scalar;
    this.w  /= scalar;
    return this;
  }
  exp() {
    let w  = this.w;
    let yz = this.yz;
    let zx = this.zx;
    let xy = this.xy;
    let expW  = Math.exp(w);
    let B  = Math.sqrt(yz * yz + zx * zx + xy * xy);
    let s  = expW * (B !== 0 ? Math.sin(B) / B : 1);
    this.w  = expW * Math.cos(B);
    this.yz = yz * s;
    this.zx = zx * s;
    this.xy = xy * s;
    return this;
  }
  lerp(target: Spinor3Coords, alpha: number): Spinor3 {
    this.xy += ( target.xy - this.xy ) * alpha;
    this.yz += ( target.yz - this.yz ) * alpha;
    this.zx += ( target.zx - this.zx ) * alpha;
    this.w += ( target.w - this.w ) * alpha;
    return this;
  }
  magnitude() {
    return Math.sqrt(this.quaditude());
  }
  multiply(rhs: Spinor3Coords): Spinor3 {
    return this.multiplySpinors(this, rhs);
  }
  multiplySpinors(a: Spinor3Coords, b: Spinor3Coords): Spinor3 {
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
  multiplyScalar(scalar: number) {
    this.yz *= scalar;
    this.zx *= scalar;
    this.xy *= scalar;
    this.w  *= scalar;
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
  sub(rhs: Spinor3Coords) {
    return this;
  }
  wedgeVectors(a: Cartesian3, b: Cartesian3) {
    let ax = a.x, ay = a.y, az = a.z;
    let bx = b.x, by = b.y, bz = b.z;

    this.w = 0;
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
}

export = Spinor3;
