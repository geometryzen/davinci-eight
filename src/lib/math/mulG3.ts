import { GeometricE3 } from '../math/GeometricE3';
import { compG3Get as get } from '../math/compG3Get';
import { mulE3 } from '../math/mulE3';

export function mulG3(a: GeometricE3, b: GeometricE3, out: number[]): void {

    const a0 = a.a;
    const a1 = a.x;
    const a2 = a.y;
    const a3 = a.z;
    const a4 = a.xy;
    const a5 = a.yz;
    const a6 = a.zx;
    const a7 = a.b;

    const b0 = get(b, 0);
    const b1 = get(b, 1);
    const b2 = get(b, 2);
    const b3 = get(b, 3);
    const b4 = get(b, 4);
    const b5 = get(b, 5);
    const b6 = get(b, 6);
    const b7 = get(b, 7);

    const iLen = out.length;
    for (let i = 0; i < iLen; i++) {
        out[i] = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, i);
    }
}
