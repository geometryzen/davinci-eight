import VectorE3 from '../math/VectorE3';
import SpinorE3 from '../math/SpinorE3';

/**
 *
 */
export interface CylinderOptions {
    /**
     * Defaults to e2.
     */
    axis?: VectorE3;
    /**
     * 
     */
    color?: { r: number; g: number; b: number };
    /**
     * Defaults to 1.
     */
    length?: number;
    /**
     * 
     */
    meridian?: VectorE3;
    /**
     * Defaults to false.
     */
    openBase?: boolean;
    /**
     * Defaults to false.
     */
    openCap?: boolean;
    /**
     * Defaults to false.
     */
    openWall?: boolean;
    /**
     * Defaults to 1.
     */
    radius?: number;
    /**
     * 
     */
    tilt?: SpinorE3;
}

export default CylinderOptions;
