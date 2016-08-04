import ContextManager from '../core/ContextManager';
import SpinorE3 from '../math/SpinorE3';
import VectorE3 from '../math/VectorE3';

/**
 *
 */
interface VisualOptions {

    /**
     * <p>
     * Attitude (spinor)
     * </p>
     *
     * @default 1
     */
    attitude?: SpinorE3;

    /**
     *
     */
    contextManager?: ContextManager;

    /**
     * <p>
     * Displacement (vector) to be applied to the geometry at construction time to establish the reference location.
     * This cannot be changed once the object has been created because it is burned-in to the vertex locations.
     * </p>
     *
     * @default 0
     */
    offset?: VectorE3;

    /**
     * <p>
     * Position (vector)
     * </p>
     *
     * @default 0
     */
    position?: VectorE3;

    /**
     * <p>
     * Rotation (spinor) to be applied to the geometry at construction time to establish the reference orientation.
     * This cannot be changed once the object has been created because it is burned-in to the vertex locations.
     * </p>
     *
     * @default 1
     */
    tilt?: SpinorE3;
}

export default VisualOptions;
