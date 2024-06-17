import { GeometryKey } from "../core/GeometryKey";
import { VectorE3 } from "../math/VectorE3";
import { GeometryOptions } from "./GeometryOptions";

/**
 * Options for creating a HollowCylinderGeometry.
 * @hidden
 */
export interface HollowCylinderGeometryOptions extends GeometryOptions, GeometryKey {
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
