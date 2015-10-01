import Color = require('../core/Color')
import Matrix3 = require('../math/Matrix3')
import Matrix4 = require('../math/Matrix4')
import Shareable = require('../utils/Shareable')
import Spinor3 = require('../math/Spinor3')
import Symbolic = require('../core/Symbolic')
import IFacet = require('../core/IFacet')
import ColorRGB = require('../core/ColorRGB')
import IFacetVisitor = require('../core/IFacetVisitor')
import Vector3 = require('../math/Vector3')
/**
 * @class ColorFacet.
 */
class ColorFacet extends Shareable implements ColorRGB, IFacet {
  /**
   * @property colorRGB
   * @type Vector3
   * @private
   */
  private data: Vector3 = new Vector3([1, 1, 1]);
  /**
   * @property name
   * @type {string}
   * @private
   */
  private name: string;
  /**
   * @class ColorFacet
   * @constructor
   * @param [name = Symbolic.UNIFORM_COLOR]
   */
  constructor(name: string = Symbolic.UNIFORM_COLOR) {
    super('ColorFacet')
    this.data.modified = true
    this.name = name
  }
  /**
   * @method destructor
   * @return {void}
   * @protected
   */
  protected destructor(): void {
    this.data = void 0
  }
  /**
   * The red component of the color.
   * @property red
   * @type {number}
   */
  get red(): number {
    return this.data.x
  }
  set red(red: number) {
    this.data.x = red
  }
  /**
   * The green component of the color.
   * @property green
   * @type {number}
   */
  get green(): number {
    return this.data.y
  }
  set green(green: number) {
    this.data.y = green
  }
  /**
   * The green component of the color.
   * @property blue
   * @type {number}
   */
  get blue(): number {
    return this.data.x
  }
  set blue(blue: number) {
    this.data.z = blue
  }
  scale(s: number): ColorFacet {
    this.red   *= s
    this.green *= s
    this.blue  *= s
    return this
  }
  setRGB(red: number, green: number, blue: number): ColorFacet {
    this.red   = red
    this.green = green
    this.blue  = blue
    return this;
  }
  setUniforms(visitor: IFacetVisitor, canvasId: number) {
    visitor.uniformVector3(this.name, this.data, canvasId)
  }
}

export = ColorFacet
