/**
 * Multiplication of Geometric3.
 * This was originally written for asm.
 */
export function mulE3(a0: number, a1: number, a2: number, a3: number, a4: number, a5: number, a6: number, a7: number, b0: number, b1: number, b2: number, b3: number, b4: number, b5: number, b6: number, b7: number, index: number): number {
    switch (index) {
        case 0: {
            return a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3 - a4 * b4 - a5 * b5 - a6 * b6 - a7 * b7;
        }
        case 1: {
            return a0 * b1 + a1 * b0 - a2 * b4 + a3 * b6 + a4 * b2 - a5 * b7 - a6 * b3 - a7 * b5;
        }
        case 2: {
            return a0 * b2 + a1 * b4 + a2 * b0 - a3 * b5 - a4 * b1 + a5 * b3 - a6 * b7 - a7 * b6;
        }
        case 3: {
            return a0 * b3 - a1 * b6 + a2 * b5 + a3 * b0 - a4 * b7 - a5 * b2 + a6 * b1 - a7 * b4;
        }
        case 4: {
            return a0 * b4 + a1 * b2 - a2 * b1 + a3 * b7 + a4 * b0 - a5 * b6 + a6 * b5 + a7 * b3;
        }
        case 5: {
            return a0 * b5 + a1 * b7 + a2 * b3 - a3 * b2 + a4 * b6 + a5 * b0 - a6 * b4 + a7 * b1;
        }
        case 6: {
            return a0 * b6 - a1 * b3 + a2 * b7 + a3 * b1 - a4 * b5 + a5 * b4 + a6 * b0 + a7 * b2;
        }
        case 7: {
            return a0 * b7 + a1 * b5 + a2 * b6 + a3 * b4 + a4 * b3 + a5 * b1 + a6 * b2 + a7 * b0;
        }
        default: {
            throw new Error("index must be in the range [0..7]");
        }
    }
}
