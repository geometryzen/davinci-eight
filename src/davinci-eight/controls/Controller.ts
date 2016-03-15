/**
 * This interface exists to enforce consistency of controller implementations.
 * Intentionally undocumented.
 */
interface Controller {
  /**
   * Called during the animation loop to update the target.
   */
  update(): void;

  /**
   * Called at any time to reset the target.
   */
  reset(): void;
}

export default Controller;
