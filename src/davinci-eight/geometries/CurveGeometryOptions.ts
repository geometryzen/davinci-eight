import DrawMode from '../core/DrawMode'
import IColor from '../core/IColor'
import VectorE3 from '../math/VectorE3'

interface CurveGeometryOptions {

  /**
   * A parametric function determining the positions of points on the curve.
   *
   * 0 <= u <= 1
   *
   * @attribute aPosition
   * @type (u: number) => VectorE3
   * @optional
   * @default () => (u, 0)
   */
  aPosition?: (u: number) => VectorE3

  /**
   * @attribute aColor
   * @type (u: number) => IColor
   * @optional
   */
  aColor?: (u: number) => IColor

  /**
   * @attribute drawMode
   * @type DrawMode
   * @optional
   * @default DrawMode.LINES
   */
  drawMode?: DrawMode

  /**
   * @attribute uMin
   * @type number
   * @optional
   * @default 0
   */
  uMin?: number

  /**
   * @attribute uMax
   * @type number
   * @optional
   * @default 1
   */
  uMax?: number

  /**
   * @attribute uSegments
   * @type number
   * @optional
   * @default 1
   */
  uSegments?: number

}

export default CurveGeometryOptions
