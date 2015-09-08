import AttribProvider = require('../core/AttribProvider');
import ArrowOptions = require('../mesh/ArrowOptions');
import RenderingContextMonitor = require('../core/RenderingContextMonitor');
declare function arrowMesh(monitor: RenderingContextMonitor, options?: ArrowOptions): AttribProvider;
export = arrowMesh;
