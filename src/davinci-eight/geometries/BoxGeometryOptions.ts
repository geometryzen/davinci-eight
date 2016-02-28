import VectorE3 from '../math/VectorE3'

/**
 * @class BoxGeometryOptions
 */
interface BoxGeometryOptions {

  /**
   * @property depth
   * @type number
   * @optional
   * @default 1
   */
  depth?: number

  /**
   * @property height
   * @type number
   * @optional
   * @default 1
   */
  height?: number

  /**
   * @property offset
   * @type VectorE3
   * @default 0
   */
  offset?: VectorE3

  /**
   * @property width
   * @type number
   * @optional
   * @default 1
   */
  width?: number
}

export default BoxGeometryOptions
