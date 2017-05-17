import { GeometricE2 } from '../math/GeometricE2';
import { compG2Get as get } from '../math/compG2Get';
import { mulE2 } from '../math/mulE2';
import { compG2Set as set } from '../math/compG2Set';

export function mulG2<T extends GeometricE2>(a: GeometricE2, b: GeometricE2, out: T): T {

    const a0 = get(a, 0);
    const a1 = get(a, 1);
    const a2 = get(a, 2);
    const a3 = get(a, 3);

    const b0 = get(b, 0);
    const b1 = get(b, 1);
    const b2 = get(b, 2);
    const b3 = get(b, 3);

    for (let i = 0; i < 4; i++) {
        set(out, i, mulE2(a0, a1, a2, a3, b0, b1, b2, b3, i));
    }

    return out;
}
