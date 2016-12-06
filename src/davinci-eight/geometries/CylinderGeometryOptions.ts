import GeometryOptions from './GeometryOptions';

/**
 *
 */
interface CylinderGeometryOptions extends GeometryOptions {
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
