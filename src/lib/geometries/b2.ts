// Quadratic Bezier

/**
 * @hidden
 */
function b2p0(t: number, p: number): number {
    const k = 1 - t;
    return k * k * p;
}

/**
 * @hidden
 */
function b2p1(t: number, p: number): number {
    return 2 * (1 - t) * t * p;
}

/**
 * @hidden
 */
function b2p2(t: number, p: number): number {
    return t * t * p;
}

/**
 * @hidden
 */
export function b2(t: number, begin: number, control: number, end: number): number {
    return b2p0(t, begin) + b2p1(t, control) + b2p2(t, end);
}
