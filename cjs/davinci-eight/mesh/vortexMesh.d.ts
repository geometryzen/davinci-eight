import AttribProvider = require('../core/AttribProvider');
import ContextManager = require('../core/ContextManager');
declare function vortexMesh(monitor: ContextManager, options?: {
    wireFrame?: boolean;
}): AttribProvider;
export = vortexMesh;
