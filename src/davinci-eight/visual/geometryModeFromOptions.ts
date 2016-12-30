import isDefined from '../checks/isDefined';
import mustBeBoolean from '../checks/mustBeBoolean';
import mustBeInteger from '../checks/mustBeInteger';
import GeometryMode from '../geometries/GeometryMode';
import SimplexMode from '../geometries/SimplexMode';

/**
 * Converts from a mode, k, or wireFrame option specification to a GeometryMode.
 */
export default function geometryModeFromOptions(options?: { wireFrame?: boolean; k?: SimplexMode; mode?: 'mesh' | 'wire' | 'point' | GeometryMode }, fallback: GeometryMode = GeometryMode.MESH, suppressWarnings = false): GeometryMode {
    if (isDefined(options)) {
        if (isDefined(options.mode)) {
            switch (options.mode) {
                case GeometryMode.POINT: return options.mode;
                case GeometryMode.WIRE: return options.mode;
                case GeometryMode.MESH: return options.mode;
                case 'mesh': return GeometryMode.MESH;
                case 'wire': return GeometryMode.WIRE;
                case 'point': return GeometryMode.POINT;
                default: {
                    throw new Error(`mode must be POINT = ${GeometryMode.POINT}, WIRE = ${GeometryMode.WIRE}, or MESH = ${GeometryMode.MESH}`);
                }
            }
        }
        else if (isDefined(options.wireFrame)) {
            if (!suppressWarnings) {
                console.warn("wireFrame: boolean is deprecated. Please use mode: GeometryMode instead.");
            }
            return mustBeBoolean('wireFrame', options.wireFrame) ? GeometryMode.WIRE : fallback;
        }
        else if (isDefined(options.k)) {
            if (!suppressWarnings) {
                console.warn("k: SimplexMode is deprecated. Please use mode: GeometryMode instead.");
            }
            const k: SimplexMode = mustBeInteger('k', options.k);
            switch (k) {
                case SimplexMode.POINT: return GeometryMode.POINT;
                case SimplexMode.LINE: return GeometryMode.WIRE;
                case SimplexMode.TRIANGLE: return GeometryMode.MESH;
                default: {
                    throw new Error(`k must be POINT = ${SimplexMode.POINT}, LINE = ${SimplexMode.LINE}, or TRIANGLE = ${SimplexMode.TRIANGLE}`);
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
