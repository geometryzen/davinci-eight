"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compG2Set = void 0;
var COORD_W = 0;
var COORD_X = 1;
var COORD_Y = 2;
var COORD_XY = 3;
function compG2Set(m, index, value) {
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
exports.compG2Set = compG2Set;
