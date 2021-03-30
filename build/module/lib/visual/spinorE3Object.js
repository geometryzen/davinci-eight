/**
 * Reduce to the SpinorE3 to a simple object data structure.
 * @hidden
 */
export function spinorE3Object(spinor) {
    if (spinor) {
        return { a: spinor.a, xy: spinor.xy, yz: spinor.yz, zx: spinor.zx };
    }
    else {
        return void 0;
    }
}
