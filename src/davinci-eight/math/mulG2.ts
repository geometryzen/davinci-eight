import GeometricE2 from '../math/GeometricE2';
import get from '../math/compG2Get';
import mulE2 from '../math/mulE2';
import set from '../math/compG2Set';

export default function <T extends GeometricE2>(a: GeometricE2, b: GeometricE2, out: T): T {

    let a0 = get(a, 0)
    let a1 = get(a, 1)
    let a2 = get(a, 2)
    let a3 = get(a, 3)

    let b0 = get(b, 0)
    let b1 = get(b, 1)
    let b2 = get(b, 2)
    let b3 = get(b, 3)

    for (var i = 0; i < 4; i++) {
        set(out, i, mulE2(a0, a1, a2, a3, b0, b1, b2, b3, i))
    }

    return out;
}
