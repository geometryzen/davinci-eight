import GeometryMode from '../geometries/GeometryMode';
import SpinorE3 from '../math/SpinorE3';
import VectorE3 from '../math/VectorE3';

/**
 *
 */
export interface BoxOptions {
    /**
     * 
     */
    axis?: VectorE3;
    /**
     * 
     */
    color?: { r: number; g: number; b: number };
    /**
     * 
     */
    colored?: boolean;
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
    meridian?: VectorE3;
    /**
     * 
     */
    mode?: 'mesh' | 'wire' | 'point' | GeometryMode;
    /**
     * 
     */
    offset?: VectorE3;
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
     * 
     */
    textured?: boolean;
    /**
     * Rotation (spinor) to be applied to the geometry at construction time to establish the reference orientation.
     * This cannot be changed once the object has been created because it is burned-in to the vertex locations.
     */
    tilt?: SpinorE3;
    /**
     * 
     */
    transparent?: boolean;
}

export default BoxOptions;
