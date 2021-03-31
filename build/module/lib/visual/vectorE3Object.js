/**
 * Reduce an implementation of VectorE3 to a simple object data structure (which is a copy).
 * @hidden
 *
 * @param vector The implementation to be copied.
 */
export function vectorE3Object(vector) {
    if (vector) {
        return { x: vector.x, y: vector.y, z: vector.z };
    }
    else {
        return void 0;
    }
}
