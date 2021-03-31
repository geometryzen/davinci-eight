import { Primitive } from '../core/Primitive';
import { Vector3 } from '../math/Vector3';
import { AxialShapeBuilder } from './AxialShapeBuilder';
/**
 * Constructs a one-sided ring using a TRIANGLE_STRIP.
 * @hidden
 */
export declare class RingBuilder extends AxialShapeBuilder {
    /**
     * The radius of the hole in the ring.
     */
    innerRadius: number;
    /**
     * The radius of the outer edge of the ring.
     */
    outerRadius: number;
    /**
     * The number of segments in the radial direction.
     */
    radialSegments: number;
    /**
     * The number of segments in the angular direction.
     */
    thetaSegments: number;
    /**
     * The direction of the normal vector perpendicular to the plane of the ring.
     */
    e: Vector3;
    /**
     * The direction from which a slice is created.
     */
    cutLine: Vector3;
    /**
     * The orientation of the slice relative to the cutLine.
     */
    clockwise: boolean;
    /**
     *
     */
    toPrimitive(): Primitive;
}
