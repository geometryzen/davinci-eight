/**
 * @hidden
 */
var COORD_W = 0;
/**
 * @hidden
 */
var COORD_X = 1;
/**
 * @hidden
 */
var COORD_Y = 2;
/**
 * @hidden
 */
var COORD_Z = 3;
/**
 * @hidden
 */
var COORD_XY = 4;
/**
 * @hidden
 */
var COORD_YZ = 5;
/**
 * @hidden
 */
var COORD_ZX = 6;
/**
 * @hidden
 */
var COORD_XYZ = 7;
/**
 * @hidden
 */
export function compG3Set(m, index, value) {
    switch (index) {
        case COORD_W: {
            m.a = value;
            break;
        }
        case COORD_X: {
            m.x = value;
            break;
        }
        case COORD_Y: {
            m.y = value;
            break;
        }
        case COORD_Z: {
            m.z = value;
            break;
        }
        case COORD_XY: {
            m.xy = value;
            break;
        }
        case COORD_YZ: {
            m.yz = value;
            break;
        }
        case COORD_ZX: {
            m.zx = value;
            break;
        }
        case COORD_XYZ: {
            m.b = value;
            break;
        }
        default:
            throw new Error("index => " + index);
    }
}
