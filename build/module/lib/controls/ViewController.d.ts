import { VectorE3 } from '../math/VectorE3';
/**
 * @hidden
 */
export interface ViewController {
    /**
     * <p>
     * Called during the animation loop to update the target based upon mouse events.
     * </p>
     */
    update(): void;
    /**
     * <p>
     * Called at any time to reset the target to the last synchonization point.
     * </p>
     */
    reset(): void;
    /**
     * <p>
     * Called at any time to set a view for this controller.
     * </p>
     * This method also synchronizes the controller with the view.
     *
     * @param view
     */
    setView(view: {
        eye: VectorE3;
        look: VectorE3;
        up: VectorE3;
    }): void;
    /**
     * <p>
     * Called at any time to synchronize the controller with the view state.
     * </p>
     */
    synchronize(): void;
}
