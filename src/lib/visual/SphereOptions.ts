import { GeometryMode } from '../geometries/GeometryMode';
import { SpinorE3 } from '../math/SpinorE3';
import { VectorE3 } from '../math/VectorE3';

/**
 * The options for creating a Sphere.
 * @hidden
 */
export interface SphereOptions {
    /**
     *
     */
    axis?: VectorE3;
    /**
     * 
     */
    azimuthSegments?: number;
    /**
     * 
     */
    azimuthStart?: number;
    /**
     * 
     */
    azimuthLength?: number;
    /**
     * 
     */
    color?: { r: number; g: number; b: number };
    /**
     *
     */
    colored?: boolean;
    /**
     * 
     */
    elevationSegments?: number;
    /**
     * 
     */
    elevationStart?: number;
    /**
     * 
     */
    elevationLength?: number;
    /**
     *
     */
    meridian?: VectorE3;
    /**
     * Why does this not appear to be used?
     */
    mode?: 'mesh' | 'wire' | 'point' | GeometryMode;
    /**
     * The center of the sphere.
     */
    offset?: VectorE3;
    /**
     * 
     */
    radius?: number;
    /**
     * 
     */
    textured?: boolean;
    /**
     * 
     */
    tilt?: SpinorE3;
    /**
     * 
     */
    transparent?: boolean;
}
