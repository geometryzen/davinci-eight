import { SpinorE3 } from '../math/SpinorE3';
import { VectorE3 } from '../math/VectorE3';

/**
 *
 */
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
    mode?: 'mesh' | 'wire' | 'point';
    /**
     * 
     */
    offset?: VectorE3;
    /**
     * 
     */
    tilt?: SpinorE3;
    textured?: boolean;
    transparent?: boolean;
    emissive?: boolean;
    colored?: boolean;
    reflective?: boolean;
}
