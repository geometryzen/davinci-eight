import { GeometryKey } from '../core/GeometryKey';
import { GeometryOptions } from './GeometryOptions';
/**
 * @hidden
 */
export interface ArrowGeometryOptions extends GeometryOptions, GeometryKey {
    /**
     * Defaults to 0.08.
     */
    radiusCone?: number;
    /**
     * Defaults to 16.
     * Minimum is 3.
     */
    thetaSegments?: number;
}
