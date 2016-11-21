import { Geometric3 } from '../math/Geometric3';
import SpinorE3 from '../math/SpinorE3';
import VectorE3 from '../math/VectorE3';

/**
 * This function computes the initial requested direction of an object.
 */
export default function tiltFromOptions(options: { axis?: VectorE3; tilt?: SpinorE3 }, canonical: VectorE3): SpinorE3 {
    if (options.tilt) {
        return options.tilt;
    }
    else if (options.axis) {
        const axis = options.axis;
        return Geometric3.rotorFromDirections(canonical, axis);
    }
    else {
        return Geometric3.one();
    }
}
