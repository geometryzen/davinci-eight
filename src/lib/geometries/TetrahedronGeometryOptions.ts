import { GeometryKey } from '../core/GeometryKey';
import { GeometryOptions } from './GeometryOptions';

/**
 * @hidden
 */
export interface TetrahedronGeometryOptions extends GeometryOptions, GeometryKey {
    radius?: number;
}
