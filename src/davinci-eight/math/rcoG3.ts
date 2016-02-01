import GeometricE3 from '../math/GeometricE3';
import get from '../math/compG3Get';
import rcoE3 from '../math/rcoE3';
import set from '../math/compG3Set';

export default function rcoG3<T extends GeometricE3>(a: GeometricE3, b: GeometricE3, out: T): T {

    let a0 = get(a, 0)
    let a1 = get(a, 1)
    let a2 = get(a, 2)
    let a3 = get(a, 3)
    let a4 = get(a, 4)
    let a5 = get(a, 5)
    let a6 = get(a, 6)
    let a7 = get(a, 7)

    let b0 = get(b, 0)
    let b1 = get(b, 1)
    let b2 = get(b, 2)
    let b3 = get(b, 3)
    let b4 = get(b, 4)
    let b5 = get(b, 5)
    let b6 = get(b, 6)
    let b7 = get(b, 7)

    for (var i = 0; i < 8; i++) {
        set(out, i, rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, i))
    }

    return out;
}
