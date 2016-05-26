import View from '../facets/View'

/**
 *
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
  setView(view: View): void;

  /**
   * <p>
   * Called at any time to synchronize the controller with the view state.
   * </p>
   */
  synchronize(): void;
}
