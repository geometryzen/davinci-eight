import { Geometric3 } from '../math/Geometric3';
import { SpinorE3 } from '../math/SpinorE3';
import { VectorE3 } from '../math/VectorE3';

/**
 * Reduce to the SpinorE3 data structure.
 * If the value of the spinor is 1, return void 0.
 */
function simplify(spinor: SpinorE3): SpinorE3 {
    if (spinor.a !== 1 || spinor.xy !== 0 || spinor.yz !== 0 || spinor.zx !== 0) {
        return { a: spinor.a, xy: spinor.xy, yz: spinor.yz, zx: spinor.zx };
    }
    else {
        return void 0;
    }
}

/**
 * This function computes the initial requested direction of an object.
 */
export function tiltFromOptions(options: { axis?: VectorE3; tilt?: SpinorE3 }, canonical: VectorE3): SpinorE3 {
    if (options.tilt) {
        return simplify(options.tilt);
    }
    else if (options.axis) {
        const axis = options.axis;
        return simplify(Geometric3.rotorFromDirections(canonical, axis));
    }
    else {
        return simplify(Geometric3.ONE);
    }
}
