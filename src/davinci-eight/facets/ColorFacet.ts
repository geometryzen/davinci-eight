import Color from '../core/Color';
import core from '../core';
import mustBeNumber from '../checks/mustBeNumber';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import Facet from '../core/Facet';
import FacetVisitor from '../core/FacetVisitor';

/**
 * @module EIGHT
 * @submodule facets
 */

const COORD_R = 0
const COORD_G = 1
const COORD_B = 2

function checkPropertyName(name: string): void {
  if (typeof name !== 'string') {
    const msg = "ColorFacet property 'name' must be a string.";
    throw new TypeError(msg);
  }
  switch (name) {
    case ColorFacet.PROP_RGB: return;
    default: {
      const msg = `ColorFacet property 'name' must be one of ${[ColorFacet.PROP_RGB, ColorFacet.PROP_RED, ColorFacet.PROP_GREEN, ColorFacet.PROP_BLUE]}.`;
      if (core.strict) {
        throw new Error(msg);
      }
      else {
        console.warn(msg);
      }
    }
  }
}

/**
 * @class ColorFacet
 */
export default class ColorFacet implements Facet {
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
  public static PROP_RED = 'r';

  /**
   * property PROP_GREEN
   * @type {string}
   * @static
   */
  public static PROP_GREEN = 'g';

  /**
   * property PROP_BLUE
   * @type {string}
   * @static
   */
  public static PROP_BLUE = 'b';

  /**
   * @property color
   * @type {Color}
   * @public
   */
  public color = Color.fromRGB(1, 1, 1);

  /**
   * @property uColorName
   * @type {string}
   * @optional
   */
  public uColorName: string;

  /**
   * @class ColorFacet
   * @constructor
   */
  constructor() {
    this.uColorName = GraphicsProgramSymbols.UNIFORM_COLOR
  }

  /**
   * The red component of the color.
   * @property r
   * @type {number}
   */
  get r(): number {
    return this.color.r;
  }
  set r(red: number) {
    mustBeNumber('red', red);
    this.color.r = red;
  }

  /**
   * The green component of the color.
   * @property g
   * @type {number}
   */
  get g(): number {
    return this.color.g
  }
  set g(green: number) {
    mustBeNumber('green', green);
    this.color.g = green;
  }

  /**
   * The blue component of the color.
   * @property b
   * @type {number}
   */
  get b(): number {
    return this.color.b;
  }
  set b(blue: number) {
    mustBeNumber('blue', blue);
    this.color.b = blue;
  }

  /**
   * @method scaleRGB
   * @param α {number}
   * @return {ColorFacet}
   * @chainable
   */
  scaleRGB(α: number): ColorFacet {
    this.r *= α
    this.g *= α
    this.b *= α
    return this
  }

  /**
   * @method setRGB
   * @param red {number}
   * @param green {number}
   * @param blue {number}
   * @return {ColorFacet}
   * @chainable
   */
  setRGB(red: number, green: number, blue: number): ColorFacet {
    this.r = red
    this.g = green
    this.b = blue
    return this
  }

  /**
   * @method getProperty
   * @param name {string}
   * @return {number[]}
   */
  getProperty(name: string): number[] {
    checkPropertyName(name);
    switch (name) {
      case ColorFacet.PROP_RGB: {
        return [this.r, this.g, this.b]
      }
        break;
      case ColorFacet.PROP_RED: {
        return [this.r]
      }
        break;
      case ColorFacet.PROP_GREEN: {
        return [this.g]
      }
        break;
      default: {
        return void 0
      }
    }
  }

  /**
   * @method setProperty
   * @param name {string}
   * @param data {number[]}
   * @return {ColorFacet}
   * @chainable
   */
  setProperty(name: string, data: number[]): ColorFacet {
    checkPropertyName(name);
    switch (name) {
      case ColorFacet.PROP_RGB: {
        this.r = data[COORD_R]
        this.g = data[COORD_G]
        this.b = data[COORD_B]
      }
        break;
      case ColorFacet.PROP_RED: {
        this.r = data[COORD_R]
      }
        break;
      default: {
        // Do nothing.
      }
    }
    return this;
  }

  /**
   * @method setUniforms
   * @param visitor {FacetVisitor}
   * @return {void}
   */
  setUniforms(visitor: FacetVisitor): void {
    if (this.uColorName) {
      visitor.vector3(this.uColorName, this.color.coords)
    }
  }
}
