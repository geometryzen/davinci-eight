export function scpE2(a0: number, a1: number, a2: number, a3: number, b0: number, b1: number, b2: number, b3: number, index: number): number {
    switch (index) {
        case 0:
            return a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3;
        case 1:
            return 0;
        case 2:
            return 0;
        case 3:
            return 0;
        default:
            throw new Error("index must be in the range [0..3]");
    }
}
