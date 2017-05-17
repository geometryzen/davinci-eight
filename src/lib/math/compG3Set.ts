const COORD_W = 0;
const COORD_X = 1;
const COORD_Y = 2;
const COORD_Z = 3;
const COORD_XY = 4;
const COORD_YZ = 5;
const COORD_ZX = 6;
const COORD_XYZ = 7;

export function compG3Set(m: { a: number; x: number; y: number; z: number; xy: number; yz: number; zx: number; b: number; }, index: number, value: number): void {
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
