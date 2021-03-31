import { ContextManager } from '../core/ContextManager';
import { GeometryElements } from '../core/GeometryElements';
import { Spinor3 } from '../math/Spinor3';
import { SpinorE3 } from '../math/SpinorE3';
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';
import { VectorE3 } from '../math/VectorE3';
import { SphereGeometryOptions } from './SphereGeometryOptions';
/**
 * e3 = vec(0, 0, 1)
 * @hidden
 */
export declare const DEFAULT_MERIDIAN: Readonly<import("../math/R3").R3>;
/**
 * e2 = vec(0, 1, 0)
 * @hidden
 */
export declare const DEFAULT_ZENITH: Readonly<import("../math/R3").R3>;
/**
 * @hidden
 */
export declare const DEFAULT_STRESS: Readonly<import("../math/R3").R3>;
/**
 * @hidden
 */
export declare const DEFAULT_TILT: Spinor3;
/**
 * @hidden
 */
export declare const DEFAULT_OFFSET: Readonly<import("../math/R3").R3>;
/**
 * @hidden
 */
export declare const DEFAULT_AZIMUTH_START = 0;
/**
 * @hidden
 */
export declare const DEFAULT_AZIMUTH_LENGTH: number;
/**
 * The default number of segments for the azimuth (phi) angle.
 * By making this value 36, each segment represents 10 degrees.
 * @hidden
 */
export declare const DEFAULT_AZIMUTH_SEGMENTS = 36;
/**
 * @hidden
 */
export declare const DEFAULT_ELEVATION_START = 0;
/**
 * The elevation ranges from zero to PI.
 * @hidden
 */
export declare const DEFAULT_ELEVATION_LENGTH: number;
/**
 * The default number of segments for the elevation (theta) angle.
 * By making this value 18, each segment represents 10 degrees.
 * @hidden
 */
export declare const DEFAULT_ELEVATION_SEGMENTS = 18;
/**
 *
 * @param stress
 * @param tilt
 * @param offset
 * @param azimuthStart
 * @param azimuthLength
 * @param azimuthSegments Must be an integer.
 * @param elevationStart
 * @param elevationLength
 * @param elevationSegments Must be an integer.
 * @param points
 * @param uvs
 * @hidden
 */
export declare function computeSphereVerticesAndCoordinates(zenith: VectorE3, meridian: VectorE3, stress: VectorE3, tilt: SpinorE3, offset: VectorE3, azimuthStart: number, azimuthLength: number, azimuthSegments: number, elevationStart: number, elevationLength: number, elevationSegments: number, points: Vector3[], uvs: Vector2[]): void;
/**
 * A convenience class for creating sphere geometry elements.
 * @hidden
 */
export declare class SphereGeometry extends GeometryElements {
    /**
     *
     */
    constructor(contextManager: ContextManager, options?: SphereGeometryOptions, levelUp?: number);
    /**
     *
     */
    protected resurrector(levelUp: number): void;
    /**
     *
     */
    protected destructor(levelUp: number): void;
}
