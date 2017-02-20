import GeometryKey from '../core/GeometryKey';
import GeometryMode from './GeometryMode';
import GeometryOptions from './GeometryOptions';

/**
 *
 */
interface CylinderGeometryOptions extends GeometryOptions, GeometryKey {
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
