import { VectorE3 } from '../math/VectorE3';
import { SpinorE3 } from '../math/SpinorE3';

export interface TetrahedronOptions {
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
