import AttribMetaInfos = require('../core/AttribMetaInfos');
import ShaderProgram = require('../core/ShaderProgram');
import UniformMetaInfos = require('../core/UniformMetaInfos');
/**
 *
 */
declare var smartProgram: (attributes: AttribMetaInfos, uniformsList: UniformMetaInfos[]) => ShaderProgram;
export = smartProgram;
