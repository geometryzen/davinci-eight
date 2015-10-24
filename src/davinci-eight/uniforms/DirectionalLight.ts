import Color = require('../core/Color')
import IFacet = require('../core/IFacet')
import IFacetVisitor = require('../core/IFacetVisitor')
import mustBeObject = require('../checks/mustBeObject')
import mustBeString = require('../checks/mustBeString')
import Shareable = require('../utils/Shareable')
import Symbolic = require('../core/Symbolic')
import R3 = require('../math/R3')

var LOGGING_NAME = 'DirectionalLight'

function contextBuilder() {
  return LOGGING_NAME
}

/**
 * @class DirectionalLight
 * @extends Shareable
 */
class DirectionalLight extends Shareable implements IFacet {
  /**
   * @property direction
   * @type {R3}
   */
  public direction: R3;
  /**
   * @property color
   * @type {Color}
   */
  public color: Color;
  /**
   * Constructs a white light in the -e3 direction.
   * @class DirectionalLight
   * @constructor
   */
  constructor() {
    super('DirectionalLight')
    this.direction = new R3([-1, -1, -1]).normalize()
    this.color = Color.white.clone()
  }
  /**
   * @method destructor
   * @type {void}
   * @protected
   */
  protected destructor(): void {
    super.destructor()
  }
  getProperty(name: string): number[] {
    return void 0;
  }
  setProperty(name:string, value: number[]): void {
  }
  /**
   * @method setUniforms
   * @param visitor {IFacetVisitor}
   * @param canvasId {number}
   * @return {void}
   */
  setUniforms(visitor: IFacetVisitor, canvasId: number): void {
    visitor.vector3(Symbolic.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, this.direction.data, canvasId)
    visitor.vector3(Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR, this.color.data, canvasId)
  }
}

export = DirectionalLight