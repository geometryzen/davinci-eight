import Matrix4 from './Matrix4'
/*
const Γ1 = Matrix4.zero().set(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, -1
)

const Γ2 = Matrix4.zero().set(
    0, 1, 0, 0,
    1, 0, 0, 0,
    0, 0, 0, -1,
    0, 0, 1, 0
)

const Γ3 = Matrix4.zero().set(
    0, 0, 1, 0,
    0, 0, 0, 1,
    1, 0, 0, 0,
    0, -1, 0, 0
)


const Γ4 = Matrix4.zero().set(
    0, 0, 0, 1,
    0, 0, 1, 0,
    0, -1, 0, 0,
    1, 0, 0, 0
)
*/

/**
 * Computes Γ<sub>R</sub>(a)
 */
export default function tauR4(a1: number, a2: number, a3: number, a4: number, out: Matrix4): Matrix4 {
    return out.set(
      a1, a2, a3, -a4,
      a2, a1, a4, -a3,
      a3, -a4, a1, a2,
      a4, -a3, a2, a1)
}
