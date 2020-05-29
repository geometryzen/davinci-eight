"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tauR4 = void 0;
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
function tauR4(a1, a2, a3, a4, out) {
    return out.set(a1, a2, a3, -a4, a2, a1, a4, -a3, a3, -a4, a1, a2, a4, -a3, a2, a1);
}
exports.tauR4 = tauR4;
