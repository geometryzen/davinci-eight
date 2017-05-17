"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var COORD_W = 0;
var COORD_X = 1;
var COORD_Y = 2;
var COORD_Z = 3;
var COORD_XY = 4;
var COORD_YZ = 5;
var COORD_ZX = 6;
var COORD_XYZ = 7;
function compG3Set(m, index, value) {
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
exports.compG3Set = compG3Set;
