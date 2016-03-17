import View from '../facets/View'

/**
 * @class ViewController
 */
interface ViewController {
  /**
   * <p>
   * Called during the animation loop to update the target based upon mouse events.
   * </p>
   *
   * @method update
   * @return {void}
   */
  update(): void;

  /**
   * <p>
   * Called at any time to reset the target to the last synchonization point.
   * </p>
   *
   * @method reset
   * @return {void}
   */
  reset(): void;

  /**
   * <p>
   * Called at any time to set a view for this controller.
   * </p>
   * This method also synchronizes the controller with the view.
   *
   * @method setView
   * @param view {View}
   * @return {void}
   */
  setView(view: View): void;

  /**
   * <p>
   * Called at any time to synchronize the controller with the view state.
   * </p>
   */
  synchronize(): void;
}

export default ViewController;
