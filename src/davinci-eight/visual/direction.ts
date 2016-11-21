import { R3 } from '../math/R3';
import vec from '../math/R3';
import SpinorE3 from '../math/SpinorE3';
import VectorE3 from '../math/VectorE3';

/**
 * This function computes the initial requested direction of an object.
 */
export default function (options: { axis?: VectorE3; tilt?: SpinorE3 }, canonical: VectorE3): R3 {
    if (options.axis) {
        const axis = options.axis;
        return vec(axis.x, axis.y, axis.z).direction();
    }
    else {
        return vec(canonical.x, canonical.y, canonical.z);
    }
}
