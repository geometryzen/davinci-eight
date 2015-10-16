import IContextProvider = require('../core/IContextProvider');
import IContextMonitor = require('../core/IContextMonitor');
import IMaterial = require('../core/IMaterial');
import LineMaterialParameters = require('../materials/LineMaterialParameters');
import Material = require('../materials/Material');
import MonitorList = require('../scene/MonitorList');
import createMaterial = require('../programs/createMaterial');
import SmartMaterialBuilder = require('../materials/SmartMaterialBuilder')
import Symbolic = require('../core/Symbolic')
/**
 * Name used for reference count monitoring and logging.
 */
let LOGGING_NAME = 'LineMaterial';

function nameBuilder(): string {
  return LOGGING_NAME;
}

/**
 * @class LineMaterial
 * @extends Material
 */
class LineMaterial extends Material {
  // A super call must be the first statement in the constructor when a class
  // contains initialized propertied or has parameter properties (TS2376).
  /**
   * @class LineMaterial
   * @constructor
   * @param monitors [IContextMonitor[]=[]]
   * @parameters [MeshNormalParameters]
   */
  constructor(monitors: IContextMonitor[] = [], parameters?: LineMaterialParameters) {
    super(monitors, LOGGING_NAME);
  }
  protected createMaterial(): IMaterial {
    let smb = new SmartMaterialBuilder();

    smb.attribute(Symbolic.ATTRIBUTE_POSITION, 3);

    smb.uniform(Symbolic.UNIFORM_COLOR, 'vec3');
    smb.uniform(Symbolic.UNIFORM_MODEL_MATRIX, 'mat4');
    smb.uniform(Symbolic.UNIFORM_PROJECTION_MATRIX, 'mat4');
    smb.uniform(Symbolic.UNIFORM_VIEW_MATRIX, 'mat4');

    return smb.build(this.monitors);
  }
}

export = LineMaterial;
