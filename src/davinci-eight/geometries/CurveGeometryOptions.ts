import AbstractColor from '../core/AbstractColor'
import BeginMode from '../core/BeginMode'
import GeometryOptions from './GeometryOptions'
import VectorE3 from '../math/VectorE3'

interface CurveGeometryOptions extends GeometryOptions {

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
     * @type (u: number) => AbstractColor
     * @optional
     */
    aColor?: (u: number) => AbstractColor

    /**
     * @default LINES
     */
    drawMode?: BeginMode

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
