import AttribMetaInfos = require('../core/AttribMetaInfos');
import ShaderProgram = require('../programs/ShaderProgram');
import UniformMetaInfos = require('../core/UniformMetaInfos');
/**
 *
 */
declare var smartProgram: (attributes: AttribMetaInfos, uniformsList: UniformMetaInfos[]) => ShaderProgram;
export = smartProgram;
