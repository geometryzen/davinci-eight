import GeometryKey from '../core/GeometryKey';
import GeometryOptions from './GeometryOptions';
import HollowCylinderGeometry from './HollowCylinderGeometry';
import VectorE3 from '../math/VectorE3';

/**
 * Options for creating a HollowCylinderGeometry.
 */
interface HollowCylinderGeometryOptions extends GeometryOptions, GeometryKey<HollowCylinderGeometry> {
    /**
     * The symmetry axis and the height of the cylinder.
     */
    axis?: VectorE3;
    /**
     * The starting direction for the slice.
     * A unit vector orthogonal to the height vector.
     */
    meridian?: VectorE3;
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

export default HollowCylinderGeometryOptions;
