import SpinorE3 from '../math/SpinorE3';

/**
 * The options for creating a Sphere.
 */
export interface SphereOptions {
    /**
     * 
     */
    wireFrame?: boolean;
    /**
     * 
     */
    radius?: number;
    /**
     * 
     */
    tilt?: SpinorE3;
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
}

export default SphereOptions;
