import { isDefined } from '../checks/isDefined';
/**
 * Returns a WebGL rendering context given a canvas element.
 * @param canvas The canvas element.
 * @param options The arguments to the HTMLCanvasElement.getContext() method.
 * If the canvas is undefined then an undefined value is returned for the context.
 */
export function initWebGL(canvas, options) {
    // We'll be hyper-functional. An undefined canvas begets an undefined context.
    // Clients must check their context output or canvas input.
    if (isDefined(canvas)) {
        try {
            var contextId = 'webgl2';
            var context = canvas.getContext(contextId, options);
            if (context) {
                return { context: context, contextId: contextId };
            }
            else {
                throw new Error("canvas.getContext('" + contextId + "') failed. Your browser may not support it.");
            }
        }
        catch (e) {
            var contextId = 'webgl';
            var context = canvas.getContext(contextId, options);
            if (context) {
                return { context: context, contextId: contextId };
            }
            else {
                throw new Error("canvas.getContext('" + contextId + "') failed. Your browser may not support it.");
            }
        }
    }
    else {
        // An undefined canvas results in an undefined context.
        return void 0;
    }
}
