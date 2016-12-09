import GeometryKey from '../core/GeometryKey';
import GeometryOptions from './GeometryOptions';
import ArrowGeometry from './ArrowGeometry';

/**
 *
 */
interface ArrowGeometryOptions extends GeometryOptions, GeometryKey<ArrowGeometry> {
    /**
     * Defaults to 0.08
     */
    radiusCone?: number;
}

export default ArrowGeometryOptions;
