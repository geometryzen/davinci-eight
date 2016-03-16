import Color from '../core/Color'
import AbstractColor from '../core/AbstractColor'
import Facet from '../core/Facet'
import FacetVisitor from '../core/FacetVisitor'
import Geometric3 from '../math/Geometric3'
import mustBeObject from '../checks/mustBeObject'
import mustBeString from '../checks/mustBeString'
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols'
import R3 from '../math/R3'
import VectorE3 from '../math/VectorE3'

/**
 * @module EIGHT
 * @submodule facets
 */

const LOGGING_NAME = 'DirectionalLight'

function contextBuilder() {
  return LOGGING_NAME
}

/**
 * @class DirectionalLight
 */
export default class DirectionalLight implements Facet {
  /**
   * The name of the property that designates the color.
   * @property PROP_COLOR
   * @type {string}
   * @default 'color'
   * @static
   * @readOnly
   */
  public static PROP_COLOR = 'color';

  /**
   * The name of the property that designates the direction.
   * @property PROP_DIRECTION
   * @type {string}
   * @default 'direction'
   * @static
   * @readOnly
   */
  public static PROP_DIRECTION = 'direction';

  /**
   * @property _direction
   * @type {Geometric3}
   * @private
   */
  private _direction: Geometric3;

  /**
   * @property _color
   * @type {Color}
   * @private
   */
  public _color: Color;

  /**
   * @class DirectionalLight
   * @constructor
   * @param [direction = -e3] {VectorE3}
   * @param [color = white] {AbstractColor}
   */
  constructor(direction: VectorE3 = R3.e3.neg(), color: AbstractColor = Color.white) {
    mustBeObject('direction', direction)
    mustBeObject('color', color)
    this._direction = Geometric3.fromVector(direction).normalize()
    this._color = Color.copy(color)
  }

  /**
   * @property color
   * @type {Color}
   */
  get color(): Color {
    return this._color
  }
  set color(color: Color) {
    this._color.copy(Color.mustBe('color', color))
  }

  /**
   * @property direction
   * @type {Geometric}
   */
  get direction(): Geometric3 {
    return this._direction
  }
  set direction(direction: Geometric3) {
    this._direction.copy(direction)
  }

  /**
   * @method getProperty
   * @param name {string}
   * @return {number[]}
   */
  getProperty(name: string): number[] {
    mustBeString('name', name, contextBuilder)
    switch (name) {
      case DirectionalLight.PROP_COLOR: {
        return this._color.coords;
      }
      case DirectionalLight.PROP_DIRECTION: {
        return this._direction.coords
      }
      default: {
        console.warn("unknown property: " + name);
      }
    }
  }

  /**
   * @method setProperty
   * @param name {string}
   * @param value {number[]}
   * @return {DirectionalLight}
   * @chainable
   */
  setProperty(name: string, value: number[]): DirectionalLight {
    mustBeString('name', name, contextBuilder);
    mustBeObject('value', value, contextBuilder);
    switch (name) {
      case DirectionalLight.PROP_COLOR: {
        this._color.coords = value;
      }
        break;
      case DirectionalLight.PROP_DIRECTION: {
        this._direction.coords = value;
      }
        break;
      default: {
        console.warn("unknown property: " + name)
      }
    }
    return this;
  }

  /**
   * @method setColor
   * @param color {AbstractColor}
   * @return {DirectionalLight}
   * @chainable
   */
  setColor(color: AbstractColor): DirectionalLight {
    mustBeObject('color', color)
    this._color.copy(color)
    return this
  }

  /**
   * @method setDirection
   * @param direction {VectorE3}
   * @return {DirectionalLight}
   * @chainable
   */
  setDirection(direction: VectorE3): DirectionalLight {
    mustBeObject('direction', direction)
    this._direction.copyVector(direction).normalize()
    return this
  }

  /**
   * @method setUniforms
   * @param visitor {FacetVisitor}
   * @return {void}
   */
  setUniforms(visitor: FacetVisitor): void {
    const direction = this._direction
    visitor.uniform3f(GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, direction.x, direction.y, direction.z)
    const color = this.color
    visitor.uniform3f(GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR, color.r, color.g, color.b)
  }
}
