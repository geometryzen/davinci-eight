/// <reference path="../../../vendor/davinci-blade/dist/davinci-blade.d.ts" />
import VertexAttributeProvider = require('../core/VertexAttributeProvider');
import Color = require('../core/Color');

/**
 * @class CuboidVertexAttributeProvider
 */
interface CuboidVertexAttributeProvider extends VertexAttributeProvider {
  /**
   * @property a
   */
  a: blade.Euclidean3;
  /**
   * @property b
   */
  b: blade.Euclidean3;
  /**
   * @property c
   */
  c: blade.Euclidean3;
  /**
   * @property color
   * @type Color
   */
  color: Color;
  grayScale: boolean;
}

export = CuboidVertexAttributeProvider;
