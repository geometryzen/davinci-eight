import VectorE3 from '../math/VectorE3';
import R3 from '../math/R3';

/**
 * This function computes the initial requested direction of an object.
 * If no particular direction is requested
 */
export default function(options: { axis?: VectorE3 }): R3 {
    if (options.axis) {
        return R3.direction(options.axis);
    }
    else {
        // FIXME: This needs to be the direction associated with the Geometry?
        return R3.e2;
    }
}
