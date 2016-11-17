import SpinorE3 from '../math/SpinorE3';
import VectorE3 from '../math/VectorE3';

/**
 *
 */
interface VisualOptions {
    /**
     * 
     */
    color?: { r: number; g: number; b: number };

    /**
     * Displacement (vector) to be applied to the geometry at construction time to establish the reference location.
     * This cannot be changed once the object has been created because it is burned-in to the vertex locations.
     */
    offset?: VectorE3;

    /**
     * Rotation (spinor) to be applied to the geometry at construction time to establish the reference orientation.
     * This cannot be changed once the object has been created because it is burned-in to the vertex locations.
     */
    tilt?: SpinorE3;

    /**
     * Scaling (tensor) to be applied to the geometry at construction time to establish the reference size.
     * This cannot be changed once the object has been created because it is burned-in to the vertex locations.
     */
    stress?: VectorE3;
}

export default VisualOptions;
