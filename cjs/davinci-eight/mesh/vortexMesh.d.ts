import AttribProvider = require('../core/AttribProvider');
import RenderingContextMonitor = require('../core/RenderingContextMonitor');
declare function vortexMesh(monitor: RenderingContextMonitor, options?: {
    wireFrame?: boolean;
}): AttribProvider;
export = vortexMesh;
