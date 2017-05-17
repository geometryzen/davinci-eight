import { R3 } from '../math/R3';
import { SpinorE3 } from '../math/SpinorE3';
import { VectorE3 } from '../math/VectorE3';
export interface MeridianOptions {
    /**
     *
     */
    axis?: VectorE3;
    /**
     * Deprecated. Use axis instead.
     */
    height?: VectorE3 | number;
    /**
     *
     */
    meridian?: VectorE3;
    /**
     * Deprecated. Use meridian instead,
     */
    cutLine?: VectorE3;
    /**
     *
     */
    tilt?: SpinorE3;
}
/**
 * This function computes the reference meridian of an object.
 */
export declare function referenceMeridian(options: MeridianOptions, fallback: VectorE3): Readonly<R3>;
