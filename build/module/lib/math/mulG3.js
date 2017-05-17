import { compG3Get as get } from '../math/compG3Get';
import { mulE3 } from '../math/mulE3';
export function mulG3(a, b, out) {
    var a0 = a.a;
    var a1 = a.x;
    var a2 = a.y;
    var a3 = a.z;
    var a4 = a.xy;
    var a5 = a.yz;
    var a6 = a.zx;
    var a7 = a.b;
    var b0 = get(b, 0);
    var b1 = get(b, 1);
    var b2 = get(b, 2);
    var b3 = get(b, 3);
    var b4 = get(b, 4);
    var b5 = get(b, 5);
    var b6 = get(b, 6);
    var b7 = get(b, 7);
    var iLen = out.length;
    for (var i = 0; i < iLen; i++) {
        out[i] = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, i);
    }
}
