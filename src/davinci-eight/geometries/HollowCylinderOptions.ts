import VectorE3 from '../math/VectorE3';

/**
 * Options for creating a HollowCylinder.
 */
interface HollowCylinderOptions {
    /**
     * The symmetry axis and the height of the cylinder.
     */
    height?: VectorE3;
    /**
     * The starting direction for the slice.
     * A unit vector orthogonal to the height vector.
     */
    cutLine?: VectorE3;
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
}

export default HollowCylinderOptions;
