import { Geometric3 } from "../math/Geometric3";
import { VectorE3 } from "../math/VectorE3";

/**
 * Reduce to the vectorE3 data structure.
 * If the value of the vector is 0, return undefined.
 * TODO: Why do we do this "dangerous" thing?
 * @hidden
 */
function simplify(vector: VectorE3): VectorE3 {
    if (vector.x !== 0 || vector.y !== 0 || vector.z !== 0) {
        return { x: vector.x, y: vector.y, z: vector.z };
    } else {
        return void 0;
    }
}

/**
 * This function computes the initial requested offset of an object.
 * @hidden
 */
export function offsetFromOptions(options: { offset?: VectorE3 }): VectorE3 {
    if (options.offset) {
        return simplify(options.offset);
    } else {
        return simplify(Geometric3.ZERO);
    }
}
