// randomColor by David Merfield under the MIT license
// https://github.com/davidmerfield/randomColor/
// Ported to TypeScript by David Geo Holmes

interface ColorEntry {
  hueRange: number[];
  lowerBounds: number[][];
  saturationRange: number[];
  brightnessRange: number[];
}

/**
 * This isn't know to the TypeScript d.ts
 */
const MAX_SAFE_INTEGER = Math.pow(2, 53) - 1; // 9007199254740991

// Seed to get repeatable colors
let seed: number = null;

// Shared color dictionary
const colorDictionary: { [name: string]: ColorEntry } = {};

// Populate the color dictionary
loadColorBounds();

export function randomColor(options: { count?: number, format?: string, hue?: string, luminosity?: string, seed?: any } = {}): number[] {

  // Check if there is a seed and ensure it's an
  // integer. Otherwise, reset the seed value.
  if (options.seed && options.seed === parseInt(options.seed, 10)) {
    seed = options.seed;

    // A string was passed as a seed
  }
  else if (typeof options.seed === 'string') {
    seed = stringToInteger(options.seed);
    // Something was passed as a seed but it wasn't an integer or string
  }
  else if (options.seed !== undefined && options.seed !== null) {
    throw new TypeError('The seed value must be an integer');
    // No seed, reset the value outside.
  }
  else {
    seed = null;
  }

  /*
  // Check if we need to generate multiple colors
  if (options.count !== null && options.count !== undefined) {

    const totalColors = options.count
    const colors: number[] = [];

    options.count = null;

    while (totalColors > colors.length) {

      // Since we're generating multiple colors,
      // incremement the seed. Otherwise we'd just
      // generate the same color each time...
      if (seed && options.seed) options.seed += 1;

      colors.push(randomColor(options));
    }

    options.count = totalColors;

    return colors;
  }
  */

  // First we pick a hue (H)
  const H = pickHue(options);

  // Then use H to determine saturation (S)
  const S = pickSaturation(H, options);

  // Then use S and H to determine brightness (B).
  const B = pickBrightness(H, S, options);

  // Then we return the HSB color in the desired format
  return setFormatArray([H, S, B], options);
}

function pickHue(options: { hue?: string }): number {

  const hueRange = getHueRange(options.hue);
  let hue = randomWithin(hueRange);

  // Instead of storing red as two seperate ranges,
  // we group them, using negative numbers
  if (hue < 0) { hue = 360 + hue; }

  return hue;
}

function pickSaturation(hue: number, options: { hue?: string; luminosity?: string }) {

  if (options.luminosity === 'random') {
    return randomWithin([0, 100]);
  }

  if (options.hue === 'monochrome') {
    return 0;
  }

  var saturationRange = getSaturationRange(hue);

  var sMin = saturationRange[0],
    sMax = saturationRange[1];

  switch (options.luminosity) {

    case 'bright':
      sMin = 55;
      break;

    case 'dark':
      sMin = sMax - 10;
      break;

    case 'light':
      sMax = 55;
      break;
  }

  return randomWithin([sMin, sMax]);
}

function pickBrightness(H: number, S: number, options: { luminosity?: string }): number {

  var bMin = getMinimumBrightness(H, S),
    bMax = 100;

  switch (options.luminosity) {

    case 'dark':
      bMax = bMin + 20;
      break;

    case 'light':
      bMin = (bMax + bMin) / 2;
      break;

    case 'random':
      bMin = 0;
      bMax = 100;
      break;
  }

  return randomWithin([bMin, bMax]);
}

/*
function setFormatString(hsv: number[], options: { format?: string }): string {

  switch (options.format) {

    case 'hsl':
      var hsl = HSVtoHSL(hsv);
      return 'hsl(' + hsl[0] + ', ' + hsl[1] + '%, ' + hsl[2] + '%)';

    case 'hsla':
      var hslColor = HSVtoHSL(hsv);
      return 'hsla(' + hslColor[0] + ', ' + hslColor[1] + '%, ' + hslColor[2] + '%, ' + Math.random() + ')';

    case 'rgb':
      var rgb = HSVtoRGB(hsv);
      return 'rgb(' + rgb.join(', ') + ')';

    case 'rgba':
      var rgbColor = HSVtoRGB(hsv);
      return 'rgba(' + rgbColor.join(', ') + ', ' + Math.random() + ')';

    default:
      return HSVtoHex(hsv);
  }
}
*/

function setFormatArray(hsv: number[], options: { format?: string }): number[] {

  switch (options.format) {

    case 'hsvArray':
      return hsv;

    case 'hslArray':
      return HSVtoHSL(hsv);

    case 'rgbArray':
      return HSVtoRGB(hsv);

    default:
      throw new Error();
  }
}

function getMinimumBrightness(H: number, S: number): number {

  var lowerBounds = getColorInfo(H).lowerBounds;

  for (var i = 0; i < lowerBounds.length - 1; i++) {

    var s1 = lowerBounds[i][0],
      v1 = lowerBounds[i][1];

    var s2 = lowerBounds[i + 1][0],
      v2 = lowerBounds[i + 1][1];

    if (S >= s1 && S <= s2) {

      var m = (v2 - v1) / (s2 - s1),
        b = v1 - m * s1;

      return m * S + b;
    }

  }

  return 0;
}

function getHueRange(colorInput: string): number[] {

  if (typeof parseInt(colorInput) === 'number') {

    var number = parseInt(colorInput);

    if (number < 360 && number > 0) {
      return [number, number];
    }

  }

  if (typeof colorInput === 'string') {

    if (colorDictionary[colorInput]) {
      var color = colorDictionary[colorInput];
      if (color.hueRange) { return color.hueRange; }
    }
  }

  return [0, 360];
}

function getSaturationRange(hue: number): number[] {
  return getColorInfo(hue).saturationRange;
}

function getColorInfo(hue: number): ColorEntry {

  // Maps red colors to make picking hue easier
  if (hue >= 334 && hue <= 360) {
    hue -= 360;
  }

  for (let colorName in colorDictionary) {
    if (colorDictionary.hasOwnProperty(colorName)) {
      const color = colorDictionary[colorName];
      if (color.hueRange &&
        hue >= color.hueRange[0] &&
        hue <= color.hueRange[1]) {
        return colorDictionary[colorName];
      }
    }
  }
  throw new Error(`Color with hue ${hue} not found`);
}

function randomWithin(range: number[]): number {
  if (seed === null) {
    return Math.floor(range[0] + Math.random() * (range[1] + 1 - range[0]));
  }
  else {
    // Seeded random algorithm from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
    var max = range[1] || 1;
    var min = range[0] || 0;
    seed = (seed * 9301 + 49297) % 233280;
    var rnd = seed / 233280.0;
    return Math.floor(min + rnd * (max - min));
  }
}

/*
function HSVtoHex(hsv: number[]): string {

  const rgb: number[] = HSVtoRGB(hsv);

  function componentToHex(c: number): string {
    var hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }

  const hex = '#' + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);

  return hex;
}
*/

function defineColor(name: string, hueRange: number[], lowerBounds: number[][]): void {

  const sMin = lowerBounds[0][0];
  const sMax = lowerBounds[lowerBounds.length - 1][0];

  const bMin = lowerBounds[lowerBounds.length - 1][1];
  const bMax = lowerBounds[0][1];

  colorDictionary[name] = {
    hueRange: hueRange,
    lowerBounds: lowerBounds,
    saturationRange: [sMin, sMax],
    brightnessRange: [bMin, bMax]
  };
}

function loadColorBounds() {

  defineColor(
    'monochrome',
    null,
    [[0, 0], [100, 0]]
  );

  defineColor(
    'red',
    [-26, 18],
    [[20, 100], [30, 92], [40, 89], [50, 85], [60, 78], [70, 70], [80, 60], [90, 55], [100, 50]]
  );

  defineColor(
    'orange',
    [19, 46],
    [[20, 100], [30, 93], [40, 88], [50, 86], [60, 85], [70, 70], [100, 70]]
  );

  defineColor(
    'yellow',
    [47, 62],
    [[25, 100], [40, 94], [50, 89], [60, 86], [70, 84], [80, 82], [90, 80], [100, 75]]
  );

  defineColor(
    'green',
    [63, 178],
    [[30, 100], [40, 90], [50, 85], [60, 81], [70, 74], [80, 64], [90, 50], [100, 40]]
  );

  defineColor(
    'blue',
    [179, 257],
    [[20, 100], [30, 86], [40, 80], [50, 74], [60, 60], [70, 52], [80, 44], [90, 39], [100, 35]]
  );

  defineColor(
    'purple',
    [258, 282],
    [[20, 100], [30, 87], [40, 79], [50, 70], [60, 65], [70, 59], [80, 52], [90, 45], [100, 42]]
  );

  defineColor(
    'pink',
    [283, 334],
    [[20, 100], [30, 90], [40, 86], [60, 84], [80, 80], [90, 75], [100, 73]]
  );
}

function HSVtoRGB(hsv: number[]): number[] {

  // this doesn't work for the values of 0 and 360
  // here's the hacky fix
  var h = hsv[0];
  if (h === 0) { h = 1; }
  if (h === 360) { h = 359; }

  // Rebase the h,s,v values
  h = h / 360;
  var s = hsv[1] / 100,
    v = hsv[2] / 100;

  var h_i = Math.floor(h * 6),
    f = h * 6 - h_i,
    p = v * (1 - s),
    q = v * (1 - f * s),
    t = v * (1 - (1 - f) * s),
    r = 256,
    g = 256,
    b = 256;

  switch (h_i) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }

  var result = [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
  return result;
}

function HSVtoHSL(hsv: number[]): number[] {
  var h = hsv[0],
    s = hsv[1] / 100,
    v = hsv[2] / 100,
    k = (2 - s) * v;

  return [
    h,
    Math.round(s * v / (k < 1 ? k : 2 - k) * 10000) / 100,
    k / 2 * 100
  ];
}

function stringToInteger(s: string): number {
  let total = 0;
  for (let i = 0; i !== s.length; i++) {
    if (total >= MAX_SAFE_INTEGER) break;
    total += s.charCodeAt(i);
  }
  return total;
}
