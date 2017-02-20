import GeometryKey from '../core/GeometryKey';
import GeometryOptions from './GeometryOptions';

/**
 *
 */
interface TetrahedronGeometryOptions extends GeometryOptions, GeometryKey {
    radius?: number;
}

export default TetrahedronGeometryOptions;
