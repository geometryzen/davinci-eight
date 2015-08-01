/// <reference path="../../../vendor/davinci-blade/dist/davinci-blade.d.ts" />
import AttribProvider = require('../core/AttribProvider');
import Color = require('../core/Color');

/**
 * @class CuboidMesh
 */
interface CuboidMesh extends AttribProvider {
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

export = CuboidMesh;
