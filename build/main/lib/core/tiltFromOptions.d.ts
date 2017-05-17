import { SpinorE3 } from '../math/SpinorE3';
import { VectorE3 } from '../math/VectorE3';
import { R3 } from '../math/R3';
export declare const canonicalAxis: Readonly<R3>;
export declare const canonicalMeridian: Readonly<R3>;
/**
 * tilt takes precedence over axis and meridian.
 */
export declare function tiltFromOptions(options: {
    axis?: VectorE3;
    meridian?: VectorE3;
    tilt?: SpinorE3;
}): SpinorE3;
