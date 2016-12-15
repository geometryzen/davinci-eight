import SpinorE3 from '../math/SpinorE3';
import VectorE3 from '../math/VectorE3';

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
    meridian?: VectorE3;
    /**
     * 
     */
    tilt?: SpinorE3;
}

export default BasisOptions;
