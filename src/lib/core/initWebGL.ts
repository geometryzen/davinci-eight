import { isDefined } from '../checks/isDefined';

/**
 * Returns the WebGLRenderingContext given a canvas.
 * canvas
 * attributes
 * If the canvas is undefined then an undefined value is returned for the context.
 */
export function initWebGL(canvas: HTMLCanvasElement, attributes?: WebGLContextAttributes): WebGLRenderingContext {

    // We'll be hyper-functional. An undefined canvas begets an undefined context.
    // Clients must check their context output or canvas input.
    if (isDefined(canvas)) {
        var context: WebGLRenderingContext;

        try {
            // Try to grab the standard context. If it fails, fallback to experimental.
            context = <WebGLRenderingContext>(canvas.getContext('webgl', attributes) || canvas.getContext('experimental-webgl', attributes));
        }
        catch (e) {
            // Do nothing.
        }

        if (context) {
            return context;
        }
        else {
            throw new Error("Unable to initialize WebGL. Your browser may not support it.");
        }
    }
    else {
        // An undefined canvas results in an undefined context.
        return void 0;
    }
}
