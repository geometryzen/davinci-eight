import ContextManager = require('../core/ContextManager');
import ContextMonitor = require('../core/ContextMonitor');
import Material = require('../scene/Material');
import MonitorList = require('../scene/MonitorList');

/**
 * Name used for reference count monitoring and logging.
 */
let LOGGING_NAME = 'MeshNormalMaterial';

function ctorContext(): string {
  return LOGGING_NAME + " constructor";
}

/**
 * @module EIGHT
 * @class MeshNormalMaterial
 * @extends Material
 */
class MeshNormalMaterial extends Material {
  constructor(monitors: ContextMonitor[]) {
    super(MonitorList.verify('monitors', monitors, ctorContext), LOGGING_NAME);
  }
  contextGain(manager: ContextManager): void {
    console.warn(LOGGING_NAME + '.contextGain method TODO')
  }
}

export = MeshNormalMaterial;
