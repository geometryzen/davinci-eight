import AttribMetaInfo = require('../core/AttribMetaInfo');
import IContextMonitor = require('../core/IContextMonitor');
import IMaterial = require('../core/IMaterial');
import UniformMetaInfo = require('../core/UniformMetaInfo');
/**
 *
 */
declare var smartProgram: (monitors: IContextMonitor[], attributes: {
    [name: string]: AttribMetaInfo;
}, uniformsList: {
    [name: string]: UniformMetaInfo;
}[], bindings: string[]) => IMaterial;
export = smartProgram;
