import { GeometryMode } from '../geometries/GeometryMode';
import { VectorE3 } from '../math/VectorE3';
import { SpinorE3 } from '../math/SpinorE3';
/**
 * The options for creating a Sphere.
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
     *
     */
    mode?: 'mesh' | 'wire' | 'point' | GeometryMode;
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