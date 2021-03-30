/**
 * Reduce to the VectorE3 to a simple object data structure.
 * @hidden
 */
export function vectorE3Object(vector) {
    if (vector) {
        return { x: vector.x, y: vector.y, z: vector.z };
    }
    else {
        return void 0;
    }
}
