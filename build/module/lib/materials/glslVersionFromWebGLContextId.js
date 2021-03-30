import { GLSLESVersion } from './glslVersion';
/**
 * Returns a GLSL version (usually for the purpose of automatically writing shaders).
 * If an override is defined then it will be returned.
 * Otherwise, if the contextId is known, a version will be returned that is consistent with the contextId.
 * If the contextId is not yet known and there is no override, returns the latest GLSL version.
 * @param override The override that the caller desires. May be undefined.
 * @param contextId The context identifier, usually determined from a ContextManager.
 * @hidden
 */
export function glslVersionFromWebGLContextId(override, contextId) {
    if (override) {
        return override;
    }
    else {
        switch (contextId) {
            case 'webgl2': return GLSLESVersion.ThreeHundred;
            case 'webgl': return GLSLESVersion.OneHundred;
            default: {
                // In the majority of examples, the WebGL rendering context will be initialized
                // before we construct the shaders and so it will be rare that we end up here.
                // We don't want the user to be forced to override to get the latest, so we
                // return the most aggressive option.
                return GLSLESVersion.ThreeHundred;
            }
        }
    }
}
