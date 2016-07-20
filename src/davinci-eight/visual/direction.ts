import VectorE3 from '../math/VectorE3';
import Vector3 from '../math/Vector3';

/**
 * This function computes the initial requested direction of an object.
 * If no particular direction is requested
 */
export default function(options: { axis?: VectorE3 }): VectorE3 {
    if (options.axis) {
        return Vector3.copy(options.axis).normalize();
    }
    else {
        // FIXME: This needs to be the direction associated with the Geometry?
        return Vector3.vector(0, 1, 0);
    }
}
