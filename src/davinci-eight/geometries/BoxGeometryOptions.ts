import BoxGeometry from './BoxGeometry';
import GeometryKey from '../core/GeometryKey';
import GeometryMode from './GeometryMode';
import GeometryOptions from './GeometryOptions';

/**
 * The options when creating a BoxGeometry.
 */
interface BoxGeometryOptions extends GeometryOptions, GeometryKey<BoxGeometry> {
    /**
     *
     */
    depth?: number;
    /**
     *
     */
    height?: number;
    /**
     * 
     */
    mode?: GeometryMode;
    /**
     *
     */
    openBack?: boolean;
    /**
     *
     */
    openBase?: boolean;
    /**
     *
     */
    openFront?: boolean;
    /**
     *
     */
    openLeft?: boolean;
    /**
     *
     */
    openRight?: boolean;
    /**
     *
     */
    openCap?: boolean;
    /**
     *
     */
    width?: number;
}

export default BoxGeometryOptions;
