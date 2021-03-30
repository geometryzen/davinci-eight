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
var COORD_XY = 3;
/**
 * @hidden
 */
export function compG2Set(m, index, value) {
    switch (index) {
        case COORD_W:
            m.a = value;
            break;
        case COORD_X:
            m.x = value;
            break;
        case COORD_Y:
            m.y = value;
            break;
        case COORD_XY:
            m.b = value;
            break;
        default:
            throw new Error("index => " + index);
    }
}
