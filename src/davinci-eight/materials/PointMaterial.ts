import IContextProvider = require('../core/IContextProvider');
import IContextMonitor = require('../core/IContextMonitor');
import IGraphicsProgram = require('../core/IGraphicsProgram');
import LineMaterialParameters = require('../materials/LineMaterialParameters');
import GraphicsProgram = require('../materials/GraphicsProgram');
import MonitorList = require('../scene/MonitorList');
import createGraphicsProgram = require('../programs/createGraphicsProgram');
import GraphicsProgramBuilder = require('../materials/GraphicsProgramBuilder')
import GraphicsProgramSymbols = require('../core/GraphicsProgramSymbols')
/**
 * Name used for reference count monitoring and logging.
 */
let LOGGING_NAME = 'PointMaterial';

function nameBuilder(): string {
  return LOGGING_NAME;
}

/**
 * @class PointMaterial
 * @extends GraphicsProgram
 */
class PointMaterial extends GraphicsProgram {
  // A super call must be the first statement in the constructor when a class
  // contains initialized propertied or has parameter properties (TS2376).
  /**
   * @class PointMaterial
   * @constructor
   * @param monitors [IContextMonitor[]=[]]
   * @parameters [MeshNormalParameters]
   */
  constructor(monitors: IContextMonitor[] = [], parameters?: LineMaterialParameters) {
    super(monitors, LOGGING_NAME);
  }
  protected createGraphicsProgram(): IGraphicsProgram {
    let smb = new GraphicsProgramBuilder();

    smb.attribute(GraphicsProgramSymbols.ATTRIBUTE_POSITION, 3);

    smb.uniform(GraphicsProgramSymbols.UNIFORM_COLOR, 'vec3');
    smb.uniform(GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX, 'mat4');
    smb.uniform(GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX, 'mat4');
    smb.uniform(GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX, 'mat4');
    smb.uniform(GraphicsProgramSymbols.UNIFORM_POINT_SIZE, 'float');

    return smb.build(this.monitors);
  }
}

export = PointMaterial;
