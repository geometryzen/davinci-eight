import IContextProvider = require('../core/IContextProvider');
import ContextMonitor = require('../core/ContextMonitor');
import IMaterial = require('../core/IMaterial');
import MeshMaterialParameters = require('../materials/MeshMaterialParameters');
import Material = require('../materials/Material');
import MonitorList = require('../scene/MonitorList');
import createMaterial = require('../programs/createMaterial');
import SmartMaterialBuilder = require('../materials/SmartMaterialBuilder')
import Symbolic = require('../core/Symbolic')
/**
 * Name used for reference count monitoring and logging.
 */
let LOGGING_NAME = 'MeshMaterial';

function nameBuilder(): string {
  return LOGGING_NAME;
}

/**
 * @class MeshMaterial
 * @extends Material
 */
class MeshMaterial extends Material {
  // A super call must be the first statement in the constructor when a class
  // contains initialized propertied or has parameter properties (TS2376).
  /**
   * @class MeshMaterial
   * @constructor
   * @param monitors [ContextMonitor[]=[]]
   * @parameters [MeshNormalParameters]
   */
  constructor(monitors: ContextMonitor[] = [], parameters?: MeshMaterialParameters) {
    super(monitors, LOGGING_NAME);
  }
  protected createProgram(): IMaterial {
    let smb = new SmartMaterialBuilder();

    smb.attribute(Symbolic.ATTRIBUTE_POSITION, 3);
    smb.attribute(Symbolic.ATTRIBUTE_NORMAL, 3);
    // smb.attribute(Symbolic.ATTRIBUTE_COLOR, 3);

    smb.uniform(Symbolic.UNIFORM_COLOR, 'vec3');
    smb.uniform(Symbolic.UNIFORM_MODEL_MATRIX, 'mat4');
    smb.uniform(Symbolic.UNIFORM_NORMAL_MATRIX, 'mat3');
    smb.uniform(Symbolic.UNIFORM_PROJECTION_MATRIX, 'mat4');
    smb.uniform(Symbolic.UNIFORM_VIEW_MATRIX, 'mat4');

    return smb.build(this.monitors);
  }
}

export = MeshMaterial;
