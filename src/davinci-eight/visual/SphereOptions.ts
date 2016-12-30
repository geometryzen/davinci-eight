import GeometryMode from '../geometries/GeometryMode';
import VectorE3 from '../math/VectorE3';
import SpinorE3 from '../math/SpinorE3';

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
    tilt?: SpinorE3;
}

export default SphereOptions;
