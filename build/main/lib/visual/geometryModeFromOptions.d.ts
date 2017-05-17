import { GeometryMode } from '../geometries/GeometryMode';
import { SimplexMode } from '../geometries/SimplexMode';
/**
 * Converts from a mode, k, or wireFrame option specification to a GeometryMode.
 */
export declare function geometryModeFromOptions(options?: {
    wireFrame?: boolean;
    k?: SimplexMode;
    mode?: 'mesh' | 'wire' | 'point' | GeometryMode;
}, fallback?: GeometryMode, suppressWarnings?: boolean): GeometryMode;
