import IContextProvider = require('../core/IContextProvider')
import IContextMonitor = require('../core/IContextMonitor')
import IMaterial = require('../core/IMaterial')
import MeshMaterialParameters = require('../materials/MeshMaterialParameters')
import Material = require('../materials/Material')
import MonitorList = require('../scene/MonitorList')
import createMaterial = require('../programs/createMaterial')
import SmartMaterialBuilder = require('../materials/SmartMaterialBuilder')
import Symbolic = require('../core/Symbolic')

/**
 * Name used for reference count monitoring and logging.
 */
let LOGGING_NAME = 'MeshLambertMaterial'

function nameBuilder(): string {
  return LOGGING_NAME;
}

/**
 * @class MeshLambertMaterial
 * @extends Material
 */
class MeshLambertMaterial extends Material {
  /**
   * 
   * @class MeshLambertMaterial
   * @constructor
   * @param monitors [IContextMonitor[]=[]]
   */
  constructor(monitors: IContextMonitor[] = []) {
    super(monitors, LOGGING_NAME);
  }
  protected destructor(): void {
    super.destructor()
  }
  protected createProgram(): IMaterial {
    let smb = new SmartMaterialBuilder()

    smb.attribute(Symbolic.ATTRIBUTE_POSITION, 3)
    smb.attribute(Symbolic.ATTRIBUTE_NORMAL, 3)

    smb.uniform(Symbolic.UNIFORM_COLOR, 'vec3')
    smb.uniform(Symbolic.UNIFORM_MODEL_MATRIX, 'mat4')
    smb.uniform(Symbolic.UNIFORM_NORMAL_MATRIX, 'mat3')
    smb.uniform(Symbolic.UNIFORM_PROJECTION_MATRIX, 'mat4')
    smb.uniform(Symbolic.UNIFORM_VIEW_MATRIX, 'mat4')

    smb.uniform(Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR, 'vec3')
    smb.uniform(Symbolic.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, 'vec3')

    return smb.build(this.monitors);
  }
}

export = MeshLambertMaterial;
