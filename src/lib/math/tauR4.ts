import { Matrix4 } from './Matrix4';
/**
 * Computes Γ<sub>R</sub>(a)
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
 */
export function tauR4(a1: number, a2: number, a3: number, a4: number, out: Matrix4): Matrix4 {
    return out.set(
        a1, a2, a3, -a4,
        a2, a1, a4, -a3,
        a3, -a4, a1, a2,
        a4, -a3, a2, a1);
}
