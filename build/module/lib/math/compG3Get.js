// GraphicsProgramSymbols constants for the coordinate indices into the data array.
// These are chosen to match those used by G3.
// TODO: The goal should be to protect the user from changes in ordering.
var COORD_W = 0;
var COORD_X = 1;
var COORD_Y = 2;
var COORD_Z = 3;
var COORD_XY = 4;
var COORD_YZ = 5;
var COORD_ZX = 6;
var COORD_XYZ = 7;
export function compG3Get(m, index) {
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
