import Spinor3Coords = require('../math/Spinor3Coords');
/**
 * @class Spinor3
 */
class Spinor3 implements Spinor3Coords
{
  /**
   * @property xy The bivector coordinate corresponding to the xy subspace.
   * @type Number
   * @default 0
   */
  public yz: number;
  public zx: number;
  public xy: number;
  public w: number;
  constructor(spinor?: {yz: number, zx: number, xy: number, w: number})
  {
    this.yz = spinor ? spinor.yz : 0;
    this.zx = spinor ? spinor.zx : 0;
    this.xy = spinor ? spinor.xy : 0;
    this.w  = spinor ? spinor.w  : 1;
  }
  clone(): Spinor3
  {
    return new Spinor3({yz: this.yz, zx: this.zx, xy: this.xy, w: this.w});
  }
  /**
   * @method toString
   * @return {string} A non-normative string representation of the target.
   */
  toString(): string
  {
    return "Spinor3({yz: " + this.yz + ", zx: " + this.zx + ", xy: " + this.xy + ", w: " + this.w + "})"
  }
}

export = Spinor3;
