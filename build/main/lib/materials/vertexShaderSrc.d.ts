import { AttribMetaInfo } from '../core/AttribMetaInfo';
import { UniformMetaInfo } from '../core/UniformMetaInfo';
/**
 * Generates a vertex shader.
 */
export declare function vertexShaderSrc(attributes: {
    [name: string]: AttribMetaInfo;
}, uniforms: {
    [name: string]: UniformMetaInfo;
}, vColor: boolean, vCoords: boolean, vLight: boolean): string;
