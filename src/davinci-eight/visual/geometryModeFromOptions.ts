import isDefined from '../checks/isDefined';
import mustBeBoolean from '../checks/mustBeBoolean';
import mustBeInteger from '../checks/mustBeInteger';
import GeometryMode from '../geometries/GeometryMode';

/**
 * Converts from a mode, k, or wireFrame option specification to a GeometryMode.
 */
export default function modeFromOptions(options?: { wireFrame?: boolean; k?: number; mode?: GeometryMode }, fallback: GeometryMode = GeometryMode.MESH): GeometryMode {
    if (isDefined(options)) {
        if (isDefined(options.mode)) {
            return mustBeInteger('mode', options.mode);
        }
        else if (isDefined(options.wireFrame)) {
            return mustBeBoolean('wireFrame', options.wireFrame) ? GeometryMode.WIRE : GeometryMode.MESH;
        }
        else if (isDefined(options.k)) {
            const k = mustBeInteger('k', options.k);
            switch (k) {
                case 0: return GeometryMode.POINT;
                case 1: return GeometryMode.WIRE;
                case 2: return GeometryMode.MESH;
                default: {
                    throw new Error("k must be 0, 1, or 2");
                }
            }
        }
        else {
            // In the absence of any hints to the contrary we assume...
            return fallback;
        }
    }
    else {
        return fallback;
    }
}
