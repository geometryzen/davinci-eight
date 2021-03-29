import { SpinorE3 } from '../math/SpinorE3';

/**
 * Reduce to the SpinorE3 to a simple object data structure.
 * @hidden
 */
export function spinorE3Object(spinor: SpinorE3): SpinorE3 {
    if (spinor) {
        return { a: spinor.a, xy: spinor.xy, yz: spinor.yz, zx: spinor.zx };
    }
    else {
        return void 0;
    }
}
