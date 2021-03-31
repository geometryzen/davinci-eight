import { Primitive } from '../core/Primitive';
import { Vector3 } from '../math/Vector3';
import { AxialShapeBuilder } from './AxialShapeBuilder';
/**
 * This implementation only builds the walls of the cylinder (by wrapping a grid)
 * @hidden
 */
export declare class CylindricalShellBuilder extends AxialShapeBuilder {
    radialSegments: number;
    thetaSegments: number;
    /**
     * The axis of symmetry and the height.
     */
    height: Vector3;
    /**
     * The initial direction and the radius vector.
     */
    cutLine: Vector3;
    clockwise: boolean;
    convex: boolean;
    /**
     *
     */
    toPrimitive(): Primitive;
}
