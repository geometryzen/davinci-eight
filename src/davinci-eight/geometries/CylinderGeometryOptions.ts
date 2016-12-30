import GeometryKey from '../core/GeometryKey';
import GeometryMode from './GeometryMode';
import GeometryOptions from './GeometryOptions';
import CylinderGeometry from './CylinderGeometry';

/**
 *
 */
interface CylinderGeometryOptions extends GeometryOptions, GeometryKey<CylinderGeometry> {
    /**
     * 
     */
    heightSegments?: number;
    /**
     * 
     */
    length?: number;
    /**
     * 
     */
    mode?: GeometryMode;
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
    /**
     * 
     */
    thetaSegments?: number;
}

export default CylinderGeometryOptions;
