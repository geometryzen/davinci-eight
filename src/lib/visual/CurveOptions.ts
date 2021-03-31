import { CurveMode } from '../geometries/CurveMode';
import { VectorE3 } from '../math/VectorE3';

/**
 *
 */
export interface CurveOptions {

    /**
     * <p>
     * A parametric function determining the positions of points on the curve.
     * </p>
     * <p>
     * u<sub>min</sub> <= u <= u<sub>max</sub>
     * </p>
     *
     * @default (u: number) => u * e1 + v * e2
     */
    aPosition?: (u: number) => VectorE3;

    /**
     *
     */
    aColor?: (u: number) => { r: number; g: number; b: number };

    /**
     *
     */
    aOpacity?: (u: number) => number;

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
    mode?: CurveMode;

    /**
     *
     * @default -0.5
     */
    uMin?: number;

    /**
     *
     * @default +0.5
     */
    uMax?: number;

    /**
     * The number of segments for the u coordinate.
     *
     * @default 1
     */
    uSegments?: number;
}
