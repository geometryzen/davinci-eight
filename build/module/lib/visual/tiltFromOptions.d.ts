import { SpinorE3 } from '../math/SpinorE3';
import { VectorE3 } from '../math/VectorE3';
/**
 * This function computes the initial requested direction of an object.
 */
export declare function tiltFromOptions(options: {
    axis?: VectorE3;
    tilt?: SpinorE3;
}, canonical: VectorE3): SpinorE3;
