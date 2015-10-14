import Color = require('../core/Color')
import Matrix3 = require('../math/Matrix3')
import Matrix4 = require('../math/Matrix4')
import mustBeNumber = require('../checks/mustBeNumber')
import Shareable = require('../utils/Shareable')
import Spinor3 = require('../math/Spinor3')
import Symbolic = require('../core/Symbolic')
import IFacet = require('../core/IFacet')
import ColorRGB = require('../core/ColorRGB')
import IFacetVisitor = require('../core/IFacetVisitor')
import IAnimationTarget = require('../slideshow/IAnimationTarget')
import IUnknownExt = require('../core/IUnknownExt')
import Vector3 = require('../math/Vector3')
/**
 * @class ColorFacet
 */
class ColorFacet extends Shareable implements ColorRGB, IFacet, IAnimationTarget, IUnknownExt<ColorFacet> {
  /**
   * property PROP_RGB
   * @type {string}
   * @static
   */
  public static PROP_RGB = 'rgb';
  /**
   * property PROP_RED
   * @type {string}
   * @static
   */
  public static PROP_RED = 'red';
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
    super.destructor()
  }
  incRef(): ColorFacet {
    this.addRef()
    return this
  }
  decRef(): ColorFacet {
    this.release()
    return this
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
    return this.data.z
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
  setColor(color: ColorRGB): ColorFacet {
    this.red   = color.red
    this.green = color.green
    this.blue  = color.blue
    return this
  }
  setRGB(red: number, green: number, blue: number): ColorFacet {
    this.red   = red
    this.green = green
    this.blue  = blue
    return this
  }
  getProperty(name: string): number[] {
    switch(name) {
      case ColorFacet.PROP_RGB: {
        return [this.red, this.green, this.blue]
      }
      case ColorFacet.PROP_RED: {
        return [this.red]
      }
      default: {
        console.warn("ColorFacet.getProperty " + name)
        return void 0
      }
    }
  }
  setProperty(name: string, data: number[]): void {
    switch(name) {
      case ColorFacet.PROP_RGB: {
        this.red = data[0]
        this.green = data[1]
        this.blue = data[2]
      }
      break
      case ColorFacet.PROP_RED: {
        this.red = data[0]
      }
      break
      default: {
        console.warn("ColorFacet.setProperty " + name)
      }
    }
  }
  setUniforms(visitor: IFacetVisitor, canvasId: number) {
    visitor.uniformCartesian3(this.name, this.data, canvasId)
  }
}

export = ColorFacet
