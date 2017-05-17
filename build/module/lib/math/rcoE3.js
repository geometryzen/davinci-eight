export function rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
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
        case 0:
            {
                x = +(a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3 - a4 * b4 - a5 * b5 - a6 * b6 - a7 * b7);
            }
            break;
        case 1:
            {
                x = +(+a1 * b0 + a4 * b2 - a6 * b3 - a7 * b5);
            }
            break;
        case 2:
            {
                x = +(+a2 * b0 - a4 * b1 + a5 * b3 - a7 * b6);
            }
            break;
        case 3:
            {
                x = +(+a3 * b0 - a5 * b2 + a6 * b1 - a7 * b4);
            }
            break;
        case 4:
            {
                x = +(+a4 * b0 + a7 * b3);
            }
            break;
        case 5:
            {
                x = +(+a5 * b0 + a7 * b1);
            }
            break;
        case 6:
            {
                x = +(+a6 * b0 + a7 * b2);
            }
            break;
        case 7:
            {
                x = +(+a7 * b0);
            }
            break;
        default: {
            throw new Error("index must be in the range [0..7]");
        }
    }
    return +x;
}
