import { Geometric3 } from '../math/Geometric3';
/**
 * Reduce to the SpinorE3 data structure.
 * If the value of the spinor is 1, return void 0.
 */
function simplify(spinor) {
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
export function tiltFromOptions(options, canonical) {
    if (options.tilt) {
        return simplify(options.tilt);
    }
    else if (options.axis) {
        var axis = options.axis;
        return simplify(Geometric3.rotorFromDirections(canonical, axis));
    }
    else {
        return simplify(Geometric3.ONE);
    }
}
