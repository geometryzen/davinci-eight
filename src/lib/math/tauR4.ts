import { Matrix4 } from "./Matrix4";
/**
 * Computes Γ<sub>R</sub>(a)
 * @hidden
 *
 * Γ1 =
 * 1, 0, 0, 0,
 * 0, 1, 0, 0,
 * 0, 0, 1, 0,
 * 0, 0, 0, -1
 *
 * Γ2 =
 * 0, 1, 0, 0,
 * 1, 0, 0, 0,
 * 0, 0, 0, -1,
 * 0, 0, 1, 0
 *
 * Γ3 =
 * 0, 0, 1, 0,
 * 0, 0, 0, 1,
 * 1, 0, 0, 0,
 * 0, -1, 0, 0
 *
 * Γ4 =
 * 0, 0, 0, 1,
 * 0, 0, 1, 0,
 * 0, -1, 0, 0,
 * 1, 0, 0, 0
 *
 * @param a1 The element on the main diagonal.
 * @param a2
 * @param a3
 * @param a4 The element (alternating sign) on the minor diagonal.
 * @param out The matrix that accepts the result.
 * @returns
 */
export function tauR4(a1: number, a2: number, a3: number, a4: number, out: Matrix4): Matrix4 {
    return out.set(a1, a2, a3, -a4, a2, a1, a4, -a3, a3, -a4, a1, a2, a4, -a3, a2, a1);
}
