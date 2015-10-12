import AttribMetaInfo = require('../core/AttribMetaInfo');
import UniformMetaInfo = require('../core/UniformMetaInfo');
/**
 * Generates a vertex shader.
 */
declare function vertexShader(attributes: {
    [name: string]: AttribMetaInfo;
}, uniforms: {
    [name: string]: UniformMetaInfo;
}, vColor: boolean, vLight: boolean): string;
export = vertexShader;
