/**
 * @class Spinor3
 */
class Spinor3 {
  /**
   * @property xy The bivector coordinate corresponding to the xy subspace.
   * @type Number
   * @default 0
   */
  public yz: number;
  public zx: number;
  public xy: number;
  public w: number;
  constructor(spinor?: {yz: number, zx: number, xy: number, w: number}) {
    this.yz = spinor ? spinor.yz : 0;
    this.zx = spinor ? spinor.zx : 0;
    this.xy = spinor ? spinor.xy : 0;
    this.w  = spinor ? spinor.w  : 1;
  }
}

export = Spinor3;
