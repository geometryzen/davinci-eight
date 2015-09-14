import AttribProvider = require('../core/AttribProvider');
import CylinderOptions = require('../mesh/CylinderOptions');
import ContextManager = require('../core/ContextManager');
declare function cylinderMesh(monitor: ContextManager, options?: CylinderOptions): AttribProvider;
export = cylinderMesh;
