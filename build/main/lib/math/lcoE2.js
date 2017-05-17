"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, index) {
    a0 = +a0;
    a1 = +a1;
    a2 = +a2;
    a3 = +a3;
    b0 = +b0;
    b1 = +b1;
    b2 = +b2;
    b3 = +b3;
    index = index | 0;
    var x = 0.0;
    switch (~(~index)) {
        case 0:
            {
                x = +(a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3);
            }
            break;
        case 1:
            {
                x = +(a0 * b1 - a2 * b3);
            }
            break;
        case 2:
            {
                x = +(a0 * b2 + a1 * b3);
            }
            break;
        case 3:
            {
                x = +(a0 * b3);
            }
            break;
        default: {
            throw new Error("index must be in the range [0..3]");
        }
    }
    return +x;
}
exports.lcoE2 = lcoE2;
