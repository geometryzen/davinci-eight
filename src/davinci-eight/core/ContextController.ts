/**
 * @class ContextController
 */
interface ContextController {
    /**
     * @method start
     * @param canvas {HTMLCanvasElement}
     * @return {void}
     */
    start(canvas: HTMLCanvasElement): void
    /**
     * @method stop
     * @return {void}
     */
    stop(): void
    // FIXME: kill: You won't be seeing me again.
    // kill(): void;
}

export default ContextController;
