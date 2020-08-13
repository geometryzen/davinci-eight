import { GLSLESVersion } from './glslVersion';
/**
 * Returns a GLSL version (usually for the purpose of automatically writing shaders).
 * If an override is defined then it will be returned.
 * Otherwise, if the contextId is known, a version will be returned that is consistent with the contextId.
 * If the contextId is not yet known and there is no override, returns the latest GLSL version.
 * @param override The override that the caller desires. May be undefined.
 * @param contextId The context identifier, usually determined from a ContextManager.
 */
export declare function glslVersionFromWebGLContextId(override: GLSLESVersion | undefined | null, contextId: 'webgl2' | 'webgl' | undefined | null): GLSLESVersion;
