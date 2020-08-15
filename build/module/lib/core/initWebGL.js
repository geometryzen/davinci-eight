import { isDefined } from '../checks/isDefined';
function getContextFailed(contextId) {
    return "canvas.getContext('" + contextId + "') failed. Your browser may not support it.";
}
function invalidContextId(contextId) {
    return JSON.stringify(contextId) + " is not a recognized WebGL contextId. contextId must be 'webgl2' or 'webgl'.";
}
/**
 * Returns a WebGL rendering context given a canvas element.
 * @param canvas The canvas element.
 * @param options The arguments to the HTMLCanvasElement.getContext() method.
 * @param contextId An optional override for the context identifier.
 * If the canvas is undefined then an undefined value is returned for the context.
 */
export function initWebGL(canvas, options, contextId) {
    // We'll be hyper-functional. An undefined canvas begets an undefined context.
    // Clients must check their context output or canvas input.
    if (isDefined(canvas)) {
        if (contextId) {
            switch (contextId) {
                case 'webgl2': {
                    var context = canvas.getContext(contextId, options);
                    if (context) {
                        return { context: context, contextId: contextId };
                    }
                    else {
                        throw new Error(getContextFailed(contextId));
                    }
                }
                case 'webgl': {
                    var context = canvas.getContext(contextId, options);
                    if (context) {
                        return { context: context, contextId: contextId };
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
                var candidateContextId = 'webgl2';
                var context = canvas.getContext(candidateContextId, options);
                if (context) {
                    return { context: context, contextId: candidateContextId };
                }
                else {
                    throw new Error(getContextFailed(candidateContextId));
                }
            }
            catch (e) {
                var candidateContextId = 'webgl';
                var context = canvas.getContext(candidateContextId, options);
                if (context) {
                    return { context: context, contextId: candidateContextId };
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
