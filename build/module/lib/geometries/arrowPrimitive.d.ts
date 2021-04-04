import { Primitive } from '../core/Primitive';
import { ArrowGeometryOptions } from './ArrowGeometryOptions';
import { ArrowHeadGeometryOptions } from './ArrowHeadGeometry';
import { ArrowTailGeometryOptions } from './ArrowTailGeometry';
/**
 * @hidden
 * Used by the ArrowGeometry constructor.
 */
export declare function arrowPrimitive(options?: Pick<ArrowGeometryOptions, 'kind' | 'axis' | 'meridian' | 'radiusCone' | 'stress' | 'thetaSegments' | 'offset'>): Primitive;
/**
 * @hidden
 */
export declare function arrowHeadPrimitive(options?: Pick<ArrowHeadGeometryOptions, 'axis' | 'heightCone' | 'meridian' | 'radiusCone' | 'stress' | 'thetaSegments' | 'offset'>): Primitive;
/**
 * @hidden
 */
export declare function arrowTailPrimitive(options?: Pick<ArrowTailGeometryOptions, 'axis' | 'heightShaft' | 'meridian' | 'radiusShaft' | 'stress' | 'thetaSegments' | 'offset'>): Primitive;
