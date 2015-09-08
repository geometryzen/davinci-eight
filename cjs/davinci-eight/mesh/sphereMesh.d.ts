import AttribProvider = require('../core/AttribProvider');
import SphereOptions = require('../mesh/SphereOptions');
import RenderingContextMonitor = require('../core/RenderingContextMonitor');
declare function sphereMesh(monitor: RenderingContextMonitor, options?: SphereOptions): AttribProvider;
export = sphereMesh;
