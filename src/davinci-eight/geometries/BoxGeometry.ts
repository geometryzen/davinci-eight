import BoxComplex = require('../geometries/BoxComplex');
import Geometry = require('../geometries/Geometry');
import toDrawElements = require('../dfx/toDrawElements');

/**
 * @class BoxGeometry
 */
class BoxGeometry extends Geometry {
  /**
   * @property x {number} The length of the side in the x-axis direction.
   */
  public x: number;
  /**
   * @property y {number} The length of the side in the y-axis direction.
   */
  public y: number;
  /**
   * @property z {number} The length of the side in the z-axis direction.
   */
  public z: number;
  /**
   * @property xSegments {number} The number of segments in the x-axis direction.
   */
  public xSegments: number;
  /**
   * @property ySegments {number} The number of segments in the y-axis direction.
   */
  public ySegments: number;
  /**
   * @property zSegments {number} The number of segments in the z-axis direction.
   */
  public zSegments: number;
  public lines: boolean;
  /**
   * @class BoxGeometry
   * @constructor
   */
  constructor() {
    super(void 0, void 0);
    this.x = 1;
    this.y = 1;
    this.z = 1;
    this.xSegments = 1;
    this.ySegments = 1;
    this.zSegments = 1;
    this.lines = true;
  }
  calculate(): void {
    let complex = new BoxComplex(this.x, this.y, this.z, this.xSegments, this.ySegments, this.zSegments, this.lines);
    this.data = toDrawElements(complex.data, complex.meta);
    this.meta = complex.meta;
  }
}

export = BoxGeometry;