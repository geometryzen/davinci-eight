import Spinor3Coords = require('../math/Spinor3Coords');
import Mutable = require('../math/Mutable');
import expectArg = require('../checks/expectArg');
/**
 * @class Spinor3
 */
class Spinor3 implements Spinor3Coords, Mutable<number[]>
{
  private $data: number[];
  private $callback: () => number[];
  public modified: boolean;
  constructor(data: number[] = [0, 0, 0, 1]) {
    this.data = data;
    this.modified = false;
  }
  get data() {
    if (this.$data) {
      return this.$data;
    }
    else if (this.$callback) {
      var data = this.$callback();
      expectArg('callback()', data).toSatisfy(data.length === 4, "callback() length must be 4");
      return this.$callback();
    }
    else {
      throw new Error("Vector3 is undefined.");
    }
  }
  set data(data: number[]) {
    expectArg('data', data).toSatisfy(data.length === 4, "data length must be 4");
    this.$data = data;
    this.$callback = void 0;
  }
  get callback() {
    return this.$callback;
  }
  set callback(reactTo: () => number[]) {
    this.$callback = reactTo;
    this.$data = void 0;
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
  clone(): Spinor3 {
    return new Spinor3([this.yz, this.zx, this.xy, this.w]);
  }
  copy(spinor: Spinor3Coords): Spinor3 {
    this.yz = spinor.yz;
    this.zx = spinor.zx;
    this.xy = spinor.xy;
    this.w  = spinor.w;
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
