import SpinorE3 from '../math/SpinorE3';

/**
 *
 */
export interface BoxOptions {
    /**
     * Determines whether the Box is rendered with lines or triangles.
     */
    wireFrame?: boolean;
    /**
     * 
     */
    color?: { r: number; g: number; b: number };
    /**
     * The extent of the box in the z-axis direction.
     */
    depth?: number;
    /**
     * The extent of the box in the y-axis direction.
     */
    height?: number;
    /**
     *
     */
    openBack?: boolean;
    /**
     *
     */
    openBase?: boolean;
    /**
     *
     */
    openFront?: boolean;
    /**
     *
     */
    openLeft?: boolean;
    /**
     *
     */
    openRight?: boolean;
    /**
     *
     */
    openCap?: boolean;
    /**
     * The extent of the box in the x-axis direction.
     */
    width?: number;
    /**
     * Rotation (spinor) to be applied to the geometry at construction time to establish the reference orientation.
     * This cannot be changed once the object has been created because it is burned-in to the vertex locations.
     */
    tilt?: SpinorE3;
}

export default BoxOptions;
