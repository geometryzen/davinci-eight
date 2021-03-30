import { isDefined } from '../checks/isDefined';

/**
 * @hidden
 */
function getContextFailed(contextId: 'webgl2' | 'webgl'): string {
    return `canvas.getContext('${contextId}') failed. Your browser may not support it.`;
}

/**
 * @hidden
 */
function invalidContextId(contextId: string): string {
    return `${JSON.stringify(contextId)} is not a recognized WebGL contextId. contextId must be 'webgl2' or 'webgl'.`;
}

/**
 * Returns a WebGL rendering context given a canvas element.
 * @param canvas The canvas element.
 * @param options The arguments to the HTMLCanvasElement.getContext() method.
 * @param contextId An optional override for the context identifier.
 * If the canvas is undefined then an undefined value is returned for the context.
 * @hidden
 */
export function initWebGL(canvas: HTMLCanvasElement, options: WebGLContextAttributes, contextId: 'webgl2' | 'webgl' | undefined): { context: WebGL2RenderingContext, contextId: 'webgl2' } | { context: WebGLRenderingContext, contextId: 'webgl' } {

    // We'll be hyper-functional. An undefined canvas begets an undefined context.
    // Clients must check their context output or canvas input.
    if (isDefined(canvas)) {
        if (contextId) {
            switch (contextId) {
                case 'webgl2': {
                    const context = canvas.getContext(contextId, options);
                    if (context) {
                        return { context, contextId };
                    }
                    else {
                        throw new Error(getContextFailed(contextId));
                    }
                }
                case 'webgl': {
                    const context = canvas.getContext(contextId, options);
                    if (context) {
                        return { context, contextId };
                    }
                    else {
                        throw new Error(getContextFailed(contextId));
                    }
                }
                default: {
                    // From a type-safety perspective, this should never happen.
                    throw new Error(invalidContextId(contextId));
                }
            }
        }
        else {
            try {
                const candidateContextId = 'webgl2';
                const context = canvas.getContext(candidateContextId, options);
                if (context) {
                    return { context, contextId: candidateContextId };
                }
                else {
                    throw new Error(getContextFailed(candidateContextId));
                }
            }
            catch (e) {
                const candidateContextId = 'webgl';
                const context = canvas.getContext(candidateContextId, options);
                if (context) {
                    return { context, contextId: candidateContextId };
                }
                else {
                    throw new Error(getContextFailed(candidateContextId));
                }
            }
        }
    }
    else {
        // An undefined canvas results in an undefined context.
        return void 0;
    }
}
