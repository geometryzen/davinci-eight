import isDefined from '../checks/isDefined';
import mustBeBoolean from '../checks/mustBeBoolean';
import mustBeInteger from '../checks/mustBeInteger';
import GeometryMode from '../geometries/GeometryMode';
import SimplexMode from '../geometries/SimplexMode';

/**
 * Converts from a mode, k, or wireFrame option specification to a SimplexMode.
 */
export default function simplexFromOptions(options?: { wireFrame?: boolean; k?: number; mode?: GeometryMode }, fallback: SimplexMode = SimplexMode.TRIANGLE): SimplexMode {
    if (isDefined(options)) {
        if (isDefined(options.mode)) {
            return mustBeInteger('mode', options.mode);
        }
        else if (isDefined(options.wireFrame)) {
            return mustBeBoolean('wireFrame', options.wireFrame) ? SimplexMode.LINE : fallback;
        }
        else if (isDefined(options.k)) {
            const k = mustBeInteger('k', options.k);
            switch (k) {
                case -1: return SimplexMode.EMPTY;
                case 0: return SimplexMode.POINT;
                case 1: return SimplexMode.LINE;
                case 2: return SimplexMode.TRIANGLE;
                default: {
                    throw new Error("k must be -1, 0, 1, or 2");
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
