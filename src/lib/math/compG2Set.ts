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
const COORD_XY = 3;

/**
 * @hidden
 */
export function compG2Set(m: { a: number; x: number; y: number; b: number }, index: number, value: number): void {
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
