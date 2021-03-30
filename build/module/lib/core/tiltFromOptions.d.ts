import { R3 } from '../math/R3';
import { SpinorE3 } from '../math/SpinorE3';
import { VectorE3 } from '../math/VectorE3';
/**
 * e2 = vec(0, 1, 0)
 * @hidden
 */
export declare const canonicalAxis: Readonly<R3>;
/**
 * e3 = vec(0, 0, 1)
 * @hidden
 */
export declare const canonicalMeridian: Readonly<R3>;
/**
 * tilt takes precedence over axis and meridian.
 * @hidden
 */
export declare function tiltFromOptions(options: {
    axis?: VectorE3;
    meridian?: VectorE3;
    tilt?: SpinorE3;
}): SpinorE3;
