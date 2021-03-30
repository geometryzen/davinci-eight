import { VectorE3 } from '../math/VectorE3';

/**
 * @hidden
 */
export interface Camera {
    /**
     * The position of the camera, a position vector.
     */
    eye: VectorE3;
    /**
     * The point (position vector) that the camera looks at.
     */
    look: VectorE3;
    /**
     * The direction that is used to orient the camera. 
     */
    up: VectorE3;
}
