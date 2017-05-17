import { GeometryMode } from '../geometries/GeometryMode';
import { SimplexMode } from '../geometries/SimplexMode';
/**
 * Converts from a mode, k, or wireFrame option specification to a SimplexMode.
 */
export declare function simplexModeFromOptions(options: {
    wireFrame?: boolean;
    k?: number;
    mode?: 'mesh' | 'wire' | 'point' | GeometryMode;
}, fallback: SimplexMode): SimplexMode;
