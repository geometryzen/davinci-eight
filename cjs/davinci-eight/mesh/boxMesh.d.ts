import AttribProvider = require('../core/AttribProvider');
import BoxOptions = require('../mesh/BoxOptions');
import RenderingContextMonitor = require('../core/RenderingContextMonitor');
declare function boxMesh(monitor: RenderingContextMonitor, options?: BoxOptions): AttribProvider;
export = boxMesh;
