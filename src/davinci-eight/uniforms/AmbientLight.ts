import Color = require('../core/Color')
import IFacet = require('../core/IFacet')
import IFacetVisitor = require('../core/IFacetVisitor')
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
    this.color = Color.white;
  }
  /**
   * @method destructor
   * @type {void}
   * @protected
   */
  protected destructor(): void {
    super.destructor()
  }
  /**
   * @method setUniforms
   * @param visitor {IFacetVisitor}
   * @param canvasId {number}
   * @return {void}
   */
  setUniforms(visitor: IFacetVisitor, canvasId: number): void {
    visitor.vector3(Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR, this.color.data, canvasId)
  }
}

export = AmbientLight