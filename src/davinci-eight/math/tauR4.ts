import Mat4R from './Mat4R'
/*
const Γ1 = Mat4R.zero().set(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, -1
)

const Γ2 = Mat4R.zero().set(
    0, 1, 0, 0,
    1, 0, 0, 0,
    0, 0, 0, -1,
    0, 0, 1, 0
)

const Γ3 = Mat4R.zero().set(
    0, 0, 1, 0,
    0, 0, 0, 1,
    1, 0, 0, 0,
    0, -1, 0, 0
)


const Γ4 = Mat4R.zero().set(
    0, 0, 0, 1,
    0, 0, 1, 0,
    0, -1, 0, 0,
    1, 0, 0, 0
)
*/

/**
 * Computes Γ<sub>R</sub>(a)
 */
export default function tauR4(a1: number, a2: number, a3: number, a4: number, out: Mat4R): Mat4R {
    return out.set(
      a1, a2, a3, -a4,
      a2, a1, a4, -a3,
      a3, -a4, a1, a2,
      a4, -a3, a2, a1)
}
