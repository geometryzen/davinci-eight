import { R3 } from '../math/R3';
export interface ALMRS {
    /**
     * Default e2
     */
    axis: Readonly<R3>;
    /**
     * Default 1
     */
    length: number;
    /**
     * Default e3
     */
    meridian: Readonly<R3>;
    /**
     * Default 0.5
     */
    radius: number;
    /**
     * Default tau
     */
    sliceAngle: number;
}
/**
 * Defaults:
 * axis:       e2,
 * length:     1,
 * meridian:   e3,
 * radius:     0.5,
 * sliceAngle: tau.
 */
export declare const ds: ALMRS;
