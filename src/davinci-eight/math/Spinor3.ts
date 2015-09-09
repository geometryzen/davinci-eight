import VectorN = require('../math/VectorN');
import expectArg = require('../checks/expectArg');
import GeometricElement = require('../math/GeometricElement');
import Mutable = require('../math/Mutable');
import Spinor3Coords = require('../math/Spinor3Coords');
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
  magnitude() {
    return Math.sqrt(this.quaditude());
  }
  multiply(rhs: Spinor3Coords) {
    let a0 = this.w;
    let a1 = this.yz;
    let a2 = this.zx;
    let a3 = this.xy;
    let b0 = rhs.w;
    let b1 = rhs.yz;
    let b2 = rhs.zx;
    let b3 = rhs.xy;
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
  sub(rhs: Spinor3Coords) {
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
