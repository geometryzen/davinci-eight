import AttribMetaInfo = require('../core/AttribMetaInfo');
import IContextMonitor = require('../core/IContextMonitor');
import IGraphicsProgram = require('../core/IGraphicsProgram');
import UniformMetaInfo = require('../core/UniformMetaInfo');
/**
 *
 */
declare var smartProgram: (monitors: IContextMonitor[], attributes: {
    [name: string]: AttribMetaInfo;
}, uniformsList: {
    [name: string]: UniformMetaInfo;
}[], bindings: string[]) => IGraphicsProgram;
export = smartProgram;
