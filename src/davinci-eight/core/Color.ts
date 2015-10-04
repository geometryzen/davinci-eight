import clamp = require('../math/clamp')
import expectArg = require('../checks/expectArg')
import mustBeNumber = require('../checks/mustBeNumber')
import principalAngle = require('../core/principalAngle')
import ColorRGB = require('../core/ColorRGB')
import Mutable = require('../math/Mutable')
/**
 * <p>
 * A mutable type representing a color through its RGB components.
 * </p>
 * <p>
 * WARNING: In many object-oriented designs, types representing values are completely immutable.
 * In a graphics library where data changes rapidly and garbage collection might become an issue,
 * it is common to use reference types, such as in this design. This mutability can lead to
 * difficult bugs because it is hard to reason about where a color may have changed. 
 * </p>
 *
 * @class Color
 * @implements ColorRGB
 * @implements Mutable<number[]>
 */
class Color implements ColorRGB, Mutable<number[]> {
  /**
   * @property black
   * @type {Color}
   * @static
   */
  public static black   = new Color([0, 0, 0]);
  /**
   * @property blue
   * @type {Color}
   * @static
   */
  public static blue    = new Color([0, 0, 1]);
  /**
   * @property green
   * @type {Color}
   * @static
   */
  public static green   = new Color([0, 1, 0]);
  /**
   * @property cyan
   * @type {Color}
   * @static
   */
  public static cyan    = new Color([0, 1, 1]);
  /**
   * @property red
   * @type {Color}
   * @static
   */
  public static red     = new Color([1, 0, 0]);
  /**
   * @property magenta
   * @type {Color}
   * @static
   */
  public static magenta = new Color([1, 0, 1]);
  /**
   * @property yellow
   * @type {Color}
   * @static
   */
  public static yellow  = new Color([1, 1, 0]);
  /**
   * @property white
   * @type {Color}
   * @static
   */
  public static white   = new Color([1, 1, 1]);
  /**
   * @property data
   * @type {number[]}
   */
  public data: number[];
  public callback: () => number[];
  public modified: boolean = false;
  /**
   * @class Color
   * @constructor
   * @param data {number[]}
   */
  constructor(data: number[] = [0, 0, 0]) {
    expectArg('data', data).toSatisfy(data.length === 3, "data must have length equal to 3")
    this.data = data
  }
  get red(): number {
    return this.data[0]
  }
  set red(value: number) {
    this.data[0] = clamp(value, 0, 1)
  }
  get green(): number {
    return this.data[1]
  }
  set green(value: number) {
    this.data[1] = clamp(value, 0, 1)
  }
  get blue(): number {
    return this.data[2]
  }
  set blue(value: number) {
    this.data[2] = clamp(value, 0, 1)
  }
  public clone() {
    return new Color([this.data[0], this.data[1], this.data[2]])
  }
  public interpolate(target: ColorRGB, alpha: number): Color {
    this.red   += ( target.red   - this.red )   * alpha
    this.green += ( target.green - this.green ) * alpha
    this.blue  += ( target.blue  - this.blue )  * alpha
    return this;
  }
  get luminance(): number {
    return Color.luminance(this.red, this.green, this.blue);
  }
  public toString(): string {
    return "Color(" + this.red + ", " + this.green + ", " + this.blue + ")"
  }
  public static luminance(red: number, green: number, blue: number): number {
    mustBeNumber('red',   red)
    mustBeNumber('green', green)
    mustBeNumber('blue',  blue)
    var gamma = 2.2
    return 0.2126 * Math.pow(red, gamma) + 0.7152 * Math.pow(green, gamma) + 0.0722 * Math.pow(blue, gamma);
  }
  /**
   * Converts an angle, radius, height to a color on a color wheel.
   */
  public static fromHSL(H: number, S: number, L: number): Color {
    mustBeNumber('H', H)
    mustBeNumber('S', S)
    mustBeNumber('L', L)
    var C = (1 - Math.abs(2 * L - 1)) * S
    /**
     * This function captures C and L
     */
    function matchLightness(R: number, G: number, B: number): Color {
      var x = Color.luminance(R, G, B)
      var m = L - 0.5 * C
      return new Color([R + m, G + m, B + m])
    }
    var sextant = ((principalAngle(H) / Math.PI) * 3) % 6;
    var X = C * (1 - Math.abs(sextant % 2 - 1));
    if (sextant >= 0 && sextant < 1) {
      return matchLightness(C, X/*C*(sextant-0)*/, 0);
    }
    else if (sextant >= 1 && sextant < 2) {
      return matchLightness(X/*C*(2-sextant)*/, C, 0);
    }
    else if (sextant >= 2 && sextant < 3) {
      return matchLightness(0, C, C * (sextant - 2))
    }
    else if (sextant >= 3 && sextant < 4) {
      return matchLightness(0, C * (4 - sextant), C)
    }
    else if (sextant >= 4 && sextant < 5) {
      return matchLightness(X, 0, C)
    }
    else if (sextant >= 5 && sextant < 6) {
      return matchLightness(C, 0, X)
    }
    else {
      return matchLightness(0, 0, 0)
    }
  }
  public static fromRGB(red: number, green: number, blue: number): Color {
    mustBeNumber('red', red)
    mustBeNumber('green', green)
    mustBeNumber('blue', blue)
    // FIXME: Replace with functions that don't create temporaries.
    expectArg('red', red).toBeNumber().toBeInClosedInterval(0, 1)
    expectArg('green', green).toBeNumber().toBeInClosedInterval(0, 1)
    expectArg('blue', blue).toBeNumber().toBeInClosedInterval(0, 1)

    return new Color([red, green, blue])
  }
  public static copy(color: ColorRGB): Color {
    return new Color([color.red, color.green, color.blue])
  }
  public static interpolate(a: ColorRGB, b: ColorRGB, alpha: number): Color {
    return Color.copy(a).interpolate(b, alpha)
  }
}

export = Color;
