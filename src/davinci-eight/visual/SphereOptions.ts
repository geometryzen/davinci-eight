import VisualOptions from './VisualOptions';

/**
 * The options for creating a Sphere.
 */
interface SphereOptions extends VisualOptions {
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
