import GeometryKey from '../core/GeometryKey';
import GeometryOptions from './GeometryOptions';
import TetrahedronGeometry from './TetrahedronGeometry';

/**
 *
 */
interface TetrahedronGeometryOptions extends GeometryOptions, GeometryKey<TetrahedronGeometry> {
    radius?: number;
}

export default TetrahedronGeometryOptions;
