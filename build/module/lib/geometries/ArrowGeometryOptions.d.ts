import { GeometryKey } from '../core/GeometryKey';
import { GeometryOptions } from './GeometryOptions';
/**
 * @hidden
 */
export interface ArrowGeometryOptions extends GeometryOptions, GeometryKey {
    /**
     * Defaults to 0.08
     */
    radiusCone?: number;
}
