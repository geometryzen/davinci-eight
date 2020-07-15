import { isDefined } from '../checks/isDefined';
/**
 * Returns the WebGLRenderingContext given a canvas.
 * canvas
 * attributes
 * If the canvas is undefined then an undefined value is returned for the context.
 */
export function initWebGL(canvas, attributes) {
    // We'll be hyper-functional. An undefined canvas begets an undefined context.
    // Clients must check their context output or canvas input.
    if (isDefined(canvas)) {
        var context = void 0;
        var contextId = 'webgl2';
        try {
            context = canvas.getContext(contextId, attributes);
        }
        catch (e) {
            // Do nothing.
        }
        if (context) {
            return context;
        }
        else {
            throw new Error("canvas.getContext('" + contextId + "') failed. Your browser may not support it.");
        }
    }
    else {
        // An undefined canvas results in an undefined context.
        return void 0;
    }
}
