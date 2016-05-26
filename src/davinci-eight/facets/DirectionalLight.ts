import {Color} from '../core/Color'
import AbstractColor from '../core/AbstractColor'
import {Facet} from '../core/Facet'
import FacetVisitor from '../core/FacetVisitor'
import {Geometric3} from '../math/Geometric3'
import mustBeObject from '../checks/mustBeObject'
import mustBeString from '../checks/mustBeString'
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols'
import R3 from '../math/R3'
import VectorE3 from '../math/VectorE3'

const LOGGING_NAME = 'DirectionalLight'

function contextBuilder() {
  return LOGGING_NAME
}

/**
 *
 */
export class DirectionalLight implements Facet {
  /**
   * The name of the property that designates the color.
   * @default 'color'
   */
  public static PROP_COLOR = 'color';

  /**
   * The name of the property that designates the direction.
   * @default 'direction'
   */
  public static PROP_DIRECTION = 'direction';

  /**
   *
   */
  private _direction: Geometric3;

  /**
   *
   */
  public _color: Color;

  /**
   *
   * @param direction
   * @param color
   */
  constructor(direction: VectorE3 = R3.e3.neg(), color: AbstractColor = Color.white) {
    mustBeObject('direction', direction)
    mustBeObject('color', color)
    this._direction = Geometric3.fromVector(direction).normalize()
    this._color = Color.copy(color)
  }

  /**
   *
   */
  get color(): Color {
    return this._color
  }
  set color(color: Color) {
    this._color.copy(Color.mustBe('color', color))
  }

  /**
   *
   */
  get direction(): Geometric3 {
    return this._direction
  }
  set direction(direction: Geometric3) {
    this._direction.copy(direction)
  }

  /**
   * @param name
   * @returns
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
   * @param name
   * @param value
   * @returns
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
   * @param color
   * @returns
   */
  setColor(color: AbstractColor): DirectionalLight {
    mustBeObject('color', color)
    this._color.copy(color)
    return this
  }

  /**
   * @param direction
   * @returns
   */
  setDirection(direction: VectorE3): DirectionalLight {
    mustBeObject('direction', direction)
    this._direction.copyVector(direction).normalize()
    return this
  }

  /**
   * @param visitor
   */
  setUniforms(visitor: FacetVisitor): void {
    const direction = this._direction
    visitor.uniform3f(GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, direction.x, direction.y, direction.z)
    const color = this.color
    visitor.uniform3f(GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR, color.r, color.g, color.b)
  }
}
