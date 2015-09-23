import AttribMetaInfo = require('../core/AttribMetaInfo');
import ContextMonitor = require('../core/ContextMonitor');
import IMaterial = require('../core/IMaterial');
import UniformMetaInfo = require('../core/UniformMetaInfo');
/**
 *
 */
declare var smartProgram: (monitors: ContextMonitor[], attributes: {
    [name: string]: AttribMetaInfo;
}, uniformsList: {
    [name: string]: UniformMetaInfo;
}[], bindings: string[]) => IMaterial;
export = smartProgram;
