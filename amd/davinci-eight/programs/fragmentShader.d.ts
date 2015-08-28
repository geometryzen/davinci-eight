import AttribMetaInfos = require('../core/AttribMetaInfos');
import UniformMetaInfos = require('../core/UniformMetaInfos');
/**
 *
 */
declare function fragmentShader(attributes: AttribMetaInfos, uniforms: UniformMetaInfos, vColor: boolean, vLight: boolean): string;
export = fragmentShader;
