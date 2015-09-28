import CuboidGeometry = require('../geometries/CuboidGeometry')
import SerialGeometry = require('../geometries/SerialGeometry')
import toSerialGeometryElements = require('../dfx/toSerialGeometryElements')

/**
 * @class CuboidSerialGeometry
 */
class CuboidSerialGeometry extends SerialGeometry {
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
   * <p>
   * A CuboidSerialGeometry represents the mathematical shape of a cuboid.
   * <p>
   * @class CuboidSerialGeometry
   * @constructor
   * @param width {number} The length in the x-axis aspect.
   * @param height {number} The length in the y-axis aspect.
   * @param depth {number} The length in the z-axis aspect. 
   */
  constructor(width: number = 1, height: number = 1, depth: number = 1) {
    super(void 0, void 0)
    this.x = width
    this.y = height
    this.z = depth
    this.xSegments = 1
    this.ySegments = 1
    this.zSegments = 1
    this.lines = true
    this.calculate()
  }
  calculate(): void {
    let complex = new CuboidGeometry(this.x, this.y, this.z, this.xSegments, this.ySegments, this.zSegments, this.lines)
    this.data = toSerialGeometryElements(complex.data, complex.meta)
    this.meta = complex.meta
  }
}

export = CuboidSerialGeometry;