import { R3 } from '../math/R3';
import { SpinorE3 } from '../math/SpinorE3';
import { VectorE3 } from '../math/VectorE3';
export interface AxisOptions {
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
 * This function computes the reference axis of an object.
 */
export declare function referenceAxis(options: AxisOptions, fallback: VectorE3): Readonly<R3>;
