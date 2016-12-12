import { R3 } from '../math/R3';
import vec from '../math/R3';
import SpinorE3 from '../math/SpinorE3';
import VectorE3 from '../math/VectorE3';

/**
 * This function computes the initial requested axis of an object.
 */
export default function initialAxis(options: { axis?: VectorE3; tilt?: SpinorE3 }, fallback: VectorE3): R3 {
    if (options.axis) {
        const axis = options.axis;
        return vec(axis.x, axis.y, axis.z).direction();
    }
    else {
        return vec(fallback.x, fallback.y, fallback.z);
    }
}
