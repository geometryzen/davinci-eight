import { SpinorE3 } from '../math/SpinorE3';
import { VectorE3 } from '../math/VectorE3';

/**
 *
 */
export interface BasisOptions {
    /**
     * 
     */
    axis?: VectorE3;
    /**
     * 
     */
    color?: { r: number; g: number; b: number };
    /**
     * 
     */
    meridian?: VectorE3;
    /**
     * 
     */
    tilt?: SpinorE3;
}
