import AttribMetaInfo = require('../core/AttribMetaInfo');
import ContextMonitor = require('../core/ContextMonitor');
import IProgram = require('../core/IProgram');
import UniformMetaInfo = require('../core/UniformMetaInfo');
/**
 *
 */
declare var smartProgram: (monitors: ContextMonitor[], attributes: {
    [name: string]: AttribMetaInfo;
}, uniformsList: {
    [name: string]: UniformMetaInfo;
}[], bindings: string[]) => IProgram;
export = smartProgram;
