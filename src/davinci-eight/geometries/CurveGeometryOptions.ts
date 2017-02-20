import CurveMode from './CurveMode';
import GeometryKey from '../core/GeometryKey';
import GeometryOptions from './GeometryOptions';
import VectorE3 from '../math/VectorE3';

interface CurveGeometryOptions extends GeometryOptions, GeometryKey {

    /**
     * A parametric function determining the positions of points on the curve.
     *
     * @default () => (u, 0)
     */
    aPosition?: (u: number) => VectorE3;

    /**
     *
     */
    aColor?: (u: number) => { r: number; g: number; b: number };

    /**
     * @default LINES
     */
    mode?: CurveMode;

    /**
     * @default 0
     */
    uMin?: number;

    /**
     * @default 1
     */
    uMax?: number;

    /**
     * @default 1
     */
    uSegments?: number;

}

export default CurveGeometryOptions;
