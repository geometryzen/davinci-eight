import IContextProvider = require('../core/IContextProvider')
import IContextMonitor = require('../core/IContextMonitor')
import IGraphicsProgram = require('../core/IGraphicsProgram')
import MeshMaterialParameters = require('../materials/MeshMaterialParameters')
import GraphicsProgram = require('../materials/GraphicsProgram')
import MonitorList = require('../scene/MonitorList')
import createGraphicsProgram = require('../programs/createGraphicsProgram')
import GraphicsProgramBuilder = require('../materials/GraphicsProgramBuilder')
import GraphicsProgramSymbols = require('../core/GraphicsProgramSymbols')

/**
 * Name used for reference count monitoring and logging.
 */
let LOGGING_NAME = 'MeshLambertMaterial'

function nameBuilder(): string {
  return LOGGING_NAME;
}

/**
 * @class MeshLambertMaterial
 * @extends GraphicsProgram
 */
class MeshLambertMaterial extends GraphicsProgram {
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
  protected createGraphicsProgram(): IGraphicsProgram {
    let smb = new GraphicsProgramBuilder()

    smb.attribute(GraphicsProgramSymbols.ATTRIBUTE_POSITION, 3)
    smb.attribute(GraphicsProgramSymbols.ATTRIBUTE_NORMAL, 3)

    smb.uniform(GraphicsProgramSymbols.UNIFORM_COLOR, 'vec3')
    smb.uniform(GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX, 'mat4')
    smb.uniform(GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX, 'mat3')
    smb.uniform(GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX, 'mat4')
    smb.uniform(GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX, 'mat4')

    smb.uniform(GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR, 'vec3')
    smb.uniform(GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, 'vec3')

    return smb.build(this.monitors);
  }
}

export = MeshLambertMaterial;
