import { AttribMetaInfo } from '../core/AttribMetaInfo';
import { UniformMetaInfo } from '../core/UniformMetaInfo';
import { GLSLESVersion } from './glslVersion';
/**
 * Generates a vertex shader.
 * @hidden
 */
export declare function vertexShaderSrc(attributes: {
    [name: string]: AttribMetaInfo;
}, uniforms: {
    [name: string]: UniformMetaInfo;
}, vColor: boolean, vCoords: boolean, vLight: boolean, version: GLSLESVersion): string;
