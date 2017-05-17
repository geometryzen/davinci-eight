
export function extE3(a0: number, a1: number, a2: number, a3: number, a4: number, a5: number, a6: number, a7: number, b0: number, b1: number, b2: number, b3: number, b4: number, b5: number, b6: number, b7: number, index: number): number {
    a0 = +a0;
    a1 = +a1;
    a2 = +a2;
    a3 = +a3;
    a4 = +a4;
    a5 = +a5;
    a6 = +a6;
    a7 = +a7;
    b0 = +b0;
    b1 = +b1;
    b2 = +b2;
    b3 = +b3;
    b4 = +b4;
    b5 = +b5;
    b6 = +b6;
    b7 = +b7;
    index = index | 0;
    var x = 0.0;
    switch (~(~index)) {
        case 0: {
            x = +(a0 * b0);
        }
            break;
        case 1: {
            x = +(a0 * b1 + a1 * b0);
        }
            break;
        case 2: {
            x = +(a0 * b2 + a2 * b0);
        }
            break;
        case 3: {
            x = +(a0 * b3 + a3 * b0);
        }
            break;
        case 4: {
            x = +(a0 * b4 + a1 * b2 - a2 * b1 + a4 * b0);
        }
            break;
        case 5: {
            x = +(a0 * b5 + a2 * b3 - a3 * b2 + a5 * b0);
        }
            break;
        case 6: {
            x = +(a0 * b6 - a1 * b3 + a3 * b1 + a6 * b0);
        }
            break;
        case 7: {
            x = +(a0 * b7 + a1 * b5 + a2 * b6 + a3 * b4 + a4 * b3 + a5 * b1 + a6 * b2 + a7 * b0);
        }
            break;
        default: {
            throw new Error("index must be in the range [0..7]");
        }
    }
    return +x;
}
