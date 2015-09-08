import AttribMetaInfos = require('../core/AttribMetaInfos');
import ShaderProgram = require('../core/ShaderProgram');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import RenderingContextMonitor = require('../core/RenderingContextMonitor');
/**
 *
 */
declare var smartProgram: (monitor: RenderingContextMonitor, attributes: AttribMetaInfos, uniformsList: UniformMetaInfos[], attribs: string[]) => ShaderProgram;
export = smartProgram;
