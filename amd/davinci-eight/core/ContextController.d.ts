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
    start(canvas: HTMLCanvasElement, canvasId: number): void;
    /**
     * @method stop
     * @return {void}
     */
    stop(): void;
}
export = ContextController;
