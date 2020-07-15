import { AttribMetaInfo } from '../core/AttribMetaInfo';
import { UniformMetaInfo } from '../core/UniformMetaInfo';
import { GLSLESVersion } from './glslVersion';
/**
 * Generates a fragment shader
 */
export declare function fragmentShaderSrc(attributes: {
    [name: string]: AttribMetaInfo;
}, uniforms: {
    [name: string]: UniformMetaInfo;
}, vColor: boolean, vCoords: boolean, vLight: boolean, version: GLSLESVersion): string;
