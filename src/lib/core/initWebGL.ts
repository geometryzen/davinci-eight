import { isDefined } from '../checks/isDefined';

/**
 * Returns a WebGL rendering context given a canvas element.
 * @param canvas The canvas element.
 * @param options The arguments to the HTMLCanvasElement.getContext() method.
 * If the canvas is undefined then an undefined value is returned for the context.
 */
export function initWebGL(canvas: HTMLCanvasElement, options?: WebGLContextAttributes): { context: WebGL2RenderingContext, contextId: 'webgl2' } | { context: WebGLRenderingContext, contextId: 'webgl' } {

    // We'll be hyper-functional. An undefined canvas begets an undefined context.
    // Clients must check their context output or canvas input.
    if (isDefined(canvas)) {

        try {
            const contextId = 'webgl2';
            const context = canvas.getContext(contextId, options);
            if (context) {
                return { context, contextId };
            }
            else {
                throw new Error(`canvas.getContext('${contextId}') failed. Your browser may not support it.`);
            }
        }
        catch (e) {
            const contextId = 'webgl';
            const context = canvas.getContext(contextId, options);
            if (context) {
                return { context, contextId };
            }
            else {
                throw new Error(`canvas.getContext('${contextId}') failed. Your browser may not support it.`);
            }
        }
    }
    else {
        // An undefined canvas results in an undefined context.
        return void 0;
    }
}
