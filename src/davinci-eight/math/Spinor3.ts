import AbstractVector = require('../math/AbstractVector');
import expectArg = require('../checks/expectArg');
import GeometricElement = require('../math/GeometricElement');
import Mutable = require('../math/Mutable');
import Spinor3Coords = require('../math/Spinor3Coords');
/**
 * @class Spinor3
 */
class Spinor3 extends AbstractVector implements Spinor3Coords, Mutable<number[]>, GeometricElement<Spinor3Coords, Spinor3>
{
  constructor(data: number[] = [0, 0, 0, 1]) {
    super(data, 4);
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
  add(element: Spinor3Coords) {
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
  multiply(rhs: Spinor3Coords) {
    let w = rhs.w;
    return this;
  }
  multiplyScalar(scalar: number) {
    this.yz *= scalar;
    this.zx *= scalar;
    this.xy *= scalar;
    this.w  *= scalar;
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
