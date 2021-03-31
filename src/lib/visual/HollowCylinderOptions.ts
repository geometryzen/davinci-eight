import { SpinorE3 } from '../math/SpinorE3';
import { VectorE3 } from '../math/VectorE3';

/**
 *
 */
export interface HollowCylinderOptions {
    /**
     * The symmetry axis and the height of the cylinder.
     */
    axis?: VectorE3;
    /**
     * 
     */
    color?: { r: number; g: number; b: number };
    /**
     * 
     */
    length?: number;
    /**
     * The starting direction for the slice.
     * A unit vector orthogonal to the height vector.
     */
    meridian?: VectorE3;
    /**
     * 
     */
    offset?: VectorE3;
    /**
     * The outer radius of the cylinder.
     */
    outerRadius?: number;
    /**
     * The inner radius of the cylinder.
     */
    innerRadius?: number;
    /**
     * The angular size of the cylinder. Default is 2 * PI.
     */
    sliceAngle?: number;
    /**
     * 
     */
    tilt?: SpinorE3;
}
