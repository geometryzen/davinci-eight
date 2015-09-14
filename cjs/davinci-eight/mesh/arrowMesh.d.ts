import AttribProvider = require('../core/AttribProvider');
import ArrowOptions = require('../mesh/ArrowOptions');
import ContextManager = require('../core/ContextManager');
declare function arrowMesh(monitor: ContextManager, options?: ArrowOptions): AttribProvider;
export = arrowMesh;
