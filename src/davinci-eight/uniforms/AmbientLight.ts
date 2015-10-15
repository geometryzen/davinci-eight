import Color = require('../core/Color')
import IFacet = require('../core/IFacet')
import IFacetVisitor = require('../core/IFacetVisitor')
import mustBeNumber = require('../checks/mustBeNumber')
import mustBeObject = require('../checks/mustBeObject')
import mustBeString = require('../checks/mustBeString')
import Shareable = require('../utils/Shareable')
import Symbolic = require('../core/Symbolic')

var LOGGING_NAME = 'AmbientLight'

function contextBuilder() {
  return LOGGING_NAME
}

/**
 * @class AmbientLight
 * @extends Shareable
 */
class AmbientLight extends Shareable implements IFacet {
  /**
   * @property color
   * @type {Color}
   */
  public color: Color;
  /**
   * Constructs a white light in the -e3 direction.
   * @class AmbientLight
   * @constructor
   */
  constructor() {
    super('AmbientLight')
    // FIXME: Need some kind of locking for constants
    this.color = Color.white.clone()
    this.color.red = 0.2
    this.color.green = 0.2
    this.color.blue = 0.2
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
    visitor.vector3(Symbolic.UNIFORM_AMBIENT_LIGHT, this.color.data, canvasId)
  }
}

export = AmbientLight