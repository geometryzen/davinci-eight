import AttribMetaInfos = require('../core/AttribMetaInfos');
import ContextMonitor = require('../core/ContextMonitor');
import IProgram = require('../core/IProgram');
import UniformMetaInfos = require('../core/UniformMetaInfos');
/**
 *
 */
declare var smartProgram: (monitors: ContextMonitor[], attributes: AttribMetaInfos, uniforms: UniformMetaInfos, bindings: string[]) => IProgram;
export = smartProgram;
