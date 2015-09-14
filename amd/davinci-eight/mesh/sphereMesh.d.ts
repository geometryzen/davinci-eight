import AttribProvider = require('../core/AttribProvider');
import SphereOptions = require('../mesh/SphereOptions');
import ContextManager = require('../core/ContextManager');
declare function sphereMesh(monitor: ContextManager, options?: SphereOptions): AttribProvider;
export = sphereMesh;
