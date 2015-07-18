import AttributeMetaInfos = require('../core/AttributeMetaInfos');
import ShaderProgram = require('../programs/ShaderProgram');
import UniformMetaInfos = require('../core/UniformMetaInfos');
/**
 *
 */
declare var smartProgram: (attributes: AttributeMetaInfos, uniformsList: UniformMetaInfos[]) => ShaderProgram;
export = smartProgram;
