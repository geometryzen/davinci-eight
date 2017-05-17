import { Geometric3 } from '../math/Geometric3';
/**
 * Reduce to the vectorE3 data structure.
 * If the value of the vector is 0, return void 0.
 */
function simplify(vector) {
    if (vector.x !== 0 || vector.y !== 0 || vector.z !== 0) {
        return { x: vector.x, y: vector.y, z: vector.z };
    }
    else {
        return void 0;
    }
}
/**
 * This function computes the initial requested direction of an object.
 */
export function offsetFromOptions(options) {
    if (options.offset) {
        return simplify(options.offset);
    }
    else {
        return simplify(Geometric3.ZERO);
    }
}
