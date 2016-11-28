import VectorE3 from '../math/VectorE3';

/**
 *
 */
export interface CylinderOptions {
    /**
     * Defaults to e2.
     */
    axis?: VectorE3;
    /**
     * Defaults to 1.
     */
    length?: number;
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
}

export default CylinderOptions;
