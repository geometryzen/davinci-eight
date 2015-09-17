import ContextManager = require('../core/ContextManager');
import ContextMonitor = require('../core/ContextMonitor');
import Material = require('../materials/Material');
import MonitorList = require('../scene/MonitorList');

/**
 * Name used for reference count monitoring and logging.
 */
let LOGGING_NAME = 'MeshNormalMaterial';

function nameBuilder(): string {
  return LOGGING_NAME;
}

/**
 * @module EIGHT
 * @class MeshNormalMaterial
 * @extends Material
 */
class MeshNormalMaterial extends Material {
  // A super call must be the first statement in the constructor when a class
  // contains initialized propertied or has parameter properties (TS2376).
  constructor(contexts: ContextMonitor[]) {
    super(contexts, LOGGING_NAME);
    //
    // Perform state initialization here.
    //
  }
  contextGain(manager: ContextManager): void {
    console.warn(LOGGING_NAME + ' contextGain method TODO')
  }
}

export = MeshNormalMaterial;
