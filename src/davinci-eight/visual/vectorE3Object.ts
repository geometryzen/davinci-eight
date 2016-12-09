import VectorE3 from '../math/VectorE3';

/**
 * Reduce to the VectorE3 to a simple object data structure.
 */
export default function vectorE3Object(vector: VectorE3): VectorE3 {
    if (vector) {
        return { x: vector.x, y: vector.y, z: vector.z };
    }
    else {
        return void 0;
    }
}
