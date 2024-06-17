import { VectorE3 } from "../math/VectorE3";

/**
 * Reduce an implementation of VectorE3 to a simple object data structure (which is a copy).
 * @hidden
 *
 * @param vector The implementation to be copied.
 */
export function vectorE3Object(vector: VectorE3): VectorE3 {
    if (vector) {
        return { x: vector.x, y: vector.y, z: vector.z };
    } else {
        return void 0;
    }
}
