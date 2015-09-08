import AttribProvider = require('../core/AttribProvider');
import CylinderOptions = require('../mesh/CylinderOptions');
import RenderingContextMonitor = require('../core/RenderingContextMonitor');
declare function cylinderMesh(monitor: RenderingContextMonitor, options?: CylinderOptions): AttribProvider;
export = cylinderMesh;
