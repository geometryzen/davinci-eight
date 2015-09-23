/**
 * @class ContextController
 */
interface ContextController {
  /**
   * @method start
   * @param canvas {HTMLCanvasElement}
   * @param canvasId {number}
   * @return {void}
   */
  start(canvas: HTMLCanvasElement, canvasId: number): void
  /**
   * @method stop
   * @return {void}
   */
  stop(): void
  // FIXME: kill: You won't be seeing me again.
  // kill(): void;
}

export = ContextController