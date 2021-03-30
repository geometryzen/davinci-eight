import { compG3Get as get } from '../math/compG3Get';
import { mulE3 } from '../math/mulE3';
import { compG3Set as set } from '../math/compG3Set';
/**
 * @hidden
 */
export function scpG3(a, b, out) {
    var a0 = get(a, 0);
    var a1 = get(a, 1);
    var a2 = get(a, 2);
    var a3 = get(a, 3);
    var a4 = get(a, 4);
    var a5 = get(a, 5);
    var a6 = get(a, 6);
    var a7 = get(a, 7);
    var b0 = get(b, 0);
    var b1 = get(b, 1);
    var b2 = get(b, 2);
    var b3 = get(b, 3);
    var b4 = get(b, 4);
    var b5 = get(b, 5);
    var b6 = get(b, 6);
    var b7 = get(b, 7);
    set(out, 0, mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0));
    set(out, 1, 0);
    set(out, 2, 0);
    set(out, 3, 0);
    set(out, 4, 0);
    set(out, 5, 0);
    set(out, 6, 0);
    set(out, 7, 0);
    return out;
}
