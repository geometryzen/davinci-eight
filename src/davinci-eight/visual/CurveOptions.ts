import DrawMode from '../core/DrawMode'
import AbstractColor from '../core/AbstractColor'
import VectorE3 from '../math/VectorE3'

/**
 * @module EIGHT
 * @submodule visual
 */

/**
 * @class CurveOptions
 */
interface CurveOptions {

  /**
   * <p>
   * A parametric function determining the positions of points on the curve.
   * </p>
   * <p>
   * u<sub>min</sub> <= u <= u<sub>max</sub>
   * </p>
   *
   * @attribute aPosition
   * @type (u: number, v: number) => VectorE3
   * @optional
   * @default (u: number) => u * e1 + v * e2
   */
  aPosition?: (u: number) => VectorE3

  /**
   * @attribute aColor
   * @type (u: number) => AbstractColor
   * @optional
   */
  aColor?: (u: number) => AbstractColor

  /**
   * Specifies the required Geometric Primitive Type.
   * Implementations may choose the nearest type.
   *
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
   * @default -0.5
   */
  uMin?: number

  /**
   * @attribute uMax
   * @type number
   * @optional
   * @default +0.5
   */
  uMax?: number

  /**
   * The number of segments for the u coordinate.
   *
   * @attribute uSegments
   * @type number
   * @optional
   * @default 1
   */
  uSegments?: number
}

export default CurveOptions
