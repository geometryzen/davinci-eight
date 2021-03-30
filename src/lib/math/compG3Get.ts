import { GeometricE3 } from '../math/GeometricE3';

// GraphicsProgramSymbols constants for the coordinate indices into the data array.
// These are chosen to match those used by G3.
// TODO: The goal should be to protect the user from changes in ordering.
/**
 * @hidden
 */
const COORD_W = 0;
/**
 * @hidden
 */
const COORD_X = 1;
/**
 * @hidden
 */
const COORD_Y = 2;
/**
 * @hidden
 */
const COORD_Z = 3;
/**
 * @hidden
 */
const COORD_XY = 4;
/**
 * @hidden
 */
const COORD_YZ = 5;
/**
 * @hidden
 */
const COORD_ZX = 6;
/**
 * @hidden
 */
const COORD_XYZ = 7;

/**
 * @hidden
 */
export function compG3Get(m: GeometricE3, index: number): number {
    switch (index) {
        case COORD_W: {
            return m.a;
        }
        case COORD_X: {
            return m.x;
        }
        case COORD_Y: {
            return m.y;
        }
        case COORD_Z: {
            return m.z;
        }
        case COORD_XY: {
            return m.xy;
        }
        case COORD_YZ: {
            return m.yz;
        }
        case COORD_ZX: {
            return m.zx;
        }
        case COORD_XYZ: {
            return m.b;
        }
        default: {
            throw new Error("index => " + index);
        }
    }
}
