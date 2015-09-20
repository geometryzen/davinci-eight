import ContextManager = require('../core/ContextManager');
import ContextMonitor = require('../core/ContextMonitor');
import MeshNormalMaterialParameters = require('../materials/MeshNormalMaterialParameters');
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
 * @class MeshNormalMaterial
 * @extends Material
 */
class MeshNormalMaterial extends Material {
  // A super call must be the first statement in the constructor when a class
  // contains initialized propertied or has parameter properties (TS2376).
  /**
   * @class MeshNormalMaterial
   * @constructor
   */
  constructor(contexts: ContextMonitor[], parameters?: MeshNormalMaterialParameters) {
    super(contexts, LOGGING_NAME);
    //
    // Perform state initialization here.
    //
  }
}

export = MeshNormalMaterial;
