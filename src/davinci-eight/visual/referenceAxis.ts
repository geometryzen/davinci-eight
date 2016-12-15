import Geometric3 from '../math/Geometric3';
import { R3 } from '../math/R3';
import vec from '../math/R3';
import { canonicalAxis, canonicalMeridian } from '../core/tiltFromOptions';
import SpinorE3 from '../math/SpinorE3';
import VectorE3 from '../math/VectorE3';

/**
 * This function computes the reference axis of an object.
 */
export default function referenceAxis(options: { axis?: VectorE3; meridian?: VectorE3; tilt?: SpinorE3 }, fallback: VectorE3): R3 {
    if (options.tilt) {
        const axis = Geometric3.fromVector(canonicalAxis).rotate(options.tilt);
        return vec(axis.x, axis.y, axis.z);
    }
    else if (options.axis) {
        const axis = options.axis;
        return vec(axis.x, axis.y, axis.z).direction();
    }
    else if (options.meridian) {
        const B = Geometric3.dualOfVector(canonicalAxis);
        const tilt = Geometric3.rotorFromVectorToVector(canonicalMeridian, options.meridian, B);
        const axis = Geometric3.fromVector(canonicalAxis).rotate(tilt);
        return vec(axis.x, axis.y, axis.z).direction();
    }
    else {
        return vec(fallback.x, fallback.y, fallback.z);
    }
}
