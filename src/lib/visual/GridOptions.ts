import { GeometryMode } from '../geometries/GeometryMode';
import { VectorE3 } from '../math/VectorE3';

/**
 *
 */
export interface GridOptions {
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
    aPosition?: (u: number, v: number) => VectorE3;
    /**
     *
     * @default (u: number, v: number) => e3
     */
    aNormal?: (u: number, v: number) => VectorE3;
    /**
     * 
     */
    axis?: VectorE3;
    /**
     *
     */
    aColor?: (u: number, v: number) => { r: number; g: number; b: number };
    /**
     * 
     */
    color?: { r: number; g: number; b: number };
    /**
     * 
     */
    mode?: GeometryMode;
    /**
     * The minimum value of the u coordinate.
     */
    uMin?: number;
    /**
     * The maximum value of the u coordinate.
     */
    uMax?: number;
    /**
     * The number of segments for the u coordinate.
     */
    uSegments?: number;
    /**
     * The minimum value of the v coordinate.
     */
    vMin?: number;
    /**
     * The maximum value of the v coordinate.
     */
    vMax?: number;
    /**
     * The number of segments for the v coordinate.
     */
    vSegments?: number;
}
