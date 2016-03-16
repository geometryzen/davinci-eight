import View from '../facets/View'

/**
 * @class ViewController
 */
interface ViewController {
  /**
   * Called during the animation loop to update the target.
   *
   * @method update
   * @return {void}
   */
  update(): void;

  /**
   * Called at any time to reset the target.
   *
   * @method reset
   * @return {void}
   */
  reset(): void;

  /**
   * Called at any time to set a view for this controller.
   *
   * @method setView
   * @param view {View}
   * @return {void}
   */
  setView(view: View): void;
}

export default ViewController;
