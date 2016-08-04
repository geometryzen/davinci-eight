import BeginMode from '../core/BeginMode'
import VectorE3 from '../math/VectorE3'
import VisualOptions from './VisualOptions'

/**
 *
 */
interface GridOptions extends VisualOptions {

    /**
     * <p>
     * A parametric function determining the positions of points in the grid.
     * </p>
     * <p>
     * u<sub>min</sub> <= u <= u<sub>max</sub>
     * </p>
     * <p>
     * v<sub>min</sub> <= v <= v<sub>max</sub>
     * </p>
     *
     * @default (u: number, v: number) => u * e1 + v * e2
     */
    aPosition?: (u: number, v: number) => VectorE3

    /**
     *
     * @default (u: number, v: number) => e3
     */
    aNormal?: (u: number, v: number) => VectorE3

    /**
     *
     */
    aColor?: (u: number, v: number) => { r: number; g: number; b: number }

    /**
     * 
     */
    color?: { r: number; g: number; b: number };

    /**
     * Specifies the required Geometric Primitive Type.
     * Implementations may choose the nearest type.
     *
     * @default LINES
     */
    mode?: BeginMode

    /**
     * @default -0.5
     */
    uMin?: number

    /**
     * @default +0.5
     */
    uMax?: number

    /**
     * The number of segments for the u coordinate.
     *
     * @default 1
     */
    uSegments?: number

    /**
     * @default -0.5
     */
    vMin?: number

    /**
     * @default +0.5
     */
    vMax?: number

    /**
     * The number of segments for the v coordinate.
     *
     * @default 1
     */
    vSegments?: number
}

export default GridOptions
