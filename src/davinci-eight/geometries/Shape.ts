import Curve = require('../curves/Curve')
import Path = require('../geometries/Path')

/**
 * @class Shape
 */
class Shape extends Path {
  holes: Path[]
  /**
   * @class Shape
   * @constructor
   */
  constructor() {
    super()
    this.holes = []
  }
}
export = Shape;