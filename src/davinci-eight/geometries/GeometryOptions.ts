import Engine from '../core/Engine'
import SpinorE3 from '../math/SpinorE3'
import VectorE3 from '../math/VectorE3'

/**
 * @class GeometryOptions
 */
interface GeometryOptions {

  /**
   * @attribute engine
   * @type Engine
   * @optional
   */
  engine?: Engine

  /**
   * @attribute offset
   * @type VectorE3
   * @optional
   * @default 0
   */
  offset?: VectorE3

  /**
   * @attribute stress
   * @type VectorE3
   * @optional
   * @default (1, 1, 1)
   */
  stress?: VectorE3

  /**
   * @attribute tilt
   * @type SpinorE3
   * @optional
   * @default 1
   */
  tilt?: SpinorE3
}

export default GeometryOptions
