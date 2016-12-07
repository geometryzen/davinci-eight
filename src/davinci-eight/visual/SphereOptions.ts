import GeometryMode from '../geometries/GeometryMode';
import SpinorE3 from '../math/SpinorE3';

/**
 * The options for creating a Sphere.
 */
export interface SphereOptions {
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
    mode?: GeometryMode;
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
    wireFrame?: boolean;
}

export default SphereOptions;
