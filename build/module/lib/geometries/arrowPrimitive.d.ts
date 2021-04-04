import { Primitive } from '../core/Primitive';
import { ArrowGeometryOptions } from './ArrowGeometryOptions';
/**
 * @hidden
 * Used by the ArrowGeometry constructor.
 */
export declare function arrowPrimitive(options?: Pick<ArrowGeometryOptions, 'kind' | 'axis' | 'meridian' | 'radiusCone' | 'stress' | 'thetaSegments' | 'offset'>): Primitive;
