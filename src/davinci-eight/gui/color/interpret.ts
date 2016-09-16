import toArray from '../common/toArray';
import isArray from '../common/isArray';
import isString from '../common/isString';
import isNumber from '../common/isNumber';
import isObject from '../common/isObject';

interface Conversion {
  read(original: any): ColorRep | boolean;
}

interface Family {
  litmus: (original: any) => boolean;
  conversions: { [name: string]: Conversion };
}

const INTERPRETATIONS = [

  // Strings
  {

    litmus: isString,

    conversions: {

      THREE_CHAR_HEX: {

        read: function (original: string): boolean | ColorRep {

          var test = original.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
          if (test === null) return false;

          return {
            space: 'HEX',
            hex: parseInt(
              '0x' +
              test[1].toString() + test[1].toString() +
              test[2].toString() + test[2].toString() +
              test[3].toString() + test[3].toString())
          };

        },

        write: toString

      },

      SIX_CHAR_HEX: {

        read: function (original: string): ColorRep | boolean {

          var test = original.match(/^#([A-F0-9]{6})$/i);
          if (test === null) return false;

          return {
            space: 'HEX',
            hex: parseInt('0x' + test[1].toString())
          };

        },

        write: toString

      },

      CSS_RGB: {

        read: function (original: string): ColorRep | boolean {

          var test = original.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
          if (test === null) return false;

          return {
            space: 'RGB',
            r: parseFloat(test[1]),
            g: parseFloat(test[2]),
            b: parseFloat(test[3])
          };

        },

        write: toString

      },

      CSS_RGBA: {

        read: function (original: string): ColorRep | boolean {

          var test = original.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\,\s*(.+)\s*\)/);
          if (test === null) return false;

          return {
            space: 'RGB',
            r: parseFloat(test[1]),
            g: parseFloat(test[2]),
            b: parseFloat(test[3]),
            a: parseFloat(test[4])
          };

        },

        write: toString

      }

    }

  },

  // Numbers
  {

    litmus: isNumber,

    conversions: {

      HEX: {
        read: function (original: string) {
          return {
            space: 'HEX',
            hex: original,
            conversionName: 'HEX'
          };
        },

        write: function (color: { hex: string }) {
          return color.hex;
        }
      }

    }

  },

  // Arrays
  {

    litmus: isArray,

    conversions: {

      RGB_ARRAY: {
        read: function (original: number[]): ColorRep | boolean {
          if (original.length !== 3) return false;
          return {
            space: 'RGB',
            r: original[0],
            g: original[1],
            b: original[2]
          };
        },

        write: function (color: { r: number; g: number; b: number }) {
          return [color.r, color.g, color.b];
        }

      },

      RGBA_ARRAY: {
        read: function (original: number[]): ColorRep | boolean {
          if (original.length !== 4) return false;
          return {
            space: 'RGB',
            r: original[0],
            g: original[1],
            b: original[2],
            a: original[3]
          };
        },

        write: function (color: { r: number; g: number; b: number; a: number }) {
          return [color.r, color.g, color.b, color.a];
        }

      }

    }

  },

  // Objects
  {

    litmus: isObject,

    conversions: {

      RGBA_OBJ: {
        read: function (original: { r: number; g: number; b: number; a: number }): ColorRep | boolean {
          if (isNumber(original.r) &&
            isNumber(original.g) &&
            isNumber(original.b) &&
            isNumber(original.a)) {
            return {
              space: 'RGB',
              r: original.r,
              g: original.g,
              b: original.b,
              a: original.a
            };
          }
          return false;
        },

        write: function (color: { r: number; g: number; b: number; a: number }) {
          return {
            r: color.r,
            g: color.g,
            b: color.b,
            a: color.a
          };
        }
      },

      RGB_OBJ: {
        read: function (original: { r: number; g: number; b: number }): ColorRep | boolean {
          if (isNumber(original.r) &&
            isNumber(original.g) &&
            isNumber(original.b)) {
            return {
              space: 'RGB',
              r: original.r,
              g: original.g,
              b: original.b
            };
          }
          return false;
        },

        write: function (color: { r: number; g: number; b: number }) {
          return {
            r: color.r,
            g: color.g,
            b: color.b
          };
        }
      },

      HSVA_OBJ: {
        read: function (original: { h: number; s: number; v: number; a: number }): ColorRep | boolean {
          if (isNumber(original.h) &&
            isNumber(original.s) &&
            isNumber(original.v) &&
            isNumber(original.a)) {
            return {
              space: 'HSV',
              h: original.h,
              s: original.s,
              v: original.v,
              a: original.a
            };
          }
          return false;
        },

        write: function (color: { h: number; s: number; v: number; a: number }) {
          return {
            h: color.h,
            s: color.s,
            v: color.v,
            a: color.a
          };
        }
      },

      HSV_OBJ: {
        read: function (original: { h: number; s: number; v: number }): ColorRep | boolean {
          if (isNumber(original.h) &&
            isNumber(original.s) &&
            isNumber(original.v)) {
            return {
              space: 'HSV',
              h: original.h,
              s: original.s,
              v: original.v
            };
          }
          return false;
        },

        write: function (color: { h: number; s: number; v: number }) {
          return {
            h: color.h,
            s: color.s,
            v: color.v
          };
        }
      }
    }
  }
];

export default function interpret(args: any) {

  const original = arguments.length > 1 ? toArray(arguments) : arguments[0];

  for (let i = 0; i < INTERPRETATIONS.length; i++) {
    const family = INTERPRETATIONS[i];
    if (family.litmus(original)) {

      const conversions = family.conversions;
      const names = Object.keys(conversions);
      for (let k = 0; k < names.length; k++) {
        const conversionName = names[k];
        const conversion = conversions[conversionName];

        const result = conversion.read(original);

        if (result !== false) {
          result.conversionName = conversionName;
          result.conversion = conversion;
          return result;
        }
      }
    }
  }
  return false;
};

interface ColorRep {
  space: string;
  hex?: number;
  r?: number;
  g?: number;
  b?: number;
  a?: number;
  h?: number;
  s?: number;
  v?: number;
}
