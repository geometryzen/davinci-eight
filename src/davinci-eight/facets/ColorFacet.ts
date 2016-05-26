import {Color} from '../core/Color';
import mustBeNumber from '../checks/mustBeNumber';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import {Facet} from '../core/Facet';
import {FacetVisitor} from '../core/FacetVisitor';

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
      throw new Error(msg);
    }
  }
}

/**
 *
 */
export class ColorFacet implements Facet {

  /**
   *
   */
  public static PROP_RGB = 'rgb';

  /**
   *
   */
  public static PROP_RED = 'r';

  /**
   *
   */
  public static PROP_GREEN = 'g';

  /**
   *
   */
  public static PROP_BLUE = 'b';

  /**
   *
   */
  public color = Color.fromRGB(1, 1, 1);

  /**
   *
   */
  public uColorName: string;

  /**
   *
   */
  constructor() {
    this.uColorName = GraphicsProgramSymbols.UNIFORM_COLOR
  }

  /**
   * The red component of the color.
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
   */
  get b(): number {
    return this.color.b;
  }
  set b(blue: number) {
    mustBeNumber('blue', blue);
    this.color.b = blue;
  }

  /**
   * @param α
   * @returns
   */
  scaleRGB(α: number): ColorFacet {
    this.r *= α
    this.g *= α
    this.b *= α
    return this
  }

  /**
   * @param red
   * @param green
   * @param blue
   * @returns
   */
  setRGB(red: number, green: number, blue: number): ColorFacet {
    this.r = red
    this.g = green
    this.b = blue
    return this
  }

  /**
   * @param name
   * @returns
   */
  getProperty(name: string): number[] {
    checkPropertyName(name);
    switch (name) {
      case ColorFacet.PROP_RGB: {
        return [this.r, this.g, this.b]
      }
      case ColorFacet.PROP_RED: {
        return [this.r]
      }
      case ColorFacet.PROP_GREEN: {
        return [this.g]
      }
      default: {
        return void 0
      }
    }
  }

  /**
   * @param name
   * @param data
   * @returns
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
   * @param visitor
   */
  setUniforms(visitor: FacetVisitor): void {
    const name = this.uColorName
    if (name) {
      const color = this.color
      visitor.uniform3f(name, color.r, color.g, color.b)
    }
  }
}
