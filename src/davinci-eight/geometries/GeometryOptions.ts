import SpinorE3 from '../math/SpinorE3'
import VectorE3 from '../math/VectorE3'

/**
 * @class GeometryOptions
 */
interface GeometryOptions {

  /**
   * @attribute offset
   * @type VectorE3
   * @default 0
   */
  offset?: VectorE3

  /**
   * @attribute tilt
   * @type SpinorE3
   * @default 1
   */
  tilt?: SpinorE3
}

export default GeometryOptions
