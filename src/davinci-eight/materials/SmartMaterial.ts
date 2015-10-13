import AttribMetaInfo = require('../core/AttribMetaInfo');
import IContextProvider = require('../core/IContextProvider');
import IContextMonitor = require('../core/IContextMonitor');
import fragmentShader = require('../programs/fragmentShader');
import getAttribVarName = require('../core/getAttribVarName');
import getUniformVarName = require('../core/getUniformVarName');
import GeometryMeta = require('../geometries/GeometryMeta');
import IMaterial = require('../core/IMaterial');
import Material = require('../materials/Material');
import mergeStringMapList = require('../utils/mergeStringMapList');
import MeshMaterialParameters = require('../materials/MeshMaterialParameters');
import MonitorList = require('../scene/MonitorList');
import mustBeDefined = require('../checks/mustBeDefined');
import mustBeInteger = require('../checks/mustBeInteger');
import createMaterial = require('../programs/createMaterial');
import UniformMetaInfo = require('../core/UniformMetaInfo');
import vertexShader = require('../programs/vertexShader');
import glslAttribType = require('../programs/glslAttribType');
import vColorRequired = require('../programs/vColorRequired');
import vLightRequired = require('../programs/vLightRequired');
/**
 * Name used for reference count monitoring and logging.
 */
let LOGGING_NAME = 'SmartMaterial';

function contextBuilder(): string {
  return LOGGING_NAME;
}

/**
 * <p>
 * SmartMaterial constructs a vertex shader and a fragment shader.
 * The shader codes are configured by specifying attributes, uniforms and varyings.
 * The default configuration is produces minimal shaders.
 * <p> 
 * @class SmartMaterial
 * @extends Material
 */
class SmartMaterial extends Material {
  public aParams: { [name: string]: { glslType: string } } = {};
  public uParams: { [name: string]: { glslType: string } } = {};
  private vColor: boolean = false;
  private vLight: boolean = false;
  /**
   * @class SmartMaterial
   * @constructor
   * @param contexts {IContextMonitor[]}
   * @param geometry {GeometryMeta} This parameter determines the attributes used in the shaders.
   */
  constructor(contexts: IContextMonitor[],
    aParams: { [name: string]: { glslType: string } },
    uParams: { [name: string]: { glslType: string } },
    vColor: boolean,
    vLight: boolean
  ) {
    // A super call must be the first statement in the constructor when a class
    // contains initialized propertied or has parameter properties (TS2376).
    super(contexts, LOGGING_NAME);
    this.aParams = aParams;
    this.uParams = uParams;
    this.vColor = vColor;
    this.vLight = vLight;
    // We can start eagerly or omit this call entirely and wait till we are use(d).
    this.makeReady(false);
  }
  protected createMaterial(): IMaterial {
    let bindings: string[] = [];
    return createMaterial(this.monitors, this.vertexShader, this.fragmentShader, bindings);
  }
  get vertexShader(): string {
    return vertexShader(this.aParams, this.uParams, this.vColor, this.vLight);
  }
  get fragmentShader(): string {
    return fragmentShader(this.aParams, this.uParams, this.vColor, this.vLight);
  }
}

export = SmartMaterial;
