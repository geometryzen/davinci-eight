import { GeometryKey } from '../core/GeometryKey';
import { GeometryMode } from './GeometryMode';
import { GeometryOptions } from './GeometryOptions';
/**
 * The options when creating a BoxGeometry.
 */
export interface BoxGeometryOptions extends GeometryOptions, GeometryKey {
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
