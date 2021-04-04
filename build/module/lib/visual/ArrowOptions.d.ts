import { SpinorE3 } from '../math/SpinorE3';
import { VectorE3 } from '../math/VectorE3';
/**
 *
 */
export interface ArrowOptions {
    /**
     *
     */
    axis?: VectorE3;
    /**
     *
     */
    color?: {
        r: number;
        g: number;
        b: number;
    };
    /**
     *
     */
    length?: number;
    /**
     *
     */
    meridian?: VectorE3;
    /**
     *
     */
    mode?: 'mesh' | 'wire' | 'point';
    /**
     *
     */
    offset?: VectorE3;
    /**
     * The radius of the cone that constitutes the arrow head.
     * Default is 0.08
     */
    radiusCone?: number;
    /**
     * The number of segments, in the azimuth plane, used to construct the arrow.
     * Default is 16.
     * Minimum is 3.
     */
    thetaSegments?: number;
    /**
     *
     */
    tilt?: SpinorE3;
    textured?: boolean;
    transparent?: boolean;
    emissive?: boolean;
    colored?: boolean;
    reflective?: boolean;
}
