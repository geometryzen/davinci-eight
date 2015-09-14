import AttribProvider = require('../core/AttribProvider');
import BoxOptions = require('../mesh/BoxOptions');
import ContextManager = require('../core/ContextManager');
declare function boxMesh(monitor: ContextManager, options?: BoxOptions): AttribProvider;
export = boxMesh;
