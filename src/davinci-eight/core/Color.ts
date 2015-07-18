import clamp = require('../math/clamp');
/**
 * @class Color
 */
class Color {
  public red: number;
  public green: number;
  public blue: number;
  public alpha: number;
  constructor(red: number, green: number, blue: number, alpha: number = 1) {
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.alpha = typeof alpha === 'number' ? clamp(alpha, 0, 1) : 1;
  }
  public luminance(): number {
    return Color.luminance(this.red, this.green, this.blue);
  }
  public toString(): string {
    return "Color(" + this.red + ", " + this.green + ", " + this.blue + ", " + this.alpha + ")"
  }
  public static luminance(red: number, green: number, blue: number): number {
    var gamma = 2.2;
    return 0.2126 * Math.pow(red, gamma) + 0.7152 * Math.pow(green, gamma) + 0.0722 * Math.pow(blue, gamma);
  }
  /**
   * Converts an angle, radius, height to a color on a color wheel.
   */
  public static fromHSL(H: number, S: number, L: number): Color {
    var C = (1 - Math.abs(2*L-1)) * S;
    function normalizeAngle(angle: number) {
      if (angle > 2 * Math.PI) {
        return normalizeAngle(angle - 2 * Math.PI);
      }
      else if (angle < 0) {
        return normalizeAngle(angle + 2 * Math.PI);
      }
      else {
        return angle;
      }
    }
    function matchLightness(R: number, G: number, B: number): Color {
      var x = Color.luminance(R, G, B);
      var m = L - (0.5 * C);
      return new Color(R + m, G + m, B + m, 1.0);
    }
    var sextant = ((normalizeAngle(H) / Math.PI) * 3) % 6;
    var X = C * (1 - Math.abs(sextant % 2 - 1));
    if (sextant >= 0 && sextant < 1) {
      return matchLightness(C,X/*C*(sextant-0)*/,0.0);
    }
    else if (sextant >= 1 && sextant < 2) {
      return matchLightness(X/*C*(2-sextant)*/,C,0.0);
    }
    else if (sextant >= 2 && sextant < 3) {
      return matchLightness(0.0,C,C*(sextant-2));
    }
    else if (sextant >= 3 && sextant < 4) {
      return matchLightness(0.0,C*(4-sextant),C);
    }
    else if (sextant >= 4 && sextant < 5) {
      return matchLightness(X,0.0,C);
    }
    else if (sextant >= 5 && sextant < 6) {
      return matchLightness(C,0.0,X);
    }
    else {
      return matchLightness(0.0,0.0,0.0);
    }
  }
}

export = Color;
