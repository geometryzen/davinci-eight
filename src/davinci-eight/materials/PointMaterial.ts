import IContextProvider = require('../core/IContextProvider');
import ContextMonitor = require('../core/ContextMonitor');
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
let LOGGING_NAME = 'PointMaterial';

function nameBuilder(): string {
  return LOGGING_NAME;
}

/**
 * @class PointMaterial
 * @extends Material
 */
class PointMaterial extends Material {
  // A super call must be the first statement in the constructor when a class
  // contains initialized propertied or has parameter properties (TS2376).
  /**
   * @class PointMaterial
   * @constructor
   * @param monitors [ContextMonitor[]=[]]
   * @parameters [MeshNormalParameters]
   */
  constructor(monitors: ContextMonitor[] = [], parameters?: LineMaterialParameters) {
    super(monitors, LOGGING_NAME);
  }
  protected createProgram(): IMaterial {
    let smb = new SmartMaterialBuilder();

    smb.attribute(Symbolic.ATTRIBUTE_POSITION, 3);
    // smb.attribute(Symbolic.ATTRIBUTE_COLOR, 3);

    smb.uniform(Symbolic.UNIFORM_COLOR, 'vec3');
    smb.uniform(Symbolic.UNIFORM_MODEL_MATRIX, 'mat4');
    smb.uniform(Symbolic.UNIFORM_PROJECTION_MATRIX, 'mat4');
    smb.uniform(Symbolic.UNIFORM_VIEW_MATRIX, 'mat4');
    smb.uniform(Symbolic.UNIFORM_POINT_SIZE, 'float');

    return smb.build(this.monitors);
  }
}

export = PointMaterial;
