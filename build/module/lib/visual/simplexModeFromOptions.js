import { isDefined } from '../checks/isDefined';
import { mustBeBoolean } from '../checks/mustBeBoolean';
import { mustBeInteger } from '../checks/mustBeInteger';
import { GeometryMode } from '../geometries/GeometryMode';
import { SimplexMode } from '../geometries/SimplexMode';
/**
 * Converts from a mode, k, or wireFrame option specification to a SimplexMode.
 * @hidden
 */
export function simplexModeFromOptions(options, fallback) {
    if (options === void 0) { options = {}; }
    if (isDefined(options)) {
        if (isDefined(options.mode)) {
            switch (options.mode) {
                case GeometryMode.MESH: return SimplexMode.TRIANGLE;
                case GeometryMode.WIRE: return SimplexMode.LINE;
                case GeometryMode.POINT: return SimplexMode.POINT;
                case 'mesh': return SimplexMode.TRIANGLE;
                case 'wire': return SimplexMode.LINE;
                case 'point': return SimplexMode.POINT;
                default: {
                    throw new Error("Unknown mode: " + options.mode);
                }
            }
        }
        else if (isDefined(options.wireFrame)) {
            return mustBeBoolean('wireFrame', options.wireFrame) ? SimplexMode.LINE : fallback;
        }
        else if (isDefined(options.k)) {
            var k = mustBeInteger('k', options.k);
            switch (k) {
                case SimplexMode.EMPTY: return SimplexMode.EMPTY;
                case SimplexMode.POINT: return SimplexMode.POINT;
                case SimplexMode.LINE: return SimplexMode.LINE;
                case SimplexMode.TRIANGLE: return SimplexMode.TRIANGLE;
                default: {
                    throw new Error("k: SimplexMode must be -1, 0, 1, or 2");
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
