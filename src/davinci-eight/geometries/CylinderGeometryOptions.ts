import GeometryKey from '../core/GeometryKey';
import GeometryOptions from './GeometryOptions';
import CylinderGeometry from './CylinderGeometry';

/**
 *
 */
interface CylinderGeometryOptions extends GeometryOptions, GeometryKey<CylinderGeometry> {
    /**
     * 
     */
    length?: number;
    /**
     *
     */
    openBase?: boolean;
    /**
     *
     */
    openCap?: boolean;
    /**
     *
     */
    openWall?: boolean;
    /**
     * 
     */
    radius?: number;
}

export default CylinderGeometryOptions;
