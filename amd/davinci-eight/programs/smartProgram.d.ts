import AttribMetaInfos = require('../core/AttribMetaInfos');
import Program = require('../core/Program');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import ContextManager = require('../core/ContextManager');
/**
 *
 */
declare var smartProgram: (monitor: ContextManager, attributes: AttribMetaInfos, uniformsList: UniformMetaInfos[], attribs: string[]) => Program;
export = smartProgram;
