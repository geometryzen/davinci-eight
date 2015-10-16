import IContextProvider = require('../core/IContextProvider');
import IContextMonitor = require('../core/IContextMonitor');
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
  /**
   * @class MeshMaterial
   * @constructor
   * @param monitors [IContextMonitor[]=[]]
   * @parameters [MeshNormalParameters]
   */
  constructor(monitors: IContextMonitor[] = [], parameters?: MeshMaterialParameters) {
    super(monitors, LOGGING_NAME);
  }
  /**
   * @method destructor
   * @return {void}
   * @protected
   */
  protected destructor(): void {
    super.destructor();
  }
  /**
   * @method createMaterial
   * @return {IMaterial}
   * @protected
   */
  protected createMaterial(): IMaterial {
    let smb = new SmartMaterialBuilder();

    smb.attribute(Symbolic.ATTRIBUTE_POSITION, 3);
    smb.attribute(Symbolic.ATTRIBUTE_NORMAL, 3);

    smb.uniform(Symbolic.UNIFORM_COLOR, 'vec3');
    smb.uniform(Symbolic.UNIFORM_MODEL_MATRIX, 'mat4');
    smb.uniform(Symbolic.UNIFORM_NORMAL_MATRIX, 'mat3');
    smb.uniform(Symbolic.UNIFORM_PROJECTION_MATRIX, 'mat4');
    smb.uniform(Symbolic.UNIFORM_VIEW_MATRIX, 'mat4');

    smb.uniform(Symbolic.UNIFORM_AMBIENT_LIGHT, 'vec3')
    smb.uniform(Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR, 'vec3')
    smb.uniform(Symbolic.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, 'vec3')

    return smb.build(this.monitors);
  }
}

export = MeshMaterial;
